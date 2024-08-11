import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Service from '../config/servis';
import { flowerSuccess } from '../redux/slice/flowersSlice';

const Comments = ({ flowerId }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const { isLoggedIn } = useSelector(state => state.auth);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentSubmit = async () => {
        if (!isLoggedIn) {
            alert("Sharx qoldirish uchun tizimga kirishingiz kerak.");
            return;
        }
    
        if (rating === 0 || !text) {
            alert("Iltimos, sharxingizni yozing va reyting tanlang.");
            return;
        }
    
        try {
            const response = await Service.addCommentToFlower(flowerId, { rating, text });
            dispatch(flowerSuccess({ data: response.data }));
            setRating(0);
            setText("");
        } catch (error) {
            console.error("Sharx qoldirishda xatolik yuz berdi:", error);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-2xl mb-2">Sharhlar</h2>
            <div className="flex flex-col gap-2">
                {/* Yulduzcha reytingni tanlash */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                {/* Sharh yozish */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Sharxingizni yozing..."
                />
                <button
                    onClick={handleCommentSubmit}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Sharx qoldirish
                </button>
            </div>
        </div>
    );
};

export default Comments;
