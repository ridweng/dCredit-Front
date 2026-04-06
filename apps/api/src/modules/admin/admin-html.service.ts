import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';

@Injectable()
export class AdminHtmlService {
  renderLoginPage(error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>dCredit Admin Login</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --card: #ffffff;
        --text: #182233;
        --muted: #5b6880;
        --line: #dce4f0;
        --primary: #1f6feb;
        --danger: #c0392b;
        --shadow: 0 12px 28px rgba(24, 34, 51, 0.08);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--text);
      }
      .card {
        width: min(420px, calc(100vw - 32px));
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 28px;
        box-shadow: var(--shadow);
      }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0 0 20px; color: var(--muted); line-height: 1.5; }
      label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
      input {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 15px;
        margin-bottom: 14px;
      }
      button {
        width: 100%;
        padding: 12px 14px;
        border: 0;
        border-radius: 12px;
        background: var(--primary);
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
      }
      .error {
        margin-bottom: 16px;
        border: 1px solid rgba(192, 57, 43, 0.25);
        background: rgba(192, 57, 43, 0.08);
        color: var(--danger);
        padding: 12px 14px;
        border-radius: 12px;
      }
      code {
        background: #f2f5fb;
        padding: 2px 6px;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>dCredit Admin</h1>
      <p>Internal operations access for activation KPIs, user lookup, schema reference, and backend documentation.</p>
      ${error ? `<div class="error">${this.escapeHtml(error)}</div>` : ''}
      <form method="post" action="/admin/login">
        <label for="email">Admin email</label>
        <input id="email" name="email" type="email" autocomplete="username" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required />
        <button type="submit">Sign in</button>
      </form>
    </main>
  </body>
</html>`;
  }

  renderDashboardPage(adminUser: User): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>dCredit Ops Dashboard</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --card: #ffffff;
        --panel: #f8fbff;
        --text: #172132;
        --muted: #60708a;
        --line: #dde5f0;
        --primary: #215fd0;
        --green: #1f8b4c;
        --amber: #c8811a;
        --red: #bf3d30;
        --shadow: 0 10px 30px rgba(23, 33, 50, 0.08);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(244, 247, 251, 0.96);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--line);
      }
      .topbar, main {
        width: min(1200px, calc(100vw - 24px));
        margin: 0 auto;
      }
      .topbar {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
      }
      .brand h1 { margin: 0; font-size: 22px; }
      .brand p { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
      .actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .actions a, .actions button {
        border: 1px solid var(--line);
        background: #fff;
        color: var(--text);
        border-radius: 12px;
        padding: 10px 14px;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
      }
      main { padding: 20px 0 36px; }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
      nav button {
        border: 1px solid var(--line);
        background: #fff;
        color: var(--muted);
        padding: 10px 14px;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
      }
      nav button.active {
        background: var(--primary);
        color: #fff;
        border-color: var(--primary);
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .grid.cards {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .split {
        display: grid;
        gap: 16px;
        grid-template-columns: 1.3fr 1fr;
      }
      .card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 18px;
        box-shadow: var(--shadow);
        padding: 18px;
      }
      .card h2, .card h3 {
        margin: 0 0 10px;
      }
      .muted { color: var(--muted); }
      .metric-value {
        font-size: 32px;
        font-weight: 800;
        margin: 6px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 10px 8px;
        border-bottom: 1px solid var(--line);
        font-size: 14px;
        vertical-align: top;
      }
      th { color: var(--muted); font-weight: 600; }
      tr.clickable { cursor: pointer; }
      tr.clickable:hover { background: #f7faff; }
      .badge {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 700;
      }
      .badge.green { background: rgba(31, 139, 76, 0.12); color: var(--green); }
      .badge.amber { background: rgba(200, 129, 26, 0.12); color: var(--amber); }
      .badge.red { background: rgba(191, 61, 48, 0.12); color: var(--red); }
      .progress-row {
        display: grid;
        gap: 10px;
        grid-template-columns: 180px 1fr 72px;
        align-items: center;
        margin-bottom: 10px;
      }
      .bar {
        background: #eef3fb;
        border-radius: 999px;
        overflow: hidden;
        height: 10px;
      }
      .bar > span {
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #3b82f6 0%, #215fd0 100%);
      }
      .search-form {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        margin-bottom: 16px;
      }
      input, select {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 10px 12px;
        background: #fff;
      }
      code {
        background: #f2f5fb;
        color: #334155;
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 12px;
      }
      .schema-shell {
        display: grid;
        gap: 16px;
      }
      .schema-layout {
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.2fr);
      }
      .schema-map {
        position: relative;
        max-height: 72vh;
        overflow: auto;
        padding: 6px;
        background:
          linear-gradient(90deg, rgba(221, 229, 240, 0.35) 1px, transparent 1px) 0 0 / 28px 28px,
          linear-gradient(rgba(221, 229, 240, 0.35) 1px, transparent 1px) 0 0 / 28px 28px,
          #fbfdff;
        border-radius: 16px;
      }
      .schema-diagram {
        position: relative;
        min-height: 640px;
      }
      .schema-links {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: visible;
      }
      .schema-edge {
        fill: none;
        stroke: rgba(96, 112, 138, 0.38);
        stroke-width: 2;
        transition: stroke 0.16s ease, stroke-width 0.16s ease, opacity 0.16s ease;
      }
      .schema-edge.active {
        stroke: rgba(33, 95, 208, 0.72);
        stroke-width: 3;
      }
      .schema-edge-label {
        font-size: 11px;
        fill: #64748b;
      }
      .schema-node-layer {
        position: absolute;
        inset: 0;
      }
      .schema-table-node {
        position: absolute;
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 16px;
        padding: 14px;
        cursor: pointer;
        transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
        box-shadow: 0 10px 20px rgba(23, 33, 50, 0.06);
      }
      .schema-table-node:hover {
        transform: translateY(-1px);
        border-color: rgba(33, 95, 208, 0.35);
      }
      .schema-table-node.active {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(33, 95, 208, 0.12);
        background: #f8fbff;
      }
      .schema-table-header {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .schema-table-header h3 {
        margin: 0 0 4px;
      }
      .schema-node-columns {
        margin-top: 10px;
        display: grid;
        gap: 6px;
      }
      .schema-node-column {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 10px;
        background: #f8fbff;
        border: 1px solid #e8eef8;
      }
      .schema-node-column code {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .schema-node-column-flags {
        display: inline-flex;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .schema-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }
      .schema-stat {
        border: 1px solid var(--line);
        border-radius: 999px;
        background: #fff;
        padding: 5px 10px;
        font-size: 12px;
        color: var(--muted);
        font-weight: 700;
      }
      .section-kicker {
        display: inline-flex;
        margin-bottom: 10px;
        border-radius: 999px;
        background: rgba(33, 95, 208, 0.12);
        color: var(--primary);
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 700;
      }
      .schema-column-table td,
      .schema-column-table th {
        font-size: 13px;
      }
      .column-flags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .column-flag {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.01em;
      }
      .column-flag.pk {
        background: rgba(31, 139, 76, 0.12);
        color: var(--green);
      }
      .column-flag.fk {
        background: rgba(33, 95, 208, 0.12);
        color: var(--primary);
      }
      .column-flag.unique {
        background: rgba(200, 129, 26, 0.12);
        color: var(--amber);
      }
      .column-flag.nullable {
        background: rgba(96, 112, 138, 0.12);
        color: var(--muted);
      }
      .schema-detail-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        margin-bottom: 16px;
      }
      .schema-detail-card {
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 14px;
        padding: 12px;
      }
      .schema-detail-card strong {
        display: block;
        font-size: 22px;
        margin-top: 4px;
      }
      .relationship-list {
        display: grid;
        gap: 10px;
      }
      .relationship-item {
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 14px;
        padding: 12px;
      }
      .relationship-item strong {
        display: block;
        margin-bottom: 4px;
      }
      .pill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .pill {
        background: #f2f6fd;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 12px;
        color: var(--muted);
      }
      pre {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        background: #0f172a;
        color: #e2e8f0;
        padding: 14px;
        border-radius: 14px;
        font-size: 12px;
      }
      .empty, .loading {
        padding: 18px;
        border: 1px dashed var(--line);
        border-radius: 16px;
        color: var(--muted);
        background: var(--panel);
      }
      .section { display: none; }
      .section.active { display: block; }
      @media (max-width: 900px) {
        .split { grid-template-columns: 1fr; }
        .progress-row { grid-template-columns: 1fr; }
        .schema-layout { grid-template-columns: 1fr; }
        .schema-map { max-height: none; }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="topbar">
        <div class="brand">
          <h1>dCredit Ops Dashboard</h1>
          <p>Signed in as ${this.escapeHtml(adminUser.fullName)} (${this.escapeHtml(adminUser.email)})</p>
        </div>
        <div class="actions">
          <a href="/api/docs" target="_blank" rel="noreferrer">Swagger</a>
          <form method="post" action="/admin/logout" style="margin:0">
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
    </header>
    <main>
      <nav id="tabs">
        <button data-tab="overview" class="active">Overview</button>
        <button data-tab="users">Users</button>
        <button data-tab="searcher">Searcher</button>
        <button data-tab="database">Database</button>
        <button data-tab="backend-docs">Backend Docs</button>
      </nav>
      <section id="overview" class="section active"><div class="loading">Loading overview...</div></section>
      <section id="users" class="section"><div class="loading">Loading users...</div></section>
      <section id="searcher" class="section"><div class="loading">Loading search...</div></section>
      <section id="database" class="section"><div class="loading">Loading database reference...</div></section>
      <section id="backend-docs" class="section"><div class="loading">Loading backend docs...</div></section>
    </main>
    <script>
      const state = { users: [], selectedUserId: null, schema: null, selectedSchemaTableName: null };

      function money(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
      }

      function dateTime(value) {
        if (!value) return 'N/A';
        return new Date(value).toLocaleString();
      }

      function stageBadge(stage) {
        const kind = stage === 'activated' ? 'green' : stage === 'registered' ? 'red' : 'amber';
        return '<span class="badge ' + kind + '">' + stage.replaceAll('_', ' ') + '</span>';
      }

      function escapeHtml(value) {
        return String(value ?? '')
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');
      }

      function columnFlag(label, kind) {
        return '<span class="column-flag ' + kind + '">' + escapeHtml(label) + '</span>';
      }

      function buildSchemaLayout(schema) {
        const nodeWidth = 290;
        const nodeHeight = 214;
        const horizontalGap = 110;
        const verticalGap = 36;
        const padding = 28;
        const edges = schema.overview.relationships || [];
        const adjacency = new Map();
        const incomingCount = new Map();

        schema.tables.forEach((table) => {
          adjacency.set(table.name, []);
          incomingCount.set(table.name, 0);
        });

        edges.forEach((edge) => {
          if (!adjacency.has(edge.fromTable)) {
            adjacency.set(edge.fromTable, []);
          }
          adjacency.get(edge.fromTable).push(edge.toTable);
          incomingCount.set(edge.toTable, (incomingCount.get(edge.toTable) || 0) + 1);
        });

        const roots = schema.tables
          .map((table) => table.name)
          .filter((tableName) => (incomingCount.get(tableName) || 0) === 0);
        const queue = roots.length > 0 ? [...roots] : schema.tables.map((table) => table.name);
        const depthMap = new Map(queue.map((tableName) => [tableName, 0]));

        while (queue.length > 0) {
          const current = queue.shift();
          const currentDepth = depthMap.get(current) || 0;
          (adjacency.get(current) || []).forEach((next) => {
            const nextDepth = currentDepth + 1;
            if (!depthMap.has(next) || nextDepth > depthMap.get(next)) {
              depthMap.set(next, nextDepth);
              queue.push(next);
            }
          });
        }

        schema.tables.forEach((table) => {
          if (!depthMap.has(table.name)) {
            depthMap.set(table.name, 0);
          }
        });

        const maxDepth = Math.max(...Array.from(depthMap.values()), 0);
        const columns = Array.from({ length: maxDepth + 1 }, () => []);

        schema.tables
          .slice()
          .sort((left, right) => {
            const depthDelta = (depthMap.get(left.name) || 0) - (depthMap.get(right.name) || 0);
            return depthDelta !== 0 ? depthDelta : left.name.localeCompare(right.name);
          })
          .forEach((table) => {
            columns[depthMap.get(table.name) || 0].push(table);
          });

        const positions = new Map();
        let diagramHeight = padding * 2;

        columns.forEach((columnTables, columnIndex) => {
          columnTables.forEach((table, rowIndex) => {
            const x = padding + columnIndex * (nodeWidth + horizontalGap);
            const y = padding + rowIndex * (nodeHeight + verticalGap);
            positions.set(table.name, { x, y, width: nodeWidth, height: nodeHeight });
            diagramHeight = Math.max(diagramHeight, y + nodeHeight + padding);
          });
        });

        const diagramWidth = padding * 2 + columns.length * nodeWidth + Math.max(columns.length - 1, 0) * horizontalGap;

        return {
          nodeWidth,
          nodeHeight,
          width: Math.max(diagramWidth, 860),
          height: Math.max(diagramHeight, 640),
          positions,
        };
      }

      function renderSchemaDiagram(schema) {
        const layout = buildSchemaLayout(schema);
        const edgeMarkup = schema.overview.relationships.map((relation) => {
          const from = layout.positions.get(relation.fromTable);
          const to = layout.positions.get(relation.toTable);
          if (!from || !to) return '';
          const startX = from.x + from.width;
          const startY = from.y + from.height / 2;
          const endX = to.x;
          const endY = to.y + to.height / 2;
          const controlOffset = Math.max(56, Math.abs(endX - startX) / 2);
          const path = 'M ' + startX + ' ' + startY + ' C ' + (startX + controlOffset) + ' ' + startY + ', ' + (endX - controlOffset) + ' ' + endY + ', ' + endX + ' ' + endY;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2 - 8;

          return \`
            <g data-schema-edge data-from-table="\${escapeHtml(relation.fromTable)}" data-to-table="\${escapeHtml(relation.toTable)}">
              <path class="schema-edge" d="\${path}" />
              <text class="schema-edge-label" x="\${midX}" y="\${midY}" text-anchor="middle">\${escapeHtml(relation.fromColumn)} -> \${escapeHtml(relation.toColumn)}</text>
            </g>
          \`;
        }).join('');

        const nodeMarkup = schema.tables.map((table) => {
          const position = layout.positions.get(table.name);
          if (!position) return '';
          const previewColumns = table.columns.slice(0, 4);
          return \`
            <div
              class="schema-table-node"
              data-schema-table="\${escapeHtml(table.name)}"
              style="left:\${position.x}px;top:\${position.y}px;width:\${position.width}px;min-height:\${position.height}px"
            >
              <div class="schema-table-header">
                <div>
                  <h3>\${escapeHtml(table.name)}</h3>
                  <div class="muted">\${escapeHtml(table.purpose)}</div>
                </div>
                <div class="schema-stats">
                  <span class="schema-stat">PK \${table.primaryKeys.length}</span>
                  <span class="schema-stat">FK \${table.foreignKeys.length}</span>
                </div>
              </div>
              <div class="pill-list" style="margin-bottom:10px">
                <span class="pill">Cols: \${table.columns.length}</span>
                <span class="pill">Rows: \${Number(table.estimatedRows || 0).toLocaleString()}</span>
              </div>
              <div class="schema-node-columns">
                \${previewColumns.map((column) => \`
                  <div class="schema-node-column">
                    <code>\${escapeHtml(column.name)}</code>
                    <span class="schema-node-column-flags">
                      \${column.isPrimaryKey ? columnFlag('PK', 'pk') : ''}
                      \${column.isForeignKey ? columnFlag('FK', 'fk') : ''}
                    </span>
                  </div>
                \`).join('')}
                \${table.columns.length > previewColumns.length ? \`<div class="muted">+\${table.columns.length - previewColumns.length} more columns</div>\` : ''}
              </div>
            </div>
          \`;
        }).join('');

        return \`
          <div class="schema-diagram" style="width:\${layout.width}px;height:\${layout.height}px">
            <svg class="schema-links" viewBox="0 0 \${layout.width} \${layout.height}" preserveAspectRatio="xMinYMin meet">
              \${edgeMarkup}
            </svg>
            <div class="schema-node-layer">
              \${nodeMarkup}
            </div>
          </div>
        \`;
      }

      function renderSchemaDetail(table) {
        return \`
          <span class="section-kicker">Table inspector</span>
          <h2>\${escapeHtml(table.name)}</h2>
          <p class="muted">\${escapeHtml(table.purpose)}</p>
          <p class="muted" style="margin-top:-4px">\${escapeHtml(table.notes)}</p>
          <div class="schema-detail-grid">
            <div class="schema-detail-card">
              <div class="muted">Estimated rows</div>
              <strong>\${Number(table.estimatedRows || 0).toLocaleString()}</strong>
            </div>
            <div class="schema-detail-card">
              <div class="muted">Total size</div>
              <strong>\${escapeHtml(table.totalSizeLabel)}</strong>
            </div>
            <div class="schema-detail-card">
              <div class="muted">Primary keys</div>
              <strong>\${table.primaryKeys.length}</strong>
            </div>
            <div class="schema-detail-card">
              <div class="muted">Foreign keys</div>
              <strong>\${table.foreignKeys.length}</strong>
            </div>
          </div>
          <div class="pill-list" style="margin-bottom:16px">
            \${table.relatedTables.length === 0
              ? '<span class="pill">No direct relationships</span>'
              : table.relatedTables.map((relatedTable) => \`<span class="pill">\${escapeHtml(relatedTable)}</span>\`).join('')}
          </div>
          <h3>Columns</h3>
          <table class="schema-column-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Flags</th>
                <th>Default</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              \${table.columns.map((column) => \`
                <tr>
                  <td><code>\${escapeHtml(column.name)}</code></td>
                  <td>\${escapeHtml(column.dataType)}</td>
                  <td>
                    <div class="column-flags">
                      \${column.isPrimaryKey ? columnFlag('PK', 'pk') : ''}
                      \${column.isForeignKey ? columnFlag('FK', 'fk') : ''}
                      \${column.isUnique ? columnFlag('UNIQUE', 'unique') : ''}
                      \${column.nullable ? columnFlag('NULL', 'nullable') : ''}
                    </div>
                  </td>
                  <td>\${column.defaultValue ? \`<code>\${escapeHtml(column.defaultValue)}</code>\` : '<span class="muted">None</span>'}</td>
                  <td>\${column.references
                    ? \`<code>\${escapeHtml(column.references.table)}.\${escapeHtml(column.references.column)}</code><br /><span class="muted">ON UPDATE \${escapeHtml(column.references.updateRule || 'NO ACTION')} · ON DELETE \${escapeHtml(column.references.deleteRule || 'NO ACTION')}</span>\`
                    : '<span class="muted">-</span>'}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
          <div class="split" style="margin-top:16px">
            <article class="card" style="padding:0;border:0;box-shadow:none;background:transparent">
              <h3>Outgoing relationships</h3>
              \${table.foreignKeys.length === 0
                ? '<div class="empty">This table does not reference other tables.</div>'
                : \`<div class="relationship-list">
                    \${table.foreignKeys.map((relation) => \`
                      <div class="relationship-item">
                        <strong><code>\${escapeHtml(relation.fromTable)}.\${escapeHtml(relation.fromColumn)}</code> -> <code>\${escapeHtml(relation.toTable)}.\${escapeHtml(relation.toColumn)}</code></strong>
                        <div class="muted">\${escapeHtml(relation.constraintName)}</div>
                        <div class="muted">ON UPDATE \${escapeHtml(relation.updateRule || 'NO ACTION')} · ON DELETE \${escapeHtml(relation.deleteRule || 'NO ACTION')}</div>
                      </div>
                    \`).join('')}
                  </div>\`}
            </article>
            <article class="card" style="padding:0;border:0;box-shadow:none;background:transparent">
              <h3>Referenced by</h3>
              \${table.incomingForeignKeys.length === 0
                ? '<div class="empty">No other tables currently reference this table.</div>'
                : \`<div class="relationship-list">
                    \${table.incomingForeignKeys.map((relation) => \`
                      <div class="relationship-item">
                        <strong><code>\${escapeHtml(relation.fromTable)}.\${escapeHtml(relation.fromColumn)}</code> -> <code>\${escapeHtml(relation.toTable)}.\${escapeHtml(relation.toColumn)}</code></strong>
                        <div class="muted">\${escapeHtml(relation.constraintName)}</div>
                      </div>
                    \`).join('')}
                  </div>\`}
            </article>
          </div>
          <h3 style="margin-top:16px">Indexes</h3>
          \${table.indexes.length === 0
            ? '<div class="empty">No indexes discovered.</div>'
            : '<pre>' + escapeHtml(table.indexes.map((index) => index.definition).join('\\n\\n')) + '</pre>'}
        \`;
      }

      function selectSchemaTable(tableName) {
        if (!state.schema) return;
        const table = state.schema.tables.find((entry) => entry.name === tableName) || state.schema.tables[0];
        if (!table) return;
        state.selectedSchemaTableName = table.name;
        document.querySelectorAll('[data-schema-table]').forEach((node) => {
          node.classList.toggle('active', node.getAttribute('data-schema-table') === table.name);
        });
        document.querySelectorAll('[data-schema-edge]').forEach((edge) => {
          const isConnected =
            edge.getAttribute('data-from-table') === table.name ||
            edge.getAttribute('data-to-table') === table.name;
          edge.querySelector('.schema-edge')?.classList.toggle('active', isConnected);
        });
        const panel = document.getElementById('schema-detail-panel');
        if (panel) {
          panel.innerHTML = renderSchemaDetail(table);
        }
      }

      async function fetchJson(path) {
        const response = await fetch(path, { credentials: 'same-origin' });
        if (response.status === 401) {
          window.location.href = '/admin/login';
          return null;
        }
        if (!response.ok) {
          throw new Error('Request failed for ' + path);
        }
        return response.json();
      }

      function activateTab(tab) {
        document.querySelectorAll('#tabs button').forEach((button) => {
          button.classList.toggle('active', button.dataset.tab === tab);
        });
        document.querySelectorAll('.section').forEach((section) => {
          section.classList.toggle('active', section.id === tab);
        });
      }

      async function loadOverview() {
        const data = await fetchJson('/admin/overview');
        if (!data) return;
        const section = document.getElementById('overview');
        section.innerHTML = \`
          <div class="grid cards">
            \${[
              ['Total users', data.kpis.totalUsers],
              ['Verified users', data.kpis.verifiedUsers],
              ['Unverified users', data.kpis.unverifiedUsers],
              ['Users with sources', data.kpis.usersWithSources],
              ['Users with accounts', data.kpis.usersWithAccounts],
              ['Users with transactions', data.kpis.usersWithTransactions],
              ['Users with credits', data.kpis.usersWithCredits],
              ['Activated users', data.kpis.activatedUsers],
            ].map(([label, value]) => \`<article class="card"><div class="muted">\${label}</div><div class="metric-value">\${value}</div></article>\`).join('')}
          </div>
          <div class="split" style="margin-top:16px">
            <article class="card">
              <h2>Activation funnel</h2>
              <p class="muted">\${escapeHtml(data.activationDefinition)}</p>
              \${data.funnel.map((entry) => \`
                <div class="progress-row">
                  <strong>\${escapeHtml(entry.label)}</strong>
                  <div class="bar"><span style="width:\${entry.percentage}%"></span></div>
                  <div>\${entry.count} (\${entry.percentage}%)</div>
                </div>
              \`).join('')}
            </article>
            <article class="card">
              <h2>Growth summary</h2>
              <p class="muted">Recent registration activity based on user creation timestamps.</p>
              <div class="metric-value">\${data.trends.last7Days}</div>
              <div class="muted">New users in the last 7 days</div>
              <div style="margin-top:12px"><strong>Previous 7 days:</strong> \${data.trends.previous7Days}</div>
              <div><strong>Delta:</strong> \${data.trends.delta >= 0 ? '+' : ''}\${data.trends.delta}</div>
            </article>
          </div>
          <div class="split" style="margin-top:16px">
            <article class="card">
              <h2>Latest signups</h2>
              <table>
                <thead><tr><th>User</th><th>Stage</th><th>Created</th></tr></thead>
                <tbody>
                  \${data.latestSignups.map((user) => \`
                    <tr>
                      <td><strong>\${escapeHtml(user.fullName)}</strong><br /><span class="muted">\${escapeHtml(user.email)}</span></td>
                      <td>\${stageBadge(user.activationStage)}</td>
                      <td>\${dateTime(user.createdAt)}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </article>
            <article class="card">
              <h2>Latest verifications</h2>
              \${data.latestVerifications.length === 0 ? '<div class="empty">No completed verifications yet.</div>' : \`
                <table>
                  <thead><tr><th>User</th><th>Verified at</th></tr></thead>
                  <tbody>
                    \${data.latestVerifications.map((entry) => \`
                      <tr>
                        <td><strong>\${escapeHtml(entry.user.fullName)}</strong><br /><span class="muted">\${escapeHtml(entry.user.email)}</span></td>
                        <td>\${dateTime(entry.usedAt)}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \`}
            </article>
          </div>
        \`;
      }

      async function loadUsers() {
        const data = await fetchJson('/admin/users');
        if (!data) return;
        state.users = data.users;
        if (!state.selectedUserId && data.users[0]) {
          state.selectedUserId = data.users[0].id;
        }
        renderUsers();
        if (state.selectedUserId) {
          await loadUserDetail(state.selectedUserId);
        }
      }

      function renderUsers() {
        const section = document.getElementById('users');
        section.innerHTML = \`
          <div class="split">
            <article class="card">
              <h2>User journeys</h2>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Language</th>
                    <th>Verified</th>
                    <th>Stage</th>
                    <th>Sources</th>
                    <th>Accounts</th>
                    <th>Transactions</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  \${state.users.map((user) => \`
                    <tr class="clickable" data-user-id="\${user.id}">
                      <td><strong>\${escapeHtml(user.fullName)}</strong><br /><span class="muted">\${escapeHtml(user.email)}</span></td>
                      <td>\${escapeHtml(user.preferredLanguage)}</td>
                      <td>\${user.emailVerified ? 'Yes' : 'No'}\${user.isAdmin ? ' · Admin' : ''}</td>
                      <td>\${stageBadge(user.activationStage)}</td>
                      <td>\${user.financialSourceCount}</td>
                      <td>\${user.accountCount}</td>
                      <td>\${user.transactionCount}</td>
                      <td>\${user.creditCount}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </article>
            <article class="card" id="user-detail-panel">
              <div class="loading">Select a user to inspect journey details.</div>
            </article>
          </div>
        \`;
        section.querySelectorAll('[data-user-id]').forEach((row) => {
          row.addEventListener('click', async () => {
            state.selectedUserId = row.getAttribute('data-user-id');
            await loadUserDetail(state.selectedUserId);
          });
        });
      }

      async function loadUserDetail(userId) {
        const detail = await fetchJson('/admin/users/' + encodeURIComponent(userId));
        if (!detail) return;
        const panel = document.getElementById('user-detail-panel');
        panel.innerHTML = \`
          <h2>\${escapeHtml(detail.fullName)}</h2>
          <p class="muted">\${escapeHtml(detail.email)} · \${detail.emailVerified ? 'Verified' : 'Unverified'} · \${detail.isAdmin ? 'Admin' : 'Standard user'}</p>
          <div class="pill-list" style="margin-bottom:16px">
            <span class="pill">Stage: \${escapeHtml(detail.activationStage)}</span>
            <span class="pill">Language: \${escapeHtml(detail.preferredLanguage)}</span>
            <span class="pill">Created: \${dateTime(detail.createdAt)}</span>
            <span class="pill">Last activity: \${dateTime(detail.lastActivityAt)}</span>
          </div>
          <h3>Journey</h3>
          <div class="pill-list" style="margin-bottom:16px">
            \${detail.journey.map((step) => \`<span class="pill">\${step.completed ? '✓' : '○'} \${escapeHtml(step.label)}</span>\`).join('')}
          </div>
          <h3>Counts</h3>
          <div class="pill-list" style="margin-bottom:16px">
            <span class="pill">Verification tokens: \${detail.counts.verificationTokenCount}</span>
            <span class="pill">Sources: \${detail.counts.financialSourceCount}</span>
            <span class="pill">Accounts: \${detail.counts.accountCount}</span>
            <span class="pill">Transactions: \${detail.counts.transactionCount}</span>
            <span class="pill">Credits: \${detail.counts.creditCount}</span>
          </div>
          <h3>Financial sources</h3>
          \${detail.financialSources.length === 0 ? '<div class="empty">No financial sources yet.</div>' : '<pre>' + escapeHtml(JSON.stringify(detail.financialSources, null, 2)) + '</pre>'}
          <h3>Accounts</h3>
          \${detail.accounts.length === 0 ? '<div class="empty">No accounts yet.</div>' : '<pre>' + escapeHtml(JSON.stringify(detail.accounts, null, 2)) + '</pre>'}
          <h3>Credits</h3>
          \${detail.credits.length === 0 ? '<div class="empty">No credits yet.</div>' : '<pre>' + escapeHtml(JSON.stringify(detail.credits, null, 2)) + '</pre>'}
          <h3>Recent transactions</h3>
          \${detail.recentTransactions.length === 0 ? '<div class="empty">No transactions yet.</div>' : '<pre>' + escapeHtml(JSON.stringify(detail.recentTransactions, null, 2)) + '</pre>'}
        \`;
      }

      async function loadSearcher() {
        const section = document.getElementById('searcher');
        section.innerHTML = \`
          <article class="card">
            <h2>User search</h2>
            <form id="search-form" class="search-form">
              <input name="q" placeholder="Search by name or email" />
              <select name="verified">
                <option value="">Verification</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
              <select name="activationStage">
                <option value="">Activation stage</option>
                <option value="registered">Registered</option>
                <option value="email_verified">Email verified</option>
                <option value="source_connected">Source connected</option>
                <option value="account_ready">Account ready</option>
                <option value="transaction_ready">Transaction ready</option>
                <option value="credit_ready">Credit ready</option>
                <option value="activated">Activated</option>
              </select>
              <select name="hasFinancialSources">
                <option value="">Has sources</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <select name="hasCredits">
                <option value="">Has credits</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <button type="submit" style="background:var(--primary);color:#fff;border:0;border-radius:12px;padding:10px 12px">Search</button>
            </form>
            <div id="search-results" class="empty">Run a search to inspect filtered users.</div>
          </article>
        \`;

        const form = document.getElementById('search-form');
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const params = new URLSearchParams(new FormData(form));
          const data = await fetchJson('/admin/search?' + params.toString());
          if (!data) return;
          const container = document.getElementById('search-results');
          container.innerHTML = data.results.length === 0
            ? '<div class="empty">No users matched the current filters.</div>'
            : \`<table>
                <thead><tr><th>User</th><th>Stage</th><th>Verified</th><th>Sources</th><th>Credits</th><th>Last activity</th></tr></thead>
                <tbody>
                  \${data.results.map((user) => \`
                    <tr class="clickable" data-user-id="\${user.id}">
                      <td><strong>\${escapeHtml(user.fullName)}</strong><br /><span class="muted">\${escapeHtml(user.email)}</span></td>
                      <td>\${stageBadge(user.activationStage)}</td>
                      <td>\${user.emailVerified ? 'Yes' : 'No'}</td>
                      <td>\${user.financialSourceCount}</td>
                      <td>\${user.creditCount}</td>
                      <td>\${dateTime(user.lastActivityAt)}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>\`;
          container.querySelectorAll('[data-user-id]').forEach((row) => {
            row.addEventListener('click', async () => {
              activateTab('users');
              state.selectedUserId = row.getAttribute('data-user-id');
              await loadUsers();
            });
          });
        });
      }

      async function loadDatabase() {
        const data = await fetchJson('/admin/database');
        if (!data) return;
        state.schema = data;
        if (!state.selectedSchemaTableName && data.tables[0]) {
          state.selectedSchemaTableName = data.tables[0].name;
        }
        const section = document.getElementById('database');
        section.innerHTML = \`
          <article class="card" style="margin-bottom:16px">
            <span class="section-kicker">Live Postgres schema</span>
            <h2>Database overview</h2>
            <p class="muted">\${escapeHtml(data.overview.summary)}</p>
            <div class="pill-list">
              <span class="pill">Generated: \${dateTime(data.generatedAt)}</span>
              <span class="pill">Tables: \${data.overview.tableCount}</span>
              <span class="pill">Relationships: \${data.overview.relationshipCount}</span>
              <span class="pill">Source: \${escapeHtml(data.source)}</span>
            </div>
          </article>
          <div class="schema-shell">
            <div class="schema-layout">
              <article class="card schema-map">
                \${renderSchemaDiagram(data)}
              </article>
              <article class="card" id="schema-detail-panel">
                <div class="loading">Select a table to inspect its columns, keys, and live database metadata.</div>
              </article>
            </div>
            <article class="card">
              <h3>Relationship map</h3>
              <div class="relationship-list">
                \${data.overview.relationships.length === 0
                  ? '<div class="empty">No foreign-key relationships were discovered.</div>'
                  : data.overview.relationships.map((relation) => \`
                      <div class="relationship-item">
                        <strong><code>\${escapeHtml(relation.fromTable)}.\${escapeHtml(relation.fromColumn)}</code> -> <code>\${escapeHtml(relation.toTable)}.\${escapeHtml(relation.toColumn)}</code></strong>
                        <div class="muted">\${escapeHtml(relation.constraintName)}</div>
                        <div class="muted">ON UPDATE \${escapeHtml(relation.updateRule || 'NO ACTION')} · ON DELETE \${escapeHtml(relation.deleteRule || 'NO ACTION')}</div>
                      </div>
                    \`).join('')}
              </div>
            </article>
          </div>
        \`;
        section.querySelectorAll('[data-schema-table]').forEach((node) => {
          node.addEventListener('click', () => {
            selectSchemaTable(node.getAttribute('data-schema-table'));
          });
        });
        selectSchemaTable(state.selectedSchemaTableName);
      }

      async function loadBackendDocs() {
        const data = await fetchJson('/admin/backend-docs');
        if (!data) return;
        const section = document.getElementById('backend-docs');
        section.innerHTML = \`
          <div class="split">
            <article class="card">
              <h2>Backend documentation</h2>
              <p class="muted">Use the built-in Swagger reference for the full OpenAPI contract.</p>
              <p><a href="\${data.swaggerUrl}" target="_blank" rel="noreferrer">\${data.swaggerUrl}</a></p>
              \${data.notes.map((note) => \`<div class="pill" style="margin-bottom:8px">\${escapeHtml(note)}</div>\`).join('')}
            </article>
            <article class="card">
              <h2>Module guide</h2>
              \${data.modules.map((module) => \`
                <div style="margin-bottom:14px">
                  <strong>\${escapeHtml(module.name)}</strong>
                  <div class="muted" style="margin:4px 0 8px">\${escapeHtml(module.description)}</div>
                  <div class="pill-list">
                    \${module.endpoints.map((endpoint) => \`<span class="pill">\${escapeHtml(endpoint)}</span>\`).join('')}
                  </div>
                </div>
              \`).join('')}
            </article>
          </div>
        \`;
      }

      document.querySelectorAll('#tabs button').forEach((button) => {
        button.addEventListener('click', async () => {
          const tab = button.dataset.tab;
          activateTab(tab);
          if (tab === 'overview') await loadOverview();
          if (tab === 'users') await loadUsers();
          if (tab === 'searcher') await loadSearcher();
          if (tab === 'database') await loadDatabase();
          if (tab === 'backend-docs') await loadBackendDocs();
        });
      });

      loadOverview().catch((error) => {
        document.getElementById('overview').innerHTML = '<div class="empty">Failed to load overview: ' + escapeHtml(error.message) + '</div>';
      });
    </script>
  </body>
</html>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
