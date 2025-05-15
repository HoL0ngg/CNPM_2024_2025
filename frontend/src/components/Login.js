import React, { useState } from "react";
import { toast } from "react-toastify";

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Đăng nhập thất bại");
      } else {
        toast.success(result.message);
        console.log("User nhận được từ server:", result.userData);
        onLoginSuccess(result.userData); // ✅ Gọi đúng props
      }
    } catch (err) {
      toast.error("Lỗi kết nối đến server");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="frm-Login">
      <div className="form-title">
        <h2>ĐĂNG NHẬP</h2>
      </div>

      <div className="input-field">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="username">
          <i class="fa-solid fa-user"></i>Tên đăng nhập
        </label>
      </div>

      <div className="input-field">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">
          <i className="fa-solid fa-lock"></i> Mật khẩu
        </label>
      </div>

      <div className="input-btn-wrapper">
        <button type="submit">Đăng nhập</button>
      </div>
    </form>
  );
}

export default Login;
