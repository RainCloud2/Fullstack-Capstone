export default function Card({
  title,
  description,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        marginTop: "20px",
        border: "1px solid #e5e5e5",
      }}
    >
      <h3>{title}</h3>

      <p
        style={{
          marginTop: "10px",
          color: "#555",
        }}
      >
        {description}
      </p>
    </div>
  );
}