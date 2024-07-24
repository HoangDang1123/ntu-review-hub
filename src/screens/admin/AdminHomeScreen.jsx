import React, { useEffect, useState } from "react";
import { realtimeDB } from "../../firebase";

export default function AdminHomeScreen() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const usersRef = realtimeDB.ref(`user-review-sections`);
    usersRef.on("value", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const dataArray = Object.keys(data).map((key) => {
          const sectionData = data[key];
          let sectionState = sectionData.state;

          if (sectionState !== "Đã xong") {
            sectionState = getStateFromDates(
              sectionData.startDate,
              sectionData.endDate
            );
          }

          return {
            ...sectionData,
            state: sectionState,
          };
        });
        setSections(dataArray);
      }
    });

    return () => {
      usersRef.off();
    };
  }, []);

  function getStateFromDates(startDate, endDate) {
    const currentTime = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentTime >= start && currentTime <= end) {
      return "Chưa xong";
    } else if (currentTime < start) {
      return "Chưa bắt đầu";
    } else {
      return "Hết hạn";
    }
  }

  return (
    <table className="user-table-container">
      <thead>
        <tr className="user-table-header">
          <th className="num">#</th>
          <th>Tên đợt đánh giá</th>
          <th>Năm học</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Nhân sự đánh giá</th>
          <th>Nhân sự được đánh giá</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sections.map((item, index) => (
          <tr
            key={index}
            className={`user-table-item ${index % 2 !== 0 ? "odd" : ""}`}
          >
            <td>{index + 1}</td>
            <td>{item.reviewName}</td>
            <td>{item.year}</td>
            <td>{item.startDate}</td>
            <td>{item.endDate}</td>
            <td>{item.reviewer.name}</td>
            <td>{item.beReviewed.name}</td>
            <td>{item.state}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
