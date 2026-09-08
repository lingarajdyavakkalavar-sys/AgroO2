/**
 * Centralized API client module for CO2 Farm Frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const tokenStorage = {
  getAccessToken: () => localStorage.getItem('co2_access_token'),
  setAccessToken: (token) => localStorage.setItem('co2_access_token', token),
  clearAccessToken: () => localStorage.removeItem('co2_access_token'),
  getUser: () => {
    try {
      const data = localStorage.getItem('co2_current_user')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
  setUser: (user) => localStorage.setItem('co2_current_user', JSON.stringify(user)),
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = tokenStorage.getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `Request failed with status ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    console.warn(`API call note [${endpoint}]:`, err.message)
    throw err
  }
}

export const authApi = {
  seedTestUser: async () => {
    try {
      const res = await request('/auth/seed-test-user', { method: 'POST' })
      if (res?.user) tokenStorage.setUser(res.user)
      return res
    } catch {
      const fallbackUser = {
        uid: 'test-farmer-001',
        name: 'Ramesh Patil',
        email: 'ramesh.patil.organic@gmail.com',
        role: 'Organic Farmer',
        location: 'Mandya, Karnataka, India',
        land_acres: 5.0,
        soil_type: 'Red Loamy Soil',
        soil_organic_carbon: 0.65,
        primary_crops: 'Tomato, Cotton, Pulses',
        farming_type: 'Certified Organic',
        irrigation_type: 'Drip & Borewell',
        has_completed_onboarding: true,
      }
      tokenStorage.setUser(fallbackUser)
      return { status: 'success', user: fallbackUser }
    }
  },
}

export const farmsApi = {
  getMyFarm: async () => request('/farms/me'),
  completeOnboarding: async (data) => request('/farms/onboarding', { method: 'POST', body: JSON.stringify(data) }),
}

export const productsApi = {
  listProducts: async () => request('/products'),
}

export const ordersApi = {
  createOrder: async (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
}

export const carbonApi = {
  getScore: async () => request('/carbon/score'),
}

export const diagnosesApi = {
  listDiagnoses: async () => request('/diagnoses'),
  analyzeDisease: async (file, crop, farmId) => {
    const formData = new FormData()
    formData.append('file', file)
    if (crop) formData.append('crop', crop)
    if (farmId) formData.append('farm_id', farmId)

    const token = tokenStorage.getAccessToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const res = await fetch(`${API_BASE_URL}/diagnoses/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    })
    if (!res.ok) throw new Error('Disease analysis failed')
    return await res.json()
  },
}

export const chatApi = {
  getSuggestions: async () => request('/chat/suggestions'),
  sendMessage: async (message, farmId, context) =>
    request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, farm_id: farmId, context }),
    }),
}

export const tasksApi = {
  getTasks: async () => request('/tasks/'),
  createTask: async (data) => request('/tasks/', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: async (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: async (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
}

export const weatherApi = {
  getWeather: async () => request('/weather'),
}

export { tokenStorage }
