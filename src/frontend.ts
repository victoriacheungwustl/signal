import type { Digest, FeedbackRow, ThemeTrend } from './digest';

function urgencyBadge(urgency: string): string {
	const styles: Record<string, string> = {
		high: 'background:#fee2e2;color:#dc2626',
		medium: 'background:#fef3c7;color:#d97706',
		low: 'background:#dcfce7;color:#16a34a',
	};
	const style = styles[urgency] ?? styles['low'];
	return `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:0.04em;${style}">${urgency.charAt(0).toUpperCase() + urgency.slice(1)}</span>`;
}

function sentimentDot(sentiment: string): string {
	const colors: Record<string, string> = {
		positive: '#16a34a',
		neutral: '#d97706',
		negative: '#dc2626',
	};
	const color = colors[sentiment] ?? '#666';
	return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:5px;vertical-align:middle"></span>`;
}

function sourceTag(source: string): string {
	const labels: Record<string, string> = { github: 'GitHub', email: 'Email', support: 'Support', twitter: 'Twitter' };
	const colors: Record<string, string> = { github: '#24292e', email: '#2563eb', support: '#7c3aed', twitter: '#0ea5e9' };
	const color = colors[source] ?? '#666';
	const label = labels[source] ?? source;
	return `<span style="display:inline-block;padding:2px 10px;border-radius:5px;font-size:11px;font-weight:600;background:${color}1a;color:${color}">${label}</span>`;
}

function formatDate(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	} catch {
		return iso;
	}
}

function sentimentBar(sentiment: Digest['sentiment']): string {
	const { positive, neutral, negative } = sentiment;
	return `
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px">
        <div style="display:flex;height:8px;border-radius:999px;overflow:hidden;background:#e5e5e5">
          <div id="barPos" style="width:${positive}%;background:#16a34a;transition:width 0.4s ease"></div>
          <div id="barNeu" style="width:${neutral}%;background:#d97706;transition:width 0.4s ease"></div>
          <div id="barNeg" style="width:${negative}%;background:#dc2626;transition:width 0.4s ease"></div>
        </div>
      </div>
      <div style="display:flex;gap:20px;font-size:13px;color:#444">
        <span>${sentimentDot('positive')}<b style="color:#16a34a" id="sentPos">${positive}%</b> Positive</span>
        <span>${sentimentDot('neutral')}<b style="color:#d97706" id="sentNeu">${neutral}%</b> Neutral</span>
        <span>${sentimentDot('negative')}<b style="color:#dc2626" id="sentNeg">${negative}%</b> Negative</span>
      </div>
    </div>`;
}

function trendLine(trend?: ThemeTrend): string {
	if (!trend) return '';
	if (trend.direction === 'new') {
		return `<div style="font-size:11px;color:#999;margin-top:5px">New this period</div>`;
	}
	if (trend.direction === 'same') {
		return `<div style="font-size:11px;color:#999;margin-top:5px">&#8212; same as ${trend.vsLabel}</div>`;
	}
	const arrow = trend.direction === 'up' ? '&#8593;' : '&#8595;';
	const color = trend.direction === 'up' ? '#dc2626' : '#16a34a';
	return `<div style="font-size:11px;color:${color};font-weight:500;margin-top:5px">${arrow} ${trend.percent}% vs ${trend.vsLabel}</div>`;
}

function themeCards(themes: Digest['themes']): string {
	if (themes.length === 0) {
		return `<div style="grid-column:1/-1;padding:32px;text-align:center;color:#999;font-size:14px">No feedback data for this time window.</div>`;
	}
	return themes
		.map(
			(t) => `
    <div class="theme-card" data-theme="${t.theme}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:15px;font-weight:600;color:#111">${t.theme}</span>
        ${urgencyBadge(t.urgency)}
      </div>
      <p style="margin:0 0 12px;font-size:13px;color:#444;line-height:1.5">${t.summary}</p>
      <span style="font-size:12px;color:#999">${t.count} ${t.count === 1 ? 'entry' : 'entries'}</span>
      ${trendLine(t.trend)}
    </div>`
		)
		.join('');
}

