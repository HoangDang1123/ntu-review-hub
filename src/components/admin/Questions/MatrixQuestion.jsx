import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function MatrixQuestion({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
}) {
  const [inputValues, setInputValues] = useState([
    { question: "", answer: "" },
  ]);
  const [showInputError, setShowInputError] = useState([]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      answers: inputValues.filter((item) => item.question.trim() !== ""),
    }));
  }, [inputValues, setFormData]);

  const handleAddInput = () => {
    if (inputValues[inputValues.length - 1].question === "") {
      const newErrors = [...showInputError];
      newErrors[newErrors.length - 1] = true;
      setShowInputError(newErrors);
      return;
    }

    setInputValues([...inputValues, { question: "", answer: "" }]);
    setShowInputError([...showInputError, false]);
  };

  const handleDeleteInput = (index) => {
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);

    const newErrors = [...showInputError];
    newErrors.splice(index, 1);
    setShowInputError(newErrors);
  };

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = { question: value, answer: "" };
    setInputValues(newInputValues);

    const newErrors = [...showInputError];
    newErrors[index] = value === "";
    setShowInputError(newErrors);
  };

  const handleInputQuestionChange = (e) => {
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
  };

  useEffect(() => {
    if (inputValues.length === 0) {
      setInputValues([{ question: "", answer: "" }]);
      setShowInputError([false]);
    }
  }, [inputValues.length]);

  return (
    <div className="type-container">
      <div className="form-group">
        <label className="form-label">Câu hỏi</label>
        <input
          className="form-input form-input-review question-input"
          placeholder="Nhập câu hỏi"
          type="text"
          name="question"
          value={formData.question}
          onChange={handleInputQuestionChange}
          required
        />
        {formErrors.showQuestionError && (
          <label className="error-label">* Hãy nhập tên đợt đánh giá</label>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: "3vh" }}>
        <label className="form-label">Thang đo</label>
        <select
          className="form-select form-select-review question-select"
          name="scales"
          value={formData.scales}
          onChange={handleInputQuestionChange}
        >
          <option value="">Chọn thang đo</option>
          <option value="satisfaction">
            Rất không hài lòng - Không hài lòng - Trung lập - Hài lòng - Rất hài
            lòng
          </option>
          <option value="importance">
            Không quan trọng - Ít quan trọng - Trung bình - Quan trọng - Rất
            quan trọng
          </option>
          <option value="frequency">
            Không bao giờ - Hiếm khi - Thỉnh thoảng - Thường xuyên - Luôn luôn
          </option>
        </select>
        {formErrors.showScalesError && (
          <label className="error-label">* Hãy chọn thang đo</label>
        )}
      </div>

      <label className="form-label">Mục</label>
      <div className="input-container">
        {inputValues.map((value, index) => (
          <div key={index} className="item-input-container">
            <label>{`Mục ${index + 1}`}</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                className="item-question-input"
                type="text"
                value={value.question}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              <IoCloseOutline
                className="close-icon item-close-icon"
                onClick={() => handleDeleteInput(index)}
              />
            </div>
            {(showInputError[index] || formErrors.showAnswerError) && (
              <label className="error-label">* Hãy nhập thông tin</label>
            )}
          </div>
        ))}
        <button
          className="button primary-button add-item-button"
          onClick={handleAddInput}
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
