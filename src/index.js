import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminHomeScreen from "./screens/admin/AdminHomeScreen";
import UserScreen from "./screens/user/UserScreen";
import PersonnelScreen from "./screens/admin/PersonnelScreen";
import UnitScreen from "./screens/admin/UnitScreen";
import SubjectScreen from "./screens/admin/SubjectScreen";
import RoleScreen from "./screens/admin/RoleScreen";
import AddUnit from "./components/admin/Units/AddUnit";
import EditUnit from "./components/admin/Units/EditUnit";
import AddSubject from "./components/admin/Subjects/AddSubject";
import EditSubject from "./components/admin/Subjects/EditSubject";
import AddRole from "./components/admin/Roles/AddRole";
import EditRole from "./components/admin/Roles/EditRole";
import AnswerTypeScreen from "./screens/admin/AnswerTypeScreen";
import ReviewSection from "./screens/admin/ReviewSection";
import AddAnswerType from "./components/admin/AnswerTypes/AddAnswerType";
import EditAnswerType from "./components/admin/AnswerTypes/EditAnswerType";
import AddReviewSection from "./components/admin/ReviewSections/AddReviewSection";
import EditReviewSection from "./components/admin/ReviewSections/EditReviewSection";
import DetailReviewScreen from "./screens/admin/DetailReviewScreen";
import AddQuestion from "./components/admin/Questions/AddQuestion";
import EditQuestion from "./components/admin/Questions/EditQuestion";
import AddReviewer from "./components/admin/Reviewer/AddReviewer";
import AddBeReviewed from "./components/admin/Reviewer/AddBeReviewed";
import ProfileScreen from "./screens/user/ProfileScreen";
import HomeScreen from "./screens/user/HomeScreen";
import SectionScreen from "./screens/user/SectionScreen";
import AdminScreen from "./screens/admin/AdminScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="/admin" element={<AdminScreen />}>
        <Route path="" element={<AdminHomeScreen />} />
        <Route path="personnel" element={<PersonnelScreen />} />
        <Route path="unit" element={<UnitScreen />}>
          <Route path="add-unit" element={<AddUnit />} />
          <Route path="edit-unit/:id" element={<EditUnit />} />
        </Route>
        <Route path="subject" element={<SubjectScreen />}>
          <Route path="add-subject" element={<AddSubject />} />
          <Route path="edit-subject/:id" element={<EditSubject />} />
        </Route>
        <Route path="role" element={<RoleScreen />}>
          <Route path="add-role" element={<AddRole />} />
          <Route path="edit-role/:id" element={<EditRole />} />
        </Route>
        <Route path="answer-type" element={<AnswerTypeScreen />}>
          <Route path="add-answer-type" element={<AddAnswerType />} />
          <Route path="edit-answer-type/:id" element={<EditAnswerType />} />
        </Route>
        <Route path="review-section" element={<ReviewSection />}>
          <Route path="add-review-section" element={<AddReviewSection />} />
          <Route
            path="edit-review-section/:id"
            element={<EditReviewSection />}
          />
        </Route>
        <Route
          path="detail-review-section/:id"
          element={<DetailReviewScreen />}
        >
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="edit-question" element={<EditQuestion />} />
          <Route path="add-reviewer" element={<AddReviewer />} />
          <Route path="add-beReviewed" element={<AddBeReviewed />} />
        </Route>
      </Route>

      <Route path="/user/:id" element={<UserScreen />}>
        <Route path="" element={<HomeScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path=":sectionId" element={<SectionScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
