import axios from 'axios';

// Determine the API URL based on environment
// For Vercel deployment:
// 1. Set REACT_APP_API_URL environment variable in Vercel dashboard to your backend URL
//    Example: https://your-backend-app.vercel.app/api
// 2. If backend and frontend are on the same Vercel project, you might use relative paths
const getApiUrl = () => {
    // Priority 1: Use explicit environment variable (set in Vercel dashboard)
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    
    // Priority 2: Development mode - use localhost
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        return 'http://localhost:5000/api';
    }
    
    // Priority 3: Production fallback - try relative path first
    // This works if backend is proxied through frontend or on same domain
    // If this doesn't work, you MUST set REACT_APP_API_URL in Vercel
    console.warn('REACT_APP_API_URL not set. Using relative path. Set REACT_APP_API_URL in Vercel environment variables for production.');
    return '/api';
};

const instance = axios.create({
    baseURL: getApiUrl(),
    timeout: 30000, // 30 second timeout for serverless functions
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging (only in development)
instance.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response (network error, CORS, etc.)
            console.error('API Error: No response received. Check if backend is running and CORS is configured correctly.');
            if (process.env.NODE_ENV === 'production') {
                console.error('Backend URL:', instance.defaults.baseURL);
                console.error('Make sure REACT_APP_API_URL is set correctly in Vercel environment variables.');
            }
        } else {
            // Error setting up request
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;