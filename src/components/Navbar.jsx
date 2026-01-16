import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="navbar">
      <nav className="navbar-left">
        <Link to="/home" className="nav-btn">
          Home
        </Link>

        <Link to="/journaling" className="nav-btn">
          Journaling
        </Link>

        <Link to="/chat" className="nav-btn">
          Chat
        </Link>
        
        <Link to="/community" className="nav-btn">
          Community
        </Link>
        
        <Link to="/goal" className="nav-btn">
          Goal
        </Link>
      </nav>

      <div className="navbar-right">
        <div className="nav-logo">AIMind</div>

        <div 
          className="profile-circle"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src="/src/assets/profile.png"
            alt="profile"
          />
          
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="user-initial">{getUserInitial()}</div>
                <div className="user-info">
                  <p className="user-email">{user?.email}</p>
                  <p className="user-label">Signed in</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={handleSignOut} className="sign-out-btn">
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}