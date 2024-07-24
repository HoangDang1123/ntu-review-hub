import React from "react";
import "../styles/components/thumbnail.css"

export default function Thumbnail() {
  return (
    <div className="thumb-container">
      <img
        src={require("../assets/images/thumbnail.jpg")}
        alt="Nha Trang University Thumbnail"
        className="thumb-image"
      />
    </div>
  );
}
