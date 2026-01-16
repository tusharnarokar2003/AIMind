// src/pages/GoalPage.jsx
import "./GoalPage.css";
import profileImg from "../assets/profileBanner.png"; // your uploaded image
import Navbar from "../components/Navbar";
export default function GoalPage() {
  return (

    <div className="goal-wrapper">
      <Navbar /> 
      {/* Top section */}
      <header className="goal-header">
        <h2 className="brand">AI Mind</h2>
        <p className="safe-space">YOUR <br /> SAFE SPACE</p>
      </header>

      {/* Banner Section */}
      <div className="goal-banner">
        
        <div className="goal-text">
          <h1>Tushar</h1>
          <h1>Narokar</h1>
        </div>

        <div className="goal-image">
          <img src={profileImg} alt="profile" />
        </div>
      </div>






  

    </div>
  );
}
