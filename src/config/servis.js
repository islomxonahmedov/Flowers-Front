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
    // auth
    async loginAuth(auth) {
        const response = await api.post('/auth/signin', auth);
        return response;
    },

    async getAuth() {
        const response = await api.get('/auth');
        return response;
    },

    async getOrders() {
        const response = await api.get('/orders/user-orders')
        return response;
    },
    async addOrder() {
        const response = await api.post('/orders/add')
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

    // order
    async createOrder(userId, items, phoneNumber) {
        const response = await api.post('/orders/add', {userId,items,phoneNumber,});
        return response;
    },

    async getOrderByUser(userId){
      const response =  await api.get(`/orders/${userId}`);
      return response;
    },

    // basket
    async addToBasket(userId, flowerId) {
        const response = await api.post(`/${userId}/basket/${flowerId}`);
        return response;
    },
    async removeToBasket(userId, flowerId) {
        const response = await api.delete(`/${userId}/remove/basket/${flowerId}`);
        return response;
    },
    async getAllBasket(userId) {
        const response = await api.get(`/${userId}/basket`);
        return response;
    },
   async clearBasket (userId) {
            const response = await api.post('/clearbasket', { userId });
            return response;
    },

    // like
    async addToLike(userId, flowerId) {
        const response = await api.post(`/${userId}/like/${flowerId}`);
        return response;
    },
    async removeFromLike(userId, flowerId) {
        const response = await api.delete(`/${userId}/remove/like/${flowerId}`);
        return response;
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
        const response = await api.post(`/flowers/${id}/comment`, commentData);
        return response;
    }

}


export default Service;