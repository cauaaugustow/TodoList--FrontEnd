import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./login";
import Register from "./register";
import Home from "./home";

import './App.css'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
