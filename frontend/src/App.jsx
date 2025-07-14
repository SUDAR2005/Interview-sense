import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Placements from "./pages/Preparation";
import Chatbot from "./components/Chatbot";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth(); 

  const hideLayoutRoutes = ["/", "/login", "/signup"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="nav-box">
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/preparation/*" element={<Placements />} />

        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/" replace />}
        />
      </Routes>

      {!hideLayout && <Chatbot />}
    </div>
  );
}

export default App;