function feedbackRows(rows: FeedbackRow[]): string {
	return rows
		.map(
			(row) => `
    <tr class="feedback-row" data-source="${row.source}" data-theme="${row.theme}" data-urgency="${row.urgency}" data-sentiment="${row.sentiment}" data-ts="${row.timestamp}">
      <td style="padding:12px 16px;white-space:nowrap">${sourceTag(row.source)}</td>
      <td style="padding:12px 16px;max-width:340px">
        <div class="content-preview" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;color:#333;line-height:1.5">${row.content}</div>
        <div class="content-full" style="display:none;font-size:13px;color:#333;line-height:1.5;padding-top:6px">${row.content}</div>
      </td>
      <td style="padding:12px 16px;font-size:13px;color:#555;white-space:nowrap">${row.theme}</td>
      <td style="padding:12px 16px;white-space:nowrap">${urgencyBadge(row.urgency)}</td>
      <td style="padding:12px 16px;white-space:nowrap">${sentimentDot(row.sentiment)}<span style="font-size:13px;color:#555">${row.sentiment.charAt(0).toUpperCase() + row.sentiment.slice(1)}</span></td>
      <td style="padding:12px 16px;font-size:13px;color:#999;white-space:nowrap">${formatDate(row.timestamp)}</td>
    </tr>`
		)
		.join('');
}

