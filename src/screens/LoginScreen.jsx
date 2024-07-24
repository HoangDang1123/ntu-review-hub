import React, { useState } from "react";
import "../styles/screens/authenticateForm.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { realtimeDB } from "../firebase";
import { hashPassword } from "../utils/encrypt.js";
import { toast } from "react-toastify";
import Thumbnail from "../components/Thumbnail";

function checkBlankInput(id, password) {
  if (id.trim() === "" || password.trim() === "") {
    return true;
  }
  return false;
}

function asyncHashPassword(password) {
  return new Promise((resolve, reject) => {
    const hashedPassword = hashPassword(password);
    resolve(hashedPassword);
  });
}

function authenticate(id, password) {
  return new Promise((resolve, reject) => {
    asyncHashPassword(password).then((hashedPassword) => {
      const userRef = realtimeDB.ref("users");
      userRef
        .once("value")
        .then((snapshot) => {
          const users = snapshot.val();
          for (let key in users) {
            if (
              users[key].loginId === id &&
              users[key].password === hashedPassword
            ) {
              resolve({ isAuthenticated: true, role: users[key].role, id: users[key].id });
            }
          }
          resolve({ isAuthenticated: false, role: null, id: null });
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
          reject(error);
        });
    });
  });
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    showIdError: false,
    showPasswordError: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showIdError: formData.id.trim() === "",
      showPasswordError: formData.password.trim() === "",
    }));

    if (!checkBlankInput(formData.id, formData.password)) {
      authenticate(formData.id, formData.password).then((result) => {
        if (result.isAuthenticated) {
          if (result.role === "user") {
            navigate(`/user/${result.id}`, { state: { password: formData.password } });
          } else {
            navigate("/admin");
          }
          toast.success("Đăng nhập thành công!");
        } else {
          toast.error("Sai mã đăng nhập hoặc mật khẩu!");
        }
      });
    }
  };

  return (
    <div>
      <Thumbnail />
      <div className="form-container">
        <img
          src={require("../assets/images/logo.jpg")}
          alt="Nha Trang University Logo"
          className="logo-image"
        />

        <label className="site-title">ĐÁNH GIÁ Ý KIẾN</label>

        <div style={{ display: "grid", placeItems: "center" }}>
          <div className="form-group">
            <label className="form-label">Mã số đăng nhập</label>
            <input
              type="text"
              name="id"
              placeholder="Nhập mã số"
              className="form-input"
              value={formData.id}
              onChange={handleInputChange}
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
              />
              <div className="visible-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {formErrors.showPasswordError && (
              <label className="error-label">* Hãy nhập mật khẩu</label>
            )}
          </div>
          <div className="link-container">
            <a href="http://localhost:3000/" className="link">
              Quên mật khẩu?
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="button primary-button"
          >
            Đăng nhập
          </button>
          <button onClick={handleRegister} className="button secondary-button">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
