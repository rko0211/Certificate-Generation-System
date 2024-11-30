import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ViewCertificate.css";

const ViewCertificate = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCertificatesData = async () => {
      try {
        const response = await axios.get("https://certificate-generation-system-backend.onrender.com/viewcertificate");
        setData(response.data);
      } catch (error) {
        toast.error("Failed to fetch certificates.");
      }
    };
    fetchCertificatesData();
  }, []);

  const deleteCertificate = async (id) => {
    try {
      await axios.delete(`https://certificate-generation-system-backend.onrender.com/${id}`);
      toast.success("Certificate deleted successfully.");
      setData((prev) => prev.filter((cert) => cert._id !== id));
    } catch {
      toast.error("Failed to delete certificate.");
    }
  };

  return (
    <div className="table-container">
      {data.length === 0 ? (
        <p className="no-data-message">No certificates found.</p> // Show this message if data is empty
      ) : (
        <div className="responsive-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Row Number</th>
                <th>Email</th>
                <th>Drive Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.email}</td>
                  <td>
                    <a
                      href={row.WebViewLink || "#"}
                      target="_blank"
                      className="drivelink"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!row.WebViewLink) {
                          e.preventDefault();
                          toast.error("Invalid drive link.");
                        }
                      }}
                    >
                      View Certificate
                    </a>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => deleteCertificate(row._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCertificate;
