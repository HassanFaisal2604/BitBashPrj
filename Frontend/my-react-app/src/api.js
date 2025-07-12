// Simple wrapper around the Flask API endpoints located at http://localhost:5000/api
// You can override the base URL at runtime by defining VITE_API_BASE in an .env file.

// Ensure no trailing slash to avoid double slashes when we append paths
const API_BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '')

function handleResponse(res) {
  if (!res.ok) {
    return res.text().then((txt) => {
      throw new Error(txt || `${res.status} ${res.statusText}`)
    })
  }
  return res.json()
}

export async function getJobs(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${API_BASE}/jobs${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  return handleResponse(res)
}

export async function createJob(payload) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function updateJob(id, payload) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function deleteJob(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok && res.status !== 204) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
} 