import React from 'react';

const Cart = ({ cartItems, updateQuantity }) => {
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = total * 0.1;
    const grandTotal = total + tax;

    return (
        <div className="cart">
            <h2>YOUR CART ({cartItems.length})</h2>
            {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                    <p>
                        {item.id}. {item.name}
                    </p>
                    <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <p>
                        {item.price.toLocaleString()}đ <br />
                        (inc. tax 10% = {(item.price * 0.1).toLocaleString()}đ)
                    </p>
                </div>
            ))}
            <div className="cart-total">
                <h3>TOTAL:</h3>
                <div>
                    <p>{grandTotal.toLocaleString()}đ </p>
                    <p>(inc. tax 10% = {tax.toLocaleString()}đ)</p>
                </div>
            </div>
            <button className="payment-btn">PAYMENT</button>
        </div>
    );
};

export default Cart;