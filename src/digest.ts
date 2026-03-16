export interface ThemeTrend {
	direction: 'up' | 'down' | 'same' | 'new';
	percent?: number; // absolute % change, omitted when direction is 'new' or 'same'
	vsLabel: string;  // "yesterday" | "last week" | "last month"
}

export interface ThemeDigest {
	theme: string;
	urgency: 'high' | 'medium' | 'low';
	summary: string;
	count: number;
	trend?: ThemeTrend;
}

export interface SentimentBreakdown {
	positive: number;
	neutral: number;
	negative: number;
}

export interface Digest {
	themes: ThemeDigest[];
	sentiment: SentimentBreakdown;
	generatedAt: string;
	window: string;
}

export interface FeedbackRow {
	id: number;
	source: string;
	content: string;
	timestamp: string;
	sentiment: string;
	theme: string;
	urgency: string;
}

export type DigestWindow = 'today' | 'week' | 'month' | 'all';

const CACHE_TTL_SECONDS = 86400; // 24h for 'today'; window-specific digests also use this
const WINDOW_TTL: Record<DigestWindow, number> = {
	today: 3600,   // 1 hour — refreshes throughout the day
	week: 3600,
	month: 3600,
	all: 86400,
};

function cacheKey(window: DigestWindow): string {
	return `digest-${window}`;
}

function getWindowStart(window: DigestWindow): string | null {
	const now = new Date();
	if (window === 'today') {
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		return start.toISOString();
	}
	if (window === 'week') {
		return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
	}
	if (window === 'month') {
		return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
	}
	return null; // 'all' — no filter
}

function getPreviousPeriodRange(window: DigestWindow): { start: string; end: string; vsLabel: string } | null {
	const now = new Date();
	const DAY = 86_400_000;
	if (window === 'today') {
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterdayStart = new Date(todayStart.getTime() - DAY);
		return { start: yesterdayStart.toISOString(), end: todayStart.toISOString(), vsLabel: 'yesterday' };
	}
	if (window === 'week') {
		const weekStart = new Date(now.getTime() - 7 * DAY);
		const prevWeekStart = new Date(now.getTime() - 14 * DAY);
		return { start: prevWeekStart.toISOString(), end: weekStart.toISOString(), vsLabel: 'last week' };
	}
	if (window === 'month') {
		const monthStart = new Date(now.getTime() - 30 * DAY);
		const prevMonthStart = new Date(now.getTime() - 60 * DAY);
		return { start: prevMonthStart.toISOString(), end: monthStart.toISOString(), vsLabel: 'last month' };
	}
	return null; // 'all' — no meaningful previous period
}

function attachTrends(themes: ThemeDigest[], prevRows: { theme: string }[], vsLabel: string): void {
	const prevCount = new Map<string, number>();
	for (const row of prevRows) {
		prevCount.set(row.theme, (prevCount.get(row.theme) ?? 0) + 1);
	}
	for (const t of themes) {
		const prev = prevCount.get(t.theme) ?? 0;
		if (prev === 0 && t.count > 0) {
			t.trend = { direction: 'new', vsLabel };
		} else if (prev === 0) {
			t.trend = { direction: 'same', vsLabel };
		} else {
			const pct = Math.round(((t.count - prev) / prev) * 100);
			t.trend = {
				direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'same',
				percent: Math.abs(pct),
				vsLabel,
			};
		}
	}
}

function buildFallbackDigest(rows: FeedbackRow[], window: DigestWindow): Digest {
	const themeMap = new Map<string, { urgency: string; count: number }>();
	let positive = 0, neutral = 0, negative = 0;

	for (const row of rows) {
		if (row.sentiment === 'positive') positive++;
		else if (row.sentiment === 'negative') negative++;
		else neutral++;

		const existing = themeMap.get(row.theme);
		if (!existing) {
			themeMap.set(row.theme, { urgency: row.urgency, count: 1 });
		} else {
			existing.count++;
			if (row.urgency === 'high') existing.urgency = 'high';
			else if (row.urgency === 'medium' && existing.urgency === 'low') existing.urgency = 'medium';
		}
	}

	const sorted = [...themeMap.entries()]
		.sort((a, b) => b[1].count - a[1].count)
		.slice(0, 3);

	const total = rows.length || 1;
	// Use largest-remainder method to guarantee sum = 100
	const posP = Math.round((positive / total) * 100);
	const neuP = Math.round((neutral / total) * 100);
	const negP = Math.max(0, 100 - posP - neuP);
	return {
		themes: sorted.map(([theme, data]) => ({
			theme,
			urgency: data.urgency as 'high' | 'medium' | 'low',
			summary: `${data.count} feedback ${data.count === 1 ? 'entry' : 'entries'} flagged for ${theme.toLowerCase()}.`,
			count: data.count,
		})),
		sentiment: {
			positive: posP,
			neutral: neuP,
			negative: negP,
		},
		generatedAt: new Date().toISOString(),
		window,
	};
}

