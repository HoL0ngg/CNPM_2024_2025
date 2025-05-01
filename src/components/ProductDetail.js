import React, { useState, useEffect } from "react";
import cheese from "../assets/images/cheese.png";
import omelette from "../assets/images/omelette.png";
import chickentopping from "../assets/images/chickentopping.png";
const ProductDetail = ({ product, addToCart, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(product.price);

  const toppings = [
    { id: "cheese", name: "Phô mai", price: 7000, image: cheese },
    { id: "omelette", name: "Trứng", price: 7000, image: omelette },
    { id: "chickentopping", name: "Gà", price: 10000, image: chickentopping },
  ];

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  // Tính tổng giá dựa trên số lượng và topping
  useEffect(() => {
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find((t) => t.id === toppingId);
      return total + (topping ? topping.price : 0);
    }, 0);
    setTotalPrice((product.price + toppingsPrice) * quantity);
  }, [selectedToppings, quantity, product.price]);

  const handleAddToCart = () => {
    const selectedToppingsDetail = toppings
      .filter((topping) => selectedToppings.includes(topping.id))
      .map((topping) => ({
        id: topping.id,
        name: topping.name,
        price: topping.price,
      }));

    const updatedProduct = {
      ...product,
      quantity,
      toppings: selectedToppingsDetail,
      totalPrice,
    };
    addToCart(updatedProduct);
    onClose();
  };

  return (
    <div className="product-detail-modal">
      <div className="product-detail-content">
        <div className="close-btn" onClick={onClose}>
          x
        </div>
        <div className="left-section">
          <img src={product.imgUrl} alt={product.name} className="main-image" />
        </div>

        <div className="right-section">
          <h2>{product.name}</h2>
          <p className="subtext">Ngon hơn khi ăn kèm</p>

          <div className="topping-container">
            {toppings.map((topping) => (
              <div key={topping.id} className="topping-item">
                <input
                  type="checkbox"
                  checked={selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingChange(topping.id)}
                />
                <span className="topping-img">
                  <img src={topping.image} />
                </span>
                <span className="topping-name">{topping.name}</span>
                <span className="topping-price">
                  + {topping.price.toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>

          <p className="unit-price">
            <strong>Giá: </strong> {product.price.toLocaleString()}đ
          </p>

          <div className="quantity-control">
            <span>Số lượng</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              −
            </button>
            <span className="qty">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>＋</button>
          </div>

          <p className="total-price">
            <strong>Tổng cộng: </strong>{" "}
            <span>{totalPrice.toLocaleString()}đ</span>
          </p>

          <button className="add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
