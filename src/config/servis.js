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
    },

    // carusel
    async getAllCaorucel() {
        const response = await api.get('/carousel')
        return response
    },

    // flowers
    async getAllFlowers() {
        const response = await api.get('/flowers');
        return response
    },
    async getOneFlowers(id) {
        const response = await api.get(`/flowers/${id}`);
        return response;
    },
    async addCommentToFlower(id, commentData) {
        const response = await api.post(`/flowers/${id}/comment`, commentData)
        return response
    }
 
}


export default Service;