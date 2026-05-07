import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login          from './pages/login/Login';

// ── Student shell ─────────────────────────────────────────────────────────────
import Sidebar   from './components/Sidebar/Sidebar';
import Topbar    from './components/Topbar/Topbar';
import Dashboard from './pages/dashboard/Dashboard';
import Tutor     from './pages/tutor/Tutor';
import Sessions  from './pages/sessions/Sessions';
import Calendar  from './pages/calendar/Calendar';
import Credits   from './pages/credits/Credits';
import Chat      from './pages/chat/Chat';
import LifePlan  from './pages/lifeplan/LifePlan';
import Evidences from './pages/evidences/Evidences';
import Settings               from './pages/settings/Settings';
import ComplementaryCredits   from './pages/complementary/ComplementaryCredits';

// ── Coordinator shell ─────────────────────────────────────────────────────────
import CoordinatorLayout   from './components/CoordinatorLayout/CoordinatorLayout';
import CoordinatorDashboard from './pages/coordinator/dashboard/CoordinatorDashboard';
import CoordinatorStudents  from './pages/coordinator/students/CoordinatorStudents';
import CoordinatorTutors    from './pages/coordinator/tutors/CoordinatorTutors';
import CoordinatorReleases  from './pages/coordinator/releases/CoordinatorReleases';
import CoordinatorReports   from './pages/coordinator/reports/CoordinatorReports';
import { api } from './services/api';

// ── Student pages map ─────────────────────────────────────────────────────────
const STUDENT_PAGES = {
  dashboard: { title:'Vista General',             subtitle:'Bienvenido de nuevo',                    component: Dashboard },
  tutor:     { title:'Mi Tutor',                  subtitle:'Información de tu tutor asignado',       component: Tutor     },
  sessions:  { title:'Tutorías',                  subtitle:'Gestiona tus sesiones de tutoría',       component: Sessions  },
  calendar:  { title:'Calendario',                subtitle:'Tus eventos y sesiones del mes',         component: Calendar  },
  credits:   { title:'Progreso de Créditos',      subtitle:'Seguimiento de tus créditos académicos', component: Credits   },
  lifeplan:  { title:'Plan de Vida',              subtitle:'',                                        component: LifePlan  },
  evidences: { title:'Repositorio de Evidencias', subtitle:'',                                        component: Evidences },
  chat:      { title:'Chat / Asistente',          subtitle:'Conversación con tu tutor',              component: Chat      },
  complementary: { title:'Créditos Complementarios', subtitle:'Actividades y liberación de tutoría',   component: ComplementaryCredits },
  settings:  { title:'Configuración',             subtitle:'',                                        component: Settings  },
};

// ── Coordinator pages map ─────────────────────────────────────────────────────
const COORDINATOR_PAGES = {
  dashboard: CoordinatorDashboard,
  students:  CoordinatorStudents,
  tutors:    CoordinatorTutors,
  releases:  CoordinatorReleases,
  reports:   CoordinatorReports,
};

// ── Student App Shell ─────────────────────────────────────────────────────────
const StudentShell = () => {
  const { user, logout }          = useAuth();
  const [page, setPage]           = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const info     = STUDENT_PAGES[page] || STUDENT_PAGES.dashboard;
  const PageComp = info.component;
  const subtitle = page === 'dashboard'
    ? `Bienvenido de nuevo, ${user?.name?.split(' ')[0] ?? ''}`
    : info.subtitle;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f4f7ff;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#d0d8ee;border-radius:10px;}
      `}</style>
      <div style={{ display:'flex', minHeight:'100vh', background:'#f4f7ff' }}>
        <Sidebar active={page} onNav={setPage} collapsed={collapsed} onToggle={() => setCollapsed(c=>!c)} onLogout={logout}/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <Topbar title={info.title} subtitle={subtitle}/>
          <div style={{ flex:1, overflowY:'auto' }}>
            <PageComp/>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Coordinator App Shell ─────────────────────────────────────────────────────
const CoordinatorShell = () => {
  const [page,    setPage]    = useState('dashboard');
  const [pending, setPending] = useState(0);

  useEffect(() => {
    api.coordinator.getReleases('pending')
      .then(r => setPending(r.length))
      .catch(() => {});
  }, [page]);

  const PageComp = COORDINATOR_PAGES[page] || CoordinatorDashboard;

  return (
    <CoordinatorLayout activePage={page} onNav={setPage} pendingCount={pending}>
      <PageComp onNav={setPage}/>
    </CoordinatorLayout>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const AppInner = () => {
  const { user } = useAuth();

  if (!user) return <Login/>;

  if (user.role === 'coordinator') return <CoordinatorShell/>;
  if (user.role === 'tutor')       return <StudentShell/>;  // tutor uses student shell for now
  return <StudentShell/>;
};

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute fallback={<Login/>}>
        <AppInner/>
      </ProtectedRoute>
    </AuthProvider>
  );
}
