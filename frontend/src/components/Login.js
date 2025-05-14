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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Đăng nhập</h2>
      <input
        type="text"
        name="username"
        placeholder="Tên đăng nhập"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}

export default Login;
