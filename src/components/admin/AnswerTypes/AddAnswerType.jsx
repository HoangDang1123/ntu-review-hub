import React, { useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

function checkBlank(name, type) {
  if (
    name.trim() === "" ||
    type.trim() === ""
  ) {
    return true;
  }
  return false;
}

function checkExistType(name) {
  return new Promise((resolve, reject) => {
    const userRef = realtimeDB.ref("answer-types");
    userRef
      .once("value")
      .then((snapshot) => {
        const types = snapshot.val();
        for (let key in types) {
          if (types[key].name === name) {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu answer-types:", error);
        reject(error);
      });
  });
}

export default function AddAnswerType() {
  const [formData, setFormData] = useState({
    answerTypeName: "",
    answerType: "",
  });

  const [formErrors, setFormErrors] = useState({
    showAnswerTypeNameError: false,
    showAnswerTypeError: false,
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
      showAnswerTypeNameError: formData.answerTypeName.trim() === "",
      showAnswerTypeError: formData.answerType.trim() === "",
    }));

    if (
      !checkBlank(formData.answerTypeName, formData.answerType)
    ) {
      checkExistType(formData.answerTypeName)
        .then((exists) => {
          if (exists) {
            toast.error("Kiểu trả lời đã tồn tại!");
            console.error("Kiểu trả lời đã tồn tại!");
          } else {
            try {
              const newTypeId = realtimeDB
                .ref("answer-types")
                .child("answer-type")
                .push().key;

              realtimeDB.ref("answer-types/" + newTypeId).set({
                id: newTypeId,
                answerTypeName: formData.answerTypeName,
                answerType: formData.answerType,
              });

              navigate("/admin/answer-type");
              toast.success("Tạo kiểu trả lời thành công!");
              console.log("Tạo kiểu trả lời thành công!");
            } catch (error) {
              toast.error("Lỗi tạo kiểu trả lời:", error);
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
        {formErrors.showAnswerTypeNameError && (
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
        {formErrors.showAnswerTypeError && (
          <label className="error-label">* Hãy nhập kiểu trả lời</label>
        )}
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleAddButton}
      >
        Tạo kiểu trả lời
      </button>
    </div>
  );
}
