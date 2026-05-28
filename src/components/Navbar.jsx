import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      <h2>StudySync AI</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/home">Home</Link>

        <p>Roadmap</p>

        <p>Quiz</p>

        <p>Course</p>
      </div>

      <div>User</div>
    </nav>
  );
}