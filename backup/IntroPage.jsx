// src/pages/IntroPage.jsx
import "./IntroPage.css";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home"); // move to HomePage
  };

  return (
    <div className="intro-wrapper">
      <div className="intro-logo">AIMind</div>

      <div className="intro-buttons">
        <button className="main-btn" onClick={handleClick}>
          YOUR SAFE SPACE
        </button>

        <button className="arrow-btn" onClick={handleClick}>
          <IoIosArrowForward className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}
