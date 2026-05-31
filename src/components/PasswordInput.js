import React, {useState} from "react";
function PasswordInput({ id, placeholder, value, onChange, onBlur, inputClassName,required, disabled }) {
  const [show, setShow] = useState(false);

  const eyeOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const eyeClosed = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.228 6.228A10.045 10.045 0 002.457 12c1.274 4.057 5.065 7 9.543 7 1.496 0 2.921-.316 4.206-.882M9.878 9.878C9.338 10.418 9 11.17 9 12a3 3 0 003 3c.83 0 1.582-.338 2.122-.878" />
    </svg>
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled ={disabled}
        className={inputClassName || ""}
        style={{
          width: "100%",
          padding: "10px 42px 10px 14px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(79, 70, 229, 0.3)",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#ffffff",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          //borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
      >
        {show ? eyeClosed : eyeOpen}
      </button>
    </div>
  );
}
export default PasswordInput;