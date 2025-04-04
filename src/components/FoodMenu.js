import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules'; // Import module Navigation
import Cart from './Cart';
import '@fortawesome/fontawesome-free/css/all.min.css';

const FoodMenu = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Nước ngọt', price: 20000, quantity: 1 },
        { id: 2, name: 'Bánh burger', price: 20000, quantity: 1 },
        { id: 3, name: 'Mỳ xào', price: 20000, quantity: 1 },
    ]);

    const foodItems = [
        { id: 1, name: 'Bánh burger', price: 20000 },
        { id: 2, name: 'Nước ngọt', price: 20000 },
        { id: 3, name: 'Mỳ xào', price: 20000 },
        { id: 4, name: 'Nước lọc', price: 20000 },
        { id: 5, name: 'Nước cam', price: 20000 },
        { id: 6, name: 'Mỳ xào', price: 20000 },
    ];

    const addToCart = (item) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCartItems(
            cartItems
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + delta }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    return (
        <div className="food-menu">
            <div className="header">
                <button className="back-btn">
                    <span role="img" aria-label="home">🏠</span> Back to home
                </button>
            </div>

            <div className="content">
                <div className="menu-section">
                    <div className="swiper-container">
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={5}
                            loop={true} // Lặp lại vòng tròn
                            navigation={{
                                nextEl: '.swiper-button-next', // Class cho nút next
                                prevEl: '.swiper-button-prev', // Class cho nút prev
                            }}
                            modules={[Navigation]} // Thêm module Navigation
                            className="food-swiper"
                        // Này để responsive
                        // breakpoints={{
                        //     768: {
                        //         slidesPerView: 2,
                        //         spaceBetween: 10,
                        //     },
                        //     480: {
                        //         slidesPerView: 1,
                        //         spaceBetween: 5,
                        //     },
                        // }}
                        >
                            {Array(10)
                                .fill()
                                .map((_, index) => (
                                    <SwiperSlide key={index} style={{ width: 'auto' }}>
                                        <div className="food-placeholder">Mục đồ ăn thứ {index + 1}</div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                        {/* Thêm các nút prev/next tùy chỉnh */}
                        <div className="swiper-button-prev"><i className="fas fa-arrow-left"></i></div>
                        <div className="swiper-button-next"><i className="fas fa-arrow-right"></i></div>
                    </div>

                    <div className="food-list">
                        <h3>FOOD</h3>
                        <div className="food-grid">
                            {foodItems.map((item, index) => (
                                <div key={item.id} className="food-item">
                                    <div className="food-image-placeholder"></div>
                                    <p className='food-title'>{index + 1}. {item.name}</p>
                                    <div className='food-price'>
                                        <p>{item.price.toLocaleString()}đ</p>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => addToCart(item)}
                                        >
                                            <i class="fa-solid fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Cart cartItems={cartItems} updateQuantity={updateQuantity} />
            </div>
        </div>
    );
};

export default FoodMenu;