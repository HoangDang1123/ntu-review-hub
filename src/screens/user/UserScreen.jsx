import React, { useEffect, useState } from "react";
import Thumbnail from "../../components/Thumbnail";
import "../../styles/screens/userHome.css";
import Header from "../../components/user/Header";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { realtimeDB } from "../../firebase";

export default function UserScreen() {
  const { id } = useParams();
  const { state } = useLocation();
  const { password } = state || {};

  const [data, setData] = useState({
    lastName: "",
    firstName: "",
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
              lastName: users[key].lastName,
              firstName: users[key].firstName,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu users:", error);
      });
  }, [id]);

  return (
    <div>
      <Thumbnail />
      <div className="home-container">
        <Header
          name={`${data.lastName} ${data.firstName}`}
          password={password}
        />

        <div style={{ marginTop: "9vh" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
