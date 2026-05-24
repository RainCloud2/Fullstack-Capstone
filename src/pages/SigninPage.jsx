import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SigninPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (!email || !password) {
      alert("Please fill email and password.");
      return;
    }

    navigate("/onboarding");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* LEFT SIDE */}

      <div
        style={{
          width: "50%",
          minWidth: 0,
          background: "#23470F",
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "12px",
          overflow: "hidden",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: "40px",
              color: "white",
              marginBottom: "8px",
            }}
          >
            StudySync AI
          </h1>

          <p
            style={{
              color: "white",
              fontFamily: "Poppins",
              fontSize: "17px",
            }}
          >
            Accessible & Adaptive Learning
          </p>
        </div>

        {[
          ["Belajar sesuai levelmu","AI menyesuaikan materi berdasarkan skill kamu saat ini."],
          ["Roadmap yang jelas","Dari onboarding quiz hingga jadi engineer profesional."],
          ["Rekomendasi course","Kursus terbaik dari berbagai platform, rekomendasi untukmu."]
        ].map(([title,text],i)=>(
          <div
            key={i}
            style={{
              background:"#81956D",
              borderRadius:"22px",
              padding:"16px",
              width:"85%",
            }}
          >
            <h2
              style={{
                color:"white",
                fontFamily:"Playfair Display",
                fontSize:"22px",
                marginBottom:"8px",
              }}
            >
              {title}
            </h2>

            <p
              style={{
                color:"white",
                lineHeight:"1.5",
                fontFamily:"Poppins",
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}

      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            width: "420px",
            maxWidth: "90%",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "10px",
              fontFamily: "Playfair Display",
              color: "#1E1E1E",
            }}
          >
            Sign in
          </h1>

          <p
            style={{
              color: "#9A9A9A",
              marginBottom: "28px",
              fontSize: "16px",
              fontFamily: "Poppins",
            }}
          >
            Please login to continue to your account
          </p>

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={inputStyle}
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={inputStyle}
          />

          {/* CHECKBOX */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <input
              type="checkbox"
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#23470F",
              }}
            />

            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "#444",
              }}
            >
              Keep me logged in
            </p>
          </div>

          {/* BUTTON */}

          <button
            onClick={handleLogin}
            style={buttonStyle}
          >
            Sign in
          </button>

          {/* OR */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "22px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#D9D9D9",
              }}
            />

            <p
              style={{
                margin: "0 12px",
                color: "#9A9A9A",
                fontFamily: "Poppins",
                fontSize: "14px",
              }}
            >
              or
            </p>

            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#D9D9D9",
              }}
            />
          </div>

          {/* GOOGLE */}

          <button
            style={{
              ...buttonStyle,
              backgroundColor: "white",
              color: "#1E1E1E",
              border: "1px solid #D9D9D9",
            }}
          >
            Sign in with Google
          </button>

          {/* SIGNUP */}

          <p
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontFamily: "Poppins",
              color: "#666",
              marginTop: "24px",
            }}
          >
            Need an account?{" "}

            <Link
              to="/signup"
              style={{
                color: "#23470F",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "58px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid #D9D9D9",
  paddingLeft: "18px",
  fontSize: "15px",
  fontFamily: "Poppins",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  height: "58px",
  backgroundColor: "#23470F",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "22px",
  fontFamily: "Poppins",
};