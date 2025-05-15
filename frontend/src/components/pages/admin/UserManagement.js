// src/pages/admin/UserManagement.js
import React from "react";
import AdminLayout from "../../layouts/AdminLayout";

const UserManagement = () => {
  return (
    <AdminLayout>
      <main className="main-content">
        <header>
          <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <select>
              <option>Tất cả</option>
              <option>Admin</option>
              <option>Nhân viên</option>
            </select>
            <input type="text" placeholder="Tìm kiếm" />
            <button className="add-user-btn">Thêm người dùng</button>
          </div>
        </header>
        <section className="user-list">
          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {/* Dữ liệu mẫu */}
              <tr>
                <td>1</td>
                <td>admin01</td>
                <td>Nguyễn Văn A</td>
                <td>0123456789</td>
                <td>admin@gmail.com</td>
                <td>Hoạt động</td>
                <td>Admin</td>
                <td>
                  <button>Sửa</button>
                  <button>Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </AdminLayout>
  );
};

export default UserManagement;
