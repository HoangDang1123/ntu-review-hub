import React, { useEffect, useRef, useState } from "react";
import "../../styles/screens/section.css";

export default function MatrixForm({
  section,
  setSection,
  errors,
  setErrors,
  dataKey,
  index,
}) {
  const questions = section.questions[dataKey];
  const dataRef = useRef(section);

  const satisfaction = [
    "Rất không hài lòng",
    "Không hài lòng",
    "Trung lập",
    "Hài lòng",
    "Rất hài lòng",
  ];

  const importance = [
    "Không quan trọng",
    "Ít quan trọng",
    "Trung bình",
    "Quan trọng",
    "Rất quan trọng",
  ];

  const frequency = [
    "Không bao giờ",
    "Hiếm khi",
    "Thỉnh thoảng",
    "Thường xuyên",
    "Luôn luôn",
  ];

  const [selectedAnswers, setSelectedAnswers] = useState(
    questions.answers.map(() => "")
  );

  useEffect(() => {
    const newData = { ...dataRef.current };
    newData.questions[dataKey].answers = newData.questions[dataKey].answers.map((item, index) => ({
      ...item,
      answer: selectedAnswers[index],
    }));
    dataRef.current = newData;
  }, [selectedAnswers, dataRef, setSection, dataKey]);

  const handleRadioClick = (rowIndex, columnIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[rowIndex] =
    questions.scales === "satisfaction"
        ? satisfaction[columnIndex]
        : questions.scales === "importance"
        ? importance[columnIndex]
        : frequency[columnIndex];
    setSelectedAnswers(newSelectedAnswers);
  };

  return (
    <div className="section-container section-question-container">
      <label>{`Câu ${index + 1}: ${questions.question}`}</label>
      {questions.scales === "satisfaction" ? (
        <label className="scale-label section-form-label">
          {satisfaction.map((label, index) => (
            <span key={index}>
              {index + 1}: {label} -{" "}
            </span>
          ))}
        </label>
      ) : questions.scales === "importance" ? (
        <label className="scale-label section-form-label">
          {importance.map((label, index) => (
            <span key={index}>
              {index + 1}: {label} -{" "}
            </span>
          ))}
        </label>
      ) : (
        <label className="scale-label section-form-label">
          {frequency.map((label, index) => (
            <span key={index}>
              {index + 1}: {label} -{" "}
            </span>
          ))}
        </label>
      )}

      <div>
        <table className="section-table">
          <thead>
            <tr className="section-table-header">
              <th></th>
              {questions.scales === "satisfaction"
                ? satisfaction.map((_, index) => (
                    <th key={index} style={{ paddingLeft: "1.4vw" }}>
                      {index + 1}
                    </th>
                  ))
                : questions.scales === "importance"
                ? importance.map((_, index) => (
                    <th key={index} style={{ paddingLeft: "1.4vw" }}>
                      {index + 1}
                    </th>
                  ))
                : frequency.map((_, index) => (
                    <th key={index} style={{ paddingLeft: "1.4vw" }}>
                      {index + 1}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {questions.answers.map((answer, rowIndex) => (
              <tr key={rowIndex} className="section-table-item">
                {errors && errors[rowIndex] ? (
                  <td className="section-question-label">
                    {answer.question}
                    <span style={{ color: "red", fontWeight: "bold", marginLeft: "0.5vw" }}>*</span>
                  </td>
                ) : (
                  <td>{answer.question}</td>
                )}
                {questions.scales === "satisfaction"
                  ? satisfaction.map((_, columnIndex) => (
                      <td key={columnIndex}>
                        <input
                          className="section-radio"
                          type="radio"
                          name={`row-${rowIndex}-column-${columnIndex}-${questions.id}`}
                          checked={
                            selectedAnswers[rowIndex] ===
                            satisfaction[columnIndex]
                          }
                          onChange={() =>
                            handleRadioClick(rowIndex, columnIndex)
                          }
                        />
                      </td>
                    ))
                  : questions.scales === "importance"
                  ? importance.map((_, columnIndex) => (
                      <td key={columnIndex}>
                        <input
                          className="section-radio"
                          type="radio"
                          name={`row-${rowIndex}-column-${columnIndex}`}
                          checked={
                            selectedAnswers[rowIndex] ===
                            importance[columnIndex]
                          }
                          onChange={() =>
                            handleRadioClick(rowIndex, columnIndex)
                          }
                        />
                      </td>
                    ))
                  : frequency.map((_, columnIndex) => (
                      <td key={columnIndex}>
                        <input
                          className="section-radio"
                          type="radio"
                          name={`row-${rowIndex}-column-${columnIndex}`}
                          checked={
                            selectedAnswers[rowIndex] === frequency[columnIndex]
                          }
                          onChange={() =>
                            handleRadioClick(rowIndex, columnIndex)
                          }
                        />
                      </td>
                    ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