export function renderDashboard(digest: Digest, rows: FeedbackRow[]): string {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
	const generatedAt = formatDate(digest.generatedAt);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Signal — Feedback Intelligence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #ffffff; color: #111; min-height: 100vh; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    header { border-bottom: 1px solid #e5e5e5; padding: 20px 0; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .logo { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
    .tagline { font-size: 13px; color: #666; margin-top: 2px; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .date-label { font-size: 13px; color: #666; }
    .refresh-btn {
      background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 7px 14px;
      font-size: 13px; font-family: inherit; font-weight: 500; color: #444; cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .refresh-btn:hover { background: #f5f5f5; border-color: #ccc; }
    .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    section { padding: 40px 0 0; }
    .section-title { font-size: 18px; font-weight: 600; color: #111; }
    .section-sub { font-size: 13px; color: #999; margin-top: 3px; }

    /* Segmented control */
    .seg-control {
      display: inline-flex; gap: 2px; background: #f3f3f3; border-radius: 8px; padding: 3px;
    }
    .seg-btn {
      padding: 5px 14px; border-radius: 6px; border: none; background: none;
      font-size: 13px; font-family: inherit; font-weight: 500; color: #666; cursor: pointer;
      transition: all 0.12s;
    }
    .seg-btn:hover { color: #333; }
    .seg-btn.active { background: #fff; color: #111; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

    .theme-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .theme-card {
      background: #f9f9f9; border: 1.5px solid #e5e5e5; border-radius: 12px; padding: 20px;
      cursor: pointer; transition: border-color 0.15s, background 0.15s;
    }
    .theme-card:hover { border-color: #ccc; background: #f5f5f5; }
    .theme-card.active { border-color: #111; background: #f0f0f0; }
    .sentiment-section { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; }

    /* Digest loading state */
    .digest-loading { display:none; align-items:center; justify-content:center; gap:8px; padding:48px; color:#999; font-size:13px; }
    .digest-loading.visible { display:flex; }

    /* Filter bar */
    .filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .filter-label { font-size: 13px; font-weight: 600; color: #111; margin-right: 4px; white-space: nowrap; }
    .filter-select {
      -webkit-appearance: none; appearance: none;
      padding: 6px 28px 6px 12px; border-radius: 7px; border: 1px solid #e5e5e5;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
      font-size: 13px; font-family: inherit; color: #555; cursor: pointer;
      transition: border-color 0.12s, font-weight 0.12s;
    }
    .filter-select:hover { border-color: #bbb; }
    .filter-select.active { border-color: #111; font-weight: 600; color: #111; }
    .clear-link {
      margin-left: auto; font-size: 13px; color: #aaa; cursor: pointer;
      text-decoration: none; white-space: nowrap;
    }
    .clear-link:hover { color: #111; text-decoration: underline; }

    .table-wrap { border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f9f9f9; }
    thead th {
      padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600;
      color: #999; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #e5e5e5;
    }
    .feedback-row { border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.1s; }
    .feedback-row:last-child { border-bottom: none; }
    .feedback-row:hover { background: #fafafa; }
    .feedback-row.expanded { background: #fafafa; }
    .no-results { padding: 40px; text-align: center; color: #999; font-size: 13px; }

    .loading-overlay {
      display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.75);
      backdrop-filter: blur(2px); z-index: 50; align-items: center; justify-content: center;
      font-size: 14px; color: #555; gap: 10px;
    }
    .loading-overlay.visible { display: flex; }
    .spinner { width: 20px; height: 20px; border: 2px solid #e5e5e5; border-top-color: #111; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    footer { padding: 48px 0 32px; text-align: center; font-size: 12px; color: #ccc; }
  </style>
</head>
<body>

<div class="loading-overlay" id="loading">
  <div class="spinner"></div>
  Regenerating digest…
</div>

<header>
  <div class="container">
    <div class="header-inner">
      <div>
        <div class="logo">Signal</div>
        <div class="tagline">Your feedback, distilled.</div>
      </div>
      <div class="header-right">
        <span class="date-label">${today}</span>
        <button class="refresh-btn" id="refreshBtn">&#x21BB; Refresh Digest</button>
      </div>
    </div>
  </div>
</header>

<main class="container">

  <!-- ── DIGEST SECTION ── -->
  <section>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px">
      <div>
        <div class="section-title" id="digestTitle">This Month's Digest</div>
        <div class="section-sub" id="digestSub">Generated ${generatedAt} &middot; AI-powered analysis of ${rows.filter(r => {
		const ts = new Date(r.timestamp).getTime();
		return ts >= Date.now() - 30 * 24 * 60 * 60 * 1000;
	}).length} feedback entries</div>
      </div>
      <div class="seg-control" role="group" aria-label="Digest time window">
        <button class="seg-btn" data-window="today">Today</button>
        <button class="seg-btn" data-window="week">This Week</button>
        <button class="seg-btn active" data-window="month">This Month</button>
      </div>
    </div>

    <div id="digestContent">
      <div class="theme-grid" id="themeGrid">
        ${themeCards(digest.themes)}
      </div>
      <div class="sentiment-section">
        <div style="font-size:13px;font-weight:600;color:#111;margin-bottom:12px">Overall Sentiment</div>
        ${sentimentBar(digest.sentiment)}
      </div>
    </div>
    <div class="digest-loading" id="digestLoading">
      <div class="spinner"></div> Analyzing feedback…
    </div>
  </section>

  <!-- ── FEEDBACK TABLE SECTION ── -->
  <section style="padding-bottom:40px">
    <div style="margin-bottom:16px">
      <div class="section-title">All Feedback</div>
      <div class="section-sub" id="rowCount">${rows.length} total entries across all channels</div>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar" id="filterBar">
      <span class="filter-label">Filters</span>
      <select class="filter-select" id="filterDate">
        <option value="all">All Time</option>
        <option value="month">This Month</option>
        <option value="week">This Week</option>
        <option value="today">Today</option>
      </select>
      <select class="filter-select" id="filterSource">
        <option value="all">All Sources</option>
        <option value="email">Email</option>
        <option value="github">GitHub</option>
        <option value="support">Support</option>
        <option value="twitter">Twitter</option>
      </select>
      <select class="filter-select" id="filterUrgency">
        <option value="all">All Urgencies</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select class="filter-select" id="filterTheme">
        <option value="all">All Themes</option>
        <option value="Performance">Performance</option>
        <option value="Onboarding">Onboarding</option>
        <option value="Billing">Billing</option>
        <option value="Documentation">Documentation</option>
        <option value="API Reliability">API Reliability</option>
      </select>
      <select class="filter-select" id="filterSentiment">
        <option value="all">All Sentiments</option>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
      <a class="clear-link" id="clearFilters">Clear all</a>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Content</th>
            <th>Theme</th>
            <th>Urgency</th>
            <th>Sentiment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="feedbackBody">
          ${feedbackRows(rows)}
        </tbody>
      </table>
      <div class="no-results" id="noResults" style="display:none">No entries match the current filters.</div>
    </div>
  </section>

</main>

<footer>
  <div class="container">Signal &mdash; Built on Cloudflare Workers &middot; D1 &middot; Workers AI</div>
</footer>

<script>
(function () {
  // ── State ──
  var state = { source: 'all', theme: 'all', urgency: 'all', sentiment: 'all', dateRange: 'all' };

  // ── Combined filter engine ──
  function applyFilters() {
    var now = Date.now();
    var DAY = 86400000;
    var todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    var dateStart = { all: 0, month: now - 30 * DAY, week: now - 7 * DAY, today: todayStart.getTime() }[state.dateRange] || 0;

    var visible = 0;
    document.querySelectorAll('.feedback-row').forEach(function (row) {
      var matchSource    = state.source === 'all'    || row.dataset.source === state.source;
      var matchTheme     = state.theme === 'all'     || row.dataset.theme === state.theme;
      var matchUrgency   = state.urgency === 'all'   || row.dataset.urgency === state.urgency;
      var matchSentiment = state.sentiment === 'all' || row.dataset.sentiment === state.sentiment;
      var ts = new Date(row.dataset.ts).getTime();
      var matchDate = dateStart === 0 || ts >= dateStart;
      var show = matchSource && matchTheme && matchUrgency && matchSentiment && matchDate;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    var hasFilters = state.source !== 'all' || state.theme !== 'all' || state.urgency !== 'all' || state.sentiment !== 'all' || state.dateRange !== 'all';
    document.getElementById('rowCount').textContent =
      visible + ' ' + (visible === 1 ? 'entry' : 'entries') +
      (hasFilters ? ' matching filters' : ' total entries across all channels');
    document.getElementById('noResults').style.display = visible === 0 ? '' : 'none';
  }

  // When a theme card is clicked and then the theme tab filter changes, sync the card highlight
  function syncThemeCards() {
    document.querySelectorAll('.theme-card').forEach(function (c) {
      c.classList.toggle('active', state.theme !== 'all' && c.dataset.theme === state.theme);
    });
  }

  // ── Row expand/collapse ──
  document.getElementById('feedbackBody').addEventListener('click', function (e) {
    var row = e.target.closest('.feedback-row');
    if (!row) return;
    var isExpanded = row.classList.contains('expanded');
    row.classList.toggle('expanded', !isExpanded);
    row.querySelector('.content-preview').style.display = isExpanded ? '' : 'none';
    row.querySelector('.content-full').style.display = isExpanded ? 'none' : '';
  });

  // ── Filter select helpers ──
  function updateSelStyle(sel) {
    sel.classList.toggle('active', sel.value !== 'all');
  }

  function wireSelect(id, stateKey) {
    var sel = document.getElementById(id);
    sel.addEventListener('change', function () {
      state[stateKey] = sel.value;
      updateSelStyle(sel);
      if (stateKey === 'theme') syncThemeCards();
      applyFilters();
    });
  }

  wireSelect('filterDate',      'dateRange');
  wireSelect('filterSource',    'source');
  wireSelect('filterUrgency',   'urgency');
  wireSelect('filterTheme',     'theme');
  wireSelect('filterSentiment', 'sentiment');

  // ── Clear all filters ──
  document.getElementById('clearFilters').addEventListener('click', function () {
    ['filterDate', 'filterSource', 'filterUrgency', 'filterTheme', 'filterSentiment'].forEach(function (id) {
      var sel = document.getElementById(id);
      sel.value = 'all';
      updateSelStyle(sel);
    });
    state.source = state.theme = state.urgency = state.sentiment = state.dateRange = 'all';
    syncThemeCards();
    applyFilters();
  });

  // ── Theme card click → also syncs theme select ──
  document.getElementById('themeGrid').addEventListener('click', function (e) {
    var card = e.target.closest('.theme-card');
    if (!card) return;
    var theme = card.dataset.theme;
    var isActive = card.classList.contains('active');
    document.querySelectorAll('.theme-card').forEach(function (c) { c.classList.remove('active'); });
    state.theme = isActive ? 'all' : theme;
    if (!isActive) card.classList.add('active');
    // Sync theme select to match
    var themeSel = document.getElementById('filterTheme');
    themeSel.value = state.theme;
    updateSelStyle(themeSel);
    applyFilters();
  });

  // ── Digest window toggle (event delegation) ──
  var WINDOW_LABELS = { today: "Today's Digest", week: "This Week's Digest", month: "This Month's Digest", all: "All-Time Digest" };

  document.querySelector('.seg-control').addEventListener('click', function (e) {
    var btn = e.target.closest('button.seg-btn');
    if (!btn || !btn.dataset.window) return;
    switchDigestWindow(btn.dataset.window, btn);
  });

  function switchDigestWindow(win, btn) {
    document.querySelectorAll('.seg-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var content = document.getElementById('digestContent');
    var loader  = document.getElementById('digestLoading');
    content.style.opacity = '0.4';
    content.style.pointerEvents = 'none';
    loader.classList.add('visible');
    fetch('/api/digest?window=' + win)
      .then(function (r) { return r.json(); })
      .then(function (digest) { renderDigestDOM(digest, win); })
      .catch(function (err) { console.error('Digest switch failed:', err); })
      .finally(function () {
        content.style.opacity = '';
        content.style.pointerEvents = '';
        loader.classList.remove('visible');
      });
  }

  function renderDigestDOM(digest, win) {
    document.getElementById('digestTitle').textContent = WINDOW_LABELS[win] || 'Digest';
    var count = (digest.themes || []).reduce(function (s, t) { return s + t.count; }, 0);
    document.getElementById('digestSub').textContent =
      'Generated ' + new Date(digest.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' \u00b7 AI-powered analysis of ' + count + ' feedback ' + (count === 1 ? 'entry' : 'entries');

    // Rebuild theme cards (no onclick — event delegation on #themeGrid handles clicks)
    var grid = document.getElementById('themeGrid');
    if (!digest.themes || digest.themes.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:32px;text-align:center;color:#999;font-size:14px">No feedback data for this time window.</div>';
    } else {
      var urgencyStyles = { high: 'background:#fee2e2;color:#dc2626', medium: 'background:#fef3c7;color:#d97706', low: 'background:#dcfce7;color:#16a34a' };
      grid.innerHTML = digest.themes.slice(0, 3).map(function (t) {
        var urg = t.urgency || 'low';
        var badgeStyle = urgencyStyles[urg] || urgencyStyles.low;
        var badge = '<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:0.04em;' + badgeStyle + '">' + urg.charAt(0).toUpperCase() + urg.slice(1) + '</span>';
        var trendHtml = '';
        var tr = t.trend;
        if (tr) {
          if (tr.direction === 'new') {
            trendHtml = '<div style="font-size:11px;color:#999;margin-top:5px">New this period</div>';
          } else if (tr.direction === 'same') {
            trendHtml = '<div style="font-size:11px;color:#999;margin-top:5px">\u2014 same as ' + tr.vsLabel + '</div>';
          } else {
            var arrow = tr.direction === 'up' ? '\u2191' : '\u2193';
            var clr = tr.direction === 'up' ? '#dc2626' : '#16a34a';
            trendHtml = '<div style="font-size:11px;color:' + clr + ';font-weight:500;margin-top:5px">' + arrow + ' ' + tr.percent + '% vs ' + tr.vsLabel + '</div>';
          }
        }
        return '<div class="theme-card" data-theme="' + t.theme + '">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><span style="font-size:15px;font-weight:600;color:#111">' + t.theme + '</span>' + badge + '</div>' +
          '<p style="margin:0 0 12px;font-size:13px;color:#444;line-height:1.5">' + t.summary + '</p>' +
          '<span style="font-size:12px;color:#999">' + t.count + ' ' + (t.count === 1 ? 'entry' : 'entries') + '</span>' + trendHtml + '</div>';
      }).join('');
    }

    // Update sentiment bar using stable IDs
    var s = digest.sentiment || { positive: 0, neutral: 0, negative: 0 };
    document.getElementById('barPos').style.width = s.positive + '%';
    document.getElementById('barNeu').style.width = s.neutral + '%';
    document.getElementById('barNeg').style.width = s.negative + '%';
    document.getElementById('sentPos').textContent = s.positive + '%';
    document.getElementById('sentNeu').textContent = s.neutral + '%';
    document.getElementById('sentNeg').textContent = s.negative + '%';

    // Reset theme filter when switching digest windows
    state.theme = 'all';
    var themeSel = document.getElementById('filterTheme');
    themeSel.value = 'all';
    updateSelStyle(themeSel);
    document.querySelectorAll('.theme-card').forEach(function (c) { c.classList.remove('active'); });
    applyFilters();
  }

  // ── Refresh digest button ──
  document.getElementById('refreshBtn').addEventListener('click', function () {
    var btn = this;
    var overlay = document.getElementById('loading');
    var activeWin = (document.querySelector('.seg-btn.active') || {}).dataset && document.querySelector('.seg-btn.active').dataset.window || 'month';
    btn.disabled = true;
    overlay.classList.add('visible');
    fetch('/api/refresh?window=' + activeWin, { method: 'POST' })
      .then(function () { location.reload(); })
      .catch(function (err) {
        alert('Failed to refresh: ' + err.message);
        btn.disabled = false;
        overlay.classList.remove('visible');
      });
  });

}());
</script>
</body>
</html>`;
}
