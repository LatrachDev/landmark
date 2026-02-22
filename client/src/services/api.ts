const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/').replace(/\/$/, '');
const V1_URL = (process.env.NEXT_PUBLIC_API_BASE_URL_V1 || 'https://api.landmark.ma/api/v1').replace(/\/$/, '');

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        return Promise.reject(data);
    }
    return data;
}

const getHeaders = (isFormData = false) => {
    const headers: HeadersInit = {
        'Accept': 'application/json',
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

export const api = {
    // Auth
    login: (credentials: any) =>
        fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(credentials)
        }).then(handleResponse),

    // Team Members
    team: {
        getAll: () => fetch(`${V1_URL}/admin/teams`, { headers: getHeaders() }).then(handleResponse),
        create: (formData: FormData) => fetch(`${V1_URL}/admin/teams`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        update: (id: number, formData: FormData) => fetch(`${V1_URL}/admin/teams/${id}`, {
            method: 'POST', // Using POST with _method PUT for Laravel compatibility
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        delete: (id: number) => fetch(`${V1_URL}/admin/teams/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(handleResponse),
    },

    // Projects
    projects: {
        getAll: () => fetch(`${V1_URL}/admin/projects`, { headers: getHeaders() }).then(handleResponse),
        create: (formData: FormData) => fetch(`${V1_URL}/admin/projects`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        update: (id: number, formData: FormData) => fetch(`${V1_URL}/admin/projects/${id}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        delete: (id: number) => fetch(`${V1_URL}/admin/projects/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(handleResponse),
    },

    // Blog
    blog: {
        getAll: () => fetch(`${V1_URL}/admin/blogs`, { headers: getHeaders() }).then(handleResponse),
        create: (formData: FormData) => fetch(`${V1_URL}/admin/blogs`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        update: (id: number, formData: FormData) => fetch(`${V1_URL}/admin/blogs/${id}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        delete: (id: number) => fetch(`${V1_URL}/admin/blogs/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(handleResponse),
    },

    // Content (Reels)
    content: {
        getAll: () => fetch(`${V1_URL}/admin/contents`, { headers: getHeaders() }).then(handleResponse),
        create: (formData: FormData) => fetch(`${V1_URL}/admin/contents`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        update: (id: number, formData: FormData) => fetch(`${V1_URL}/admin/contents/${id}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        delete: (id: number) => fetch(`${V1_URL}/admin/contents/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(handleResponse),
    },

    // Services
    services: {
        getAll: () => fetch(`${V1_URL}/admin/services`, { headers: getHeaders() }).then(handleResponse),
        create: (formData: FormData) => fetch(`${V1_URL}/admin/services`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        update: (id: number, formData: FormData) => fetch(`${V1_URL}/admin/services/${id}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        }).then(handleResponse),
        delete: (id: number) => fetch(`${V1_URL}/admin/services/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(handleResponse),
    },

    // Inbox (Contacts)
    inbox: {
        getAll: (options: RequestInit = {}) => fetch(`${V1_URL}/admin/contacts`, {
            headers: getHeaders(),
            ...options
        }).then(handleResponse),
    },

    // Public API (Home)
    home: {
        getBlogs: (options: RequestInit = {}) => fetch(`${BASE_URL}/api/home`, {
            headers: { 'Accept': 'application/json' },
            ...options
        }).then(handleResponse),
        getContent: (options: RequestInit = {}) => fetch(`${BASE_URL}/api/content`, {
            headers: { 'Accept': 'application/json' },
            ...options
        }).then(handleResponse),
        getProjects: (options: RequestInit = {}) => fetch(`${BASE_URL}/api/projects`, {
            headers: { 'Accept': 'application/json' },
            ...options
        }).then(handleResponse),
        getServices: (options: RequestInit = {}) => fetch(`${BASE_URL}/api/services`, {
            headers: { 'Accept': 'application/json' },
            ...options
        }).then(handleResponse),
        getAbout: (options: RequestInit = {}) => fetch(`${BASE_URL}/api/about`, {
            headers: { 'Accept': 'application/json' },
            ...options
        }).then(handleResponse),
        submitContact: (data: any, options: RequestInit = {}) => fetch(`${BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
            ...options
        }).then(handleResponse),
    }
};

const V1_VURL = process.env.NEXT_PUBLIC_API_BASE_URL_V1; // Minor fix if needed
