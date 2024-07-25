import React, { useEffect, useState } from "react";
import "../../styles/screens/item.css";
import { realtimeDB } from "../../firebase";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CgAddR } from "react-icons/cg";
import { GrEdit } from "react-icons/gr";
import { toast } from "react-toastify";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function SubjectScreen() {
  const [data, setData] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveModal(/^\/admin\/subject\//.test(location.pathname)); // Lấy tất cả đường dẫn sau
  }, [location.pathname]);

  useEffect(() => {
    const userRef = realtimeDB.ref("subjects");
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

  const handleDelete = async (id) => {
    try {
      realtimeDB.ref("subjects").child(id).remove();

      setData(data.filter((item) => item.id !== id));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  const handleOpenAddForm = async () => {
    navigate("/admin/subject/add-subject");
  };

  const handleOpenEditForm = async (id) => {
    navigate(`/admin/subject/edit-subject/${id}`);
  }

  return (
    <div style={{ position: 'relative', overflowY: "auto" }}>
      <div className={`page-container item ${activeModal ? "activeForm" : ""}`}>
        <label className="page-label">Tổ bộ môn</label>

        <div className="title-container">
          <label className="title-label">Danh sách tổ bộ môn</label>
          <button className="add-button" onClick={handleOpenAddForm}>
            <CgAddR className="add-icon" />
            Thêm
          </button>
        </div>

        <table className="table-container">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Mã tổ bộ môn</th>
              <th>Tên tổ bộ môn</th>
              <th>Đơn vị</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.subjectCode}</td>
                <td>{item.subjectName}</td>
                <td>{item.unit}</td>
                <td>
                  <div className="item-button-container">
                    <button
                      className="item-button delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <RiDeleteBin6Fill className="item-icon" />
                      Xóa
                    </button>
                    <button
                      className="item-button edit"
                      onClick={() => handleOpenEditForm(item.id)}
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
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
}