export async function getDigest(env: Env, forceRefresh = false, window: DigestWindow = 'month'): Promise<Digest> {
	const key = cacheKey(window);

	if (!forceRefresh) {
		const cached = await env.DIGEST_CACHE.get(key);
		if (cached) {
			try {
				return JSON.parse(cached) as Digest;
			} catch {
				// fall through to regenerate
			}
		}
	}

	// Fetch rows filtered by time window
	const windowStart = getWindowStart(window);
	const { results } = windowStart
		? await env.DB.prepare('SELECT * FROM feedback WHERE timestamp >= ? ORDER BY timestamp DESC').bind(windowStart).all<FeedbackRow>()
		: await env.DB.prepare('SELECT * FROM feedback ORDER BY timestamp DESC').all<FeedbackRow>();
	const rows = results ?? [];

	if (rows.length === 0) {
		const empty: Digest = { themes: [], sentiment: { positive: 0, neutral: 0, negative: 0 }, generatedAt: new Date().toISOString(), window };
		return empty;
	}

	let digest: Digest;

	try {
		// Build per-theme map with content snippets for the AI
		const themeMap = new Map<string, { count: number; urgency: string; snippets: string[] }>();
		let pos = 0, neu = 0, neg = 0;

		for (const row of rows) {
			if (row.sentiment === 'positive') pos++;
			else if (row.sentiment === 'negative') neg++;
			else neu++;

			const entry = themeMap.get(row.theme) ?? { count: 0, urgency: 'low', snippets: [] };
			entry.count++;
			if (row.urgency === 'high') entry.urgency = 'high';
			else if (row.urgency === 'medium' && entry.urgency === 'low') entry.urgency = 'medium';
			// Keep up to 4 content excerpts per theme for AI context
			if (entry.snippets.length < 4) {
				entry.snippets.push(row.content.slice(0, 220).trim());
			}
			themeMap.set(row.theme, entry);
		}

		// Sort by volume, take top 5 for context (AI will pick top 3)
		const sortedThemes = [...themeMap.entries()]
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5);

		// Build detailed per-theme sections with real feedback content
		const themeDetails = sortedThemes
			.map(([theme, data]) => {
				const excerpts = data.snippets
					.map((s, i) => `  ${i + 1}. "${s}${s.length >= 220 ? '…' : ''}"`)
					.join('\n');
				return `Theme: ${theme} (${data.count} ${data.count === 1 ? 'entry' : 'entries'}, dominant urgency: ${data.urgency})\nFeedback excerpts:\n${excerpts}`;
			})
			.join('\n\n');

		const total = rows.length;
		const prompt = `You are a product feedback analyst. Analyze the following real customer feedback excerpts and generate a concise, actionable digest.

${themeDetails}

Totals: ${total} entries | ${pos} positive, ${neu} neutral, ${neg} negative

Return ONLY valid JSON with no markdown fencing or explanation:
{
  "themes": [
    {"theme": "...", "urgency": "high|medium|low", "summary": "...", "count": N},
    {"theme": "...", "urgency": "high|medium|low", "summary": "...", "count": N},
    {"theme": "...", "urgency": "high|medium|low", "summary": "...", "count": N}
  ],
  "sentiment": {
    "positive": N,
    "neutral": N,
    "negative": N
  }
}

Rules:
- Return exactly the top 3 themes by entry count
- For each "summary": write a SPECIFIC actionable insight under 20 words that names the exact pain point or pattern visible in the actual feedback excerpts above. Reference concrete details — specific error codes, version numbers, timeouts, missing headers, endpoint names, or behavioral patterns. Never write generic statements.
  GOOD: "Query timeouts on 500K+ row exports and mobile Analytics crashes since v3.2.1 dominate complaints"
  BAD: "Users are experiencing performance issues across the platform"
- sentiment values must be integers 0-100 and sum to 100
- count must match the entry count shown above for each theme`;

		const aiResponse = await (env.AI as Ai).run('@cf/meta/llama-3.1-8b-instruct' as Parameters<Ai['run']>[0], {
			prompt,
			max_tokens: 600,
		});

		const rawText =
			typeof aiResponse === 'object' && 'response' in aiResponse
				? (aiResponse as { response: string }).response
				: JSON.stringify(aiResponse);

		// Extract JSON — model may wrap it in markdown code fences
		const jsonMatch = rawText.match(/\{[\s\S]*\}/);
		if (!jsonMatch) throw new Error('No JSON in AI response');

		const parsed = JSON.parse(jsonMatch[0]) as { themes: ThemeDigest[]; sentiment: SentimentBreakdown };

		// Normalize sentiment to always sum to exactly 100 — the AI sometimes returns
		// raw counts instead of percentages (e.g. 4, 6, 23 instead of 12%, 18%, 70%)
		const rawS = parsed.sentiment;
		const sentTotal = (rawS.positive ?? 0) + (rawS.neutral ?? 0) + (rawS.negative ?? 0);
		let sentiment: SentimentBreakdown;
		if (sentTotal > 0) {
			const p = Math.round((rawS.positive / sentTotal) * 100);
			const n = Math.round((rawS.neutral / sentTotal) * 100);
			sentiment = { positive: p, neutral: n, negative: Math.max(0, 100 - p - n) };
		} else {
			// Fallback: compute from raw row data
			const total = rows.length || 1;
			const p2 = Math.round((pos / total) * 100);
			const n2 = Math.round((neu / total) * 100);
			sentiment = { positive: p2, neutral: n2, negative: Math.max(0, 100 - p2 - n2) };
		}

		digest = {
			themes: parsed.themes.slice(0, 3),
			sentiment,
			generatedAt: new Date().toISOString(),
			window,
		};
	} catch (err) {
		console.error('AI digest generation failed, using fallback:', err);
		digest = buildFallbackDigest(rows, window);
	}

	// Compute trends by querying the previous equivalent period
	const prevRange = getPreviousPeriodRange(window);
	if (prevRange && digest.themes.length > 0) {
		try {
			const { results: prevRows } = await env.DB.prepare(
				'SELECT theme FROM feedback WHERE timestamp >= ? AND timestamp < ?'
			).bind(prevRange.start, prevRange.end).all<{ theme: string }>();
			attachTrends(digest.themes, prevRows ?? [], prevRange.vsLabel);
		} catch {
			// Trends are best-effort — don't fail the whole digest if this query errors
		}
	}

	await env.DIGEST_CACHE.put(key, JSON.stringify(digest), {
		expirationTtl: WINDOW_TTL[window],
	});

	return digest;
}
