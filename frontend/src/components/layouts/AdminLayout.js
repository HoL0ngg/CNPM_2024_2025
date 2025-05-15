import React from "react";
// import "./AdminLayout.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Logo</h2>
        <ul>
          <li>
            <span>
              <i className="fa-solid fa-user"></i>
            </span>
            Quản lý người dùng
          </li>
        </ul>
        <div className="admin-info">
          <p>
            Xin chào: <strong>admin</strong>
          </p>
          <button className="logout-button">🔓 Đăng xuất</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
