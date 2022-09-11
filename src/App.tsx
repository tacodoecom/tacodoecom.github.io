import React from 'react';
import './App.css';
import {LoginPage} from "./view/LoginPage";
import {FakeApi} from "./api/api";
import {Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./view/DashboardPage";
import {AuthProtectedRoute} from "./view/AuthProtectedRoute";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {NotFoundPage} from "./view/NotFoundPage";
import {MaintenancePage} from "./view/MaintenancePage";

function App() {
  const api = new FakeApi();
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/login" element={<LoginPage api={api}/>}/>
        <Route path="/index.html" element={<Navigate to="/"/>}></Route>
        <Route path="/" element={
          <AuthProtectedRoute api={api}>
            <DashboardPage api={api}/>
          </AuthProtectedRoute>
        }/>
        <Route path="/maintenance" element={<MaintenancePage/>}/>
        <Route path="/notfound" element={<NotFoundPage/>}/>
        <Route path="*" element={<Navigate to="/notfound"/>}/>
      </Routes>
    </div>
  );
}

export default App;
