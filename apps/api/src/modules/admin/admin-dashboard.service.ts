import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminDashboardService {
  renderLoginPage(error?: string) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>dCredit Admin Login</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;background:#f4f7f7;color:#163138;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .card{background:#fff;border:1px solid #d7e2e1;border-radius:24px;padding:28px;max-width:420px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,.06)}
      input{width:100%;height:44px;border-radius:14px;border:1px solid #d7e2e1;padding:0 12px;margin-top:8px;margin-bottom:14px}
      button{height:44px;border:none;border-radius:14px;background:#16847c;color:#fff;font-weight:700;width:100%;cursor:pointer}
      .error{background:#ffe4e4;color:#9b1c1c;padding:12px;border-radius:12px;margin-bottom:16px}
      .hint{margin-top:16px;color:#63737c;font-size:14px;line-height:1.5}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>dCredit Admin</h1>
      <p>Internal operations dashboard access.</p>
      ${error ? `<div class="error">${error}</div>` : ''}
      <form method="post" action="/admin/login">
        <label>Email</label>
        <input name="email" type="email" required />
        <label>Password</label>
        <input name="password" type="password" required />
        <button type="submit">Sign in</button>
      </form>
      <p class="hint">Use the seeded admin account for local access. After login, the dashboard uses a secure httpOnly cookie scoped to the local admin session.</p>
    </div>
  </body>
</html>`;
  }

  renderDashboardPage(adminName: string) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>dCredit Ops</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;background:#f4f7f7;color:#163138;margin:0}
      header{padding:18px 24px;background:#fff;border-bottom:1px solid #d7e2e1;display:flex;justify-content:space-between;align-items:center;gap:16px;position:sticky;top:0}
      .shell{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 74px)}
      nav{padding:20px;border-right:1px solid #d7e2e1;background:#fbfdfd}
      nav button{display:block;width:100%;text-align:left;padding:12px 14px;border:none;background:transparent;border-radius:12px;cursor:pointer;color:#163138;font-weight:600;margin-bottom:6px}
      nav button.active{background:#e1f5f3;color:#16847c}
      main{padding:24px}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
      .card{background:#fff;border:1px solid #d7e2e1;border-radius:20px;padding:16px}
      .metric{font-size:28px;font-weight:700;margin-top:8px}
      table{width:100%;border-collapse:collapse;background:#fff;border-radius:18px;overflow:hidden}
      th,td{padding:12px;border-bottom:1px solid #edf2f2;text-align:left;font-size:14px;vertical-align:top}
      th{background:#fbfdfd}
      .row-link{cursor:pointer;color:#16847c;font-weight:600}
      .pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#e1f5f3;color:#16847c;font-size:12px;font-weight:700}
      .filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:16px}
      input,select{height:40px;border:1px solid #d7e2e1;border-radius:12px;padding:0 10px;background:#fff}
      .two-col{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}
      .muted{color:#63737c}
      a{color:#16847c}
      @media(max-width:900px){.shell{grid-template-columns:1fr}nav{border-right:none;border-bottom:1px solid #d7e2e1}.two-col{grid-template-columns:1fr}}
    </style>
  </head>
  <body>
    <header>
      <div>
        <strong>dCredit Ops</strong>
        <div class="muted">Signed in as ${adminName}</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <a href="/api/docs" target="_blank" rel="noreferrer">Swagger</a>
        <form method="post" action="/admin/logout"><button style="height:40px;border:none;border-radius:12px;background:#16847c;color:#fff;padding:0 14px;cursor:pointer">Logout</button></form>
      </div>
    </header>
    <div class="shell">
      <nav>
        <button data-tab="overview" class="active">Overview</button>
        <button data-tab="users">Users</button>
        <button data-tab="searcher">Searcher</button>
        <button data-tab="database">Database</button>
        <button data-tab="backend-docs">Backend Docs</button>
      </nav>
      <main id="content">Loading…</main>
    </div>
    <script>
      const content = document.getElementById('content');
      const buttons = Array.from(document.querySelectorAll('nav button'));
      let userDetailId = null;

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          buttons.forEach((entry) => entry.classList.remove('active'));
          button.classList.add('active');
          userDetailId = null;
          renderTab(button.dataset.tab);
        });
      });

      async function loadJson(path) {
        const response = await fetch(path, { credentials: 'same-origin' });
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/admin/login';
            return null;
          }
          throw new Error('Failed to load ' + path);
        }
        return response.json();
      }

      function renderOverview(data) {
        return '<div class="grid">' + [
          ['Total users', data.kpis.totalUsers],
          ['Verified users', data.kpis.verifiedUsers],
          ['Unverified users', data.kpis.unverifiedUsers],
          ['With sources', data.kpis.usersWithFinancialSources],
          ['With accounts', data.kpis.usersWithAccounts],
          ['With transactions', data.kpis.usersWithTransactions],
          ['With credits', data.kpis.usersWithCredits],
          ['Activated', data.kpis.activatedUsers],
        ].map(([label, value]) => '<div class="card"><div class="muted">'+label+'</div><div class="metric">'+value+'</div></div>').join('') + '</div>' +
        '<div class="two-col" style="margin-top:16px">' +
          '<div class="card"><h2>Activation Funnel</h2><table><thead><tr><th>Stage</th><th>Users</th><th>%</th></tr></thead><tbody>' +
            data.funnel.map((row) => '<tr><td><span class="pill">'+row.stage+'</span></td><td>'+row.count+'</td><td>'+row.percentage+'%</td></tr>').join('') +
          '</tbody></table></div>' +
          '<div class="card"><h2>Conversion</h2><table><tbody>' +
            '<tr><td>Verification rate</td><td>'+data.conversion.verificationRate+'%</td></tr>' +
            '<tr><td>Source connection rate</td><td>'+data.conversion.sourceConnectionRate+'%</td></tr>' +
            '<tr><td>Activation rate</td><td>'+data.conversion.activationRate+'%</td></tr>' +
            '<tr><td>New users last 7 days</td><td>'+data.growthSummary.newestUserCountLast7Days+'</td></tr>' +
          '</tbody></table></div>' +
        '</div>' +
        '<div class="two-col" style="margin-top:16px">' +
          '<div class="card"><h2>Latest Signups</h2><table><thead><tr><th>User</th><th>Created</th><th>Stage</th></tr></thead><tbody>' +
            data.latestSignups.map((user) => '<tr><td class="row-link" data-user-id="'+user.id+'">'+user.fullName+'<div class="muted">'+user.email+'</div></td><td>'+new Date(user.createdAt).toLocaleString()+'</td><td>'+user.activationStage+'</td></tr>').join('') +
          '</tbody></table></div>' +
          '<div class="card"><h2>Latest Verifications</h2><table><thead><tr><th>User</th><th>Verified at</th></tr></thead><tbody>' +
            data.latestVerifications.map((entry) => '<tr><td class="row-link" data-user-id="'+entry.user.id+'">'+entry.user.fullName+'<div class="muted">'+entry.user.email+'</div></td><td>'+new Date(entry.verifiedAt).toLocaleString()+'</td></tr>').join('') +
          '</tbody></table></div>' +
        '</div>';
      }

      function renderUsersTable(data, title) {
        return '<div class="card"><h2>'+title+'</h2><table><thead><tr><th>User</th><th>Lang</th><th>Verified</th><th>Stage</th><th>Sources</th><th>Accounts</th><th>Tx</th><th>Credits</th><th>Last activity</th><th>Admin</th></tr></thead><tbody>' +
          data.map((user) => '<tr>' +
            '<td class="row-link" data-user-id="'+user.id+'">'+user.fullName+'<div class="muted">'+user.email+'</div><div class="muted">'+user.id+'</div></td>' +
            '<td>'+user.preferredLanguage+'</td>' +
            '<td>'+user.emailVerified+'</td>' +
            '<td>'+user.activationStage+'</td>' +
            '<td>'+user.counts.financialSources+'</td>' +
            '<td>'+user.counts.accounts+'</td>' +
            '<td>'+user.counts.transactions+'</td>' +
            '<td>'+user.counts.credits+'</td>' +
            '<td>'+(user.counts.lastActivityAt ? new Date(user.counts.lastActivityAt).toLocaleString() : '—')+'</td>' +
            '<td>'+user.isAdmin+'</td>' +
          '</tr>').join('') + '</tbody></table></div>';
      }

      function renderUserDetail(detail) {
        return '<div class="two-col">' +
          '<div class="card"><h2>'+detail.user.fullName+'</h2><p class="muted">'+detail.user.email+'</p><table><tbody>' +
            '<tr><td>Language</td><td>'+detail.user.preferredLanguage+'</td></tr>' +
            '<tr><td>Verified</td><td>'+detail.user.emailVerified+'</td></tr>' +
            '<tr><td>Admin</td><td>'+detail.user.isAdmin+'</td></tr>' +
            '<tr><td>Created</td><td>'+new Date(detail.user.createdAt).toLocaleString()+'</td></tr>' +
            '<tr><td>Latest verification</td><td>'+(detail.latestVerificationAt ? new Date(detail.latestVerificationAt).toLocaleString() : '—')+'</td></tr>' +
          '</tbody></table></div>' +
          '<div class="card"><h2>Activation Journey</h2><table><thead><tr><th>Stage</th><th>Status</th></tr></thead><tbody>' +
            detail.activationJourney.map((step) => '<tr><td>'+step.stage+'</td><td>'+(step.current ? 'Current' : (step.complete ? 'Complete' : 'Pending'))+'</td></tr>').join('') +
          '</tbody></table></div>' +
        '</div>' +
        '<div class="two-col" style="margin-top:16px">' +
          '<div class="card"><h2>Financial Sources</h2><table><thead><tr><th>Name</th><th>Status</th><th>Type</th></tr></thead><tbody>' +
            detail.financialSources.map((item) => '<tr><td>'+item.providerName+'</td><td>'+item.status+'</td><td>'+item.providerType+'</td></tr>').join('') +
          '</tbody></table></div>' +
          '<div class="card"><h2>Accounts</h2><table><thead><tr><th>Name</th><th>Type</th><th>Balance</th></tr></thead><tbody>' +
            detail.accounts.map((item) => '<tr><td>'+item.accountName+'</td><td>'+item.accountType+'</td><td>'+item.currentBalance+'</td></tr>').join('') +
          '</tbody></table></div>' +
        '</div>' +
        '<div class="two-col" style="margin-top:16px">' +
          '<div class="card"><h2>Credits</h2><table><thead><tr><th>Name</th><th>APR</th><th>Monthly</th></tr></thead><tbody>' +
            detail.credits.map((item) => '<tr><td>'+item.name+'</td><td>'+item.interestRate+'%</td><td>'+item.monthlyPayment+'</td></tr>').join('') +
          '</tbody></table></div>' +
          '<div class="card"><h2>Recent Transactions</h2><table><thead><tr><th>Description</th><th>Date</th><th>Amount</th></tr></thead><tbody>' +
            detail.recentTransactions.map((item) => '<tr><td>'+item.description+'</td><td>'+new Date(item.date).toLocaleString()+'</td><td>'+item.amount+'</td></tr>').join('') +
          '</tbody></table></div>' +
        '</div>';
      }

      function renderDatabase(data) {
        return '<div class="card"><h2>Database Explanation</h2><p>'+data.explanation+'</p></div>' +
          '<div class="card" style="margin-top:16px"><h2>Relationships</h2><ul>' +
            data.relationships.map((item) => '<li>'+item+'</li>').join('') +
          '</ul></div>' +
          '<div style="margin-top:16px">' +
            data.tables.map((table) => '<div class="card" style="margin-bottom:12px"><h2>'+table.name+'</h2><p>'+table.purpose+'</p><p><strong>Important columns:</strong> '+table.importantColumns.join(', ')+'</p><p><strong>Relations:</strong> '+table.relations.join(', ')+'</p><p class="muted">'+table.notes+'</p></div>').join('') +
          '</div>';
      }

      function renderBackendDocs(data) {
        return '<div class="card"><h2>Backend Docs</h2><p><a href="'+data.swaggerUrl+'" target="_blank" rel="noreferrer">Open Swagger / OpenAPI Docs</a></p><p>'+data.help+'</p></div>' +
          '<div class="two-col" style="margin-top:16px">' +
            '<div class="card"><h2>Modules</h2><ul>' + data.modules.map((module) => '<li><strong>'+module.name+':</strong> '+module.description+'</li>').join('') + '</ul></div>' +
            '<div class="card"><h2>Endpoint Groups</h2><ul>' + data.endpointGroups.map((group) => '<li><strong>'+group.name+':</strong> '+group.description+'</li>').join('') + '</ul></div>' +
          '</div>';
      }

      async function renderTab(tab) {
        content.innerHTML = 'Loading…';
        try {
          if (tab === 'overview') {
            content.innerHTML = renderOverview(await loadJson('/admin/overview'));
          } else if (tab === 'users') {
            if (userDetailId) {
              content.innerHTML = renderUserDetail(await loadJson('/admin/users/' + userDetailId));
            } else {
              const data = await loadJson('/admin/users');
              content.innerHTML = renderUsersTable(data.users, 'Users');
            }
          } else if (tab === 'searcher') {
            const data = await loadJson('/admin/search');
            content.innerHTML = '<div class="filters">' +
              '<input id="searchText" placeholder="Name or email" />' +
              '<select id="verification"><option value="">Verification</option><option value="verified">Verified</option><option value="unverified">Unverified</option></select>' +
              '<select id="stage"><option value="">Activation stage</option>' + data.activationStages.map((stage) => '<option value="'+stage+'">'+stage+'</option>').join('') + '</select>' +
              '<select id="hasCredits"><option value="">Has credits</option><option value="yes">Yes</option><option value="no">No</option></select>' +
              '<select id="hasSources"><option value="">Has sources</option><option value="yes">Yes</option><option value="no">No</option></select>' +
              '<button id="searchBtn" style="height:40px;border:none;border-radius:12px;background:#16847c;color:#fff">Search</button>' +
            '</div><div id="searchResults">' + renderUsersTable(data.results, 'Search Results') + '</div>';
            document.getElementById('searchBtn').addEventListener('click', async () => {
              const params = new URLSearchParams();
              const appendIfValue = (id, key) => {
                const value = document.getElementById(id).value;
                if (value) params.set(key, value);
              };
              appendIfValue('searchText', 'search');
              appendIfValue('verification', 'verification');
              appendIfValue('stage', 'activationStage');
              appendIfValue('hasCredits', 'hasCredits');
              appendIfValue('hasSources', 'hasFinancialSources');
              const nextData = await loadJson('/admin/search?' + params.toString());
              document.getElementById('searchResults').innerHTML = renderUsersTable(nextData.results, 'Search Results');
              bindUserLinks();
            });
          } else if (tab === 'database') {
            content.innerHTML = renderDatabase(await loadJson('/admin/database'));
          } else if (tab === 'backend-docs') {
            content.innerHTML = renderBackendDocs(await loadJson('/admin/backend-docs'));
          }
          bindUserLinks();
        } catch (error) {
          content.innerHTML = '<div class="card"><h2>Error</h2><p class="muted">'+error.message+'</p></div>';
        }
      }

      function bindUserLinks() {
        document.querySelectorAll('[data-user-id]').forEach((element) => {
          element.addEventListener('click', async () => {
            userDetailId = element.dataset.userId;
            buttons.forEach((entry) => entry.classList.remove('active'));
            document.querySelector('[data-tab="users"]').classList.add('active');
            await renderTab('users');
          });
        });
      }

      renderTab('overview');
    </script>
  </body>
</html>`;
  }

  getBackendDocs() {
    return {
      swaggerUrl: '/api/docs',
      help:
        'The admin dashboard links to Swagger for request/response detail, while this section gives a quick operational map of the backend modules.',
      modules: [
        { name: 'auth', description: 'Registration, login, email verification, resend verification, JWT issuance.' },
        { name: 'users', description: 'Current user profile, language preference persistence, safe user shaping.' },
        { name: 'dashboard', description: 'General balance, grouped spending, credit obligation summaries.' },
        { name: 'credits', description: 'Credit list, detail, and timeline endpoints.' },
        { name: 'financial-sources', description: 'Connected source list and placeholder setup/update flows.' },
        { name: 'admin', description: 'Internal operational dashboard, user lookup, database guide, and docs access.' },
      ],
      endpointGroups: [
        { name: 'Auth', description: 'Login/register/verify/resend flows and JWT-based access.' },
        { name: 'Dashboard', description: 'Overview KPIs and user-facing financial summary endpoints.' },
        { name: 'Credits', description: 'Credit performance, rates, next payments, and installment schedule views.' },
        { name: 'Transactions', description: 'Category summaries and recent transaction search data.' },
        { name: 'Admin', description: 'Protected internal ops endpoints backing /admin.' },
      ],
    };
  }
}
