import { useSelector, useDispatch } from 'react-redux';
import Carousel from './Carousel';
import React, { useEffect, useState } from 'react';
import { flowerStart, flowerSuccess, flowerFailure } from '../redux/slice/flowersSlice';
import Service from '../config/servis';
import { LuChevronRight } from "react-icons/lu";
import { FaHeart } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

function Home({ addToBasketFunction, toggleLikeFunction }) {
  const dispatch = useDispatch();
  const { flowers, isLoading, isError } = useSelector((state) => state.flower);
  const [displayCount, setDisplayCount] = useState(2);

  useEffect(() => {
    const fetchFlowers = async () => {
      dispatch(flowerStart());

      try {
        const response = await Service.getAllFlowers();
        dispatch(flowerSuccess({ data: response.data }));
      } catch (error) {
        dispatch(flowerFailure());
      }
    };

    fetchFlowers();
  }, [dispatch]);


  if (isLoading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-lg text-red-500">Error loading flowers.</p>;
  }

  const topFlowers = Array.isArray(flowers)
    ? [...flowers].sort((a, b) => b.sales - a.sales).slice(0, displayCount)
    : [];

  // Determine if there are more items to display
  const moreItemsAvailable = flowers.length > displayCount;

  // Handle button click to show more items
  const handleShowMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + 10, flowers.length));
  };

  return (
    <div className='home_p_container'>
      <div className="mb-4">
        <Carousel />
      </div>
      <div>
        <div className='flex items-center gap-2'>
          <p className='text-4xl'>Mashxur gullar</p>
          <LuChevronRight className='text-3xl' />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 ">
          {topFlowers.map((flower) => (
            <div key={flower._id}
              className="flower-item bg-white rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out hover:shadow-md pb-2"
            >
              <NavLink to={`/flowers/${flower._id}`}>
                <img
                  src={flower.img[0]}
                  alt={flower.name}
                  className="flower-image w-72 h-72 object-cover rounded-[10px] mb-2 hover:scale-105 cursor-pointer"
                />
              </NavLink>

              <div onClick={() => toggleLikeFunction(flower?._id)} className='absolute top-3 right-5 cursor-pointer'>
                <FaHeart />
              </div>
              <div className='mx-2 h-24 flex flex-col'>
                <NavLink to={`/flowers/${flower._id}`} className="text-[15px] h-[31px] text-gray-800 overflow-hidden " style={{ lineHeight: "15px" }}>{flower.nomi}</NavLink>
                <NavLink to={`/flowers/${flower._id}`} className='flex items-center text-slate-500'>
                  {flower.total > 0 ? (
                    <span className={"text-yellow-300 text-[20px]"}>
                      ★
                    </span>
                  ) : <div className='opacity-0'>
                    salom
                  </div>}
                  <h3 className='text-[13px]'>
                    {flower.total > 0
                      ? `${Math.floor(flower.total)}.${Math.round((flower.total - Math.floor(flower.total)) * 10)}`
                      : ''}
                  </h3>

                  <span className='text-[13px] ml-1'>
                    {flower.comments.length === 0 ? "" : "(" + flower.comments.length + " sharhlar)"}
                  </span>
                </NavLink>
                <div className='flex items-center justify-between'>
                  <NavLink to={`/flowers/${flower._id}`}>
                    <del className="text-[12px] text-gray-500">
                      {flower.price === 0 ? <div className='opacity-0 text-[12px]'>0</div> : flower.price.toLocaleString('uz-UZ').replace(/,/g, ' ')}
                    </del>
                    <p className="text-[14px] text-gray-800">
                      {flower.narxi.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                    </p>
                  </NavLink>
                  <div onClick={() => addToBasketFunction(flower?._id)} className='relative bottom-2 right-3 rounded-[50px] border border-gray-300 hover:bg-slate-200'>
                    <svg data-v-cee4be4c="" width="30" height="30" radius={50} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui-icon  add-cart-icon">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {moreItemsAvailable && (
            <button
              onClick={handleShowMore}
              className="w-[50%] py-2 text-[17px] bg-[#b4c1a19d] text-black rounded-[7px] hover:bg-[#b4c1a1fc]"
            >
              Yana ko'rsatish 10 ta
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
