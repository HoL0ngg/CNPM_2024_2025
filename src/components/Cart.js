import React from "react";
import CheckoutModal from "./CheckoutModal";
import { useState } from "react";

const Cart = ({ cartItems, updateQuantity }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);  

  const openCheckoutModal = () => {
    setShowCheckoutModal(true);
  }
  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  }
  const handleCheckout = () => {
    if(cartItems.length === 0) {
      alert("Đặt món đi bạn êy");
      return;
    }
    setShowCheckoutModal(true);
  }


  // Tính tổng tiền từng item bao gồm topping
  const getItemTotalPrice = (item) => {
    const toppingTotal =
      item.toppings?.reduce((sum, topping) => sum + topping.price, 0) || 0;
    return (item.price + toppingTotal) * item.quantity;
  };
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + getItemTotalPrice(item),
    0
  );
  const tax = total * 0.1;
  const grandTotal = total + tax;

  return (
    <div className="cart">
      <h2>GIỎ HÀNG ({totalQuantity})</h2>
      {/* <h2>GIỎ HÀNG ({cartItems.length})</h2> */}
      <div className="cart-items-container">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-img">
              <img
                src={
                  item.imgUrl ||
                  `https://via.placeholder.com/150?text=${item.name}`
                }
                alt={item.name}
              />
            </div>
            <div className="item-info">
              <p>
                {item.id}. {item.name}
              </p>

              {/* Nếu có topping thì show ra */}
              {item.toppings && item.toppings.length > 0 && (
                <div className="toppings-list">
                  <small>+ Topping:</small>
                  <ul>
                    {item.toppings.map((topping) => (
                      <li key={topping.id}>
                        {topping.name} (+{topping.price.toLocaleString()}đ)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="quantity-controls">
                <div className="quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <div>
                  <p>{item.price.toLocaleString()}đ</p>
                  <p>
                    (inc. tax 10% ={" "}
                    {(getItemTotalPrice(item) * 0.1).toLocaleString()}đ)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>TỔNG CỘNG:</h3>
        <div>
          <p>{grandTotal.toLocaleString()}đ</p>
          <p>(inc. tax 10% = {tax.toLocaleString()}đ)</p>
        </div>
      </div>

      <button className="payment-btn" onClick={() => handleCheckout()}>THANH TOÁN</button>

      {showCheckoutModal && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={closeCheckoutModal}
          
        />
      )}

    </div>

   
  );
};

export default Cart;
