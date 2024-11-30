import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import { toast } from "react-toastify";
import "./Dashboard.css"; // Link to the CSS file for styling

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("https://certificate-generation-system-backend.onrender.com/dashboard");
        setCertificates(response.data);
      } catch (error) {
        toast.error("Failed to fetch certificates.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCertificates();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true); // Start loading for delete
    try {
      await axios.delete(`https://certificate-generation-system-backend.onrender.com/${id}`);
      toast.success("Certificate deleted successfully.");
      setCertificates((prev) => prev.filter((cert) => cert._id !== id));
    } catch (error) {
      toast.error("Failed to delete certificate.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const submitData = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e, certId, issueDate) => {
    e.preventDefault(); // Prevent default form submission
    const cert = certificates.find((cert) => cert._id === certId);

    if (!cert || !issueDate) {
      toast.error("Missing required fields. Please check the form.");
      return;
    }

    const data = {
      _id: cert._id,
      name: cert.name,
      course: cert.course,
      createdAt: cert.createdAt,
      issueDate,
    };

    setLoading(true); // Start loading for update
    try {
      await axios.post(`https://certificate-generation-system-backend.onrender.com/api/certificates/generate/${certId}`, data);
      toast.success("Certificate generated successfully!");
    } catch (error) {
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleIssueDateChange = (e, certId) => {
    setCertificates(prevCertificates =>
      prevCertificates.map(cert =>
        cert._id === certId ? { ...cert, issueDate: e.target.value } : cert
      )
    );
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Certificate Request</h1>
      {loading ? ( 
        <div className="loading-spinner"></div>
      ) : certificates.length > 0 ? (
        <div className="cards-container">
          {certificates.map((cert) => (
            <form
              key={cert._id}
              className="certificate-card"
              onSubmit={(e) => submitData(e)}
            >
              <div className="card-body">
                <p>
                  <label>Student Name:</label>
                  <span className="data">{cert.name}</span>
                </p>
                <p>
                  <label>Course:</label>
                  <span className="data">{cert.course}</span>
                </p>
                <p>
                  <label>Requested Date:</label>
                  <span className="data">
                    {moment(cert.createdAt).format("MMMM Do YYYY")}
                  </span>
                </p>
                <p>
                  <label>Issue Date:</label>
                  <input
                    type="date"
                    className="issue-date-input"
                    required
                    value={cert.issueDate || ""}
                    onChange={(e) => handleIssueDateChange(e, cert._id)}
                  />
                </p>
              </div>
              <div className="card-footer">
                <button
                  type="submit"
                  className="generate-btn"
                  onClick={(e) => handleSubmit(e, cert._id, cert.issueDate)}
                >
                  Update Certificate
                </button>
                <button
                  type="submit"
                  className="delete-btn"
                  onClick={() => handleDelete(cert._id)}
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      ) : (
        <p className="no-certificates-message">No certificates available.</p>
      )}
    </div>
  );
};

export default Dashboard;
