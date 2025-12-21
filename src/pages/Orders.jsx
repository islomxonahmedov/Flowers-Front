import React, { useEffect, useState } from 'react';
import Service from '../config/servis';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Loading holati
    const userId = useSelector(state => state?.auth?.auth?.data?._id);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true); // Loadingni yoqish
                const response = await Service.getOrderByUser(userId);
                setOrders(response.data);
            } catch (error) {
                console.error('Buyurtmalarni olishda xatolik yuz berdi:', error);
            } finally {
                setLoading(false); // Loadingni o'chirish
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <p className="text-center text-gray-600">Yuklanmoqda...</p>
            ) : orders.length > 0 ? (
                <div className="">
                    {orders.map(order => (
                        <div key={order._id} className=" flex bg-white shadow-md rounded-lg overflow-hidden">
                            {order.items.map(item => (
                                <NavLink to={`/flowers/${item.flower._id}`} key={item.flower._id}>
                                    <div className="p-4">
                                        <img
                                            src={item.flower.img[0]}
                                            alt={item.flower.nomi}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold">{item.flower.nomi}</h2>
                                            <p className="text-gray-600">Narxi: {item.flower.narxi} so'm</p>
                                            <p className="text-gray-600">Sotuvlar: {item.flower.sales}</p>
                                            <p className="text-gray-600">O'rtacha baho: {item.flower.total.toFixed(1)}</p>
                                            <p className="mt-2 text-gray-800 font-bold">{item.count} dona</p>
                                            <p className="text-sm text-gray-600 mt-2">{item.flower.description.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">Hozircha buyurtma qilingan mahsulotlar yo'q.</p>
            )}
        </div>
    );
};

export default OrdersPage;
