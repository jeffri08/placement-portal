// ============================================================
// Campus Placement Cell — authentication & session engine
// Real accounts, persisted in the browser via localStorage.
// No server: this runs entirely client-side, so accounts live
// only on the device/browser that created them. Wire this up
// to a real backend later and nothing else on the pages needs
// to change — everything reads through PortalAuth.
// ============================================================

var PortalAuth = (function () {

  var USERS_KEY = 'rc_portal_users';
  var SESSION_KEY = 'rc_portal_session';

  var BRANCH_ABBREV = {
    'Computer Science & Engineering': 'CSE',
    'Information Technology': 'IT',
    'Electronics & Communication': 'ECE',
    'Mechanical Engineering': 'Mechanical',
    'Civil Engineering': 'Civil'
  };

  // ---------- low-level storage ----------
  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  function setSession(userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: userId }));
  }

  function makeId() {
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function titleCase(str) {
    return str.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- public API ----------
  function register(data) {
    data = data || {};
    var name = (data.name || '').trim();
    var password = data.password || '';
    if (!name || !password) {
      return { ok: false, error: 'Name and password are required.' };
    }
    var users = getUsers();
    var emailLower = (data.email || '').trim().toLowerCase();
    var rollLower = (data.rollNumber || '').trim().toLowerCase();
    var duplicate = users.some(function (u) {
      return (emailLower && u.email && u.email.toLowerCase() === emailLower) ||
             (rollLower && u.rollNumber && u.rollNumber.toLowerCase() === rollLower);
    });
    if (duplicate) {
      return { ok: false, error: 'An account already exists with that email or roll number. Try logging in instead.' };
    }
    var user = {
      id: makeId(),
      name: name,
      email: (data.email || '').trim(),
      rollNumber: (data.rollNumber || '').trim(),
      phone: (data.phone || '').trim(),
      branch: data.branch || '',
      gradYear: (data.gradYear || '').trim(),
      cgpa: (data.cgpa || '').trim(),
      backlogs: (data.backlogs || '').trim(),
      skills: data.skills || '',
      resumeName: data.resumeName || '',
      resume: null,
      password: password,
      role: data.role || 'student',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(user.id);
    return { ok: true, user: user, created: true };
  }

  // Logs in against an existing account. If no account exists yet for
  // that identifier + role, one is created on the spot — so signing in
  // for the first time with any name doubles as registering.
  function login(identifier, password, role) {
    identifier = (identifier || '').trim();
    if (!identifier || !password) {
      return { ok: false, error: 'Enter your details to sign in.' };
    }
    var idLower = identifier.toLowerCase();
    var users = getUsers();
    var match = users.find(function (u) {
      var roleOk = !role || u.role === role;
      return roleOk && (
        (u.email && u.email.toLowerCase() === idLower) ||
        (u.rollNumber && u.rollNumber.toLowerCase() === idLower) ||
        (u.name && u.name.toLowerCase() === idLower)
      );
    });
    if (match) {
      if (match.password !== password) {
        return { ok: false, error: 'Incorrect password for that account.' };
      }
      setSession(match.id);
      return { ok: true, user: match, created: false };
    }
    // First time seeing this identifier for this role — create the account.
    var name = identifier.indexOf('@') > -1 ? identifier.split('@')[0].replace(/[._]+/g, ' ') : identifier;
    name = titleCase(name);
    var user = {
      id: makeId(),
      name: name,
      email: identifier.indexOf('@') > -1 ? identifier : '',
      rollNumber: identifier.indexOf('@') === -1 ? identifier : '',
      phone: '', branch: '', gradYear: '', cgpa: '', backlogs: '', skills: '',
      resumeName: '', resume: null,
      password: password,
      role: role || 'student',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(user.id);
    return { ok: true, user: user, created: true };
  }

  function logout(redirectTo) {
    localStorage.removeItem(SESSION_KEY);
    location.href = redirectTo || 'index.html';
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      var users = getUsers();
      var user = users.find(function (u) { return u.id === s.userId; });
      return user || null;
    } catch (e) { return null; }
  }

  function updateCurrentUser(patch) {
    var session = getSession();
    if (!session) return { ok: false, error: 'Not signed in.' };
    var users = getUsers();
    var idx = users.findIndex(function (u) { return u.id === session.id; });
    if (idx === -1) return { ok: false, error: 'Account not found.' };
    users[idx] = Object.assign({}, users[idx], patch);
    saveUsers(users);
    return { ok: true, user: users[idx] };
  }

  function initials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0][0] : '';
    var last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || '?';
  }

  function buildMeta(session) {
    if (!session || session.role !== 'student') return '';
    var abbrev = BRANCH_ABBREV[session.branch] || session.branch || '';
    var bits = [];
    if (abbrev) bits.push('B.Tech ' + abbrev);
    if (session.gradYear) bits.push('Class of ' + session.gradYear);
    var out = bits.join(', ');
    if (session.cgpa) out += (out ? ' \u00B7 ' : '') + 'CGPA ' + session.cgpa;
    return out;
  }

  // ---------- nav rendering (runs on every page) ----------
  function renderAuthNav() {
    var session = getSession();
    document.querySelectorAll('.nav-cta').forEach(function (nav) {
      var hamburger = nav.querySelector('.hamburger');
      Array.prototype.slice.call(nav.children).forEach(function (ch) {
        if (ch !== hamburger) ch.remove();
      });
      var html = '';
      if (session) {
        var dash = session.role === 'student' ? 'student-dashboard.html' : 'admin-dashboard.html';
        if (session.role === 'student') {
          html += '<a href="notifications.html" class="btn btn-outline on-dark btn-sm">Notifications</a>';
        } else {
          html += '<a href="index.html" class="btn btn-outline on-dark btn-sm">Exit admin</a>';
        }
        html += '<a href="' + dash + '" class="avatar" style="width:36px;height:36px;font-size:.85rem;" title="' +
                 escapeHtml(session.name) + '">' + escapeHtml(initials(session.name)) + '</a>';
        html += '<button type="button" class="btn btn-outline on-dark btn-sm" data-auth-logout>Log out</button>';
      } else {
        html += '<a href="login.html" class="btn btn-outline on-dark btn-sm">Log in</a>';
        html += '<a href="register.html" class="btn btn-primary btn-sm">Register</a>';
      }
      if (hamburger) hamburger.insertAdjacentHTML('beforebegin', html);
      else nav.insertAdjacentHTML('beforeend', html);
      var logoutBtn = nav.querySelector('[data-auth-logout]');
      if (logoutBtn) logoutBtn.addEventListener('click', function () { logout(); });
    });
  }

  // ---------- fill session data into the page ----------
  function hydrate() {
    var session = getSession();
    if (!session) return;
    var computed = {
      firstName: (session.name || '').split(/\s+/)[0] || session.name,
      initials: initials(session.name),
      meta: buildMeta(session)
    };
    function val(key) {
      if (key in computed) return computed[key];
      return session[key] != null ? session[key] : '';
    }
    document.querySelectorAll('[data-auth-text]').forEach(function (el) {
      var v = val(el.getAttribute('data-auth-text'));
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-auth-value]').forEach(function (el) {
      var key = el.getAttribute('data-auth-value');
      var v = val(key);
      if (v) el.value = v;
    });
    document.querySelectorAll('[data-auth-title]').forEach(function (el) {
      var v = val(el.getAttribute('data-auth-title'));
      if (v) el.setAttribute('title', v);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAuthNav();
    hydrate();
  });

  // ---------- route guard ----------
  // Reads data-require-role="student" or "recruiter,admin" off <body>.
  // Runs immediately (script tag sits right after <body>) so a logged
  // -out visitor is bounced before the protected content ever renders.
  (function guard() {
    var body = document.body;
    if (!body) return;
    var required = (body.getAttribute('data-require-role') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!required.length) return;
    var session = getSession();
    if (!session || required.indexOf(session.role) === -1) {
      var here = location.pathname.split('/').pop() || 'index.html';
      location.replace('login.html?redirect=' + encodeURIComponent(here));
    }
  })();

  return {
    register: register,
    login: login,
    logout: logout,
    getSession: getSession,
    updateCurrentUser: updateCurrentUser,
    initials: initials,
    renderAuthNav: renderAuthNav,
    hydrate: hydrate
  };

})();
