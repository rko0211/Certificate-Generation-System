import React, { useState } from "react";
import axios from "axios";
import "./CertificateForm.css";
import { toast } from "react-toastify";

const CertificateForm = () => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const URL = `https://certificate-generation-system-backend.onrender.com`;
  // const URL = `http://localhost:8001`;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      course,
      email,
    };

    try {
      setLoading(true); // Start spinner
      await axios.post(`${URL}/`, formData);
      toast.success("Request submitted successfully!");
      setName("");
      setCourse("");
      setEmail("");
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
      }
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="certificate-form-container">
      {loading && (
        <div className="loading-spinner">
          {/* The spinner */}
        </div>
      )}
      {!loading && (
        <>
          <h2 className="form-heading">Request Certificate</h2>
          <form onSubmit={handleSubmit} className="certificate-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                name="name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="course" className="form-label">
                Course
              </label>
              <input
                type="text"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="form-input"
                name="course"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Student Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                name="email"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CertificateForm;
