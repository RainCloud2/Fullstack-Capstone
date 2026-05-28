export default function ProgressBar({ progress }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#ddd",
        borderRadius: "20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          background: "#2D5016",
          height: "14px",
          borderRadius: "20px",
        }}
      />
    </div>
  );
}