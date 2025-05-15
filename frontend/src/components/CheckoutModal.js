import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';

const CheckoutModal = ({ onClose, cartItems, onCloseCheckoutModal, handleOrderConfirmed }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCheckoutContent, setShowCheckoutContent] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });

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

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    // console.log(customerInfo);
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
  };

  const handleConfirmCheckout = () => {
    // console.log(customerInfo);

    // Kiểm tra dữ liệu trước khi cho phép thanh toán
    if (!customerInfo.name.trim()) {
      toast.error("❌ Vui lòng nhập họ tên!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!customerInfo.phone.trim()) {
      toast.error("❌ Vui lòng nhập số điện thoại!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Kiểm tra định dạng số điện thoại (10 số, bắt đầu bằng 0)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast.error("❌ Số điện thoại không hợp lệ!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!paymentMethod) {
      toast.error("❌ Vui lòng chọn phương thức thanh toán!", {
        position: "top-right",
        autoClose: 4000,
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
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <div className="customer-info">
                  <h3>Thông tin khách hàng</h3>
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Nhập họ và tên của bạn"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Nhập số điện thoại của bạn"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                    />
                  </div>
                </div>

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
                        onChange={handlePaymentMethodChange}
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
                        onChange={handlePaymentMethodChange}
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
                        onChange={handlePaymentMethodChange}
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
            customerInfo={customerInfo} 
            onCloseCheckoutModal={onCloseCheckoutModal}
            handleOrderConfirmed={handleOrderConfirmed}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;