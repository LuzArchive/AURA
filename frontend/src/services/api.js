const BASE_URL = import.meta.env.VITE_API_URL 

export const saveToken   = (t) => localStorage.setItem('token', t);
export const getToken    = ()  => localStorage.getItem('token');
export const removeToken = ()  => localStorage.removeItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud');
  return data;
};

export const api = {
  auth: {
    login: (email, password, role) => request('/api/auth/login', { method:'POST', body:JSON.stringify({ email, password, role }) }),
    getMe: () => request('/api/auth/me'),
  },
  students: {
    getMyProfile:  ()     => request('/api/students/me'),
    updateProfile: (data) => request('/api/students/me', { method:'PUT', body:JSON.stringify(data) }),
    getMyStudents: ()     => request('/api/students'),
    register:      (data) => request('/api/students/register', { method:'POST', body:JSON.stringify(data) }),
  },
  tutors: {
    getMyProfile:  ()     => request('/api/tutors/me'),
    updateProfile: (data) => request('/api/tutors/me', { method:'PUT', body:JSON.stringify(data) }),
    getById:       (id)   => request(`/api/tutors/${id}`),
    register:      (data) => request('/api/tutors/register', { method:'POST', body:JSON.stringify(data) }),
    assignStudent: (sid)  => request('/api/tutors/assign', { method:'POST', body:JSON.stringify({ studentId: sid }) }),
  },
  sessions: {
    getAll:   ()          => request('/api/sessions'),
    getById:  (id)        => request(`/api/sessions/${id}`),
    create:   (data)      => request('/api/sessions',       { method:'POST',   body:JSON.stringify(data) }),
    update:   (id, data)  => request(`/api/sessions/${id}`, { method:'PUT',    body:JSON.stringify(data) }),
    delete:   (id)        => request(`/api/sessions/${id}`, { method:'DELETE'  }),
  },
  credits: {
    getMy:        ()            => request('/api/credits/me'),
    getByStudent: (sid)         => request(`/api/credits/${sid}`),
    create:       (data)        => request('/api/credits',        { method:'POST', body:JSON.stringify(data) }),
    update:       (sid, data)   => request(`/api/credits/${sid}`, { method:'PUT',  body:JSON.stringify(data) }),
  },
  coordinator: {
    getReports:    ()                        => request('/api/coordinator/reports'),
    getStudents:   ()                        => request('/api/coordinator/students'),
    getTutors:     ()                        => request('/api/coordinator/tutors'),
    createTutor:   (data)                    => request('/api/coordinator/tutors',          { method:'POST',  body:JSON.stringify(data) }),
    assignTutor:   (studentId, tutorId)      => request('/api/coordinator/assign',          { method:'POST',  body:JSON.stringify({ studentId, tutorId }) }),
    getReleases:   (status)                  => request(`/api/coordinator/releases${status ? `?status=${status}` : ''}`),
    getReleasePDF: (id)                      => request(`/api/releases/${id}/pdf`),
    reviewRelease: (id, status, notes)       => request(`/api/coordinator/releases/${id}`,  { method:'PATCH', body:JSON.stringify({ status, reviewNotes: notes }) }),
    manualCredit:  (data)                    => request('/api/coordinator/credits/manual',  { method:'PATCH', body:JSON.stringify(data) }),
  },
  releases: {
    submit:   (data)  => request('/api/releases',    { method:'POST', body:JSON.stringify(data) }),
    getMy:    ()      => request('/api/releases/me'),
    getPDF:   (id)    => request(`/api/releases/${id}/pdf`),
  },
};
