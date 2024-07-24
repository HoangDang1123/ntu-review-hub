import React, { useEffect, useState } from "react";
import "../../styles/screens/item.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { realtimeDB } from "../../firebase";
import { CgAddR } from "react-icons/cg";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function DetailReviewScreen() {
  const [question, setQuestion] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [beReviewed, setBeReviewed] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const { id } = useParams();
  const [activeModal, setActiveModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveModal(/^\/admin\/review-section\//.test(location.pathname)); // Lấy tất cả đường dẫn sau
  }, [location.pathname]);

  useEffect(() => {
    setActiveModal(
      /^\/admin\/detail-review-section\/([^/]+)\//.test(location.pathname)
    ); // Lấy tất cả đường dẫn sau
  }, [location.pathname]);

  useEffect(() => {
    const userRef = realtimeDB.ref("review-sections");
    userRef
      .once("value")
      .then((snapshot) => {
        const reviews = snapshot.val();
        for (let key in reviews) {
          if (reviews[key].id === id) {
            setReviewName(reviews[key].reviewName);
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu review-sections:", error);
      });
  }, [id]);

  useEffect(() => {
    const userRef = realtimeDB
      .ref("review-sections")
      .child(id)
      .child("questions");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setQuestion(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, [id]);

  useEffect(() => {
    const userRef = realtimeDB
      .ref("review-sections")
      .child(id)
      .child("reviewers");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setReviewers(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, [id, location.pathname]);

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
        setBeReviewed(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, [id, location.pathname]);

  const handleBack = async (e) => {
    e.preventDefault();

    navigate("/admin/review-section");
  };

  const handleDeleteQuestion = (questionId, id) => {
    try {
      realtimeDB.ref(`review-sections/${id}/questions/${questionId}`).remove();

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
        .once("value")
        .then((snapshot) => {
          const users = snapshot.val();
          for (let key in users) {
            if (users[key].questions) {
              for (let questionKey in users[key].questions) {
                if (questionKey === questionId) {
                  userRef.child(`${key}/questions/${questionKey}`).remove();
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
        });

      setQuestion(question.filter((item) => item.id !== questionId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  const handleDeleteReviewer = async (reviewerId, id) => {
    try {
      realtimeDB.ref(`review-sections/${id}/reviewers/${reviewerId}`).remove();

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
        .once("value")
        .then((snapshot) => {
          const users = snapshot.val();
          for (let key in users) {
            if (users[key].id === id && users[key].reviewer.id === reviewerId) {
              userRef.child(key).remove();
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
        });

      setReviewers(reviewers.filter((item) => item.id !== reviewerId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  const handleDeleteBeReviewed = async (beReviewedId, id) => {
    try {
      realtimeDB
        .ref(`review-sections/${id}/beReviewed/${beReviewedId}`)
        .remove();

      const userRef = realtimeDB.ref("user-review-sections");
      userRef
        .once("value")
        .then((snapshot) => {
          const users = snapshot.val();
          for (let key in users) {
            if (
              users[key].id === id &&
              users[key].beReviewed.id === beReviewedId
            ) {
              userRef.child(key).remove();
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi lấy dữ liệu users:", error);
        });

      setBeReviewed(beReviewed.filter((item) => item.id !== beReviewedId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  const handleOpenAddQuestionForm = async (e) => {
    e.preventDefault();
    navigate(`/admin/detail-review-section/${id}/add-question`, {
      state: { reviewers },
    });
  };

  const handleOpenAddReviewerForm = async (e) => {
    e.preventDefault();
    navigate(`/admin/detail-review-section/${id}/add-reviewer`, {
      state: { beReviewed },
    });
  };

  const handleOpenAddBeReviewedForm = async (e) => {
    e.preventDefault();
    navigate(`/admin/detail-review-section/${id}/add-beReviewed`, {
      state: { reviewers },
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <div className={`page-container item ${activeModal ? "activeForm" : ""}`}>
        <div style={{ display: "flex" }}>
          <MdKeyboardDoubleArrowLeft
            className="back-icon"
            onClick={handleBack}
          />
          <label className="page-label review-label">{`${reviewName}`}</label>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="title-label">Mục đánh giá</label>
            <button className="add-button" onClick={handleOpenAddQuestionForm}>
              <CgAddR className="add-icon" />
              Thêm
            </button>
          </div>
          <div className="table-container review-table-container">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th style={{ width: "40vw" }}>Nội dung đánh giá</th>
                  <th>Loại trả lời đánh giá</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {question.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.question}</td>
                    <td>{item.answerType}</td>
                    <td>
                      <div className="item-button-container">
                        <button
                          className="item-button delete"
                          onClick={() => handleDeleteQuestion(item.id, id)}
                        >
                          <RiDeleteBin6Fill className="item-icon" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="personnel-container">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="title-label">Nhân sự đánh giá</label>
              <button
                className="add-button"
                onClick={handleOpenAddReviewerForm}
              >
                <CgAddR className="add-icon" />
                Thêm
              </button>
            </div>
            <div className="table-container review-table-container width">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th className="num">#</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th>Mã số</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reviewers.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.lastName}</td>
                      <td>{item.firstName}</td>
                      <td>{item.loginId}</td>
                      <td>
                        <div className="item-button-container">
                          <button
                            className="item-button delete"
                            onClick={() => handleDeleteReviewer(item.id, id)}
                          >
                            <RiDeleteBin6Fill className="item-icon" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ width: "2vw" }}></div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="title-label">Nhân sự được đánh giá</label>
              <button
                className="add-button"
                onClick={handleOpenAddBeReviewedForm}
              >
                <CgAddR className="add-icon" />
                Thêm
              </button>
            </div>
            <div className="table-container review-table-container width">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th className="num">#</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th>Mã số</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {beReviewed.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.lastName}</td>
                      <td>{item.firstName}</td>
                      <td>{item.loginId}</td>
                      <td>
                        <div className="item-button-container">
                          <button
                            className="item-button delete"
                            onClick={() => handleDeleteBeReviewed(item.id, id)}
                          >
                            <RiDeleteBin6Fill className="item-icon" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="outlet-container question-container">
        <Outlet />
      </div>
    </div>
  );
}
