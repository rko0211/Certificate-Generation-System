import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CertificateForm from "./components/CertificateForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import './index.css';
import ViewCertificate from "./components/ViewCertificate.jsx";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Router>
        {/* Navbar is placed outside Routes so it remains visible on all pages */}
        <Navbar />

        <Routes>
          <Route path="/" element={<CertificateForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewcertificate" element={<ViewCertificate />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
