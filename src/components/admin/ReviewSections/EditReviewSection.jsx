import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function EditReviewSection() {
  const { id } = useParams();

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

  useEffect(() => {
    const userRef = realtimeDB.ref("review-sections");
    userRef
      .once("value")
      .then((snapshot) => {
        const reviews = snapshot.val();
        for (let key in reviews) {
          if (reviews[key].id === id) {
            setFormData(() => ({
              reviewName: reviews[key].reviewName,
              startDate: reviews[key].startDate,
              endDate: reviews[key].endDate,
              note: reviews[key].note,
              year: reviews[key].year,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu review-sections:", error);
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
      showReviewNameError: formData.reviewName.trim() === "",
      showStartDateError: formData.startDate.trim() === "",
      showEndDateError: formData.endDate.trim() === "",
      showYearError: formData.year.trim() === "",
    }));

    try {
      realtimeDB.ref("review-sections/" + id).update({
        id: id,
        reviewName: formData.reviewName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        note: formData.note,
        year: formData.year,
      });

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
      .once("value")
      .then((snapshot) => {
        const users = snapshot.val();
        for (let key in users) {
          console.log(users[key].id)
          if (users[key].id === id) {
            console.log(key);
            realtimeDB.ref("user-review-sections/" + key).update({
              id: id,
              reviewName: formData.reviewName,
              startDate: formData.startDate,
              endDate: formData.endDate,
              note: formData.note,
              year: formData.year,
            });
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu users:", error);
      });

      navigate("/admin/review-section");
      toast.success("Lưu đợt đánh giá thành công!");
      console.log("Lưu đợt đánh giá thành công!");
    } catch (error) {
      toast.error("Lỗi lưu đợt đánh giá:", error);
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
        onClick={handleEditButton}
      >
        Lưu
      </button>
    </div>
  );
}
