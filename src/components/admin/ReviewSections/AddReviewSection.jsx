import React, { useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

function checkBlank(reviewName, startDate, endDate, year) {
  if (
    reviewName.trim() === "" ||
    startDate.trim() === "" ||
    endDate.trim() === "" ||
    year.trim() === ""
  ) {
    return true;
  }
  return false;
}

function checkExistReview(name) {
  return new Promise((resolve, reject) => {
    const userRef = realtimeDB.ref("review-sections");
    userRef
      .once("value")
      .then((snapshot) => {
        const reviews = snapshot.val();
        for (let key in reviews) {
          if (reviews[key].reviewName === name) {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu review-sections:", error);
        reject(error);
      });
  });
}

export default function AddReviewSection() {
  const startYear = 2020;
  const endYear = 2030;

  const years = [];
  for (let year = startYear; year < endYear; year++) {
    const yearRange = `${year}-${year + 1}`;
    years.push(yearRange);
  }

  const [formData, setFormData] = useState({
    reviewName: "",
    startDate: "",
    endDate: "",
    note: "",
    year: "",
  });

  const [formErrors, setFormErrors] = useState({
    showReviewNameError: false,
    showStartDateError: false,
    showEndDateError: false,
    showYearError: false,
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
      showReviewNameError: formData.reviewName.trim() === "",
      showStartDateError: formData.startDate.trim() === "",
      showEndDateError: formData.endDate.trim() === "",
      showYearError: formData.year.trim() === "",
    }));

    if (
      !checkBlank(
        formData.reviewName,
        formData.startDate,
        formData.endDate,
        formData.year
      )
    ) {
      checkExistReview(formData.reviewName)
        .then((exists) => {
          if (exists) {
            toast.error("Đợt đánh giá đã tồn tại!");
            console.error("Đợt đánh giá đã tồn tại!");
          } else {
            try {
              const newReviewId = realtimeDB
                .ref("review-sections")
                .child("review-section")
                .push().key;

              realtimeDB.ref("review-sections/" + newReviewId).set({
                id: newReviewId,
                reviewName: formData.reviewName,
                startDate: formData.startDate,
                endDate: formData.endDate,
                note: formData.note,
                year: formData.year,
              });

              navigate("/admin/review-section");
              toast.success("Tạo đợt đánh giá thành công!");
              console.log("Tạo đợt đánh giá thành công!");
            } catch (error) {
              toast.error("Lỗi tạo đợt đánh giá:", error);
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
        <label className="form-label">Năm học</label>
        <select
          className="form-select form-select-review"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
        >
          <option value="">Chọn năm học</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        {formErrors.showYearError && (
          <label className="error-label">* Hãy chọn năm học</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Tên đợt đánh giá</label>
        <input
          className="form-input form-input-review"
          placeholder="Nhập tên đợt đánh giá"
          type="text"
          name="reviewName"
          value={formData.reviewName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showReviewNameError && (
          <label className="error-label">* Hãy nhập tên đợt đánh giá</label>
        )}
      </div>

      <div className="date-container">
        <div className="form-group">
          <label className="form-label">Ngày bắt đầu</label>
          <input
            className="form-input form-date"
            placeholder="Chọn ngày bắt đầu"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
          {formErrors.showStartDateError && (
            <label className="error-label">* Hãy chọn ngày bắt đầu</label>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Ngày kết thúc</label>
          <input
            className="form-input form-date"
            placeholder="Chọn ngày kết thúc"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
          {formErrors.showEndDateError && (
            <label className="error-label">* Hãy chọn ngày kết thúc</label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ghi chú</label>
        <textarea
          className="form-input form-input-review note-form"
          placeholder="Nhập ghi chú"
          type="text"
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          required
        />
      </div>

      <button
        className="button primary-button modal-button button-review"
        onClick={handleAddButton}
      >
        Tạo
      </button>
    </div>
  );
}
