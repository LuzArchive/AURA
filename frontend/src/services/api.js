const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    login: (email, password, role) => request('/auth/login', { method:'POST', body:JSON.stringify({ email, password, role }) }),
    getMe: () => request('/auth/me'),
  },
  students: {
    getMyProfile:  ()     => request('/students/me'),
    updateProfile: (data) => request('/students/me', { method:'PUT', body:JSON.stringify(data) }),
    getMyStudents: ()     => request('/students'),
    register:      (data) => request('/students/register', { method:'POST', body:JSON.stringify(data) }),
  },
  tutors: {
    getMyProfile:  ()     => request('/tutors/me'),
    updateProfile: (data) => request('/tutors/me', { method:'PUT', body:JSON.stringify(data) }),
    getById:       (id)   => request(`/tutors/${id}`),
    register:      (data) => request('/tutors/register', { method:'POST', body:JSON.stringify(data) }),
    assignStudent: (sid)  => request('/tutors/assign', { method:'POST', body:JSON.stringify({ studentId: sid }) }),
  },
  sessions: {
    getAll:   ()          => request('/sessions'),
    getById:  (id)        => request(`/sessions/${id}`),
    create:   (data)      => request('/sessions',       { method:'POST',   body:JSON.stringify(data) }),
    update:   (id, data)  => request(`/sessions/${id}`, { method:'PUT',    body:JSON.stringify(data) }),
    delete:   (id)        => request(`/sessions/${id}`, { method:'DELETE'  }),
  },
  credits: {
    getMy:        ()            => request('/credits/me'),
    getByStudent: (sid)         => request(`/credits/${sid}`),
    create:       (data)        => request('/credits',        { method:'POST', body:JSON.stringify(data) }),
    update:       (sid, data)   => request(`/credits/${sid}`, { method:'PUT',  body:JSON.stringify(data) }),
  },
  coordinator: {
    getReports:    ()                        => request('/coordinator/reports'),
    getStudents:   ()                        => request('/coordinator/students'),
    getTutors:     ()                        => request('/coordinator/tutors'),
    createTutor:   (data)                    => request('/coordinator/tutors',          { method:'POST',  body:JSON.stringify(data) }),
    assignTutor:   (studentId, tutorId)      => request('/coordinator/assign',          { method:'POST',  body:JSON.stringify({ studentId, tutorId }) }),
    getReleases:   (status)                  => request(`/coordinator/releases${status ? `?status=${status}` : ''}`),
    getReleasePDF: (id)                      => request(`/releases/${id}/pdf`),
    reviewRelease: (id, status, notes)       => request(`/coordinator/releases/${id}`,  { method:'PATCH', body:JSON.stringify({ status, reviewNotes: notes }) }),
    manualCredit:  (data)                    => request('/coordinator/credits/manual',  { method:'PATCH', body:JSON.stringify(data) }),
  },
  releases: {
    submit:   (data)  => request('/releases',    { method:'POST', body:JSON.stringify(data) }),
    getMy:    ()      => request('/releases/me'),
    getPDF:   (id)    => request(`/releases/${id}/pdf`),
  },
};
