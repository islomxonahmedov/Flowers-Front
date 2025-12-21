import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Service from '../config/servis';
import BasketLogo from '../../src/img/LOGOBASKET.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Modal from 'react-modal';

const Basket = () => {
    const [basketItems, setBasketItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const userId = useSelector(state => state?.auth?.auth?.data?._id);

    const fetchBasketItems = async () => {
        try {
            const response = await Service.getAllBasket(userId);
            setBasketItems(response.data.items || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFromBasket = async (flowerId) => {
        try {
            setLoading(true);
            await Service.removeToBasket(userId, flowerId);
            setBasketItems(basketItems.filter(item => item.flower._id !== flowerId));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderCreation = async () => {
        try {
            // Ensure phone number starts with +998
            const formattedPhoneNumber = phoneNumber.startsWith('+998') ? phoneNumber : `+998${phoneNumber}`;
            await Service.createOrder(userId, basketItems, formattedPhoneNumber);
            await Service.clearBasket(userId);
            setBasketItems([]);
            setIsModalOpen(false);
            navigate('/order_user', { state: { basketItems } });
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchBasketItems();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) return (
        <div className='flex flex-col items-center justify-center mt-[15%]'>
            <Loading />
        </div>
    );

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            {basketItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {basketItems.map(item => (
                        <div key={item.flower._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img
                                src={item.flower.img[0]}
                                alt={item.flower.nomi}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{item.flower.nomi}</h2>
                                <p className="text-gray-600">Narxi: {item.flower.narxi} so'm</p>
                                <p className="text-gray-600">Sotuvlar: {item.flower.sales}</p>
                                <p className="text-gray-600">O'rtacha baho: {item.flower.total.toFixed(1)}</p>
                                <p className="mt-2 text-gray-800 font-bold">{item.count} dona</p>
                                <p className="text-sm text-gray-600 mt-2">{item.flower.description.substring(0, 100)}...</p>
                                <button
                                    onClick={() => removeFromBasket(item.flower._id)}
                                    className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                    <div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-md">
                            Rasmiylashtirish
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center mt-16'>
                    <img className='w-36 mb-2' src={BasketLogo} alt="" />
                    <p className='text-center mb-1 text-2xl font-bold'>Savatda hozircha mahsulot yoʻq</p>
                    <p className='text-center mb-4'>Bosh sahifadagi to'plamlardan yoki shaxsiy narsa orqali topping</p>
                    <NavLink to={"/"}><button className='bg-[#123a29] text-white py-2 px-4 rounded-md'>Bosh sahifa</button></NavLink>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Telefon raqam"
                className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl font-bold mb-4">Telefon raqamingizni kiriting</h2>
                <input
                    type="text"
                    placeholder="Telefon raqami"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border p-2 rounded-md w-full mb-4"
                />
                <button
                    onClick={handleOrderCreation}
                    className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                    Buyurtma berish
                </button>
            </Modal>
        </div>
    );
};

export default Basket;
