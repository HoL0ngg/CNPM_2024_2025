import React, { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      <AppRoutes user={user} onLoginSuccess={handleLoginSuccess} />
      <ToastContainer />
    </div>
  );
}

export default App;
