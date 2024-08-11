import React, { useEffect, useState } from 'react';
import Service from '../config/servis';

const Carousel = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [dragStartX, setDragStartX] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await Service.getAllCaorucel();
                setImages(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchImages();
    }, []);

    // Auto slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 5000); // 5 seconds

        return () => clearInterval(interval); // Clear interval when component unmounts
    }, [currentIndex, isPaused]); // Re-run effect when currentIndex or isPaused changes

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    const handleDragStart = (e) => {
        setDragStartX(e.clientX || e.touches[0].clientX);
    };

    const handleDragEnd = (e) => {
        const dragEndX = e.clientX || e.changedTouches[0].clientX;
        const dragDistance = dragStartX - dragEndX;

        if (dragDistance > 50) {
            nextSlide(); // swiped left
        } else if (dragDistance < -50) {
            prevSlide(); // swiped right
        }

        setDragStartX(null); // reset drag start position
    };

    return (
        <div className='carusel_c'>
            <div 
                className="carusel_c2 relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
            >
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image) => (
                        <figure 
                            key={image._id} 
                            className="relative flex-shrink-0 w-[1200px] h-[300px] flex items-center justify-center overflow-hidden cursor-pointer rounded-[10px] img_katta_k"
                        >
                            <img
                                src={image.url}
                                alt={image.caption}
                                className="object-cover w-full h-full"
                            />
                        </figure>
                    ))}
                </div>
                <button
                    onClick={prevSlide}
                    className="absolute top-[50%] left-[2%] transform -translate-y-1/2 p-2 bg-gray-300 text-green rounded-3xl px-4 hover:bg-white hover:text-gray-800 transition-colors duration-300"
                >
                    &#10094;
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-[50%] right-[2%] transform -translate-y-1/2 p-2 bg-gray-300 text-green rounded-3xl px-4 hover:bg-white hover:text-gray-800 transition-colors duration-300"
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default Carousel;
