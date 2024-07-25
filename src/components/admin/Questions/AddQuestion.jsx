import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/components/itemForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { realtimeDB } from "../../../firebase";
import RadioQuestion from "./RadioQuestion";
import MatrixQuestion from "./MatrixQuestion";
import { toast } from "react-toastify";

function checkBlank(question, questionType, scales) {
  if (
    question.trim() === "" ||
    questionType.trim() === "" ||
    scales.trim() === ""
  ) {
    return true;
  }
  return false;
}

export default function AddQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState([]);
  const [typeForm, setTypeForm] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answers: [],
    answerType: "",
    scales: "",
  });

  const [formErrors, setFormErrors] = useState({
    showQuestionError: false,
    showAnswerError: false,
    showAnswerTypeError: false,
    showScalesError: false,
  });

  useEffect(() => {
    const userRef = realtimeDB.ref("answer-types");
    userRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setType(dataArray);
      }
    });

    return () => {
      userRef.off();
    };
  }, []);

  useEffect(() => {
    const userRef = realtimeDB
      .ref("review-sections")
      .child(id)
      .child("questions");
    userRef
      .once("value")
      .then((snapshot) => {
        const questions = snapshot.val();
        for (let key in questions) {
          if (questions[key].id === id) {
            setFormData(() => ({
              question: questions[key].question,
              answers: questions[key].answers,
              answerType: questions[key].answerType,
              scales: questions[key].scales,
            }));
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu review-sections:", error);
      });
  }, [id]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [`show${name.charAt(0).toUpperCase() + name.slice(1)}Error`]:
        value.trim() === "",
    }));

    if (e.target.value === "Trắc nghiệm") {
      setTypeForm("Radio");
    } else if (e.target.value === "Lưới trắc nghiệm") {
      setTypeForm("Matrix");
    } else {
      setTypeForm("");
    }
  };

  const handleCloseModal = async (e) => {
    e.preventDefault();

    navigate(-1);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      showQuestionError: formData.question.trim() === "",
      showAnswerError: formData.answers.some(
        (answer) => answer.question.trim() === ""
      ),
      showAnswerTypeError: formData.answerType.trim() === "",
      showScalesError: formData.scales.trim() === "",
    }));

    if (!checkBlank(formData.question, formData.answerType, formData.scales)) {
      try {
        await createQuestion(id, formData);
      } catch (error) {}
    }
  };

  const createQuestion = async (id, formData) => {
    try {
      const newQuestionId = realtimeDB
        .ref(`review-sections/${id}/questions`)
        .push().key;

      await realtimeDB
        .ref(`review-sections/${id}/questions/${newQuestionId}`)
        .set({
          id: newQuestionId,
          question: formData.question,
          answers: formData.answers,
          answerType: formData.answerType,
          scales: formData.scales,
        });

      const userReviewSectionsSnapshot = await realtimeDB
        .ref("user-review-sections")
        .orderByChild("id")
        .equalTo(id)
        .once("value");

      if (userReviewSectionsSnapshot.exists()) {
        const userReviewSections = userReviewSectionsSnapshot.val();
        const promises = [];

        for (let key in userReviewSections) {
          promises.push(
            realtimeDB
              .ref(`user-review-sections/${key}/questions/${newQuestionId}`)
              .set({
                id: newQuestionId,
                question: formData.question,
                answers: formData.answers,
                answerType: formData.answerType,
                scales: formData.scales,
              })
          );
        }

        await Promise.all(promises);
      }

      navigate(`/admin/detail-review-section/${id}`);
      toast.success("Tạo câu hỏi thành công!");
      console.log("Tạo câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi tạo câu hỏi:", error);
      throw error;
    }
  };

  return (
    <div className="add-form-container">
      <IoCloseOutline className="close-icon" onClick={handleCloseModal} />

      <div className="form-group" style={{ marginBottom: "1vh" }}>
        <label className="form-label">Loại trả lời</label>
        <select
          className="form-select form-select-review question-select"
          name="answerType"
          onChange={handleSelectChange}
        >
          <option value="">Chọn loại trả lời</option>
          {type.map((item) => (
            <option key={item.id} value={item.answerTypeName}>
              {item.answerTypeName}
            </option>
          ))}
        </select>
        {formErrors.showAnswerTypeError && (
          <label className="error-label">* Hãy chọn loại trả lời</label>
        )}
      </div>

      {typeForm === "Radio" ? (
        <RadioQuestion />
      ) : typeForm === "Matrix" ? (
        <MatrixQuestion
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      ) : null}

      <button
        className="button primary-button modal-button button-review"
        onClick={handleCreateQuestion}
      >
        Tạo
      </button>
    </div>
  );
}
