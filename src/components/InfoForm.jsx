import React, { useEffect, useState } from "react";
import "../styles/screens/authenticateForm.css";
import { realtimeDB } from "../firebase.js";
import { toast } from "react-toastify";
import { hashPassword } from "../utils/encrypt.js";
import { useNavigate } from "react-router-dom";

function checkBlankSelect(personnel, unit, subject) {
  if (personnel.trim() === "" || unit.trim() === "" || subject.trim() === "") {
    return true;
  }
  return false;
}

export default function SelectInfoForm({ showForm, sharedData }) {
  const navigate = useNavigate();
  const [unit, setUnit] = useState([]);
  const [subject, setSubject] = useState([]);
  const [role, setRole] = useState([]);

  const [formData, setFormData] = useState({
    fullName: sharedData.fullName,
    id: sharedData.id,
    password: sharedData.password,
    confirmPassword: sharedData.confirmPassword,
    personnel: "",
    unit: "",
    subject: "",
  });

  const [formErrors, setFormErrors] = useState({
    showPersonnelError: false,
    showUnitError: false,
    showSubjectError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("units");
    userRef.on("value", (snapshot) => {
      const unit = snapshot.val();
      if (unit) {
        const dataArray = Object.keys(unit).map((key) => ({
          ...unit[key],
        }));
        setUnit(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  useEffect(() => {
    const userRef = realtimeDB.ref("subjects");
    userRef.on("value", (snapshot) => {
      const subject = snapshot.val();
      if (subject) {
        const dataArray = Object.keys(subject).map((key) => ({
          ...subject[key],
        }));
        setSubject(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  useEffect(() => {
    const userRef = realtimeDB.ref("roles");
    userRef.on("value", (snapshot) => {
      const role = snapshot.val();
      if (role) {
        const dataArray = Object.keys(role).map((key) => ({
          ...role[key],
        }));
        setRole(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  const handleSelectChange = (e) => {
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

  const handleBack = async (e) => {
    e.preventDefault();

    showForm();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showPersonnelError: formData.personnel.trim() === "",
      showUnitError: formData.unit.trim() === "",
      showSubjectError: formData.subject.trim() === "",
    }));

    if (
      !checkBlankSelect(formData.personnel, formData.unit, formData.subject)
    ) {
      const nameParts = formData.fullName.split(" ");
      const lastNameValue = nameParts[0];
      const firstNameValue = nameParts.slice(1, nameParts.length).join(" ");

      const hashedPassword = await hashPassword(formData.password);

      try {
        const newUserId = realtimeDB.ref("users").child("user").push().key;

        realtimeDB.ref("users/" + newUserId).set({
          id: newUserId,
          lastName: lastNameValue,
          firstName: firstNameValue,
          loginId: formData.id,
          password: hashedPassword,
          personnel: formData.personnel,
          unit: formData.unit,
          subject: formData.subject,
          role: "user",
        });

        navigate(`/user/${newUserId}`, { state: { password: formData.password } });
        toast.success("Tạo tài khoản thành công!");
        console.log("Tạo tài khoản thành công!");
      } catch (error) {
        toast.error("Lỗi tạo tài khoản:", error);
      }
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <div className="form-group">
        <label className="form-label">Vị trí công tác</label>
        <select
          name="personnel"
          value={formData.personnel}
          onChange={handleSelectChange}
          className="form-select"
        >
          <option value="">Chọn vị trí công tác</option>
          {role.map((item) => (
            <option
              key={item.id}
              value={item.roleName}
            >{`${item.roleName}`}</option>
          ))}
        </select>

        {formErrors.showPersonnelError && (
          <label className="error-label">* Hãy chọn vị trí công tác</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Đơn vị công tác</label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleSelectChange}
          className="form-select"
        >
          <option value="">Chọn đơn vị công tác</option>
          {unit.map((item) => (
            <option
              key={item.id}
              value={item.unitName}
            >{`${item.unitName}`}</option>
          ))}
        </select>

        {formErrors.showUnitError && (
          <label className="error-label">* Hãy chọn đơn vị công tác</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Tổ bộ môn</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleSelectChange}
          className="form-select"
        >
          <option value="">Chọn tổ bộ môn</option>
          {subject.map((item) => (
            <option
              key={item.id}
              value={item.subjectName}
            >{`${item.subjectName}`}</option>
          ))}
        </select>

        {formErrors.showSubjectError && (
          <label className="error-label">* Hãy chọn tổ bộ môn</label>
        )}
      </div>

      <button
        onClick={handleRegister}
        className="button primary-button"
      >
        Đăng ký
      </button>
      <button onClick={handleBack} className="button secondary-button">
        Quay lại
      </button>
    </div>
  );
}
