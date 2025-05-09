import React from 'react';
import FoodMenu from './components/FoodMenu';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <FoodMenu />
      <ToastContainer />
    </div>
  );
}

export default App;