import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/screens/authenticateForm.css";
import { realtimeDB } from "../firebase.js";
import { toast } from "react-toastify";

function checkBlankInput(name, id, password, confirmPassword) {
  if (
    name.trim() === "" ||
    id.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === ""
  ) {
    return true;
  }
  return false;
}

function checkNotMatchPasswordInput(password, confirmPassword) {
  if (password !== confirmPassword) {
    return true;
  }
  return false;
}

function checkExistUser(id) {
  return new Promise((resolve, reject) => {
    const userRef = realtimeDB.ref("users");
    userRef
      .once("value")
      .then((snapshot) => {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].loginId === id) {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu users:", error);
        reject(error);
      });
  });
}

export default function RegisterForm({ showForm, sharedData, setSharedData }) {
  const [formData, setFormData] = useState({
    fullName: sharedData.fullName,
    id: sharedData.id,
    password: sharedData.password,
    confirmPassword: sharedData.confirmPassword,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    showFullNameError: false,
    showIdError: false,
    showPasswordError: false,
    showConfirmPasswordError: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

  const handleContinue = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showFullNameError: formData.fullName.trim() === "",
      showIdError: formData.id.trim() === "",
      showPasswordError: formData.password.trim() === "",
      showConfirmPasswordError: formData.confirmPassword.trim() === "",
    }));

    if (
      !checkBlankInput(
        formData.fullName,
        formData.id,
        formData.password,
        formData.confirmPassword
      )
    ) {
      if (
        !checkNotMatchPasswordInput(formData.password, formData.confirmPassword)
      ) {
        checkExistUser(formData.id)
          .then((exists) => {
            if (exists) {
              toast.error("Tài khoản đã tồn tại!");
              console.error("Tài khoản đã tồn tại!");
            } else {
              setSharedData(formData);
              showForm();
            }
          })
          .catch((error) => {
            toast.error("Lỗi:", error);
          });
      } else {
        toast.error("Mật khẩu xác nhận không đúng!");
        console.error("Mật khẩu xác nhận không đúng!");
      }
    }
  };
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <div className="form-group">
        <label className="form-label">Họ tên</label>
        <input
          type="text"
          name="fullName"
          placeholder="Nhập họ và tên"
          className="form-input"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        {formErrors.showFullNameError && (
          <label className="error-label">* Hãy nhập họ và tên</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Mã số đăng nhập</label>
        <input
          type="text"
          name="id"
          placeholder="Nhập mã số"
          className="form-input"
          value={formData.id}
          onChange={handleInputChange}
          required
        />
        {formErrors.showIdError && (
          <label className="error-label">* Hãy nhập mã số đăng nhập</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Mật khẩu</label>
        <div style={{ display: "flex" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Nhập mật khẩu"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="visible-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        {formErrors.showPasswordError && (
          <label className="error-label">* Hãy nhập mật khẩu</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Xác nhận mật khẩu</label>
        <div style={{ display: "flex" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <div
            className="visible-icon"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        {formErrors.showConfirmPasswordError && (
          <label className="error-label">* Hãy nhập lại mật khẩu</label>
        )}
      </div>

      <div className="link-container">
        <label className="link">Đã có tài khoản?</label>
        <Link to={`/`} className="link">
          Đăng nhập
        </Link>
      </div>

      <button onClick={handleContinue} className="button primary-button">
        Tiếp theo
      </button>
    </div>
  );
}
