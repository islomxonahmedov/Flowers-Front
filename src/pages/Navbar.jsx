import React, { useEffect, useState, useRef } from 'react';
import { HiBars3BottomRight, HiXMark } from "react-icons/hi2";
import { CiSearch, CiUser, CiHeart, CiShoppingCart } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown } from "react-icons/md";
import { categoryFailure, categoryStart, categorySuccess } from "../redux/slice/catigorySlice";
import Service from '../config/servis';
import { GiFlowerPot, GiHighGrass, GiFruitTree, GiPlantSeed, GiFlowers, GiWateringCan } from "react-icons/gi";
import { PiTreeLight } from "react-icons/pi";
import { FaTree, FaLeaf, FaPepperHot } from 'react-icons/fa'; // Mos iconlar importi

const categoryIcons = [
    FaTree,       // 0 - Flower
    GiFlowerPot,         // 1 - Plants
    GiHighGrass,         // 2 - Leaves
    PiTreeLight,     // 3 - Seedlings
    GiFruitTree,     // 4 - Fruits
    GiPlantSeed,       // 5 - Vegetables
    GiFlowers,
    FaPepperHot,        // 6 - Spices
    GiWateringCan,     // 7 - Eggplants
    // Qo'shimcha iconlar
];

function Navbar() {
    const { categories, isLoading, isError } = useSelector(state => state.category);
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [modalHoveredCategory, setModalHoveredCategory] = useState(null);
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
            const { data } = await Service.getBooksByCategory(categoryId); // Service da kitoblarni olish funktsiyasi kerak
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
            if (width <= 950) {
                setVisibleCategories([]); // Hide all categories
            } else if (width <= 1000) {
                setVisibleCategories(categories.slice(0, 5)); // Show only the first 5 categories
            } else if (width <= 1100) {
                setVisibleCategories(categories.slice(0, 6)); // Show the first 6 categories
            } else if (width <= 1200) {
                setVisibleCategories(categories.slice(0, 7)); // Show the first 7 categories
            } else if (width <= 1300) {
                setVisibleCategories(categories.slice(0, 8)); // Show the first 8 categories
            } else {
                setVisibleCategories(categories); // Show all categories
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

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div className='navbar_c'>
            <div className="navbar">
                <NavLink to={"/"}>
                    <div className='Logo'>
                        <p className='Logo1'>FLOWERS</p>
                        <p className='Logo2'>GARDENING PLANTS</p>
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
                        <p>
                            <CiUser className='icon' />
                            Kirish uchun
                        </p>
                    </NavLink>
                    <NavLink to="/favorites">
                        <p>
                            <CiHeart className='icon' />
                            Sevimlilar
                        </p>
                    </NavLink>
                    <NavLink to="/cart">
                        <p>
                            <CiShoppingCart className='icon' />
                            Savat
                        </p>
                    </NavLink>
                </div>
            </div>
            <div className='catigoriyalar'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error: {isError}</p>
                ) : (
                    <>
                        {visibleCategories.map((category, index) => {
                            const Icon = categoryIcons[index] || FaLeaf;
                            return (
                                <div key={category._id}>
                                    <NavLink to={`/category/${category._id}`} className="category-link">
                                        <Icon className='category-icon size-5' />
                                        {category.nomi}
                                    </NavLink>
                                </div>
                            );
                        })}
                        <button className='flex items-center gap-1' onClick={toggleModal}>Yana <MdKeyboardArrowDown className='size-5' /></button>
                    </>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div ref={modalRef} className='modal'>
                    <div className='modal_content'>
                        <span className='close' onClick={toggleModal}>&times;</span>
                        <h2>Kategoriyalar</h2>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : isError ? (
                            <p>Error: {isError}</p>
                        ) : (
                            <ul className='modalcatigory'>
                                {categories?.map((category, index) => {
                                    const Icon = categoryIcons[index] || FaLeaf; // Default icon
                                    return (
                                        <li
                                            key={category?._id}
                                            onMouseEnter={() => {
                                                setModalHoveredCategory(category._id);
                                                fetchCategoryBooks(category._id);
                                            }}
                                            onMouseLeave={() => {
                                                setModalHoveredCategory(null);
                                                setCategoryBooks([]);
                                            }}>
                                            <NavLink to={`/category/${category?._id}`} className="category-link">
                                                <Icon className='category-icon size-7' />
                                                {category?.nomi}
                                            </NavLink>
                                            {modalHoveredCategory === category._id && (
                                                <div className='books-list'>
                                                    {loadingBooks ? (
                                                        <p>Loading books...</p>
                                                    ) : (
                                                        categoryBooks.map((book) => (
                                                            <div key={book._id} className='book-item'>
                                                                <p>{book.nomi}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;
