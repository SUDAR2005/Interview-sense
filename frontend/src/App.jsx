import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Placements from "./pages/Preparation";
import Chatbot from "./components/Chatbot";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./components/NotFound";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth(); 

  const showLayoutRoutes = ["/home", "/about", "/preparation/", "/preparation/Coding", "/preparation/Interview"];
  const showLayout = showLayoutRoutes.includes(location.pathname);

  return (
    <div className="nav-box">
      {showLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Hide layouts to prevent unautherized access*/}
        <Route path="/home" element={
          isLoggedIn? <Home />: <Navigate to='/' replace/>} />
        <Route path="/about" element={<About />} />

        <Route path="/about" element={
          isLoggedIn? <About />: <Navigate to='/' replace/>} />

        <Route path="/preparation/*" element={
          isLoggedIn? <Placements />: <Navigate to='/' replace/>} />

        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/" replace />}
        />

        <Route
          path="*"
          element={<NotFound/>}
        />

      </Routes>

      {showLayout && <Chatbot />}
    </div>
  );
}

export default App;
