import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules"; // Import module Navigation
import Cart from "./Cart";
import "@fortawesome/fontawesome-free/css/all.min.css";
import garan from "../assets/images/ga_ran.png";
import miy from "../assets/images/mi_y.png";
import nuocngot from "../assets/images/nuoc_ngot.png";
import ProductDetail from "./ProductDetail"; // import component chi tiết sản phẩm

import burger from "../assets/images/hamburger.png";
import nuoccam from "../assets/images/nuoccam.png";
import cocacola from "../assets/images/cocacola.png";
import banhtrangtron from "../assets/images/banhtrangtron.png";
import mixao from "../assets/images/mixao.png";
import welcome from "../assets/images/welcome.png";

const FoodMenu = () => {
  // const [cartItems, setCartItems] = useState([
  //   { id: 1, name: "Bánh burger", price: 20000, quantity: 1 },
  //   { id: 2, name: "Nước ngọt", price: 20000, quantity: 1 },
  //   { id: 3, name: "Mỳ ý", price: 20000, quantity: 1 },
  // ]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setselectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  const handleOrderConfirmed = () => {
    setCartItems([]);
  }

  const foodItems = [
    {
      id: 1,
      name: "Bánh burger",
      price: 25000,
      category: "burger",
      imgUrl: burger,
    },
    {
      id: 2,
      name: "Nước ngọt",
      price: 15000,
      category: "drink",
      imgUrl: cocacola,
    },
    {
      id: 3,
      name: "Mỳ ý",
      price: 30000,
      category: "spagetti",
      imgUrl: miy,
    },
    {
      id: 4,
      name: "Bánh tráng trộn",
      price: 10000,
      category: "banhtrangtron",
      imgUrl: banhtrangtron,
    },
    {
      id: 5,
      name: "Nước cam",
      price: 20000,
      category: "drink",
      imgUrl: nuoccam,
    },
    {
      id: 6,
      name: "Mỳ xào",
      price: 20000,
      category: "spagetti",
      imgUrl: mixao,
    },
  ];

  const categories = [
    { id: 0, name: "all", label: "Tất cả", imgUrl: welcome },
    { id: 1, name: "burger", label: "Burger", imgUrl: burger },
    { id: 2, name: "drink", label: "Nước uống", imgUrl: nuocngot },
    { id: 3, name: "spagetti", label: "Mỳ", imgUrl: miy },
    { id: 4, name: "banhtrangtron", label: "Bánh tráng", imgUrl: banhtrangtron },
    { id: 5, name: "chicken", label: "Gà rán", imgUrl: garan },
  ];

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => {
      const cartToppingIds = (cartItem.toppings || []).map((t) => t.id).sort();
      const newToppingIds = (item.toppings || []).map((t) => t.id).sort();
      return (
        cartItem.id === item.id &&
        JSON.stringify(cartToppingIds) === JSON.stringify(newToppingIds)
      );
    });

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) => {
          const cartToppingIds = (cartItem.toppings || [])
            .map((t) => t.id)
            .sort();
          const newToppingIds = (item.toppings || []).map((t) => t.id).sort();
          if (
            cartItem.id === item.id &&
            JSON.stringify(cartToppingIds) === JSON.stringify(newToppingIds)
          ) {
            return { ...cartItem, quantity: cartItem.quantity + item.quantity };
          }
          return cartItem;
        })
      );
    } else {
      setCartItems([...cartItems, { ...item }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const openProductDetail = (item) => {
    setSelectedProduct(item);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const filteredItems = foodItems
    .filter((item) =>
      selectedCategory === "all" || item.category === selectedCategory
    )
    .filter((item) =>
      searchTerm.trim() === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  function getSlidesPerView(){
    const width = window.innerWidth;
    if(width >= 1065) return 5;
    if(width >= 800) return 4;
    if(width >= 650) return 3;
    return 2;
  }

  useEffect(() => {
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="food-menu">
      <div className="header">
        <button className="back-btn">
          <span role="img" aria-label="home">
            🏠
          </span>{" "}
          Back to home
        </button>
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm món ăn ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

      </div>

      <div className="content">
        <div className="menu-section">
          <div className="swiper-container">
            <Swiper
              spaceBetween={20}
              slidesPerView={slidesPerView}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation]}
              className="food-swiper"
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id} style={{ width: "auto" }}>
                  <div
                    className={`food-placeholder ${selectedCategory === category.name ? "active" : ""
                      }`}
                    onClick={() => setselectedCategory(category.name)}
                  >
                    <img src={category.imgUrl} alt={category.label} />
                    <p>{category.label}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-prev">
              <i className="fas fa-arrow-left"></i>
            </div>
            <div className="swiper-button-next">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>


          <div className="food-list">
            <h3>
              {categories
                .find((c) => c.name === selectedCategory)
                ?.label.toUpperCase()}
            </h3>
            <div className="food-grid">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="food-item">
                  <div className="food-image-placeholder">
                    <img src={item.imgUrl} />
                  </div>
                  <p className="food-title">
                    {index + 1}. {item.name}
                  </p>
                  <div className="food-price">
                    <p>{item.price.toLocaleString()}đ</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => openProductDetail(item)}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Cart cartItems={cartItems} updateQuantity={updateQuantity} handleOrderConfirmed={handleOrderConfirmed} />

      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={closeProductDetail}
          addToCart={addToCart}
        />
      )}




    </div>
  );
};

export default FoodMenu;
