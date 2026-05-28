export default function Button({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 20px",
        background: "#2D5016",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        fontWeight: "500",
      }}
    >
      {title}
    </button>
  );
}