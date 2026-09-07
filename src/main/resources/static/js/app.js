// ScholarSync Frontend Application Logic
document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentToken = localStorage.getItem('scholarsync_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('scholarsync_user') || 'null');

  // DOM Elements
  const authSection = document.getElementById('auth-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const serverHealthBadge = document.getElementById('server-health-badge');
  const serverHealthText = document.getElementById('server-health-text');
  
  // Tab elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Dashboard elements
  const userGreeting = document.getElementById('user-greeting');
  const userSubtext = document.getElementById('user-subtext');
  const userAvatar = document.getElementById('user-avatar');
  const userRoleBadge = document.getElementById('user-role-badge');
  const tokenDisplay = document.getElementById('token-display');
  const copyTokenBtn = document.getElementById('copy-token-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Demo fill buttons
  const demoButtons = document.querySelectorAll('.btn-demo-chip');

  // 1. Initial Health Check
  checkServerHealth();

  // 2. Initial Auth Check
  if (currentToken) {
    fetchUserData(currentToken);
  } else {
    showAuthView();
  }

  // 3. Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      }
    });
  });

  // 4. Demo Data Fill
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      const demos = {
        TEACHER: {
          name: 'Dr. Ada Lovelace',
          email: 'ada@university.edu',
          pass: 'SecurePass123'
        },
        STUDENT: {
          name: 'Alan Turing',
          email: 'alan@university.edu',
          pass: 'SecurePass123'
        },
        CO_AUTHOR: {
          name: 'Grace Hopper',
          email: 'grace@university.edu',
          pass: 'SecurePass123'
        }
      };

      const demo = demos[role];
      if (!demo) return;

      // Fill register form
      document.getElementById('reg-fullname').value = demo.name;
      document.getElementById('reg-email').value = demo.email;
      document.getElementById('reg-password').value = demo.pass;
      const roleRadio = document.querySelector(`input[name="reg-role"][value="${role}"]`);
      if (roleRadio) roleRadio.checked = true;

      // Fill login form
      document.getElementById('login-email').value = demo.email;
      document.getElementById('login-password').value = demo.pass;

      showToast(`Loaded ${role} demo credentials`, 'info');
    });
  });

  // 5. Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Signing in...';

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Check credentials.');
      }

      handleAuthSuccess(data.token, { email, role: data.role || 'USER' });
      showToast('Successfully logged in!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Sign In';
    }
  });

  // 6. Handle Register Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const roleEl = document.querySelector('input[name="reg-role"]:checked');
    const role = roleEl ? roleEl.value : 'STUDENT';
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    if (!fullName || !email || !password) {
      showToast('Please complete all registration fields', 'error');
      return;
    }

    try {
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Creating account...';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Try a different email.');
      }

      handleAuthSuccess(data.token, { fullName, email, role });
      showToast('Account registered and logged in!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Create Account';
    }
  });

  // 7. Token Copy
  copyTokenBtn.addEventListener('click', () => {
    if (!currentToken) return;
    navigator.clipboard.writeText(currentToken).then(() => {
      showToast('JWT token copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy token', 'error');
    });
  });

  // 8. Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('scholarsync_token');
    localStorage.removeItem('scholarsync_user');
    currentToken = null;
    currentUser = null;
    showAuthView();
    showToast('Signed out', 'info');
  });

  // Helpers
  async function checkServerHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        serverHealthText.textContent = `Backend: ${data.status}`;
        serverHealthBadge.classList.remove('hidden');
      } else {
        serverHealthText.textContent = 'Backend: Offline';
      }
    } catch {
      serverHealthText.textContent = 'Backend: Unreachable';
    }
  }

  function handleAuthSuccess(token, user) {
    currentToken = token;
    currentUser = user;
    localStorage.setItem('scholarsync_token', token);
    localStorage.setItem('scholarsync_user', JSON.stringify(user));
    fetchUserData(token);
  }

  async function fetchUserData(token) {
    try {
      const res = await fetch('/api/home', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('scholarsync_token');
        currentToken = null;
        showAuthView();
        showToast('Session expired. Please log in again.', 'info');
        return;
      }

      const data = await res.json();
      showDashboardView(data);
    } catch (err) {
      showToast('Error connecting to backend dashboard', 'error');
      showAuthView();
    }
  }

  function showDashboardView(homeData) {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    // Extract details
    const message = homeData.message || 'Welcome to ScholarSync';
    userGreeting.textContent = message;

    const email = currentUser?.email || 'Authenticated User';
    userSubtext.textContent = `Logged in as ${email} · Authenticated via JWT`;

    // Avatar initials
    const name = currentUser?.fullName || currentUser?.email || 'U';
    userAvatar.textContent = name.charAt(0).toUpperCase();

    // Roles badge
    let roleText = 'STUDENT';
    if (homeData.roles && homeData.roles.length > 0) {
      roleText = homeData.roles[0].authority ? homeData.roles[0].authority.replace('ROLE_', '') : homeData.roles[0];
    } else if (currentUser?.role) {
      roleText = currentUser.role;
    }

    userRoleBadge.textContent = roleText;
    userRoleBadge.className = 'user-role-badge';
    if (roleText === 'TEACHER') userRoleBadge.classList.add('role-teacher');
    else if (roleText === 'STUDENT') userRoleBadge.classList.add('role-student');
    else userRoleBadge.classList.add('role-coauthor');

    // Display JWT token
    tokenDisplay.textContent = currentToken;
  }

  function showAuthView() {
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
