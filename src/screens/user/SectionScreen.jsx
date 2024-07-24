import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { realtimeDB } from "../../firebase";
import "../../styles/screens/section.css";
import SectionTitle from "../../components/user/SectionTitle";
import MatrixForm from "../../components/user/MatrixForm";
import RadioForm from "../../components/user/RadioForm";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { BsFillSendArrowUpFill } from "react-icons/bs";
import { toast } from "react-toastify";

export default function SectionScreen() {
  const { id, sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState({});
  const [sectionState, setSectionState] = useState(null);

  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState(false);

  useEffect(() => {
    const userRef = realtimeDB.ref("user-review-sections");
    userRef
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        for (let key in data) {
          if (data[key].reviewSectionId === sectionId) {
            setSection(data[key]);
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu user-review-sections:", error);
      });
  }, [sectionId]);

  useEffect(() => {
    if (section) {
      setSectionState(section.state);
    }
  }, [section]);

  useEffect(() => {
    const initialErrors = {};
    if (section.questions) {
      Object.keys(section.questions).forEach((key) => {
        initialErrors[key] = section.questions[key].answers.map(() => false);
      });
      setErrors(initialErrors);
    }
  }, [section.questions]);

  const handleBack = async (e) => {
    e.preventDefault();

    navigate(-1);
  };

  const handleSendForm = async (e) => {
    e.preventDefault();

    const newErrors = { ...errors };
    let isErrors = false;
    Object.keys(section.questions).forEach((key, questionIndex) => {
      section.questions[key].answers.forEach((item, answerIndex) => {
        const hasError = item.answer.trim() === "";
        if (hasError) {
          newErrors[key][answerIndex] = true;
          isErrors = true;
        } else {
          newErrors[key][answerIndex] = false;
        }
      });
    });

    setErrors(newErrors);
    setFormErrors(isErrors);

    if (isErrors === false) {
      setSectionState("Đã xong");
    }
  };

  useEffect(() => {
    if (sectionState === "Đã xong") {
      try {
        realtimeDB.ref(`user-review-sections/${sectionId}`).update({
          questions: section.questions,
          state: sectionState,
        });
        navigate(`/user/${id}`);
        toast.success("Gửi đánh giá thành công!");
        console.log("Gửi đánh giá thành công!");
      } catch (error) {
        toast.error("Lỗi gửi đánh giá:", error);
      }
    }
  }, [sectionState, section, id, sectionId, navigate]);

  return (
    <div
      style={{
        backgroundColor: "#D9D9D9",
        display: "grid",
        justifyContent: "center",
      }}
    >
      <MdKeyboardDoubleArrowLeft
        className="back-icon back"
        onClick={handleBack}
      />
      {Object.keys(section).length !== 0 && <SectionTitle section={section} />}

      {Object.keys(section).length !== 0 &&
        Object.keys(section.questions).map((key, index) =>
          section.questions[key].answerType === "Lưới trắc nghiệm" ? (
            <MatrixForm
              section={section}
              setSection={setSection}
              errors={errors[key]}
              setErrors={setErrors}
              key={key}
              dataKey={key}
              index={index}
            />
          ) : (
            <RadioForm data={section.questions[key]} key={key} index={index} />
          )
        )}

      {formErrors === true && (
        <label className="section-error-label">* Vui lòng chọn đủ đáp án</label>
      )}

      <button className="send-button" onClick={handleSendForm}>
        <BsFillSendArrowUpFill className="send-icon" />
        Gửi
      </button>
    </div>
  );
}
