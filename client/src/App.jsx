import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const DEMO_PRESETS = [
  { label: 'Admin', sub: 'All access & transcript', email: 'admin@novaworks.example' },
  { label: 'Ayesha Khan', sub: 'Manager (Web PM)', email: 'ayesha@novaworks.example' },
  { label: 'Bilal Ahmed', sub: 'Manager (Mobile PM)', email: 'bilal@novaworks.example' },
  { label: 'Hina Malik', sub: 'Manager (AI PM)', email: 'hina@novaworks.example' },
  { label: 'Ali Raza', sub: 'Agent (Full-Stack)', email: 'ali@novaworks.example' },
  { label: 'Hamza Shah', sub: 'Agent (Full-Stack)', email: 'hamza@novaworks.example' },
];

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('briefflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('briefflow_token') || null);

  // Auth form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Selected project for Project Detail view
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);
  const [projectDetailError, setProjectDetailError] = useState('');

  // Data states
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  // Validate or restore session on load
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
          localStorage.setItem('briefflow_user', JSON.stringify(data.user));
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  // Set default tab according to user role on login
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        setActiveTab('overview');
      } else if (user.role === 'MANAGER') {
        setActiveTab('projects');
      } else if (user.role === 'AGENT') {
        setActiveTab('tasks');
      }
      setSelectedProjectId(null);
    }
  }, [user?.role]);

  // Fetch projects list
  const fetchProjects = () => {
    if (!token) return;
    setProjectsLoading(true);
    fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  };

  // Fetch tasks list
  const fetchTasks = () => {
    if (!token) return;
    setTasksLoading(true);
    fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTasks(data))
      .catch(() => setTasks([]))
      .finally(() => setTasksLoading(false));
  };

  // Fetch team directory
  const fetchTeam = () => {
    if (!token) return;
    setTeamLoading(true);
    fetch(`${API_BASE}/team`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTeam(data))
      .catch(() => setTeam([]))
      .finally(() => setTeamLoading(false));
  };

  // Fetch data on activeTab change
  useEffect(() => {
    if (!token || !user) return;

    if (activeTab === 'projects' || (activeTab === 'overview' && user.role === 'ADMIN')) {
      fetchProjects();
    }
    if (activeTab === 'tasks' || (activeTab === 'overview' && user.role === 'ADMIN')) {
      fetchTasks();
    }
    if (activeTab === 'team' || (activeTab === 'overview' && user.role === 'ADMIN')) {
      fetchTeam();
    }
  }, [activeTab, token, user]);

  // Fetch project detail when selectedProjectId changes
  useEffect(() => {
    if (!selectedProjectId || !token) {
      setProjectDetail(null);
      setProjectDetailError('');
      return;
    }

    setProjectDetailLoading(true);
    setProjectDetailError('');

    fetch(`${API_BASE}/projects/${selectedProjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Project not found or access denied');
        }
        return res.json();
      })
      .then((data) => {
        setProjectDetail(data);
      })
      .catch((err) => {
        setProjectDetail(null);
        setProjectDetailError(err.message);
      })
      .finally(() => {
        setProjectDetailLoading(false);
      });
  }, [selectedProjectId, token]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('briefflow_token', data.token);
      localStorage.setItem('briefflow_user', JSON.stringify(data.user));
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickFill = (email) => {
    setEmailInput(email);
    setPasswordInput('Demo123!');
    setLoginError('');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    setSelectedProjectId(null);
    setProjectDetail(null);
    localStorage.removeItem('briefflow_token');
    localStorage.removeItem('briefflow_user');
    setActiveTab('overview');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
  };

  // ---------------------------------------------------------------------------
  // View 1: Unauthenticated Login Screen
  // ---------------------------------------------------------------------------
  if (!user || !token) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h1 className="login-title">BriefFlow</h1>
            <p className="login-subtitle">NovaWorks AI Meeting-to-Project CRM</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {loginError && <div className="error-banner">{loginError}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Demo Email</label>
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="name@novaworks.example"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="Demo123!"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick-Fill Demo Accounts for Evaluation */}
          <div className="quick-accounts-section">
            <div className="quick-accounts-title">Quick Demo Logins (Click to autofill)</div>
            <div className="quick-accounts-grid">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.email}
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickFill(preset.email)}
                >
                  <span className="quick-btn-name">{preset.label}</span>
                  <span className="quick-btn-role">{preset.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View 2: Authenticated CRM Shell
  // ---------------------------------------------------------------------------
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div className="brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <div className="brand-title">BriefFlow</div>
            <div className="brand-subtitle">Project CRM</div>
          </div>
        </div>

        {/* Current User Widget */}
        <div className="user-profile-widget">
          <div className="user-profile-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.role}
          </span>
        </div>

        {/* Role-Specific Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>

          {/* ADMIN Navigation */}
          {user.role === 'ADMIN' && (
            <>
              <button
                className={`nav-item ${activeTab === 'overview' && !selectedProjectId ? 'active' : ''}`}
                onClick={() => handleTabSwitch('overview')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Overview
              </button>

              <button
                className={`nav-item ${activeTab === 'transcript' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('transcript')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Create from Transcript
              </button>

              <button
                className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('projects')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Projects
              </button>

              <button
                className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('team')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Team Directory
              </button>
            </>
          )}

          {/* MANAGER Navigation */}
          {user.role === 'MANAGER' && (
            <>
              <button
                className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('projects')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                My Projects
              </button>

              <button
                className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('team')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Team Directory
              </button>
            </>
          )}

          {/* AGENT Navigation */}
          {user.role === 'AGENT' && (
            <>
              <button
                className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('tasks')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                My Tasks
              </button>

              <button
                className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('projects')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Projects
              </button>

              <button
                className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('team')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Team Directory
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer with Sign Out */}
        <div className="sidebar-footer">
          <button className="btn-signout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Top Header */}
        <header className="app-topbar">
          <div className="topbar-breadcrumbs">
            <span>BriefFlow</span>
            <span>/</span>
            {activeTab === 'projects' && selectedProjectId && projectDetail ? (
              <>
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setSelectedProjectId(null)}
                >
                  Projects
                </span>
                <span>/</span>
                <span className="active">{projectDetail.project.name}</span>
              </>
            ) : (
              <span className="active">
                {activeTab === 'overview' && 'Overview'}
                {activeTab === 'transcript' && 'Create from Transcript'}
                {activeTab === 'projects' && (user.role === 'MANAGER' ? 'My Projects' : 'Projects')}
                {activeTab === 'tasks' && 'My Tasks'}
                {activeTab === 'team' && 'Team Directory'}
              </span>
            )}
          </div>

          <div className="topbar-actions">
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role} View
            </span>
            <div className="status-badge" title="Express API Status">
              <span className="status-dot"></span>
              <span>API: Online</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="app-content">
          {/* ================================================================
              TAB: OVERVIEW (Admin Only)
              ================================================================ */}
          {activeTab === 'overview' && user.role === 'ADMIN' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Operations Overview</h1>
                  <p className="page-subtitle">NovaWorks Technologies • Client Delivery Command</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Client Projects</span>
                  <span className="stat-card-value">{projects.length}</span>
                  <span className="stat-card-meta">
                    {projects.length === 0 ? 'Awaiting transcript' : 'Active engagements'}
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-card-label">Total Tasks</span>
                  <span className="stat-card-value">{tasks.length}</span>
                  <span className="stat-card-meta">
                    {tasks.length === 0 ? '0 estimated hours' : 'Assigned tasks'}
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-card-label">Active Team</span>
                  <span className="stat-card-value">{team.length || 10}</span>
                  <span className="stat-card-meta">1 Admin, 3 PMs, 6 Agents</span>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-state-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="empty-state-title">No Projects Created Yet</h2>
                  <p className="empty-state-desc">
                    Paste your meeting transcript in the transcript creation console to automatically extract client deliverables, assign managers, and schedule developer tasks.
                  </p>
                  <button className="btn-primary" onClick={() => handleTabSwitch('transcript')}>
                    Open Transcript Console
                  </button>
                </div>
              ) : (
                <div className="project-grid">
                  {projects.map((proj) => (
                    <div
                      key={proj._id}
                      className="project-card"
                      onClick={() => {
                        setActiveTab('projects');
                        setSelectedProjectId(proj._id);
                      }}
                    >
                      <div className="project-card-header">
                        <div>
                          <div className="project-title">{proj.name}</div>
                          <div className="project-client-tag">Client: {proj.clientName}</div>
                        </div>
                        <span className="project-deadline-pill">Due {proj.deadline}</span>
                      </div>
                      {proj.description && <div className="project-desc">{proj.description}</div>}
                      <div className="project-card-footer">
                        <div className="project-manager-info">
                          <span>PM:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {proj.managerId?.name || 'Unassigned'}
                          </strong>
                        </div>
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>
                          View Details →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================================================================
              TAB: CREATE FROM TRANSCRIPT (Admin Only)
              ================================================================ */}
          {activeTab === 'transcript' && user.role === 'ADMIN' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Create from Transcript</h1>
                  <p className="page-subtitle">AI-assisted meeting ingestion and work delegation</p>
                </div>
              </div>

              <div className="transcript-console-card">
                <div className="transcript-instructions">
                  <strong>Transcript Ingestion Workflow:</strong> Paste the client delivery planning meeting dialogue. The AI engine will parse final agreements, match managers and developer agents from the team directory, and save all projects and tasks atomically.
                </div>

                <textarea
                  className="transcript-textarea"
                  placeholder="Paste meeting transcript text here (e.g. 09:00-09:04 Opening... 09:04-09:08 UrbanCart project scope...)..."
                  disabled
                ></textarea>

                <div className="transcript-actions">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    AI extraction pipeline will be integrated in Step 5.
                  </span>
                  <button className="btn-primary" disabled>
                    Create from Transcript
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              TAB: PROJECTS (Admin / Manager / Agent)
              ================================================================ */}
          {activeTab === 'projects' && (
            <>
              {selectedProjectId ? (
                /* --------------------------------------------------------
                   SUBVIEW: Project Details View
                   -------------------------------------------------------- */
                <div className="project-detail-container">
                  <div className="page-header">
                    <div>
                      <button className="btn-back" onClick={() => setSelectedProjectId(null)}>
                        ← Back to Projects
                      </button>
                    </div>
                  </div>

                  {projectDetailLoading ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      Loading project details...
                    </div>
                  ) : projectDetailError ? (
                    <div className="empty-state-card">
                      <h2 className="empty-state-title" style={{ color: 'var(--status-red)' }}>
                        Access Denied or Not Found
                      </h2>
                      <p className="empty-state-desc">{projectDetailError}</p>
                      <button className="btn-back" onClick={() => setSelectedProjectId(null)}>
                        Return to Projects
                      </button>
                    </div>
                  ) : projectDetail?.project ? (
                    <>
                      {/* Project Hero Card */}
                      <div className="project-detail-hero">
                        <div className="project-card-header">
                          <div>
                            <h1 className="project-title" style={{ fontSize: '18px' }}>
                              {projectDetail.project.name}
                            </h1>
                            <div className="project-client-tag">
                              Client: {projectDetail.project.clientName}
                            </div>
                          </div>
                          <span className="role-badge manager">
                            Deadline: {projectDetail.project.deadline}
                          </span>
                        </div>

                        {projectDetail.project.description && (
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {projectDetail.project.description}
                          </p>
                        )}

                        <div className="project-meta-grid">
                          <div className="meta-field">
                            <span className="meta-label">Project Manager</span>
                            <span className="meta-val">
                              {projectDetail.project.managerId?.name || 'Unassigned'}
                            </span>
                          </div>
                          <div className="meta-field">
                            <span className="meta-label">Client Account</span>
                            <span className="meta-val">{projectDetail.project.clientName}</span>
                          </div>
                          <div className="meta-field">
                            <span className="meta-label">Final Deadline</span>
                            <span className="meta-val">{projectDetail.project.deadline}</span>
                          </div>
                          <div className="meta-field">
                            <span className="meta-label">Tasks Count</span>
                            <span className="meta-val">
                              {projectDetail.tasks.length} task{projectDetail.tasks.length === 1 ? '' : 's'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Associated Tasks Section */}
                      <div>
                        <div className="tasks-section-header">
                          <div className="tasks-section-title">
                            <span>Project Deliverables & Tasks</span>
                            <span className="badge-count">
                              {projectDetail.tasks.length}
                            </span>
                          </div>
                        </div>

                        {projectDetail.tasks.length === 0 ? (
                          <div className="empty-state-card" style={{ padding: '32px 16px' }}>
                            <h3 className="empty-state-title" style={{ fontSize: '14px' }}>
                              {user.role === 'AGENT'
                                ? 'No tasks assigned to you in this project'
                                : 'No tasks created for this project yet'}
                            </h3>
                            <p className="empty-state-desc">
                              {user.role === 'AGENT'
                                ? 'Tasks assigned to other agents are restricted.'
                                : 'Tasks will populate here once meeting deliverables are generated.'}
                            </p>
                          </div>
                        ) : (
                          <div className="task-list" style={{ marginTop: '12px' }}>
                            {projectDetail.tasks.map((task) => (
                              <div key={task._id} className="task-card">
                                <div className="task-info-col">
                                  <div className="task-title">{task.title}</div>
                                  {task.description && (
                                    <div className="task-desc">{task.description}</div>
                                  )}
                                </div>
                                <div className="task-meta-col">
                                  <div className="task-assignee-pill">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>{task.assigneeId?.name || 'Unassigned'}</span>
                                  </div>
                                  <span className="task-hours-pill">
                                    {task.estimatedHours}h
                                  </span>
                                  <span className="task-due-pill">
                                    Due {task.deadline}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
                /* --------------------------------------------------------
                   SUBVIEW: Projects List View
                   -------------------------------------------------------- */
                <>
                  <div className="page-header">
                    <div>
                      <h1 className="page-title">
                        {user.role === 'MANAGER'
                          ? 'My Managed Projects'
                          : user.role === 'AGENT'
                          ? 'Assigned Projects'
                          : 'All Projects'}
                      </h1>
                      <p className="page-subtitle">
                        {user.role === 'MANAGER'
                          ? 'Projects under your direct management'
                          : user.role === 'AGENT'
                          ? 'Projects with tasks assigned to you'
                          : 'All client delivery projects across NovaWorks'}
                      </p>
                    </div>
                  </div>

                  {projectsLoading ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      Loading projects...
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="empty-state-card">
                      <div className="empty-state-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <h2 className="empty-state-title">No Projects Found</h2>
                      <p className="empty-state-desc">
                        {user.role === 'ADMIN'
                          ? 'No projects have been generated yet. Use "Create from Transcript" to convert planning notes into structured projects.'
                          : user.role === 'MANAGER'
                          ? 'You currently have no projects assigned to you. Projects will appear here when assigned to your portfolio.'
                          : 'You do not have any tasks assigned in active projects yet.'}
                      </p>
                      {user.role === 'ADMIN' && (
                        <button className="btn-primary" onClick={() => handleTabSwitch('transcript')}>
                          Create from Transcript
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="project-grid">
                      {projects.map((proj) => (
                        <div
                          key={proj._id}
                          className="project-card"
                          onClick={() => setSelectedProjectId(proj._id)}
                        >
                          <div className="project-card-header">
                            <div>
                              <div className="project-title">{proj.name}</div>
                              <div className="project-client-tag">
                                Client: {proj.clientName}
                              </div>
                            </div>
                            <span className="project-deadline-pill">
                              Due {proj.deadline}
                            </span>
                          </div>
                          {proj.description && (
                            <div className="project-desc">{proj.description}</div>
                          )}
                          <div className="project-card-footer">
                            <div className="project-manager-info">
                              <span>Manager:</span>
                              <strong style={{ color: 'var(--text-primary)' }}>
                                {proj.managerId?.name || 'Unassigned'}
                              </strong>
                            </div>
                            <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>
                              View Details →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ================================================================
              TAB: MY TASKS (Agent Only)
              ================================================================ */}
          {activeTab === 'tasks' && user.role === 'AGENT' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">My Tasks</h1>
                  <p className="page-subtitle">Your personalized deliverable queue</p>
                </div>
              </div>

              {tasksLoading ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-state-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <h2 className="empty-state-title">No Assigned Tasks</h2>
                  <p className="empty-state-desc">
                    You currently have no tasks assigned to your queue. Action items will be populated automatically when meeting transcripts are processed.
                  </p>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map((task) => (
                    <div key={task._id} className="task-card">
                      <div className="task-info-col">
                        <div className="task-title">{task.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Project: {task.projectId?.name || 'Assigned Project'} • Client: {task.projectId?.clientName || 'NovaWorks'}
                        </div>
                        {task.description && (
                          <div className="task-desc" style={{ marginTop: '4px' }}>
                            {task.description}
                          </div>
                        )}
                      </div>
                      <div className="task-meta-col">
                        <span className="task-hours-pill">
                          {task.estimatedHours}h
                        </span>
                        <span className="task-due-pill">
                          Due {task.deadline}
                        </span>
                        {task.projectId && (
                          <button
                            className="btn-back"
                            onClick={() => {
                              setActiveTab('projects');
                              setSelectedProjectId(task.projectId._id || task.projectId);
                            }}
                          >
                            View Project →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================================================================
              TAB: TEAM DIRECTORY (Admin / Manager / Agent)
              ================================================================ */}
          {activeTab === 'team' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Team Directory</h1>
                  <p className="page-subtitle">NovaWorks engineering staff and specializations</p>
                </div>
              </div>

              {teamLoading ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Loading team directory...
                </div>
              ) : (
                <div className="team-grid">
                  {team.map((member) => (
                    <div key={member.id} className="team-card">
                      <div className="team-card-header">
                        <div>
                          <div className="team-member-name">{member.name}</div>
                          <div className="team-member-spec">{member.specialization}</div>
                        </div>
                        <span className={`role-badge ${member.role.toLowerCase()}`}>
                          {member.role}
                        </span>
                      </div>

                      <div className="team-member-email">{member.email}</div>

                      {member.skills && member.skills.length > 0 && (
                        <div className="skills-list">
                          {member.skills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
