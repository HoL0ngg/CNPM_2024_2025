import React, { useState } from 'react';

const ConfirmModal = ({cartItems, subtotal, tax, total, onCloseCheckoutConfirm, onOpenCheckoutContent, paymentMethod, onCloseCheckoutModal, handleOrderConfirmed}) => {

  const handleCheckoutConfirm = () => {
      alert('Đơn đã được xác nhận!');
      onCloseCheckoutConfirm();
      onCloseCheckoutModal();
      handleOrderConfirmed();
  }

    return (
        <div id="checkout-modal-overlay">
          <div id="checkout-modal-container">
            <div id="checkout-close-btn" onClick={() => {
                onCloseCheckoutConfirm();
                onOpenCheckoutContent();
            }}>
              ×
            </div>
            
            <h2 id="checkout-title">Xác nhận đơn món</h2>
            
            <div id="customer-info-section">
              <h3>Thông tin khách hàng</h3>
              <div className="checkout-info-row">
                <div className="checkout-info-label">Họ và tên:</div>
                <div className="checkout-info-value">{}</div>
              </div>
              <div className="checkout-info-row">
                <div className="checkout-info-label">Số điện thoại:</div>
                <div className="checkout-info-value">{}</div>
              </div>
              
              <div className="checkout-info-row">
                <div className="checkout-info-label">Ghi chú:</div>
                <div className="checkout-info-value">{}</div>
              </div>
              
              <div className="checkout-info-row">
                <div className="checkout-info-label">Phương thức thanh toán:</div>
                <div className="checkout-info-value">
                  {paymentMethod === 'cash' && 'Tiền mặt'}
                    {paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
                    {paymentMethod === 'momo' && 'Ví MoMo'}
                </div>
              </div>
            </div>
            
            <div id="checkout-content-wrapper">
              <div id="checkout-items-container">
                <h3>Đơn hàng của bạn</h3>
                <div id="checkout-items-list">
                {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <span className="item-quantity">{item.quantity}x</span>
                        <span className="item-name">{item.name}
                          <small key={item.id}> +{item.price}</small>
                        </span>
                        {item.toppings && item.toppings.length > 0 && (
                          <div className="item-toppings">
                            {item.toppings.map(topping => (
                              <small key={topping.id}>+ {topping.name} +{topping.price}</small>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="item-price">
                          {(
                              item.quantity * (
                              item.price +
                              (item.toppings?.reduce((sum, topping) => sum + topping.price, 0) || 0)
                              )
                          ).toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div id="checkout-calculations-container">
                <div id="checkout-calculations">
                  <div className="checkout-calc-row">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="checkout-calc-row">
                    <span>Thuế (10%):</span>
                    <span>{tax.toLocaleString()}đ</span>
                  </div>
                  <div className="checkout-calc-row checkout-total-row">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="checkout-action-buttons">
              <button type="button" id="checkout-cancel-btn" onClick={() => {
                onCloseCheckoutConfirm()
                onOpenCheckoutContent()
                }}>
                Hủy
              </button>
              <button type="button" id="checkout-confirm-btn" onClick={() => handleCheckoutConfirm()}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      );
};

export default ConfirmModal;