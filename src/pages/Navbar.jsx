import React, { useEffect, useState, useRef } from 'react';
import { HiBars3BottomRight, HiXMark } from "react-icons/hi2";
import { CiSearch, CiUser, CiHeart, CiShoppingCart } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown } from "react-icons/md";
import { categoryFailure, categoryStart, categorySuccess } from "../redux/slice/catigorySlice";
import Service from '../config/servis';
import { GiFlowerPot, GiHighGrass, GiFruitTree, GiPlantSeed, GiFlowers, GiWateringCan } from "react-icons/gi";
import { FaHeadphones } from "react-icons/fa6";
import { PiTreeLight } from "react-icons/pi";
import { FaTree, FaPepperHot } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import Loading from './Loading';

const categoryIcons = [
    FaTree,       // 0 - Flower
    GiFlowerPot,  // 1 - Plants
    GiHighGrass,  // 2 - Leaves
    PiTreeLight,  // 3 - Seedlings
    GiFruitTree,  // 4 - Fruits
    GiPlantSeed,  // 5 - Vegetables
    GiFlowers,
    FaPepperHot,  // 6 - Spices
    GiWateringCan,// 7 - Eggplants
    // Qo'shimcha iconlar
];

function Navbar() {
    const { categories, isLoading, isError } = useSelector(state => state.category);
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [modalHoveredCategory, setModalHoveredCategory] = useState(null);
    const [lastHoveredCategory, setLastHoveredCategory] = useState(null); // Oxirgi hover qilingan kategoriya
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const modalRef = useRef(null);

    const getAllCategories = async () => {
        try {
            dispatch(categoryStart());
            const { data } = await Service.getAllCategory();
            dispatch(categorySuccess(data));
        } catch (error) {
            console.log(error.message);
            dispatch(categoryFailure(error.message));
        }
    };

    const fetchCategoryBooks = async (categoryId) => {
        try {
            setLoadingBooks(true);
            const { data } = await Service.getBooksByCategory(categoryId);
            setCategoryBooks(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingBooks(false);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 850) {
                setVisibleCategories([]); // Hide all categories
            } else if (width <= 1000) {
                setVisibleCategories(categories.slice(0, 6)); // Show only the first 5 categories
            } else if (width <= 1200) {
                setVisibleCategories(categories.slice(0, 7)); // Show the first 7 categories
            } else if (width <= 1300) {
                setVisibleCategories(categories.slice(0, 8)); // Show the first 8 categories
            } else {
                setVisibleCategories(categories.slice(0, 9));
            }
        };

        handleResize(); // Set initial categories
        window.addEventListener('resize', handleResize); // Update categories on resize

        return () => window.removeEventListener('resize', handleResize); // Clean up listener
    }, [categories]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
                setModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalOpen]);

    useEffect(() => {
        if (modalHoveredCategory) {
            fetchCategoryBooks(modalHoveredCategory);
            setLastHoveredCategory(modalHoveredCategory); // Oxirgi hover qilingan kategoriyani saqlash
        }
    }, [modalHoveredCategory]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <>
            <div className='navbar_c'>
                <div className='call_center'>
                    <div className='flex items-center gap-1'>
                        <img style={{ width: "30px", height: "30px", borderRadius: "500px" }} src="https://storage.kun.uz/source/1/i7iLwd0gmoGftUMf1Ow2XWjaHyfb_Vkj.jpg" alt="" />
                        <div>Uzbekcha</div>
                    </div>
                    <div className='center_call'>
                        <div className='phone_center'>
                            <FaHeadphones className='call_icon' />
                            <div>
                                <p>Aloqa markazi telefon raqami</p>
                                <p>+998 77 095 00 25</p>
                            </div>
                        </div>
                        <div className='phone_center'>
                            <FaPhoneAlt className='call_icon' />
                            <div>
                                <p>Admin telefon raqami</p>
                                <p>+998 90 599 27 90</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar">
                    <NavLink to={"/"}>
                        <div className='Logo'>
                            <div className='Logo1'>FLOWERS</div>
                            <div className='Logo2'>GARDENING PLANTS</div>
                        </div>
                    </NavLink>
                    <div className='box2'>
                        <div className='katalog_Button' onClick={toggleModal}>
                            {modalOpen ? <HiXMark className='icon' /> : <HiBars3BottomRight className='icon' />} Katalog
                        </div>
                        <div className='navbar_search'>
                            <input
                                type="text"
                                placeholder='Mahsulotlarni qidiring'
                            />
                            <div className='search_icon'>
                                <CiSearch />
                            </div>
                        </div>
                    </div>
                    <div className='box3'>
                        <NavLink to="/login">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CiUser className='icon' />
                                <span className='nonecatigory'>Kirish</span>
                            </div>
                        </NavLink>
                        <NavLink to="/favorites">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CiHeart className='icon' />
                                <span className='nonecatigory'>Saralangan</span>
                            </div>
                        </NavLink>
                        <NavLink to="/cart">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CiShoppingCart className='icon' />
                                <span className='nonecatigory'>Savat</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className='catigoriyalar'>
                    {isLoading ? (
                        <div className='flex justify-center'>
                            Loading...
                        </div>
                    ) : isError ? (
                        <div>Error: {isError}</div>
                    ) : (
                        <>
                            {visibleCategories.map((category, index) => {
                                const Icon = categoryIcons[index] || null; // Default icon o'rniga null
                                return (
                                    <div key={category._id}>
                                        <NavLink to={`/category/${category._id}`} className="category-link">
                                            {Icon && <Icon className='category-icon size-5' />}
                                            {category.nomi}
                                        </NavLink>
                                    </div>
                                );
                            })}
                            <button className='flex items-center gap-1 show-more' onClick={toggleModal}>Yana <MdKeyboardArrowDown className='size-5' /></button>
                        </>
                    )}
                </div>

                {/* Modal */}
                {modalOpen && (
                    <div onClick={toggleModal} className='modal'>
                        <div className='modal_content'>
                            <span className='close' onClick={toggleModal}><HiXMark className='modalXmark' /></span>
                            {isLoading ? (
                                <div className='flex justify-center mt-52'>
                                    <Loading />
                                </div>
                            ) : isError ? (
                                <div>Error: {isError}</div>
                            ) : (
                                <ul className='modalcatigory'>
                                    {categories?.map((category, index) => {
                                        const Icon = categoryIcons[index] || null; // Default icon o'rniga null
                                        return (
                                            <li
                                                key={category?._id}
                                                onMouseEnter={() => {
                                                    setModalHoveredCategory(category._id);
                                                }}>
                                                <NavLink to={`/category/${category?._id}`} className="category-link">
                                                    {Icon && <Icon className='category-icon size-7' />}
                                                    {category?.nomi}
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {lastHoveredCategory && (
                                <div className='books-list '>
                                    {loadingBooks ? (
                                        <div className='flex justify-center mt-52'>
                                            <Loading />
                                        </div>
                                    ) : (
                                        <div className="max-h-[600px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 auto-rows-max pr-7 pl-3">
                                            {categoryBooks.map((flower, index) => (
                                                <div
                                                    key={flower._id}
                                                    className={`flowers-item ${index % 2 === 0 ? 'row-span-1' : 'row-span-2'}`}
                                                >
                                                    <img
                                                        className="w-full h-auto object-cover rounded-lg"
                                                        src={flower?.img[0]}
                                                        alt={flower?.nomi}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <nav id="navbar">
                    <ul>
                        <li><a href="#home"><IoHomeOutline className='icon' /> Bosh sahifa</a></li>
                        <li onClick={toggleModal}><a href="#about"><CiSearch className='icon' />Katalog</a></li>
                        <li><a href="#services"><CiShoppingCart className='icon' />Savat</a></li>
                        <li><a href="#contact"><CiHeart className='icon' />Saralangan</a></li>
                        <li><a href="#contact"><CiUser className='icon' />Kirish</a></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Navbar;
