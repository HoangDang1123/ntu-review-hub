import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function EditAnswerType() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    answerTypeName: "",
    answerType: "",
  });

  const [formErrors, setFormErrors] = useState({
    showAnswerTypeNameError: false,
    showAnswerTypeError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("answer-types");
    userRef
      .once("value")
      .then((snapshot) => {
        const types = snapshot.val();
        for (let key in types) {
          if (types[key].id === id) {
            setFormData(() => ({
              answerTypeName: types[key].answerTypeName,
              answerType: types[key].answerType,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu answer-types:", error);
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
      showAnswerTypeNameError: formData.answerTypeName.trim() === "",
      showAnswerTypeError: formData.answerType.trim() === "",
    }));

    try {
      realtimeDB.ref("answer-types/" + id).set({
        id: id,
        answerTypeName: formData.answerTypeName,
        answerType: formData.answerType,
      });

      navigate("/admin/answer-type");
      toast.success("Lưu kiểu trả lời thành công!");
      console.log("Lưu kiểu trả lời thành công!");
    } catch (error) {
      toast.error("Lỗi lưu kiểu trả lời:", error);
    }
  };

  return (
    <div className="add-form-container">
      <IoCloseOutline className="close-icon" onClick={handleCloseModal} />
      <div className="form-group">
        <label className="form-label">Tên kiểu trả lời</label>
        <input
          className="form-input"
          placeholder="Nhập tên kiểu trả lời"
          type="text"
          name="answerTypeName"
          value={formData.answerTypeName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showSubjectCodeError && (
          <label className="error-label">* Hãy nhập tên kiểu trả lời</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Kiểu trả lời</label>
        <input
          className="form-input"
          placeholder="Nhập kiểu trả lời"
          type="text"
          name="answerType"
          value={formData.answerType}
          onChange={handleInputChange}
          required
        />
        {formErrors.showSubjectNameError && (
          <label className="error-label">* Hãy nhập kiểu trả lời</label>
        )}
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleEditButton}
      >
        Lưu kiểu trả lời
      </button>
    </div>
  );
}
