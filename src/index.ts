import { seedDatabase } from './seed';
import { getDigest, type FeedbackRow, type DigestWindow } from './digest';
import { renderDashboard } from './frontend';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		// Seed endpoint — POST /api/seed, POST /api/seed?force=1 re-seeds from scratch
		if (pathname === '/api/seed' && request.method === 'POST') {
			try {
				const force = url.searchParams.get('force') === '1';
				const result = await seedDatabase(env.DB, force);
				return Response.json(result);
			} catch (err) {
				return Response.json({ error: String(err) }, { status: 500 });
			}
		}

		// Feedback API — filterable by source
		if (pathname === '/api/feedback') {
			try {
				const source = url.searchParams.get('source');
				let query: D1PreparedStatement;
				if (source) {
					query = env.DB.prepare('SELECT * FROM feedback WHERE source = ? ORDER BY timestamp DESC').bind(source);
				} else {
					query = env.DB.prepare('SELECT * FROM feedback ORDER BY timestamp DESC');
				}
				const { results } = await query.all<FeedbackRow>();
				return Response.json(results ?? []);
			} catch (err) {
				return Response.json({ error: String(err) }, { status: 500 });
			}
		}

		// Digest API — GET /api/digest?window=today|week|month|all
		// Used by the frontend digest toggle to re-analyze a specific time window
		if (pathname === '/api/digest') {
			try {
				const rawWindow = url.searchParams.get('window') ?? 'month';
				const validWindows: DigestWindow[] = ['today', 'week', 'month', 'all'];
				const window: DigestWindow = validWindows.includes(rawWindow as DigestWindow)
					? (rawWindow as DigestWindow)
					: 'month';
				const forceRefresh = url.searchParams.get('refresh') === '1';
				const digest = await getDigest(env, forceRefresh, window);
				return Response.json(digest);
			} catch (err) {
				return Response.json({ error: String(err) }, { status: 500 });
			}
		}

		// Refresh digest — clears all window caches and regenerates the current window
		if (pathname === '/api/refresh' && request.method === 'POST') {
			try {
				const rawWindow = url.searchParams.get('window') ?? 'month';
				const validWindows: DigestWindow[] = ['today', 'week', 'month', 'all'];
				const window: DigestWindow = validWindows.includes(rawWindow as DigestWindow)
					? (rawWindow as DigestWindow)
					: 'month';
				// Delete all window cache keys
				await Promise.all([
					env.DIGEST_CACHE.delete('digest-today'),
					env.DIGEST_CACHE.delete('digest-week'),
					env.DIGEST_CACHE.delete('digest-month'),
					env.DIGEST_CACHE.delete('digest-all'),
					// Also clear the legacy key if present
					env.DIGEST_CACHE.delete('daily-digest'),
				]);
				const digest = await getDigest(env, true, window);
				return Response.json({ ok: true, generatedAt: digest.generatedAt });
			} catch (err) {
				return Response.json({ error: String(err) }, { status: 500 });
			}
		}

		// Main dashboard
		if (pathname === '/' || pathname === '') {
			try {
				await seedDatabase(env.DB);

				const [digest, feedbackResult] = await Promise.all([
					getDigest(env, false, 'month'),
					env.DB.prepare('SELECT * FROM feedback ORDER BY timestamp DESC').all<FeedbackRow>(),
				]);

				const rows = feedbackResult.results ?? [];
				const html = renderDashboard(digest, rows);

				return new Response(html, {
					headers: { 'Content-Type': 'text/html;charset=UTF-8' },
				});
			} catch (err) {
				console.error('Dashboard error:', err);
				return new Response(
					`<pre style="font-family:monospace;padding:24px">Error loading Signal:\n\n${String(err)}</pre>`,
					{ status: 500, headers: { 'Content-Type': 'text/html' } }
				);
			}
		}

		return new Response('Not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
