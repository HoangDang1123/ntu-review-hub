import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function EditRole() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    roleCode: "",
    roleName: "",
  });

  const [formErrors, setFormErrors] = useState({
    showRoleCodeError: false,
    showRoleNameError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("roles");
    userRef
      .once("value")
      .then((snapshot) => {
        const roles = snapshot.val();
        for (let key in roles) {
          if (roles[key].id === id) {
            setFormData(() => ({
              roleCode: roles[key].roleCode,
              roleName: roles[key].roleName,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu roles:", error);
      });
  }, [id]);

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
      showRoleCodeError: formData.roleCode.trim() === "",
      showRoleNameError: formData.roleName.trim() === "",
    }));

    try {
      realtimeDB.ref("roles/" + id).set({
        id: id,
        roleCode: formData.roleCode,
        roleName: formData.roleName,
      });

      navigate("/admin/role");
      toast.success("Lưu chức vụ thành công!");
      console.log("Lưu chức vụ thành công!");
    } catch (error) {
      toast.error("Lỗi lưu chức vụ:", error);
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
        {formErrors.showSubjectCodeError && (
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
        {formErrors.showSubjectNameError && (
          <label className="error-label">* Hãy nhập tên chức vụ</label>
        )}
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleEditButton}
      >
        Lưu chức vụ
      </button>
    </div>
  );
}
