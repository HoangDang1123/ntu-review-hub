import React, { useState, useEffect } from "react";
import "../../styles/components/header.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { RiProfileLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { MdHome } from "react-icons/md";

export default function Header({ name, password }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userTab, setUserTab] = useState(false);
  const [buttonRef, setButtonRef] = useState(null);

  const handleUserTab = () => {
    setUserTab(!userTab);
  };

  const handleOpenProfile = () => {
    navigate(`/user/${id}/profile`, { state: { password: password } });
    setUserTab(false);
  };

  const handleGoHome = () => {
    navigate(`/user/${id}`);
    setUserTab(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef && !buttonRef.contains(event.target)) {
        setUserTab(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef]);

  return (
    <div className="header-container">
      <div className="header-label-container" onClick={handleGoHome}>
        <img
          src={require("../../assets/images/logo.jpg")}
          alt="Nha Trang University Logo"
          className="home-logo-image"
          style={{ width: "3vw", height: "3vw" }}
        />
        <label className="uni-label" style={{ fontSize: "1.5em" }}>
          ĐẠI HỌC NHA TRANG
        </label>
      </div>

      <div ref={(ref) => setButtonRef(ref)}>
        <button className="user-button" onClick={handleUserTab}>
          {name}
          <IoMdArrowDropdown className="account-icon" />
        </button>

        {userTab && (
          <div style={{ display: "grid" }}>
            <button
              className="tab-button"
              style={{ borderBottom: "1px solid" }}
              onClick={handleGoHome}
            >
              <MdHome className="account-icon" />
              Trang chủ
            </button>

            <button
              className="tab-button"
              style={{ borderBottom: "1px solid" }}
              onClick={handleOpenProfile}
            >
              <RiProfileLine className="account-icon" />
              Thông tin cá nhân
            </button>

            <button className="tab-button" onClick={handleLogout}>
              <TbLogout2 className="account-icon" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
