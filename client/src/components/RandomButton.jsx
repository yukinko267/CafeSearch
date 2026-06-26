import React from "react";

const RandomButton = ({ onClick }) => (
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      ランダムで表示
    </button>
  </div>
);

export default RandomButton;
