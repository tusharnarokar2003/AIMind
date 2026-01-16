import Navbar from "../components/Navbar";
import "./ChatPage.css";

export default function ComingSoon() {
  return (
    <div className="coming-wrapper">
      <Navbar />

      <div className="coming-content">
        <h1 className="coming-title">Coming Soon</h1>
        <p className="coming-text">
          We’re working hard to bring this feature to you.<br />
          Stay tuned for updates!
        </p>

        <div className="coming-badge">AIMind</div>
      </div>
    </div>
  );
}