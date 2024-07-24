import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

function checkBlank(unitName) {
  if (unitName.trim() === "") {
    return true;
  }
  return false;
}

function checkExistUnit(name) {
  return new Promise((resolve, reject) => {
    const userRef = realtimeDB.ref("units");
    userRef
      .once("value")
      .then((snapshot) => {
        const units = snapshot.val();
        for (let key in units) {
          if (units[key].unitName === name) {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu units:", error);
        reject(error);
      });
  });
}

export default function AddUnit() {
  const [formData, setFormData] = useState({
    unitName: "",
    leader: "",
  });

  const [formErrors, setFormErrors] = useState({
    showUnitNameError: false,
  });

  const [users, setUsers] = useState([]);

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
        setUsers(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

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

  const handleAddButton = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showUnitNameError: formData.unitName.trim() === "",
    }));

    if (!checkBlank(formData.unitName)) {
      checkExistUnit(formData.unitName)
        .then((exists) => {
          if (exists) {
            toast.error("Đơn vị đã tồn tại!");
            console.error("Đơn vị đã tồn tại!");
          } else {
            try {
              const leaderPart = formData.leader.split("-");
              const leaderName = leaderPart[0];
              const leaderId = leaderPart.slice(1, leaderPart.length).join(" ");

              const newUnitId = realtimeDB
                .ref("units")
                .child("unit")
                .push().key;

              realtimeDB.ref("units/" + newUnitId).set({
                id: newUnitId,
                unitName: formData.unitName,
                leaderName: leaderName,
                leaderId: leaderId,
              });

              navigate("/admin/unit");
              toast.success("Tạo đơn vị thành công!");
              console.log("Tạo đơn vị thành công!");
            } catch (error) {
              toast.error("Lỗi tạo đơn vị:", error);
            }
          }
        })
        .catch((error) => {
          toast.error("Lỗi:", error);
        });
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
          <option value="">Chọn trưởng đơn vị</option>
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
        onClick={handleAddButton}
      >
        Tạo đơn vị
      </button>
    </div>
  );
}
