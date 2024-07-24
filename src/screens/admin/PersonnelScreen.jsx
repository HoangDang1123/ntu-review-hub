import React, { useEffect, useState } from "react";
import "../../styles/screens/personnel.css";
import { realtimeDB } from "../../firebase";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function PersonnelScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userRef = realtimeDB.ref("users");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data)
          .filter((key) => data[key].role === "user")
          .map((key) => ({
            ...data[key],
          }));
        setData(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  const handleDelete = (id) => {
    try {
      realtimeDB.ref("users").child(id).remove();

      const reviewSectionsRef = realtimeDB.ref("review-sections");
      reviewSectionsRef
        .once("value")
        .then((snapshot) => {
          const reviewSections = snapshot.val();
          for (let key in reviewSections) {
            const reviewSection = reviewSections[key];
            for (let reviewerKey in reviewSection.reviewers) {
              if (reviewerKey === id) {
                reviewSectionsRef
                  .child(key)
                  .child("reviewers")
                  .child(reviewerKey)
                  .remove();
              }
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
        });

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
        .once("value")
        .then((snapshot) => {
          const users = snapshot.val();
          for (let key in users) {
            if (users[key].reviewer.id === id) {
              userRef.child(key).remove();
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
        });

      setData(data.filter((item) => item.id !== id));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  return (
    <div className="page-container">
      <label className="page-label">Nhân sự</label>
      <label className="title-label">Danh sách nhân sự</label>

      <table className="table-container">
        <thead>
          <tr>
            <th className="num">#</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Mã số đăng nhập</th>
            <th>Chức vụ</th>
            <th>Đơn vị</th>
            <th>Tổ bộ môn</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.lastName}</td>
              <td>{item.firstName}</td>
              <td>{item.loginId}</td>
              <td>{item.personnel}</td>
              <td>{item.unit}</td>
              <td>{item.subject}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  <RiDeleteBin6Fill className="delete-icon" />
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
