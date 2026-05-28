export default function InputField({
  type,
  placeholder,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px",
        marginTop: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "15px",
      }}
    />
  );
}