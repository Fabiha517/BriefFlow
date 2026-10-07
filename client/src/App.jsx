import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const OFFICIAL_TRANSCRIPT = `Meeting: NovaWorks Client Delivery Planning
Date: 7 October 2026 | Scheduled duration: 60 minutes
Participants: Ayesha, Bilal, Hina, Ali, Hamza, Sara, Usman, Zain, Maryam

09:00-09:04 | Opening and company workflow
Ayesha: Good morning. We have three client engagements to plan today: UrbanCart Clothing's website, QuickServe's customer mobile app, and HelpDeskPro's AI support assistant. Please keep these as three separate projects. A combined project would make client reporting confusing.
Bilal: We should finish with a project manager, deadline, task owner, and estimated hours for every piece of work. The estimate is effort, not the number of days between today and the delivery date.
Hina: Agreed. Please use our supplied team directory. Accounts can already be created with a setup script. We are not hiring anyone for this delivery cycle. Record developer work only in the estimated hours. We do not need management-hour estimates.
Ayesha: Keep this version simple. We need project details, assigned people, deadlines, and estimated hours. Cost calculation and progress monitoring are outside this challenge.

09:04-09:08 | UrbanCart project scope
Ayesha: First project is UrbanCart Website, for client UrbanCart Clothing. I'll manage it. They need a responsive website where customers can browse products, view product details, and add items to a demo cart. We initially discussed 18 October as the delivery date.
Ali: Do they need a real checkout, payment gateway, and stock integration?
Ayesha: No. For this phase the cart is a demo. Real payments and inventory integration are not included. The client wants to review the buying experience before funding those integrations.
Hamza: So the API scope is product data and a basic cart endpoint, without payment processing?
Ayesha: Correct. Don't add a payment task or an inventory task. The description should make the demo scope clear.

09:08-09:12 | UrbanCart frontend assignment
Ali: I can own the product catalog interface: product listing, a product detail screen, and responsive layout. Put that down as 12 estimated hours, due on 12 October.
Ayesha: Please call that task Product catalog UI. We also need the demo cart interface as a separate task so we can track it separately.
Ali: Yes. Demo cart UI will take 8 hours, due 15 October. That covers adding and removing items, quantities, and a visible total. I am the owner of both frontend tasks.
Bilal: Are these two separate tasks rather than a single 20-hour frontend task?
Ayesha: Exactly. Two tasks, same owner, with the deadlines we just agreed. We need that separation in the task list.

09:12-09:16 | UrbanCart backend and delivery correction
Hamza: For Product and cart APIs, I estimate 14 hours. I own it, and the deadline is 14 October. I will provide product responses and the demo cart endpoints Ali needs.
Ayesha: Good. After that, Ali owns Website integration and testing. Let's start with a six-hour estimate and a 17 October deadline.
Ali: Six hours is reasonable for connecting the screens and checking the demo flow. But please move that task to 19 October. I need a little more calendar space after the API work.
Ayesha: Accepted. Website integration and testing is 6 hours, due 19 October. Also, the client has just confirmed that final project delivery can be 20 October. That replaces the earlier 18 October date. The final UrbanCart project deadline is 20 October.
Hamza: So the final website plan has four tasks, and the new deadline is 20 October. No payment gateway in this phase.
Ayesha: Correct.

09:16-09:20 | QuickServe scope and manager
Bilal: The second project is QuickServe Mobile App, for client QuickServe Services. I am the project manager. The client needs a customer app for signing in, requesting a service, and seeing the request's current status.
Sara: Android only for the demonstration, or do we need separate native apps?
Bilal: A Flutter app demo is enough. We don't need separate Android and iOS development tasks. The project deadline is 24 October.
Usman: What about live maps, driver tracking, and payments?
Bilal: Exclude them. This version is customer login, service booking, and booking status. Those other features may be future work, but they must not appear as tasks in the current project.

09:20-09:24 | QuickServe screen work
Sara: I'll own Login and profile screens. That is 8 hours, due 12 October. It includes the customer login interface and a basic profile screen.
Bilal: Please keep that as one task. We don't need to split every field into its own task.
Sara: The second task is Service booking screens. I'll own that too. I estimate 12 hours, due 17 October. The customer selects a service, enters the request details, and sees a confirmation screen.
Hina: So Sara has two tasks, and both are mobile UI work. The API work is separate.
Bilal: Right. The transcript shouldn't turn these into generic web frontend tasks. This project is the mobile app.

09:24-09:28 | QuickServe API assignment
Hamza: I can build Booking and account APIs for the app. The endpoint scope is basic customer account handling, service requests, and request status. Put me as the owner.
Bilal: What's the effort estimate and delivery date?
Hamza: 16 hours, due 16 October. That's separate from the 14-hour UrbanCart API task. Please don't merge those just because I own both.
Usman: I need those responses for mobile integration, but we can use sample responses while Hamza works.
Bilal: Good. This is still one API task under QuickServe. There is no new shared platform project.

09:28-09:32 | QuickServe integration estimate correction
Usman: I will own Mobile integration and testing. Initially I would put it at 8 hours, due 22 October.
Sara: Can that cover the booking status screen, error states, and testing login through booking? Eight sounds a little tight.
Usman: You're right. Make the final estimate 10 hours. Keep the task deadline at 22 October. I will connect the mobile UI to the API, display request status, and test the whole customer flow.
Bilal: Final agreement: Mobile integration and testing, Usman, 10 hours, 22 October. QuickServe still delivers on 24 October. Don't keep the earlier eight-hour estimate.
Ayesha: That's four tasks for QuickServe as well. We are not adding maps or payment tasks.

09:32-09:36 | HelpDeskPro scope and manager
Hina: Third project is HelpDeskPro AI Assistant, for client HelpDeskPro Solutions. I am managing it. They want a support assistant that answers questions from a supplied FAQ document and passes unresolved questions to a human team.
Zain: Does the assistant need to send emails or connect to a real ticketing service?
Hina: No external message sending is required. Human escalation can be a saved record in the demo. We are building a support proof of concept, not integrating their full support system.
Maryam: We should keep an explicit boundary that the assistant uses the FAQ content instead of guessing unsupported answers.
Hina: Agreed. The project deadline is 22 October. We will test it with some questions that aren't in the document too.

09:36-09:40 | HelpDeskPro document work
Maryam: I'll own FAQ document processing. It should prepare the supplied FAQ so the assistant can retrieve relevant content. I estimate 10 hours, due 13 October.
Hina: Please make the task description clear: prepare and retrieve from the FAQ. Don't make a separate task for every FAQ topic.
Zain: I can then own Assistant answer generation. I'll use the prepared content, connect the model, and handle the response structure.
Hina: Give us the estimate and date for that task.
Zain: 14 hours, due 17 October. If the FAQ doesn't support an answer, the assistant should say it cannot resolve the question rather than inventing a response.

09:40-09:44 | HelpDeskPro escalation
Zain: The next task is Human escalation flow. I can own it as well: save unresolved questions so they can be reviewed by a person. The estimate is 6 hours, due 18 October.
Bilal: Are you assigning those escalated questions to another employee now?
Hina: No, not as new project tasks from this planning meeting. The feature is a saved escalation record in the client's demo. Keep our development task assigned to Zain.
Ayesha: The distinction matters. Discussion of end users should not create employees in our own company directory.
Hina: Exactly. Also, the client mentioned someone called Kamran who may supply a document later. Kamran is not a NovaWorks employee. Do not add him to our team or assign development work to him.

09:44-09:48 | HelpDeskPro testing owner correction
Hina: For Assistant evaluation and testing, I was initially considering Zain as the owner. We need to test FAQ answers, unsupported questions, and the escalation path.
Maryam: I can own that instead. It would be better if someone other than the answer-generation developer checks the results.
Hina: Agreed. Replace the earlier suggestion: Maryam is the final owner of Assistant evaluation and testing.
Maryam: Put the estimate at 8 hours, due 21 October. I'll include normal questions and missing-answer cases. That is separate from my ten-hour FAQ document task.
Hina: Confirmed: Maryam, 8 hours, 21 October. Final HelpDeskPro deadline stays 22 October.

09:48-09:52 | Simple accounts and team setup
Bilal: Please don't spend time building a registration flow. We can use one administrator account, our three manager accounts, and the six developer accounts.
Ayesha: The team names and specializations can be hardcoded or loaded from a setup script. The script may create those users with demo passwords. People should be able to log in using the supplied credentials.
Hina: Agreed. We do not need signup, forgot password, email verification, or a screen for creating and editing users. This is a hackathon demonstration with fictional accounts.
Sara: We still need the existing people available to the AI so it assigns the right names.
Bilal: Exactly. The directory is input to the AI. Projects and tasks should come from the meeting rather than requiring someone to enter all twelve tasks manually.

09:52-09:56 | CRM creation flow
Ayesha: The administrator pastes this transcript inside the CRM and clicks Create from Transcript. A valid result should automatically save all three projects and their tasks.
Hina: If a required person or date cannot be resolved, show a clear message and let the administrator correct it. Do not invent an employee. For this meeting, the final recap supplies all the required information.
Bilal: After creation, show project cards and a project detail screen. Each task needs its owner, deadline, description, and estimated hours. A manager can open their projects; a developer can open their assigned task list.
Usman: Do we need charts, completion percentages, timesheets, or budgets?
Ayesha: No. No cost calculation or progress monitoring. Simple login, project lists, task lists, and transcript automation are enough. Saved projects and tasks should remain after a refresh.

09:56-10:00 | Final recap
Ayesha: Final recap: UrbanCart Website, client UrbanCart Clothing, manager Ayesha, deadline 20 October. Ali owns Product catalog UI: 12 hours, 12 October. Ali owns Demo cart UI: 8 hours, 15 October. Hamza owns Product and cart APIs: 14 hours, 14 October. Ali owns Website integration and testing: 6 hours, 19 October.
Bilal: QuickServe Mobile App, client QuickServe Services, manager Bilal, deadline 24 October. Sara owns Login and profile screens: 8 hours, 12 October. Sara owns Service booking screens: 12 hours, 17 October. Hamza owns Booking and account APIs: 16 hours, 16 October. Usman owns Mobile integration and testing: 10 hours, 22 October.
Hina: HelpDeskPro AI Assistant, client HelpDeskPro Solutions, manager Hina, deadline 22 October. Maryam owns FAQ document processing: 10 hours, 13 October. Zain owns Assistant answer generation: 14 hours, 17 October. Zain owns Human escalation flow: 6 hours, 18 October. Maryam owns Assistant evaluation and testing: 8 hours, 21 October.
Ayesha: Those are the final decisions. Keep the rejected features out. The company already has its nine employees. Create three projects with twelve tasks, then show them in the CRM. That's all for this meeting.`;

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

  // Transcript state (Admin only)
  const [transcriptInput, setTranscriptInput] = useState('');
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState('');
  const [transcriptSuccess, setTranscriptSuccess] = useState(null);

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
    setTranscriptSuccess(null);
    setTranscriptError('');
    localStorage.removeItem('briefflow_token');
    localStorage.removeItem('briefflow_user');
    setActiveTab('overview');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
  };

  // Handle AI Transcript Ingestion
  const handleProcessTranscript = async () => {
    if (!transcriptInput || transcriptInput.trim().length < 50) {
      setTranscriptError('Please provide a valid meeting transcript text (minimum 50 characters).');
      return;
    }

    setTranscriptLoading(true);
    setTranscriptError('');
    setTranscriptSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/transcript/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transcript: transcriptInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process transcript');
      }

      setTranscriptSuccess(data);
      // Refresh project and task counts in background
      fetchProjects();
      fetchTasks();
    } catch (err) {
      setTranscriptError(err.message);
    } finally {
      setTranscriptLoading(false);
    }
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
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => {
                    setTranscriptInput(OFFICIAL_TRANSCRIPT);
                    setTranscriptError('');
                  }}
                >
                  Load Official Meeting Transcript
                </button>
              </div>

              <div className="transcript-console-card">
                <div className="transcript-instructions">
                  <strong>Meeting-to-Execution Workflow:</strong> Paste the client delivery planning meeting dialogue below. The AI pipeline will extract final decisions, match managers and developer agents from the team directory, and save all projects and tasks atomically.
                </div>

                {transcriptError && (
                  <div className="error-banner">
                    {transcriptError}
                  </div>
                )}

                {transcriptSuccess && (
                  <div
                    style={{
                      padding: '14px 16px',
                      backgroundColor: 'var(--status-green-bg)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ color: 'var(--status-green)', fontWeight: 600, fontSize: '14px' }}>
                      ✓ {transcriptSuccess.message}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Created {transcriptSuccess.projectsCreated} projects with {transcriptSuccess.tasksCreated} total tasks.
                    </div>
                    <button
                      className="btn-primary"
                      style={{ alignSelf: 'flex-start', marginTop: '6px' }}
                      onClick={() => handleTabSwitch('projects')}
                    >
                      View Created Projects →
                    </button>
                  </div>
                )}

                <textarea
                  className="transcript-textarea"
                  placeholder="Paste meeting transcript text here..."
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  disabled={transcriptLoading}
                ></textarea>

                <div className="transcript-actions">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {transcriptInput.length} characters • Ready for AI extraction
                  </span>
                  <button
                    className="btn-primary"
                    onClick={handleProcessTranscript}
                    disabled={transcriptLoading || !transcriptInput.trim()}
                  >
                    {transcriptLoading ? (
                      <>
                        <span className="status-dot checking"></span>
                        Analyzing Transcript with AI...
                      </>
                    ) : (
                      'Create from Transcript'
                    )}
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
