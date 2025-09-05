import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
    timeout: 15000,
})

api.interceptors.request.use((config) => {
    const key = import.meta.env.VITE_API_KEY
    if (key) config.headers['x-api-key'] = key
    return config
})

export async function validatePhone(cc, number) {
    const res = await api.get('/surveys/validate-phone', {
        params: { cc, number }
    })
    return res.data
}

export async function submitSurvey(payload) {
    const res = await api.post('/surveys/submit', payload)
    return res.data
}

export default api
