import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function EditSubject() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    unit: "",
  });

  const [formErrors, setFormErrors] = useState({
    showSubjectCodeError: false,
    showSubjectNameError: false,
    showUnitError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("subjects");
    userRef
      .once("value")
      .then((snapshot) => {
        const subjects = snapshot.val();
        for (let key in subjects) {
          if (subjects[key].id === id) {
            setFormData(() => ({
              subjectCode: subjects[key].subjectCode,
              subjectName: subjects[key].subjectName,
              unit: subjects[key].unit,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu subjects:", error);
      });
  }, [id]);

  const [units, setUnits] = useState([]);

  useEffect(() => {
    const userRef = realtimeDB.ref("units");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setUnits(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
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

  const handleEditButton = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showSubjectCodeError: formData.subjectCode.trim() === "",
      showSubjectNameError: formData.subjectName.trim() === "",
      showUnitError: formData.unit.trim() === "",
    }));

    try {
      realtimeDB.ref("subjects/" + id).set({
        id: id,
        subjectCode: formData.subjectCode,
        subjectName: formData.subjectName,
        unit: formData.unit,
      });

      navigate("/admin/subject");
      toast.success("Lưu tổ bộ môn thành công!");
      console.log("Lưu tổ bộ môn thành công!");
    } catch (error) {
      toast.error("Lỗi lưu tổ bộ môn:", error);
    }
  };

  return (
    <div className="add-form-container">
      <IoCloseOutline className="close-icon" onClick={handleCloseModal} />
      <div className="form-group">
        <label className="form-label">Mã tổ bộ môn</label>
        <input
          className="form-input"
          placeholder="Nhập mã tổ bộ môn"
          type="text"
          name="subjectCode"
          value={formData.subjectCode}
          onChange={handleInputChange}
          required
        />
        {formErrors.showSubjectCodeError && (
          <label className="error-label">* Hãy nhập mã tổ bộ môn</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Tên tổ bộ môn</label>
        <input
          className="form-input"
          placeholder="Nhập tên tổ bộ môn"
          type="text"
          name="subjectName"
          value={formData.subjectName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showSubjectNameError && (
          <label className="error-label">* Hãy nhập tên tổ bộ môn</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Đơn vị</label>
        <select
          className="form-select"
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
        >
          <option value="">Chọn đơn vị</option>
          {units.map((item) => (
            <option
              key={item.id}
              value={item.unitName}
            >{`${item.unitName}`}</option>
          ))}
        </select>
        {formErrors.showUnitError && (
          <label className="error-label">* Hãy chọn đơn vị</label>
        )}
      </div>

      <button
        className="button primary-button modal-button"
        onClick={handleEditButton}
      >
        Lưu tổ bộ môn
      </button>
    </div>
  );
}
