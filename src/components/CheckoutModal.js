import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';

const CheckoutModal = ({ onClose, cartItems, onCloseCheckoutModal, handleOrderConfirmed }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCheckoutContent, setShowCheckoutContent] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');

  let subtotal = cartItems.reduce((sum, item) => {
    const toppingTotal = item.toppings?.reduce((sum, topping) => sum + topping.price, 0) || 0;
    return sum + (item.price + toppingTotal) * item.quantity;
  }, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  }
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  }
  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;  // Lấy giá trị của radio button được chọn
    setPaymentMethod(method);  // Cập nhật giá trị của paymentMethod khi người dùng chọn một option
  };
  const handleConfirmCheckout = () => {
    if (!paymentMethod) {
      toast.error("❌ Vui lòng chọn phương thức thanh toán!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    setShowCheckoutContent(false);
    handleShowConfirmModal();
  }


  return (
    <div className="checkout-modal">
      {showCheckoutContent && (
        <div className="checkout-content">
          <div className="close-btn" onClick={() => { onClose() }}>
            x
          </div>

          <h2>Thanh Toán</h2>

          <div className="checkout-sections">
            <div className="left-section">
              <form onSubmit={() => { }}>

                <div className="payment-methods">
                  <h3>Phương thức thanh toán</h3>
                  <div className="payment-options">
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(event) => { handlePaymentMethodChange(event) }}
                      />
                      <label htmlFor="cash">Tiền mặt khi nhận hàng</label>
                    </div>

                    <div className="payment-option">
                      <input
                        type="radio"
                        id="banking"
                        name="paymentMethod"
                        value="banking"
                        checked={paymentMethod === 'banking'}
                        onChange={(event) => { handlePaymentMethodChange(event) }}
                      />
                      <label htmlFor="banking">Chuyển khoản ngân hàng</label>
                    </div>

                    <div className="payment-option">
                      <input
                        type="radio"
                        id="momo"
                        name="paymentMethod"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={(event) => { handlePaymentMethodChange(event) }}
                      />
                      <label htmlFor="momo">Ví MoMo</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="right-section">
              <div className="order-summary">
                <h3>Đơn hàng của bạn</h3>

                <div className="order-items">
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

                <div className="order-calculations">
                  <div className="calc-row">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="calc-row">
                    <span>Thuế (10%):</span>
                    <span>{tax.toLocaleString()}đ</span>
                  </div>
                  <div className="calc-row total">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString()}đ</span>
                  </div>
                </div>

                <button type="submit" className="confirm-order-btn" onClick={() => handleConfirmCheckout()}>
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {showConfirmModal && (
          <ConfirmModal
            cartItems={cartItems}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCloseCheckoutConfirm={handleCloseConfirmModal}
            onOpenCheckoutContent={() => setShowCheckoutContent(true)}
            paymentMethod={paymentMethod} 
            onCloseCheckoutModal={onCloseCheckoutModal}
            handleOrderConfirmed={handleOrderConfirmed}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;