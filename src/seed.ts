export interface FeedbackEntry {
	source: 'email' | 'github' | 'support' | 'twitter';
	content: string;
	timestamp: string;
	sentiment: 'positive' | 'neutral' | 'negative';
	theme: string;
	urgency: 'high' | 'medium' | 'low';
}

export const SEED_DATA: FeedbackEntry[] = [
	// ==================== GITHUB (25) ====================
	// Performance (5)
	{
		source: 'github',
		content:
			'Memory leak in the stream processor when ingesting events > 10MB. RSS grows from 180MB to 2.4GB over a 6-hour run and never GCs. Heap snapshots attached in issue #1847. Affects v2.4.x and v2.5.0.',
		timestamp: '2025-12-16T10:22:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'Query planner regression in v2.5.0 — EXPLAIN shows full table scans on indexed columns when joining 3+ tables. Same query on v2.4.2 uses the index correctly. Bisected to commit a7f3c21.',
		timestamp: '2025-12-29T14:05:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'The /export endpoint blocks the event loop during serialization of large payloads. On 1M row exports, CPU is pegged at 100% for ~40s and no other requests are served. Streaming serialization would fix this.',
		timestamp: '2026-01-08T09:30:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'useSignalData hook re-renders on every keystroke despite identical data references. React DevTools Profiler confirms memo is bypassed because the hook creates a new object reference inline on every call. Client-side useMemo as workaround for now.',
		timestamp: '2026-01-25T16:40:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'p99 latency spiked from 180ms to 1.4s starting Feb 3rd. Correlates exactly with the CDN config change in that day\'s deploy notes. Rolled back the edge cache TTL on our side and it restores to normal. Worth investigating on your end.',
		timestamp: '2026-02-10T11:15:00Z',
		sentiment: 'neutral',
		theme: 'Performance',
		urgency: 'medium',
	},
	// API Reliability (5)
	{
		source: 'github',
		content:
			'Webhooks delayed 15-20 minutes since Dec 18. Our queue processing shows events arriving at the broker but dispatch is lagging behind. Status page is green throughout. Is there a silent queue backup incident happening?',
		timestamp: '2025-12-20T08:45:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'SDK retry logic swallows 500 errors after 3 attempts and resolves the promise with `undefined` instead of throwing. This causes silent data loss in production for callers who don\'t check return values. Should throw after exhausting retries.',
		timestamp: '2026-01-03T13:20:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'OAuth token refresh race condition: concurrent requests both hit 401, both attempt refresh — one succeeds, other gets 400 "token already used". Need a refresh lock or queuing mechanism. Reproducible reliably with 5+ parallel requests.',
		timestamp: '2026-01-18T15:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'GraphQL endpoint returns HTTP 200 with an `errors` array for query validation failures instead of 4xx. Breaks any middleware routing on status code. Per the GraphQL spec, non-execution errors should use appropriate HTTP status codes.',
		timestamp: '2026-02-05T10:30:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'GET /api/v2/events returns inconsistent JSON field ordering across requests for the same resource ID. Makes deterministic snapshot testing impossible and breaks our JSON diff tooling that compares responses.',
		timestamp: '2026-02-22T14:50:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	// Documentation (5)
	{
		source: 'github',
		content:
			'Terraform provider docs are missing the required `signal_workspace_id` argument entirely. Results in a cryptic 422 error with no indication of what\'s missing. Only found the field by grepping the provider source code.',
		timestamp: '2025-12-17T11:10:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'Python SDK docs still show the deprecated `client.connect()` pattern that was removed in v3.0.0. New users get AttributeError immediately on line 1 of the quickstart. Would submit a PR but the docs source isn\'t in this repo.',
		timestamp: '2026-01-06T09:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'Architecture diagram in the Getting Started guide still shows the 2024 single-region topology. Misleading for teams evaluating data residency and latency — the actual multi-region setup isn\'t reflected anywhere in the docs.',
		timestamp: '2026-01-22T14:30:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'low',
	},
	{
		source: 'github',
		content:
			'No documentation on how rate limits interact with batch requests. Does a batch of 50 events count as 1 request or 50 against the hourly quota? Took reverse-engineering the SDK source to discover it\'s counted as 1. Please document.',
		timestamp: '2026-02-14T10:00:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'v2.6.0 changelog says "improved caching" with zero specifics. We had a production incident caused by the new cache invalidation behavior. Breaking behavioral changes need migration notes, not a vague one-liner.',
		timestamp: '2026-03-02T09:15:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'high',
	},
	// Billing (5)
	{
		source: 'github',
		content:
			'Usage dashboard shows NaN for API call count for 5 consecutive days. We have no way to determine proximity to our plan limit. This is a financial tracking issue — teams could exceed their limit unknowingly. Account: ENT-00291.',
		timestamp: '2025-12-22T13:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'Annual plan discount not applied to add-on seat purchases. Per our signed contract we receive 20% off all seat additions during the contract term. Current invoices show full price. Our renewal is next week — needs resolution urgently.',
		timestamp: '2026-01-10T10:45:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'No in-app alerting when approaching plan seat limit. We exceeded by 3 seats and received a $450 overage charge with zero prior notification. Configurable alerts at 80/90/100% of limits would prevent this entirely.',
		timestamp: '2026-01-30T15:20:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'Mid-cycle downgrade (Team → Starter) generates incorrect prorated credit. Expected 18-day credit, received 12-day credit. Reproducible with test accounts. The proration appears to use calendar days instead of remaining billing-period days.',
		timestamp: '2026-02-18T11:30:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'DELETE /billing/subscription returns 200 OK but does not actually cancel the subscription. The endpoint appears to be a stub — subscription stays active. This breaks automated offboarding scripts. Dashboard cancellation works as workaround.',
		timestamp: '2026-03-08T14:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	// Onboarding (5)
	{
		source: 'github',
		content:
			'Workspace setup wizard skips team invite step if an email address is pasted too quickly — focus/blur race condition. The email appears in the input visually but never gets committed to form state. Reproducible across all browsers.',
		timestamp: '2025-12-19T09:30:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'SSO callback URL is hardcoded to app.signal.io in the SAML response validator. Self-hosted deployments always fail SSO because the redirect origin never matches. The callback base URL must be configurable via environment variable.',
		timestamp: '2026-01-14T13:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'high',
	},
	{
		source: 'github',
		content:
			'CLI-created workspaces never trigger the onboarding email sequence. The workspace_created event fires correctly in logs, but the email trigger has a null check that fails for non-UI-created workspaces. Easy fix but high user-facing impact.',
		timestamp: '2026-02-03T10:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'Permissions documentation in the onboarding wizard says Viewer role is read-only. Since v2.3.0, Viewers can edit dashboards by default. Admins are assigning wrong roles based on stale copy. The wizard needs updating.',
		timestamp: '2026-02-25T15:30:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'github',
		content:
			'Quickstart instructs `npm install @signal/sdk` but the package is only published to GitHub Packages, not npm. Results in a 404 from the npm registry. Multiple new contributors have hit this — the README must clarify or the package should be published.',
		timestamp: '2026-03-10T08:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},

	// ==================== EMAIL (25) ====================
	// Performance (5)
	{
		source: 'email',
		content:
			'Dear Team, we are experiencing consistent 30-second timeouts when generating monthly reports on our primary dataset of approximately 800,000 rows. This worked reliably until the December 15th release. Our finance team is blocked on month-end close. Could you please prioritize this? Account #ENT-4421.',
		timestamp: '2025-12-18T09:00:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hello, our engineering team has noticed significant dashboard slowness over the past two weeks. Page loads that previously took 1-2 seconds now take 8-12 seconds for accounts with more than 50 connected integrations. Is this a known issue? Nothing has changed on our end.",
		timestamp: '2026-01-05T14:30:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"To the Signal product team: the performance improvements in the January update have been remarkable. Our most complex dashboard — 12 widgets, 6 data sources — now loads in under 2 seconds. It used to time out regularly. This has meaningfully improved our team's daily workflow. Thank you.",
		timestamp: '2026-01-20T11:00:00Z',
		sentiment: 'positive',
		theme: 'Performance',
		urgency: 'low',
	},
	{
		source: 'email',
		content:
			"Hi, we're attempting to export our full historical dataset (approximately 2.1 million rows) and the export job fails silently after about 45 minutes. No error message, no partial file — the job simply disappears from the queue. Is there a row limit on exports? The documentation doesn't mention one.",
		timestamp: '2026-02-08T10:15:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			'We are a healthcare analytics firm and Signal is part of a time-sensitive workflow. Our SLA requires report generation under 10 seconds, and we are regularly seeing 25-35 second runtimes since February 1st. We need to understand if this is a platform regression before we escalate internally.',
		timestamp: '2026-02-26T13:00:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	// API Reliability (5)
	{
		source: 'email',
		content:
			"Hi support, we've been experiencing intermittent 503 errors from the Signal API since December 23rd — roughly 2-5% of our requests at approximately 500 req/min. The errors aren't correlated with any pattern we can identify on our end. Could you check for infrastructure issues on that date range?",
		timestamp: '2025-12-24T15:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Dear Signal Team, we've set up webhook delivery for our CRM integration and approximately 30% of webhooks are not being delivered. The Signal dashboard marks them as successful, but our endpoint's access logs show no corresponding requests. This is a critical data sync issue.",
		timestamp: '2026-01-12T10:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hello, I wanted to commend the API stability improvements over the past quarter. Our integration handles roughly 2 million API calls per day and we've seen our error rate drop from 0.8% to under 0.05% since October. The improvements to rate limiter response headers have also made our retry logic much more reliable.",
		timestamp: '2026-01-28T09:30:00Z',
		sentiment: 'positive',
		theme: 'API Reliability',
		urgency: 'low',
	},
	{
		source: 'email',
		content:
			"Our integration broke after the February 14th update. The response schema for GET /api/v2/users now includes a nested `metadata` object that wasn't in the previous response. Our parser throws on unexpected fields. This is an undocumented breaking change.",
		timestamp: '2026-02-16T11:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hello, I'm writing to flag a discrepancy between your published rate limits (1,000 req/min) and what we observe in practice. We receive 429 errors at approximately 400 req/min across multiple accounts. Is there an undocumented per-IP or per-workspace sub-limit?",
		timestamp: '2026-03-04T14:45:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	// Documentation (5)
	{
		source: 'email',
		content:
			'Hi, our IT team is trying to set up SSO using your SAML 2.0 integration. The documentation at /docs/sso/saml has placeholder text in the "Attribute Mapping" section — it literally says "[CONTENT TO BE ADDED]". Our 45-person team is blocked from onboarding until this is resolved.',
		timestamp: '2025-12-26T10:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hello, the API reference documentation is missing the `cursor` field from paginated list endpoints. We only discovered cursor-based pagination exists by reading the SDK source code. This is a fairly important feature that should be prominently documented in the reference.",
		timestamp: '2026-01-09T13:00:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'email',
		content:
			"To the Signal team: I'm writing to acknowledge the significant improvement in documentation quality. The new API reference with live interactive examples made integrating Signal into our data pipeline dramatically easier. We saved approximately 2 weeks of integration time compared to our prior experience with the old docs.",
		timestamp: '2026-01-24T10:00:00Z',
		sentiment: 'positive',
		theme: 'Documentation',
		urgency: 'low',
	},
	{
		source: 'email',
		content:
			'Hi, the SDK changelog for v3.1.0 through v3.3.0 conflates multiple breaking changes without migration guidance. Our team spent three days debugging behavior changes that turned out to be intentional but completely undocumented. Each breaking change needs a before/after code example.',
		timestamp: '2026-02-12T09:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'email',
		content:
			"Dear Signal, we are a financial services firm and require SOC 2 Type II documentation and a Data Processing Agreement for our vendor review. The Trust Center linked from your homepage returns a 404. Could you send these documents directly? Our procurement process is blocked.",
		timestamp: '2026-03-06T15:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'high',
	},
	// Billing (5)
	{
		source: 'email',
		content:
			'Hello, my credit card was charged twice on December 1st — two identical $299 charges for the Professional plan. The second appears to be a duplicate transaction. Could you please investigate and refund the duplicate? My account ID is PRO-88213. Thank you.',
		timestamp: '2025-12-23T11:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Dear Billing Team, our January invoice shows a charge for the Enterprise Analytics add-on at $800/month, but per our signed agreement dated November 12th, this add-on was included at no additional cost for the first 12 months. I can forward the agreement if needed. Please review.",
		timestamp: '2026-01-15T09:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hi, we're confused about our annual renewal. The renewal email says our plan auto-renews at the current price, but the dashboard shows a 30% price increase for the next term. We weren't informed of a price change. Is this an error in the dashboard or has pricing changed?",
		timestamp: '2026-02-01T10:30:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Hello, we received a $1,200 overage charge for exceeding our monthly event ingestion limit, but the dashboard only shows usage as of yesterday — by the time we see we're near the limit, we've already exceeded it. Real-time usage alerting with configurable thresholds would prevent this.",
		timestamp: '2026-02-20T14:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'medium',
	},
	{
		source: 'email',
		content:
			"To the Signal Finance Team: I wanted to compliment your billing transparency improvements. The new itemized invoice format makes it easy to reconcile charges by department, and the usage breakdown by workspace is exactly what our finance team needed for internal chargeback reporting. Well done.",
		timestamp: '2026-03-12T10:00:00Z',
		sentiment: 'positive',
		theme: 'Billing',
		urgency: 'low',
	},
	// Onboarding (5)
	{
		source: 'email',
		content:
			"Hi, we're a 200-person company trying to onboard our product and engineering teams. The bulk-invite feature only accepts a CSV up to 50 rows, but we need to add 140 people. Is there a workaround, or can this limit be raised for Enterprise accounts?",
		timestamp: '2025-12-27T13:00:00Z',
		sentiment: 'neutral',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'email',
		content:
			"Hello, we are an enterprise customer configuring SAML SSO with Okta. We've followed the documentation precisely, but the SAML assertion is rejected with 'Invalid signature algorithm.' Our Okta config uses SHA-256 which appears unsupported. Our IT team is completely blocked.",
		timestamp: '2026-01-17T10:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			"Dear Signal Team, I wanted to share a positive note — the new guided onboarding experience was genuinely excellent. Our team of 15 was fully productive within a single afternoon. The integration marketplace was particularly helpful for our Salesforce and HubSpot connections.",
		timestamp: '2026-02-06T11:00:00Z',
		sentiment: 'positive',
		theme: 'Onboarding',
		urgency: 'low',
	},
	{
		source: 'email',
		content:
			"Hello, we have a new team member assigned the 'Editor' role in Signal, but they are able to delete dashboards marked as protected. Role permissions don't appear to be enforced correctly. This is a data integrity concern — we need assurance that role boundaries are reliable.",
		timestamp: '2026-02-28T09:30:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'high',
	},
	{
		source: 'email',
		content:
			'Hi Signal Team, just completed onboarding 8 new hires to our workspace last week. The walkthrough videos and interactive sandbox made the process smooth — new members were submitting their first reports by day two. A meaningful improvement from 6 months ago.',
		timestamp: '2026-03-14T08:00:00Z',
		sentiment: 'positive',
		theme: 'Onboarding',
		urgency: 'low',
	},

	// ==================== SUPPORT (25) ====================
	// Performance (5)
	{
		source: 'support',
		content:
			"Hi, I'm not sure if this is the right place to report this, but our dashboards have been running incredibly slowly for about a week. Each page takes 15-20 seconds to load and sometimes just times out entirely. We haven't changed our setup. We're on the Team plan. Is something wrong on your end?",
		timestamp: '2025-12-21T10:30:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hello, I'm trying to run a report covering the past 12 months and it's been 'processing' for over an hour. I'm not sure if it's stuck or just very slow. I've tried refreshing and restarting twice. Is there a way to check the status of a running report job? Thank you for your patience.",
		timestamp: '2026-01-11T14:00:00Z',
		sentiment: 'neutral',
		theme: 'Performance',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hi there, the Signal mobile app is quite slow on my Android phone (Pixel 7, Android 14). Scrolling through the feedback list is choppy and the app freezes for several seconds. The web version is fine. I know mobile is probably lower priority but wanted to flag it in case others are seeing the same.",
		timestamp: '2026-01-27T09:00:00Z',
		sentiment: 'neutral',
		theme: 'Performance',
		urgency: 'low',
	},
	{
		source: 'support',
		content:
			"Hello, I'm reaching out because our nightly batch export has started timing out. It ran successfully for three months and then stopped working about two weeks ago. The dataset hasn't grown — same ~300K rows as before. The timeout occurs at exactly 30 seconds every time. Any help appreciated.",
		timestamp: '2026-02-15T11:00:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hi, I don't mean to bother anyone, but the dashboard loading speed seems to have gotten noticeably worse recently. I'm on a fast connection and it used to feel snappy. Now there's a 3-4 second delay even on simple views. Totally understand if you're working on it — just flagging in case it helps.",
		timestamp: '2026-03-09T09:30:00Z',
		sentiment: 'neutral',
		theme: 'Performance',
		urgency: 'low',
	},
	// API Reliability (5)
	{
		source: 'support',
		content:
			"Hi, our integration is sending events to the Signal API and receiving 200 OK responses, but the events aren't appearing in our workspace. We've verified our API key and workspace ID. This started 3 days ago and we've lost roughly 50,000 events we were counting on. Can someone investigate?",
		timestamp: '2025-12-30T13:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hello, I'm getting intermittent 401 Unauthorized errors from the API even though my API key hasn't changed. The errors happen on maybe 1 in 10 requests and retrying usually works. Not sure if this is a token validation issue. Happy to share request logs if that helps.",
		timestamp: '2026-01-16T10:30:00Z',
		sentiment: 'neutral',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hi there, I'm hitting 429 errors but I thought my plan allows 10,000 requests per hour. The 429 response body doesn't include a Retry-After header, so I have no idea how long to wait before retrying. The documentation says the header should be present. Am I missing something?",
		timestamp: '2026-02-09T14:00:00Z',
		sentiment: 'neutral',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hello, we set up a real-time sync between Signal and Salesforce using the API, and it worked great for two months. Since the update last week, we're getting a 422 'Invalid field mapping' error — but the mapping hasn't changed. Worried about data falling out of sync.",
		timestamp: '2026-02-23T09:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hi, our team is building an integration and the API appears to go down for about 5 minutes every night around 2am UTC. We think it might be scheduled maintenance, but we can't find any mention of a maintenance window in the documentation. Is this planned? Can we receive advance notice?",
		timestamp: '2026-03-13T10:00:00Z',
		sentiment: 'neutral',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	// Documentation (5)
	{
		source: 'support',
		content:
			"Hi, I'm trying to set up Signal following the Getting Started guide, but I'm stuck on step 4 — it says to click 'Create Integration' in the left sidebar, but I don't see that option anywhere. I'm an admin on the account. Has the interface changed? The screenshots in the guide look different from what I see.",
		timestamp: '2025-12-31T11:00:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hello, I'm a business user (not a developer) trying to use Signal's Zapier integration. The help article says to paste my 'API endpoint URL' but I have no idea where to find that in Signal. I've searched settings for 20 minutes. Sorry for the basic question — could you point me to the right place?",
		timestamp: '2026-01-13T14:30:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'low',
	},
	{
		source: 'support',
		content:
			"Hi, I followed the documentation for custom themes and everything looked correct, but the theme isn't applying to exported PDFs — only the web view. The docs don't mention this limitation. Is custom theming unsupported for PDF exports? If not, it should be clearly noted.",
		timestamp: '2026-01-29T10:00:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'low',
	},
	{
		source: 'support',
		content:
			"Hello, I'm trying to understand your data retention policy. The documentation says 'data is retained for the duration of your subscription' but doesn't explain what happens post-cancellation or during the 30-day grace period. We need specifics for a compliance review.",
		timestamp: '2026-02-17T09:00:00Z',
		sentiment: 'neutral',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hi, I think there may be an error in the webhook documentation. The example payload shows `event.created_at` as a Unix timestamp, but the actual webhook we receive has it as an ISO 8601 string. Our parser was built from the docs and broke when real webhooks started arriving. Could you correct the example?",
		timestamp: '2026-03-05T13:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	// Billing (5)
	{
		source: 'support',
		content:
			"Hello, I'm hoping someone can help me. I cancelled my Signal subscription three weeks ago but was just charged again this month. I have the cancellation confirmation email with a reference number. I'd like a refund for this charge please. I've tried the chat widget but it keeps disconnecting.",
		timestamp: '2025-12-25T10:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hi, I upgraded from Starter to Professional mid-month and my bill shows the full monthly Professional charge even though I only used it for 18 days. I expected a prorated charge. Is this correct, or is something wrong? I want to make sure I understand the billing before I escalate internally.",
		timestamp: '2026-01-19T11:30:00Z',
		sentiment: 'neutral',
		theme: 'Billing',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hello, I'm the account admin for our Signal workspace. I've been trying to update our payment method for three days but every credit card I try gets declined with 'Card verification failed.' Our bank confirms the cards are active. Our subscription renews in 4 days and I'm worried about it lapsing.",
		timestamp: '2026-02-04T09:30:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hi, I'd love help understanding our usage charges. There's a line item for 'Overage: 12,500 events' at $0.004/event but I can't tell which workspace or integration generated them. Is there a breakdown of event usage by source? The bill is significant and I need to report it internally.",
		timestamp: '2026-02-21T14:00:00Z',
		sentiment: 'neutral',
		theme: 'Billing',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hello, our invoice this month includes a charge for an 'Advanced Analytics Module' that we didn't knowingly subscribe to. I can't find this feature in our account settings anywhere. Could you help clarify what this is and remove it if it was added in error? Thank you for your time.",
		timestamp: '2026-03-11T10:30:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	// Onboarding (5)
	{
		source: 'support',
		content:
			"Hi, I just signed up for Signal and I'm trying to connect my first data source. The setup guide says to click 'Connect' on the integrations page, but the button is grayed out and unclickable. I'm on the free trial. Is this feature locked to paid plans? The trial page didn't mention this restriction.",
		timestamp: '2026-01-01T09:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hello, we're migrating to Signal from a competitor and I'm having trouble importing historical data. I uploaded our CSV and it processed for an hour, then showed 'Import complete: 0 records imported.' No error message. I have about 18,000 historical feedback records I need to bring in.",
		timestamp: '2026-01-23T13:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'high',
	},
	{
		source: 'support',
		content:
			"Hi, I set up my workspace last week and I love it so far. One small thing — the initial tour showed me features that don't seem to be available on my plan. I got excited about 'AI Theme Clustering' during the tour but can't find it now. The tour should clarify what's plan-specific.",
		timestamp: '2026-02-11T10:00:00Z',
		sentiment: 'neutral',
		theme: 'Onboarding',
		urgency: 'low',
	},
	{
		source: 'support',
		content:
			"Hello, I sent 8 workspace invitations yesterday but only 2 colleagues received the email. The other 6 have checked spam folders — nothing. Could you resend the invitations? I want to make sure it's not a systemic delivery issue. Thank you so much for your help.",
		timestamp: '2026-02-27T11:00:00Z',
		sentiment: 'neutral',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'support',
		content:
			"Hi, I'm a new user setting up Signal for a small startup. The free tier has been wonderful for getting started — I connected Intercom and HubSpot in under 10 minutes. Just wanted to say the experience has been really smooth. Will definitely be upgrading when we grow.",
		timestamp: '2026-03-15T08:30:00Z',
		sentiment: 'positive',
		theme: 'Onboarding',
		urgency: 'low',
	},

	// ==================== TWITTER (25) ====================
	// Performance (5)
	{
		source: 'twitter',
		content: "@signalapp dashboard loading in under 800ms now?? what did you ship last week. I've been waiting for this for months",
		timestamp: '2025-12-16T20:00:00Z',
		sentiment: 'positive',
		theme: 'Performance',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: '@signalapp exports have been hanging for 45+ minutes today. nothing on the status page. anyone else?',
		timestamp: '2026-01-04T14:30:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: 'our @signalapp reports that used to take 8 seconds now take 45. nothing changed on our side. this regressed in the last deploy',
		timestamp: '2026-01-26T09:15:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: "@signalapp the new lazy loading on the feedback table is *chef's kiss*. first time the dashboard has felt truly fast",
		timestamp: '2026-02-13T11:00:00Z',
		sentiment: 'positive',
		theme: 'Performance',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: "@signalapp mobile app on iOS is stuttering constantly since the last update. can't scroll through feedback without lag. please fix",
		timestamp: '2026-03-07T18:00:00Z',
		sentiment: 'negative',
		theme: 'Performance',
		urgency: 'medium',
	},
	// API Reliability (5)
	{
		source: 'twitter',
		content: 'is @signalapp API down? getting 503s on every request for the last 20 minutes. nothing on status page',
		timestamp: '2025-12-28T16:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: '@signalapp our webhooks stopped firing 2 days ago. checked everything on our end. is there an incident?',
		timestamp: '2026-01-07T10:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: 'shoutout to @signalapp — 99.98% API uptime for us last quarter. enterprise-grade reliability from a startup. genuinely impressive',
		timestamp: '2026-01-31T09:00:00Z',
		sentiment: 'positive',
		theme: 'API Reliability',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: "@signalapp rate limiter is sending 429s with no Retry-After header. how are we supposed to implement backoff? this is a basic thing",
		timestamp: '2026-02-19T14:00:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	{
		source: 'twitter',
		content: '@signalapp why does the v2 API return different field ordering on the same endpoint across calls? breaks our snapshot tests every single time',
		timestamp: '2026-03-12T16:30:00Z',
		sentiment: 'negative',
		theme: 'API Reliability',
		urgency: 'medium',
	},
	// Documentation (5)
	{
		source: 'twitter',
		content: '@signalapp your quickstart guide has been returning a 401 on the auth example for 3 weeks. please just test your own docs',
		timestamp: '2025-12-24T12:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'twitter',
		content: 'new @signalapp API reference with live examples is excellent. actually ran the sample in the browser and it just worked. this is how docs should be done',
		timestamp: '2026-01-15T14:00:00Z',
		sentiment: 'positive',
		theme: 'Documentation',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: 'spent my entire morning following @signalapp terraform docs only to find they were wrong. required fields not documented. lost half a day',
		timestamp: '2026-02-03T17:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'twitter',
		content: "@signalapp the python SDK readme still shows the old v2 auth flow. every new dev on our team hits this first thing. please just update it",
		timestamp: '2026-02-24T10:30:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	{
		source: 'twitter',
		content: '@signalapp changelog for v3.2 is a single sentence. what changed?? what broke?? why are developers so bad at writing changelogs',
		timestamp: '2026-03-14T19:00:00Z',
		sentiment: 'negative',
		theme: 'Documentation',
		urgency: 'medium',
	},
	// Billing (5)
	{
		source: 'twitter',
		content: 'charged by @signalapp after cancelling. again. third time. disputing with my bank',
		timestamp: '2025-12-19T21:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: '@signalapp sent me an overage bill with zero warning. no email, no in-app alert, just a charge on my card. that is not okay',
		timestamp: '2026-01-08T08:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: 'honestly @signalapp billing has gotten so much cleaner. itemized invoices, usage breakdowns, the works. used to be a nightmare to reconcile',
		timestamp: '2026-01-21T15:00:00Z',
		sentiment: 'positive',
		theme: 'Billing',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: "hey @signalapp I downgraded my plan 3 weeks ago and you're still charging me the old rate. support ticket open for 5 days with no reply",
		timestamp: '2026-02-07T11:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: '@signalapp why is there no usage alert before I hit my plan limit? found out I was over by 20k events. $80 surprise charge. come on',
		timestamp: '2026-03-15T09:00:00Z',
		sentiment: 'negative',
		theme: 'Billing',
		urgency: 'high',
	},
	// Onboarding (5)
	{
		source: 'twitter',
		content: 'set up @signalapp for my team today. took 12 minutes to connect all our sources. genuinely impressive for enterprise software',
		timestamp: '2025-12-15T16:00:00Z',
		sentiment: 'positive',
		theme: 'Onboarding',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: '@signalapp SSO setup is completely broken on self-hosted. the callback URL is hardcoded. how did this pass QA',
		timestamp: '2026-01-02T14:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'high',
	},
	{
		source: 'twitter',
		content: 'three hours trying to get @signalapp invite emails to arrive. checked spam. nothing. is the email system down right now??',
		timestamp: '2026-02-08T09:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
	{
		source: 'twitter',
		content: "@signalapp the guided setup is the best I've seen in any B2B tool. my non-technical PM set it up solo. that's genuinely rare",
		timestamp: '2026-03-03T11:00:00Z',
		sentiment: 'positive',
		theme: 'Onboarding',
		urgency: 'low',
	},
	{
		source: 'twitter',
		content: "@signalapp new user here — your quickstart says install from npm but the package isn't on npm. pretty rough first impression",
		timestamp: '2026-03-15T14:00:00Z',
		sentiment: 'negative',
		theme: 'Onboarding',
		urgency: 'medium',
	},
];

export async function seedDatabase(db: D1Database, force = false): Promise<{ seeded: number }> {
	if (!force) {
		const existing = await db.prepare('SELECT COUNT(*) as count FROM feedback').first<{ count: number }>();
		if (existing && existing.count > 0) {
			return { seeded: 0 };
		}
	} else {
		await db.prepare('DELETE FROM feedback').run();
	}

	const stmt = db.prepare(
		'INSERT INTO feedback (source, content, timestamp, sentiment, theme, urgency) VALUES (?, ?, ?, ?, ?, ?)'
	);

	const batch = SEED_DATA.map((entry) =>
		stmt.bind(entry.source, entry.content, entry.timestamp, entry.sentiment, entry.theme, entry.urgency)
	);

	await db.batch(batch);
	return { seeded: SEED_DATA.length };
}
