// Public API base (old backend) — used only for public home-page data
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma').replace(/\/$/, '');

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        return Promise.reject(data);
    }
    return data;
}

// Admin data routes go through Next.js API routes (/api/admin/...)
// The JWT never touches browser JS — it lives in an httpOnly cookie
// managed by the server and forwarded by the proxy.

export const api = {
    // Auth — calls Next.js BFF routes, not the backend directly
    login: (credentials: { email: string; password: string }) =>
        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        }).then(handleResponse),

    logout: () =>
        fetch('/api/auth/logout', { method: 'POST' }).then(handleResponse),

    me: () => fetch('/api/auth/me').then(handleResponse),

    // Team
    team: {
        getAll: () => fetch('/api/admin/team').then(handleResponse),
        create: (formData: FormData) =>
            fetch('/api/admin/team', { method: 'POST', body: formData }).then(handleResponse),
        update: (id: number, formData: FormData) =>
            fetch(`/api/admin/team/${id}`, { method: 'PUT', body: formData }).then(handleResponse),
        delete: (id: number) =>
            fetch(`/api/admin/team/${id}`, { method: 'DELETE' }).then(handleResponse),
    },

    // Projects
    projects: {
        getAll: () => fetch('/api/admin/projects').then(handleResponse),
        create: (formData: FormData) =>
            fetch('/api/admin/projects', { method: 'POST', body: formData }).then(handleResponse),
        update: (id: string, formData: FormData) =>
            fetch(`/api/admin/projects/${id}`, { method: 'PUT', body: formData }).then(handleResponse),
        delete: (id: string) =>
            fetch(`/api/admin/projects/${id}`, { method: 'DELETE' }).then(handleResponse),
    },

    // Blog
    blog: {
        getAll: () => fetch('/api/admin/blogs').then(handleResponse),
        create: (formData: FormData) =>
            fetch('/api/admin/blogs', { method: 'POST', body: formData }).then(handleResponse),
        update: (id: number, formData: FormData) =>
            fetch(`/api/admin/blogs/${id}`, { method: 'PUT', body: formData }).then(handleResponse),
        delete: (id: number) =>
            fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' }).then(handleResponse),
    },

    // Content (Reels)
    content: {
        getAll: () => fetch('/api/admin/content').then(handleResponse),
        create: (formData: FormData) =>
            fetch('/api/admin/content', { method: 'POST', body: formData }).then(handleResponse),
        update: (id: number, formData: FormData) =>
            fetch(`/api/admin/content/${id}`, { method: 'PUT', body: formData }).then(handleResponse),
        delete: (id: number) =>
            fetch(`/api/admin/content/${id}`, { method: 'DELETE' }).then(handleResponse),
    },

    // Services
    services: {
        getAll: () => fetch('/api/admin/services').then(handleResponse),
        create: (formData: FormData) =>
            fetch('/api/admin/services', { method: 'POST', body: formData }).then(handleResponse),
        update: (id: number, formData: FormData) =>
            fetch(`/api/admin/services/${id}`, { method: 'PUT', body: formData }).then(handleResponse),
        delete: (id: number) =>
            fetch(`/api/admin/services/${id}`, { method: 'DELETE' }).then(handleResponse),
    },

    // Inbox (Contact messages)
    inbox: {
        getAll: () => fetch('/api/admin/inbox').then(handleResponse),
    },

    // Public API — home-page data (old backend, no auth needed)
    home: {
        getBlogs: (options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/home`, {
                headers: { Accept: 'application/json' },
                ...options,
            }).then(handleResponse),
        getContent: (options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/content`, {
                headers: { Accept: 'application/json' },
                ...options,
            }).then(handleResponse),
        getProjects: (options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/projects`, {
                headers: { Accept: 'application/json' },
                ...options,
            }).then(handleResponse),
        getServices: (options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/services`, {
                headers: { Accept: 'application/json' },
                ...options,
            }).then(handleResponse),
        getAbout: (options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/about`, {
                headers: { Accept: 'application/json' },
                ...options,
            }).then(handleResponse),
        submitContact: (data: unknown, options: RequestInit = {}) =>
            fetch(`${PUBLIC_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
                ...options,
            }).then(handleResponse),
    },
};
