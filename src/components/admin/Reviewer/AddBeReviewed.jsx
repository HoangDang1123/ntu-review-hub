import React, { useEffect, useState } from "react";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../../firebase";
import { toast } from "react-toastify";

export default function AddBeReviewed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const { state } = useLocation();
  const { reviewers } = state || {};

  useEffect(() => {
    const userRef = realtimeDB
      .ref("review-sections")
      .child(id)
      .child("beReviewed");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setCheckedRows(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, [id]);

  useEffect(() => {
    const userRef = realtimeDB.ref("users");
    const reviewerRef = realtimeDB.ref(`review-sections/${id}/reviewers`);

    const unsubscribeUser = userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        reviewerRef.once("value", (reviewerSnapshot) => {
          const reviewerData = reviewerSnapshot.val();
          const dataArray = Object.keys(data)
            .filter(
              (key) =>
                data[key].role === "user" &&
                (!reviewerData || !Object.keys(reviewerData).includes(key))
            )
            .map((key) => ({
              ...data[key],
            }));
          setData(dataArray);
        });
      }
    });

    return () => {
      userRef.off("value", unsubscribeUser);
    };
  }, [id]);

  const handleCheckboxChange = (index, rowData) => {
    if (checkedRows.some((row) => row.id === rowData.id)) {
      realtimeDB.ref(`review-sections/${id}/beReviewed/${rowData.id}`).remove();
      setCheckedRows(checkedRows.filter((row) => row.id !== rowData.id));
    } else {
      setCheckedRows([...checkedRows, rowData]);
    }
  };

  const handleCloseModal = async (e) => {
    e.preventDefault();

    navigate(-1);
  };

  const handleAddBeReviewed = async (e) => {
    e.preventDefault();

    try {
      const beReviewedPromises = checkedRows.map((row) => {
        return realtimeDB
          .ref(`review-sections/${id}/beReviewed/${row.id}`)
          .update({
            id: row.id,
            loginId: row.loginId,
            lastName: row.lastName,
            firstName: row.firstName,
          });
      });
      await Promise.all(beReviewedPromises);

      const userPromises = [];

      for (const row of checkedRows) {
        let check = false;
        await realtimeDB
          .ref(`user-review-sections`)
          .once("value")
          .then((snapshot) => {
            const users = snapshot.val();
            for (let key in users) {
              if (users[key].id === id && users[key].beReviewed.id === row.id) {
                check = true;
                if (check === true) {
                  return;
                }
              }
            }
          });

        if (check === true) {
          continue;
        }

        const snapshot2 = await realtimeDB
          .ref(`review-sections/${id}`)
          .once("value");
        const reviewSectionData = snapshot2.val();

        const newReviewSectionData = {
          ...reviewSectionData,
          beReviewed: {
            id: row.id,
            name: `${row.lastName} ${row.firstName}`,
          },
          state: "Chưa xong",
        };

        if (reviewers.length > 0) {
          for (const user of reviewers) {
            const newReviewSectionId = realtimeDB
              .ref(`user-review-sections`)
              .push().key;

            await realtimeDB
              .ref(`user-review-sections/${newReviewSectionId}`)
              .set({
                ...newReviewSectionData,
                reviewSectionId: newReviewSectionId,
                reviewer: {
                  id: user.id,
                  name: `${user.lastName} ${user.firstName}`,
                },
              });
          }
        }
      }
      await Promise.all(userPromises);

      navigate(`/admin/detail-review-section/${id}`);
      toast.success("Lưu nhân sự thành công!");
      console.log("Lưu nhân sự thành công!");
    } catch (error) {
      toast.error("Lỗi lưu nhân sự:", error);
    }
  };

  return (
    <div className="add-form-container add-personnel">
      <IoCloseOutline className="close-icon" onClick={handleCloseModal} />

      <div className="reviewer">
        <table className="personnel-table">
          <thead className="personnel-thead">
            <tr>
              <th style={{ maxWidth: "0.7vw" }} className="num personnel-th">
                #
              </th>
              <th className="personnel-th">Mã số</th>
              <th className="personnel-th">Họ tên</th>
              <th className="personnel-th"></th>
            </tr>
          </thead>
          <tbody className="personnel-tbody">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={
                  checkedRows.some((i) => i.id === item.id) ? "checked" : ""
                }
                style={{ backgroundColor: "#EEEEEE" }}
              >
                <td style={{ maxWidth: "0.5vw" }}>{index + 1}</td>
                <td>{item.loginId}</td>
                <td>{`${item.lastName} ${item.firstName}`}</td>
                <td>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={checkedRows.some((i) => i.id === item.id)}
                    onChange={() => handleCheckboxChange(index, item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="button primary-button modal-button button-review"
        onClick={handleAddBeReviewed}
      >
        Lưu
      </button>
    </div>
  );
}
