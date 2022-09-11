import React from 'react';
import './App.css';
import {LoginPage} from "./view/LoginPage";
import {FakeApi} from "./api/api";
import {Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./view/DashboardPage";
import {AuthProtectedRoute} from "./view/AuthProtectedRoute";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {
  const api = new FakeApi();
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Navigate to="login"/>}/>
        <Route path="/login" element={<LoginPage api={api}/>}/>
        <Route path="/reminder" element={
          <AuthProtectedRoute api={api}>
            <DashboardPage api={api}/>
          </AuthProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}

export default App;
