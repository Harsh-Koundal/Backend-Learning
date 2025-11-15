import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const instance = axios.create({
    baseURL:API_BASE,
    withCredentials:true
});

export const setAccessToken = (token) =>{
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.response.use(
    res => res,
    async(error)=>{
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
               const resp = await axios.post(`${API_BASE}/api/refresh`, {}, { withCredentials: true });
                const newAccessToken = resp.data.accessToken;
                instance.defaults.headers.common["Authorization"] = `Bearer ${newAccressToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            }catch(err){
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
export default instance