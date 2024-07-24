import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../firebase";
import "../../styles/screens/userHome.css";
import { BiDetail, BiSolidEditAlt } from "react-icons/bi";

export default function HomeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const usersRef = realtimeDB.ref(`user-review-sections`);
    usersRef
      .orderByChild("reviewer/id")
      .equalTo(id)
      .on("value", (snapshot) => {
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
          setUser(dataArray);
        }
      });

    return () => {
      usersRef.off();
    };
  }, [id]);

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

  const handleOpenSection = (sectionId) => {
    navigate(`/user/${id}/${sectionId}`);
  };

  return (
    <table className="user-table-container">
      <thead>
        <tr className="user-table-header">
          <th className="num">#</th>
          <th>Tên đợt đánh giá</th>
          <th>Năm học</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Nhân sự được đánh giá</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {user.map((item, index) => (
          <tr
            key={index}
            className={`user-table-item ${index % 2 !== 0 ? "odd" : ""}`}
          >
            <td>{index + 1}</td>
            <td>{item.reviewName}</td>
            <td>{item.year}</td>
            <td>{item.startDate}</td>
            <td>{item.endDate}</td>
            <td>{item.beReviewed.name}</td>
            <td>{item.state}</td>
            <td style={{ display: "flex", justifyContent: "flex-end" }}>
              {item.state === "Chưa xong" ? (
                <button
                  className="section-button uncompleted"
                  onClick={() => {
                    handleOpenSection(item.reviewSectionId);
                  }}
                >
                  <BiSolidEditAlt className="section-icon" />
                  Làm
                </button>
              ) : item.state === "Đã xong" ? (
                <button className="section-button completed">
                  <BiDetail className="section-icon" />
                  Xem lại
                </button>
              ) : item.state === "Chưa bắt đầu" ? (
                <button className="section-button upcoming">
                  <BiSolidEditAlt className="section-icon" />
                  Làm
                </button>
              ) : (
                <button className="section-button expired">Chưa làm</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
