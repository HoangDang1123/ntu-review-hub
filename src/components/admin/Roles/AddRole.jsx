import React, { useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

function checkBlank(roleCode, roleName) {
  if (
    roleCode.trim() === "" ||
    roleName.trim() === ""
  ) {
    return true;
  }
  return false;
}

function checkExistRole(code) {
  return new Promise((resolve, reject) => {
    const userRef = realtimeDB.ref("roles");
    userRef
      .once("value")
      .then((snapshot) => {
        const roles = snapshot.val();
        for (let key in roles) {
          if (roles[key].roleCode === code) {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu roles:", error);
        reject(error);
      });
  });
}

export default function AddRole() {
  const [formData, setFormData] = useState({
    roleCode: "",
    roleName: "",
  });

  const [formErrors, setFormErrors] = useState({
    showRoleCodeError: false,
    showRoleNameError: false,
  });

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
      showRoleCodeError: formData.roleCode.trim() === "",
      showRoleNameError: formData.roleName.trim() === "",
    }));

    if (
      !checkBlank(formData.roleCode, formData.roleName)
    ) {
      checkExistRole(formData.roleCode)
        .then((exists) => {
          if (exists) {
            toast.error("Chức vụ đã tồn tại!");
            console.error("Chức vụ đã tồn tại!");
          } else {
            try {
              const newRoleId = realtimeDB
                .ref("subjects")
                .child("subject")
                .push().key;

              realtimeDB.ref("roles/" + newRoleId).set({
                id: newRoleId,
                roleCode: formData.roleCode,
                roleName: formData.roleName,
              });

              navigate("/admin/role");
              toast.success("Tạo chức vụ thành công!");
              console.log("Tạo chức vụ thành công!");
            } catch (error) {
              toast.error("Lỗi tạo chức vụ:", error);
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
        <label className="form-label">Mã chức vụ</label>
        <input
          className="form-input"
          placeholder="Nhập mã chức vụ"
          type="text"
          name="roleCode"
          value={formData.roleCode}
          onChange={handleInputChange}
          required
        />
        {formErrors.showRoleCodeError && (
          <label className="error-label">* Hãy nhập mã chức vụ</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Tên chức vụ</label>
        <input
          className="form-input"
          placeholder="Nhập tên chức vụ"
          type="text"
          name="roleName"
          value={formData.roleName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showRoleNameError && (
          <label className="error-label">* Hãy nhập tên chức vụ</label>
        )}
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleAddButton}
      >
        Tạo chức vụ
      </button>
    </div>
  );
}
