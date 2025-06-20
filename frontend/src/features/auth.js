import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const backendDomain =
    import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BACKEND_URL_PROD
        : import.meta.env.VITE_BACKEND_URL_DEV;

const api = axios.create({
    baseURL: `${backendDomain}/api`,
    withCredentials: true,
});

const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (refreshToken) => {
        const response = await api.post('/refresh', { refreshToken });
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        loading: false,
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
            console.log(action.payload)
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
        setUserDetails: (state, action) => {
            state.status = true;
            state.user = action.payload;
            // console.log(action.payload)
        },
        removeUserDetails: (state, action) => {
            state.status = false;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(refreshAccessToken.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.loading = false;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        });
        builder.addCase(refreshAccessToken.rejected, (state) => {
            state.loading = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.accessToken = null;
            state.refreshToken = null;
        });
    },
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { payload } = await store.dispatch(refreshAccessToken(refreshToken));
                    originalRequest.headers.Authorization = `Bearer ${payload.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    store.dispatch(clearTokens());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                store.dispatch(clearTokens());
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const { setAccessToken, setRefreshToken, clearTokens, setUserDetails, removeUserDetails } = authSlice.actions;
export default authSlice.reducer;