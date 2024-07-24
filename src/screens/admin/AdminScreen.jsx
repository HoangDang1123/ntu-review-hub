import React from "react";
import "../../styles/screens/adminHome.css";
import AdminMenu from "../../components/admin/AdminMenu";
import { Outlet } from "react-router-dom";

export default function AdminScreen() {
  return (
    <div className="container">
      <AdminMenu />
      <Outlet />
    </div>
  );
}
