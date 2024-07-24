import "../styles/screens/authenticateForm.css";
import RegisterForm from "../components/RegisterForm";
import { useState } from "react";
import InfoForm from "../components/InfoForm";
import Thumbnail from "../components/Thumbnail";

export default function RegisterScreen() {
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [sharedData, setSharedData] = useState({
    fullName: "",
    id: "",
    password: "",
    confirmPassword: "",
  });

  const handleButton = () => {
    setShowRegisterForm(!showRegisterForm);
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

        <label className="site-title">ĐĂNG KÝ</label>

        {showRegisterForm ? (
          <RegisterForm
            showForm={handleButton}
            sharedData={sharedData}
            setSharedData={setSharedData}
          />
        ) : (
          <InfoForm showForm={handleButton} sharedData={sharedData} />
        )}
      </div>
    </div>
  );
}
