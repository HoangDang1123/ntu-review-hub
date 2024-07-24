import React, { useEffect, useState } from "react";
import "../../styles/screens/profile.css";
import { realtimeDB } from "../../firebase";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { IoMdDoneAll } from "react-icons/io";
import { toast } from "react-toastify";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState([]);
  const [subject, setSubject] = useState([]);
  const [unit, setUnit] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const { state } = useLocation();
  const { password } = state || {};

  const { id } = useParams();
  const [data, setData] = useState({
    id: "",
    lastName: "",
    firstName: "",
    loginId: "",
    password: "",
    personnel: "",
    unit: "",
    subject: "",
  });

  const [formErrors, setFormErrors] = useState({
    showLastName: false,
    showFirstName: false,
    showPassword: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("users");
    userRef
      .once("value")
      .then((snapshot) => {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].id === id) {
            setData(() => ({
              id: id,
              lastName: users[key].lastName,
              firstName: users[key].firstName,
              loginId: users[key].loginId,
              password: "*",
              personnel: users[key].personnel,
              unit: users[key].unit,
              subject: users[key].subject,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu users:", error);
      });
  }, [id, password]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [`show${name.charAt(0).toUpperCase() + name.slice(1)}Error`]:
        value.trim() === "",
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditForm = () => {
    setDisabled(false);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showLastName: data.reviewName.trim() === "",
      showFirstName: data.startDate.trim() === "",
      showPassword: data.endDate.trim() === "",
    }));

    try {
      realtimeDB.ref("users/" + id).update({
        id: id,
        lastName: data.lastName,
        firstName: data.firstName,
        loginId: data.loginId,
        personnel: data.personnel,
        unit: data.unit,
        subject: data.subject,
        role: "user",
      });

      navigate(0);
      setDisabled(true);
      toast.success("Lưu thông tin thành công!");
      console.log("Lưu thông tin thành công!");
    } catch (error) {
      toast.error("Lỗi lưu thông tin:", error);
    }
  };

  return (
    <div className="profile-form">
      <label style={{ fontSize: "1.2em", fontWeight: "500" }}>
        Thông tin cá nhân
      </label>

      <div
        className="form-group"
        style={{
          marginTop: "2vh",
        }}
      >
        <label className="form-label">ID</label>
        <input
          className={"profile-input disabled"}
          name="id"
          disabled={true}
          value={data.id}
        />
      </div>

      <div className="profile-name-container">
        <div className="form-group">
          <label className="form-label">Họ</label>
          <input
            className={`profile-input ${disabled ? "disabled" : ""}`}
            style={{ width: "5vw" }}
            name="lastName"
            disabled={disabled}
            value={data.lastName}
            onChange={handleInputChange}
          />

          {formErrors.showLastName && (
            <label className="error-label">* Hãy nhập họ</label>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Tên</label>
          <input
            className={`profile-input ${disabled ? "disabled" : ""}`}
            name="firstName"
            disabled={disabled}
            value={data.firstName}
            onChange={handleInputChange}
          />

          {formErrors.showFirstName && (
            <label className="error-label">* Hãy nhập tên</label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Mã số đăng nhập</label>
        <input
          className={"profile-input disabled"}
          name="loginId"
          disabled={true}
          value={data.loginId}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Mật khẩu</label>
        <input
          className={"profile-input"}
          name="password"
          disabled={true}
          value={data.password}
          onChange={handleInputChange}
        />

        {formErrors.showPassword && (
          <label className="error-label">* Hãy nhập mật khẩu</label>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Vị trí công tác</label>
        <select
          name="personnel"
          className={`form-select ${disabled ? "disabled" : ""}`}
          style={{ width: "auto" }}
          disabled={disabled}
          onChange={handleSelectChange}
        >
          <option value={data.personnel}>{data.personnel}</option>
          {role.map((item) => (
            <option
              key={item.id}
              value={item.roleName}
            >{`${item.roleName}`}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Đơn vị công tác</label>
        <select
          name="unit"
          className={`form-select ${disabled ? "disabled" : ""}`}
          style={{ width: "auto" }}
          disabled={disabled}
          onChange={handleSelectChange}
        >
          <option value={data.unit}>{data.unit}</option>
          {unit.map((item) => (
            <option
              key={item.id}
              value={item.unitName}
            >{`${item.unitName}`}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Tổ bộ môn</label>
        <select
          name="subject"
          className={`form-select ${disabled ? "disabled" : ""}`}
          style={{ width: "auto" }}
          disabled={disabled}
          onChange={handleSelectChange}
        >
          <option value={data.subject}>{data.subject}</option>
          {subject.map((item) => (
            <option
              key={item.id}
              value={item.subjectName}
            >{`${item.subjectName}`}</option>
          ))}
        </select>
      </div>

      {disabled ? (
        <button
          className="item-button edit profile-button"
          onClick={handleEditForm}
        >
          <GrEdit className="profile-icon" /> Chỉnh sửa
        </button>
      ) : (
        <button
          className="item-button save profile-button"
          onClick={handleSaveForm}
        >
          <IoMdDoneAll className="profile-icon" /> Lưu
        </button>
      )}
    </div>
  );
}
