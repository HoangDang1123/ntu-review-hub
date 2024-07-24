import React, { useEffect, useState } from "react";
import "../../styles/components/adminMenu.css";
import { LuHome } from "react-icons/lu";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiCommunityFill } from "react-icons/ri";
import { MdSubject } from "react-icons/md";
import { GiReactor } from "react-icons/gi";
import { MdRateReview } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { MdFormatAlignLeft } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminMenu() {
  const [activeTab, setActiveTab] = useState("home");
  const [openChildTab, setOpenChildTab] = useState(false);
  const [childActiveTab, setChildActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin") {
      setActiveTab("home");
      setOpenChildTab(false);
      setChildActiveTab("");
    } else if (path === "/admin/personnel") {
      setActiveTab("personnel");
      setOpenChildTab(false);
      setChildActiveTab("");
    } else if (path === "/admin/unit") {
      setActiveTab("unit");
      setOpenChildTab(false);
      setChildActiveTab("");
    } else if (path === "/admin/subject") {
      setActiveTab("subject");
      setOpenChildTab(false);
      setChildActiveTab("");
    } else if (path === "/admin/role") {
      setActiveTab("role");
      setOpenChildTab(false);
      setChildActiveTab("");
    } else if (path === "/admin/answer-type") {
      setChildActiveTab("answer-type");
    } else if (path === "/admin/review-section") {
      setChildActiveTab("review-section");
    }
  }, [location.pathname]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate("/admin");
        break;
      case "personnel":
        navigate("/admin/personnel");
        break;
      case "unit":
        navigate("/admin/unit");
        break;
      case "subject":
        navigate("/admin/subject");
        break;
      case "role":
        navigate("/admin/role");
        break;
      case "review":
        setActiveTab("review");
        setOpenChildTab(!openChildTab);
        break;
      default:
        break;
    }
  };

  const handleChildTabChange = (childTab) => {
    setChildActiveTab(childTab);
    switch (childTab) {
      case "answer-type":
        navigate("/admin/answer-type");
        break;
      case "review-section":
        navigate("/admin/review-section");
        break;
      default:
        break;
    }
  }

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="menu-container">
      <div className="uni-container">
        <img
          src={require("../../assets/images/logo.jpg")}
          alt="Nha Trang University Logo"
          className="home-logo-image"
        />
        <label className="uni-label">ĐẠI HỌC NHA TRANG</label>
      </div>
      <div className="avatar-container">
        <img
          src={require("../../assets/images/avatar.jpg")}
          alt="Nha Trang University Logo"
          className="avatar-image"
        />

        <div className="label-container">
          <label className="name-label">Admin</label>
          <label className="id-label">ID: 000000</label>
        </div>
      </div>

      <div style={{ display: "grid" }}>
        <div
          className={`tab-container ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabChange("home")}
        >
          <LuHome className="tab-icon" />
          <label className="tab-label">Trang chủ</label>
        </div>

        <div
          className={`tab-container ${
            activeTab === "personnel" ? "active" : ""
          }`}
          onClick={() => handleTabChange("personnel")}
        >
          <BsFillPeopleFill className="tab-icon" />
          <label className="tab-label">Nhân sự</label>
        </div>

        <div
          className={`tab-container ${activeTab === "unit" ? "active" : ""}`}
          onClick={() => handleTabChange("unit")}
        >
          <RiCommunityFill className="tab-icon" />
          <label className="tab-label">Đơn vị công tác</label>
        </div>

        <div
          className={`tab-container ${activeTab === "subject" ? "active" : ""}`}
          onClick={() => handleTabChange("subject")}
        >
          <MdSubject className="tab-icon" />
          <label className="tab-label">Tổ bộ môn</label>
        </div>

        <div
          className={`tab-container ${activeTab === "role" ? "active" : ""}`}
          onClick={() => handleTabChange("role")}
        >
          <GiReactor className="tab-icon" />
          <label className="tab-label">Chức vụ</label>
        </div>

        <div
          className={`tab-container ${activeTab === "review" ? "active" : ""}`}
          onClick={() => handleTabChange("review")}
        >
          <MdRateReview className="tab-icon" />
          <label className="tab-label">Đánh giá</label>
          { openChildTab ? <IoIosArrowDown className="child-icon" /> : <IoIosArrowForward className="child-icon" /> }
        </div>

        { openChildTab && (
          <div>
            <div
              className={`tab-container child-tab-container ${
                childActiveTab === "answer-type" ? "active" : ""
              }`}
              onClick={() => handleChildTabChange("answer-type")}
            >
              <MdFormatAlignLeft className="tab-icon" />
              <label className="tab-label">Loại trả lời</label>
            </div>

            <div
              className={`tab-container child-tab-container ${
                childActiveTab === "review-section" ? "active" : ""
              }`}
              onClick={() => handleChildTabChange("review-section")}
            >
              <VscPreview className="tab-icon" />
              <label className="tab-label">Đợt đánh giá</label>
            </div>
          </div>
        ) }
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <TbLogout2 className="logout-icon" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
