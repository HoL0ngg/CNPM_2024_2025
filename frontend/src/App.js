import React, { useState } from "react";
import FoodMenu from "./components/FoodMenu";
import Login from "./components/Login"; // 👈 thêm dòng này
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    console.log("Data nhận được:", userData); // 👈 Kiểm tra tại đây
    setUser(userData); // Lưu user sau khi đăng nhập thành công
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <h3>Chào {user.username}</h3>
          <FoodMenu />
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
