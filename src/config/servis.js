import api from "./api";
import { getFromLocalStorage } from "./localstorage";

api.interceptors.request.use((req) => {
    const token = getFromLocalStorage("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

const Service = {
    async getAuth() {
        const response = await api.get('/auth');
        return response;
    },


    // catigory
    async getAllCategory() {
        const response = await api.get("/catigory");
        return response;
    },
    async getBooksByCategory(categoryId) {
        const response = await api.get(`/flowers/byCategory/${categoryId}`);
        return response;
    }

    
}


export default Service;