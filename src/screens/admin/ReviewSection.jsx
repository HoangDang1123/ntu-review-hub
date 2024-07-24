import React, { useEffect, useState } from "react";
import "../../styles/screens/item.css";
import { realtimeDB } from "../../firebase";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CgAddR } from "react-icons/cg";
import { toast } from "react-toastify";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";

export default function ReviewSectionScreen() {
  const [data, setData] = useState([]);
  // const [user, setUser] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveModal(/^\/admin\/review-section\//.test(location.pathname)); // Lấy tất cả đường dẫn sau
  }, [location.pathname]);

  useEffect(() => {
    const userRef = realtimeDB.ref("review-sections");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setData(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      realtimeDB.ref("review-sections").child(id).remove();

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
      .once("value")
      .then((snapshot) => {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].id === id) {
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

  const handleOpenAddForm = async () => {
    navigate("/admin/review-section/add-review-section");
  };

  const handleOpenEditForm = async (e, id) => {
    e.stopPropagation();
    navigate(`/admin/review-section/edit-review-section/${id}`);
  };

  const handleOpenDetail = async (id) => {
    navigate(`/admin/detail-review-section/${id}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className={`page-container unit ${activeModal ? "activeForm" : ""}`}>
        <label className="page-label">Đợt đánh giá</label>

        <div className="title-container">
          <label className="title-label">Danh sách đợt đánh giá</label>
          <button className="add-button" onClick={handleOpenAddForm}>
            <CgAddR className="add-icon" />
            Thêm
          </button>
        </div>

        <table className="table-container">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Tên đợt đánh giá</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Ghi chú</th>
              <th>Năm học</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="tr-container"
                onClick={() => handleOpenDetail(item.id)}
              >
                <td>{index + 1}</td>
                <td>{item.reviewName}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.note}</td>
                <td>{item.year}</td>
                <td>
                  <div className="item-button-container">
                    <button
                      className="item-button delete"
                      onClick={(e) => handleDelete(e, item.id)}
                    >
                      <RiDeleteBin6Fill className="item-icon" />
                      Xóa
                    </button>

                    <button
                      className="item-button edit"
                      onClick={(e) => handleOpenEditForm(e, item.id)}
                    >
                      <GrEdit className="item-icon" />
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="outlet-container review-container">
        <Outlet />
      </div>
    </div>
  );
}
