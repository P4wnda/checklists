(() => {
  const pentest = (q) => `/pentest/?v=20260516&q=${encodeURIComponent(q)}`;
  const templates = {
    standalone: {
      label: 'Standalone',
      sections: [
        {
          title: 'Initial Recon & Access',
          items: [
            ['Scan all TCP ports', 'Find the full exposed TCP surface before going deep.', ['Full TCP all ports', 'Rustscan']],
            ['Run service scripts on found ports', 'Use version and default scripts for fingerprints and quick wins.', ['Aggressive + all scripts', 'Vuln scripts']],
            ['Check UDP ports', 'Run a targeted UDP pass when TCP is not enough.', ['UDP scan']],
            ['Web directory bruteforce', 'Run directory and recursive content discovery on every web root.', ['Gobuster dir', 'Feroxbuster recursive', 'ffuf dir']],
            ['Web file bruteforce', 'Check common files and extensions from root and newly found paths.', ['ffuf dir', 'Gobuster dir']],
            ['Check robots and sitemap', 'Review /robots.txt, /sitemap.xml, and /sitemap for hidden paths.', ['curl', 'Gobuster dir']],
            ['Fingerprint web stack', 'Collect titles, tech, headers, CMS hints, and server behavior.', ['WhatWeb fingerprint', 'Nikto']],
            ['Check public exploits', 'Search for exact versions after confirming the stack.', ['Vuln scripts']],
            ['Check subdomains/vhosts', 'If names appear, brute force vhosts and repeat web discovery.', ['ffuf vhost', 'Gobuster vhost']],
            ['Save and review output', 'Keep nmap, web enum, and exploit output. Slow review catches paths automation already found.', ['TCP all ports then scripts', 'Wordlists']],
            ['Try obvious credentials carefully', 'Check default/common creds only where lockout risk is understood.', ['Default & Common Creds', 'Password Attacks']],
            ['Rescan when stuck', 'Verify tools, ports, proxy, wordlists, and assumptions.', ['Quick top 1000', 'Full TCP all ports']]
          ]
        },
        {
          title: 'Linux PrivEsc',
          items: [
            ['Run LinPEAS or LSE', 'Save output and review it slowly.', ['LinPEAS', 'Linux Exploit Suggester']],
            ['Check sudo, SUID, capabilities', 'Manually verify the classic privilege escalation paths.', ['sudo -l', 'SUID Exploits', 'Capabilities']],
            ['Check listening ports', 'Look for local-only services worth forwarding.', ['Linux network', 'Local port forward']],
            ['Check cron, PATH, writable files', 'Look for scheduled jobs and weak file permissions.', ['Cron', 'Writable /etc/passwd']],
            ['Check group and user writable files', 'Look for files owned by your user or writable by your current groups.', ['Writable by group/user', 'Writable files']],
            ['Manual fallback review', 'If automation is noisy, work through users, groups, services, and configs.', ['Manual Checks', 'Quick Wins']]
          ]
        },
        {
          title: 'Windows PrivEsc',
          items: [
            ['Run whoami /all', 'Check privileges, groups, integrity level, and domain context.', ['whoami /all', 'Manual Enumeration']],
            ['Run PowerUp and WinPEAS', 'Collect automated findings and verify manually.', ['PowerUp', 'WinPEAS']],
            ['Check listening ports', 'Look for local admin panels and services to tunnel.', ['netstat', 'Local port forward']],
            ['Review services and registry', 'Check weak service permissions and stored credentials.', ['Service Misconfigs', 'Registry Exploits']],
            ['Search for credential keywords', 'Recursively search likely file extensions outside Windows system paths.', ['PowerShell keyword hunt', 'Search password in files']],
            ['Manual fallback review', 'Check users, groups, files, configs, and scheduled tasks.', ['Credentials Hunting', 'Manual Enumeration']]
          ]
        }
      ]
    },
    ad: {
      label: 'Active Directory',
      sections: [
        {
          title: 'Active Directory',
          items: [
            ['Scan all TCP ports', 'Identify DCs, member servers, web apps, WinRM, RDP, MSSQL, and odd services.', ['Full TCP all ports', 'RDP scripts', 'WinRM scripts']],
            ['Check LDAP, RPC, SMB anonymous access', 'Look for null sessions, public shares, users, and domain metadata.', ['ldapsearch', 'rpcclient', 'smbclient']],
            ['Find usernames', 'Collect users from SMB, RPC, LDAP, shares, web leaks, and kerbrute.', ['Kerbrute', 'rpcclient enum users', 'CME full enum']],
            ['Verify Kerberos basics', 'If roasting fails strangely, check DNS, domain names, and time sync before assuming the attack is wrong.', ['GetUserSPNs', 'GetNPUsers']],
            ['ASREPRoast collected users', 'Test no-preauth users and crack returned hashes.', ['GetNPUsers', 'Crack 18200']],
            ['Kerberoast with creds', 'Request SPN tickets after getting any valid domain credential.', ['GetUserSPNs', 'Crack 13100']],
            ['Try creds everywhere', 'Authenticate against SMB, WinRM, RDP, MSSQL, LDAP, and RPC.', ['CME spray', 'evil-winrm', 'RDP login', 'MSSQL client']],
            ['Enumerate shares per user', 'Every valid user can expose new shares and secrets.', ['smbclient', 'CME full enum']],
            ['Download interesting SMB shares', 'When access is allowed, recursively grab loot from non-default shares and review offline.', ['recursive download', 'NXC guest shares']],
            ['Post-shell loot and dump hashes', 'Collect creds, dump local hashes where allowed, and prepare lateral movement.', ['secretsdump', 'Credential Dumping', 'Windows Loot']],
            ['Run BloodHound', 'Map attack paths, roasting, ACL abuse, sessions, and DC sync paths.', ['BloodHound.py', 'BloodHound stealth']],
            ['Check ADCS', 'Look for vulnerable templates and relay paths.', ['Certipy find', 'ESC1', 'ESC8']],
            ['Check writable shares for relay', 'Writable network locations can help capture or relay hashes.', ['Responder', 'ntlmrelayx']],
            ['Check pivoting needs', 'Look for extra adapters, routes, and internal-only targets.', ['Chisel', 'Ligolo', 'Proxychains']],
            ['Re-bruteforce protocols', 'Use new creds and hashes against every reachable protocol.', ['Password Spraying', 'Pass-the-Hash']],
            ['Rescan when stuck', 'Validate tools, DNS, time sync, credentials, and name resolution.', ['Quick top 1000', 'zone transfer']]
          ]
        },
        {
          title: 'Windows PrivEsc',
          items: [
            ['Run whoami /all', 'Check local privileges, groups, domain role, and token abuse potential.', ['whoami /all', 'Token Impersonation']],
            ['Run PowerUp and WinPEAS', 'Save output and verify the strongest leads manually.', ['PowerUp', 'WinPEAS']],
            ['Check listening ports', 'Local services may expose admin panels or internal apps.', ['netstat', 'Local port forward']],
            ['Dump and reuse credentials carefully', 'Collect hashes and cleartext secrets for lateral movement.', ['Credential Dumping', 'secretsdump']],
            ['Manual fallback review', 'Recheck services, registry, files, tasks, and domain permissions.', ['Service Misconfigs', 'Registry Exploits']]
          ]
        }
      ]
    }
  };

  const state = {
    template: localStorage.getItem('cl_template') || 'standalone',
    done: read('cl_done', {}),
    machine: read('cl_machine', {}),
    notes: read('cl_notes', {})
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function esc(s = '') { return String(s).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
  function idFor(section, index) { return `${state.template}_${section}_${index}`; }

  function init() {
    render();
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('input', onInput);
  }

  function render() {
    const current = templates[state.template];
    $('#summary').textContent = `${current.label} workflow`;
    $('#machineName').value = state.machine[state.template] || '';
    $('#boxNotes').value = state.notes[state.template] || '';
    $$('[data-template]').forEach(btn => btn.classList.toggle('active', btn.dataset.template === state.template));
    renderNav(current);
    renderSections(current);
    updateProgress();
  }

  function renderNav(current) {
    $('#sectionNav').innerHTML = current.sections.map((section, i) => `
      <a class="nav-item" href="#section-${i}">
        <span>${esc(section.title)}</span>
        <span class="count">${section.items.length}</span>
      </a>`).join('');
  }

  function renderSections(current) {
    $('#sections').innerHTML = current.sections.map((section, si) => `
      <article class="section" id="section-${si}">
        <div class="section-head">
          <h2>${esc(section.title)}</h2>
          <span>${section.items.length} checks</span>
        </div>
        ${section.items.map((item, ii) => renderTask(item, si, ii)).join('')}
      </article>`).join('');
  }

  function renderTask(item, si, ii) {
    const id = idFor(si, ii);
    const checked = Boolean(state.done[id]);
    return `
      <label class="task ${checked ? 'done' : ''}">
        <input type="checkbox" data-check="${esc(id)}" ${checked ? 'checked' : ''}>
        <span>
          <span class="task-title">${esc(item[0])}</span>
          <span class="task-desc">${esc(item[1])}</span>
          <span class="task-links">${item[2].map(link => `<a href="${pentest(link)}" target="_blank" rel="noopener">${esc(link)}</a>`).join('')}</span>
        </span>
      </label>`;
  }

  function onClick(e) {
    const templateBtn = e.target.closest('[data-template]');
    if (templateBtn) {
      state.template = templateBtn.dataset.template;
      localStorage.setItem('cl_template', state.template);
      render();
      return;
    }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'reset') resetCurrent();
    if (action === 'export') exportCurrent();
  }

  function onChange(e) {
    if (!e.target.dataset.check) return;
    state.done[e.target.dataset.check] = e.target.checked;
    if (!e.target.checked) delete state.done[e.target.dataset.check];
    save('cl_done', state.done);
    e.target.closest('.task').classList.toggle('done', e.target.checked);
    updateProgress();
  }

  function onInput(e) {
    if (e.target.id === 'machineName') {
      state.machine[state.template] = e.target.value;
      save('cl_machine', state.machine);
    }
    if (e.target.id === 'boxNotes') {
      state.notes[state.template] = e.target.value;
      save('cl_notes', state.notes);
    }
  }

  function updateProgress() {
    const current = templates[state.template];
    const ids = current.sections.flatMap((section, si) => section.items.map((_, ii) => idFor(si, ii)));
    const done = ids.filter(id => state.done[id]).length;
    $('#progressText').textContent = `${done} / ${ids.length}`;
    $('#progressBar').style.width = `${ids.length ? Math.round(done / ids.length * 100) : 0}%`;
  }

  function resetCurrent() {
    const current = templates[state.template];
    current.sections.forEach((section, si) => section.items.forEach((_, ii) => delete state.done[idFor(si, ii)]));
    state.notes[state.template] = '';
    save('cl_done', state.done);
    save('cl_notes', state.notes);
    render();
    toast('Reset');
  }

  function exportCurrent() {
    const current = templates[state.template];
    const title = state.machine[state.template] || current.label;
    const lines = [`# ${title} checklist`, ''];
    current.sections.forEach((section, si) => {
      lines.push(`## ${section.title}`);
      section.items.forEach((item, ii) => {
        lines.push(`- [${state.done[idFor(si, ii)] ? 'x' : ' '}] ${item[0]}`);
      });
      lines.push('');
    });
    const note = (state.notes[state.template] || '').trim();
    if (note) lines.push('## Notes', note, '');
    navigator.clipboard.writeText(lines.join('\n')).then(() => toast('Export copied'));
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 1300);
  }

  init();
})();
