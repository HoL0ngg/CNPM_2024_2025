import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ConfirmModal = ({ cartItems, subtotal, tax, total, onCloseCheckoutConfirm, onOpenCheckoutContent, paymentMethod, customerInfo, onCloseCheckoutModal, handleOrderConfirmed }) => {

  console.log("cartItems", cartItems);
  console.log("subtotal", subtotal);
  console.log("tax", tax);
  console.log("total", total);
  console.log("paymentMethod", paymentMethod);
  console.log("cusomerInfo", customerInfo);
  if(paymentMethod === 'banking') {
    paymentMethod = 'Chuyển khoản ngân hàng';
  }
  else if(paymentMethod === 'momo') {
    paymentMethod = 'Ví MoMo';
  }
  else if(paymentMethod === 'cash') {
    paymentMethod = 'Tiền mặt khi nhận hàng';
  }

  const handleCheckoutConfirm = async () => {
    toast.success("Đơn hàng đã được xác nhận", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined,
    });
    // alert('Đơn đã được xác nhận!');
    onCloseCheckoutConfirm();
    onCloseCheckoutModal();
    handleOrderConfirmed(); //set giỏ hàng thành mảng rỗng

    const dataOrder = {
      customer: {
        name: customerInfo.name,
        phone: customerInfo.phone,
      },
      order: {
        totalPrice: total + tax,
        method: paymentMethod,
      },
      detailOrder: cartItems
    }

    console.log(dataOrder);
    let response = await axios.post('/order', dataOrder, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
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
            <div className="checkout-info-value">{ customerInfo.name }</div>
          </div>
          <div className="checkout-info-row">
            <div className="checkout-info-label">Số điện thoại:</div>
            <div className="checkout-info-value">{ customerInfo.phone }</div>
          </div>


          <div className="checkout-info-row">
            <div className="checkout-info-label">Phương thức thanh toán:</div>
            <div className="checkout-info-value">
              { paymentMethod }
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