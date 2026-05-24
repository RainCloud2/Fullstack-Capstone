import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupPage() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [dob,setDob] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = () => {

    if(!name || !dob || !email || !password){
      alert("Please complete all fields.");
      return;
    }

    navigate("/onboarding");
  };

  return (
    <div
      style={{
        position:"fixed",
        inset:0,
        display:"flex",
        overflow:"hidden",
        background:"#fff",
      }}
    >

      {/* LEFT */}

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
      
      {/* RIGHT */}

      <div
        style={{
          width:"50%",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
        }}
      >
        <div
          style={{
            width:"420px",
            maxWidth:"90%",
          }}
        >
          <h1
            style={{
              fontSize:"42px",
              fontFamily:"Playfair Display",
              marginBottom:"10px",
            }}
          >
            Sign up
          </h1>

          <p
            style={{
              color:"#999",
              marginBottom:"28px",
              fontFamily:"Poppins",
            }}
          >
            Sign up to continue using StudySync AI.
          </p>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            style={inputStyle}
          />

          <p
            style={{
              marginBottom:"8px",
              color:"#666",
              fontFamily:"Poppins",
              fontSize:"14px",
            }}
          >
            Date of Birth
          </p>

          <input
            type="date"
            value={dob}
            onChange={(e)=>setDob(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={handleSignup}
            style={buttonStyle}
          >
            Sign up
          </button>

          <div
            style={{
              display:"flex",
              alignItems:"center",
              margin:"22px 0",
            }}
          >
            <div style={{
              flex:1,
              height:"1px",
              background:"#D9D9D9",
            }}/>

            <p
              style={{
                margin:"0 12px",
                color:"#999",
              }}
            >
              or
            </p>

            <div style={{
              flex:1,
              height:"1px",
              background:"#D9D9D9",
            }}/>
          </div>

          <button
            style={{
              ...buttonStyle,
              background:"white",
              color:"#111",
              border:"1px solid #D9D9D9",
            }}
          >
            Continue with Google
          </button>

          <p
            style={{
              textAlign:"center",
              marginTop:"24px",
              color:"#666",
              fontFamily:"Poppins",
            }}
          >
            Already have an account?{" "}

            <Link
              to="/"
              style={{
                color:"#23470F",
                textDecoration:"none",
                fontWeight:"600",
              }}
            >
              Sign in
            </Link>

          </p>

        </div>
      </div>

    </div>
  );
}

const inputStyle = {
  width:"100%",
  height:"58px",
  marginBottom:"18px",
  borderRadius:"14px",
  border:"1px solid #D9D9D9",
  paddingLeft:"18px",
  fontSize:"15px",
  fontFamily:"Poppins",
  outline:"none",
  boxSizing:"border-box",
};

const buttonStyle = {
  width:"100%",
  height:"58px",
  background:"#23470F",
  color:"white",
  border:"none",
  borderRadius:"14px",
  fontSize:"18px",
  fontWeight:"600",
  cursor:"pointer",
  fontFamily:"Poppins",
};