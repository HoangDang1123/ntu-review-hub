import React from "react";
import "../../styles/screens/section.css";

export default function SectionTitle({ section }) {
  const currentDate = new Date();
  const leftDate = Math.floor(
    (new Date(section.endDate) - currentDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="section-container section-title-container">
      <div className="section-title">
        <label className="section-label title">{section.reviewName}</label>
        <label>{`Còn lại: ${leftDate} ngày`}</label>
      </div>
      <label
        className="section-label"
        style={{ marginBottom: "5vh" }}
      >{`Nhân sự được đánh giá: ${section.beReviewed.name}`}</label>
      <label>{section.note}</label>
    </div>
  );
}
