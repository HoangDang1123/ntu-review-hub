import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function EditUnit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    unitName: "",
    leader: "",
  });

  const [formErrors, setFormErrors] = useState({
    showUnitNameError: false,
    showLeaderError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("units");
    userRef
      .once("value")
      .then((snapshot) => {
        const units = snapshot.val();
        for (let key in units) {
          if (units[key].id === id) {
            if (units[key].leaderName !== "") {
              setFormData(() => ({
                unitName: units[key].unitName,
                leader: `${units[key].leaderName} - ${units[key].leaderId}`,
              }));
              break;
            } else {
              setFormData(() => ({
                unitName: units[key].unitName,
                leader: "",
              }));
              break;
            }
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu users:", error);
      });
  }, [id]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userRef = realtimeDB.ref("users");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data)
          .filter(
            (key) =>
              data[key].role === "user" && data[key].unit === formData.unitName
          )
          .map((key) => ({
            ...data[key],
          }));
        setUsers(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, [formData.unitName]);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [`show${name.charAt(0).toUpperCase() + name.slice(1)}Error`]:
        value.trim() === "",
    }));
  };

  const handleCloseModal = async (e) => {
    e.preventDefault();

    navigate(-1);
  };

  const handleEditButton = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showUnitNameError: formData.unitName.trim() === "",
    }));

    try {
      const leaderPart = formData.leader.split("-");
      const leaderName = leaderPart[0];
      const leaderId = leaderPart.slice(1, leaderPart.length).join(" ");

      realtimeDB.ref("units/" + id).set({
        id: id,
        unitName: formData.unitName,
        leaderName: leaderName,
        leaderId: leaderId,
      });

      navigate("/admin/unit");
      toast.success("Lưu đơn vị thành công!");
      console.log("Lưu đơn vị thành công!");
    } catch (error) {
      toast.error("Lỗi lưu đơn vị:", error);
    }
  };

  return (
    <div className="add-form-container">
      <IoCloseOutline className="close-icon" onClick={handleCloseModal} />
      <div className="form-group">
        <label className="form-label">Tên đơn vị</label>
        <input
          className="form-input"
          placeholder="Nhập tên đơn vị"
          type="text"
          name="unitName"
          value={formData.unitName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showUnitNameError && (
          <label className="error-label">* Hãy nhập tên đơn vị</label>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Tên trưởng đơn vị</label>
        <select
          className="form-select"
          name="leader"
          value={formData.leader}
          onChange={handleInputChange}
        >
          {formData.leader === "" && (
            <option value="">Chọn tên trưởng đơn vị</option>
          )}
          {users.map((item) => (
            <option
              key={item.loginId}
              value={item.fullName}
            >{`${item.lastName} ${item.firstName} - ${item.loginId}`}</option>
          ))}
        </select>
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleEditButton}
      >
        Lưu
      </button>
    </div>
  );
}
