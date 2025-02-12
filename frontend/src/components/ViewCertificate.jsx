import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ViewCertificate.css";

const ViewCertificate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const URL = `https://certificate-generation-system-backend.onrender.com`;
  // const URL = `http://localhost:8001`;
  useEffect(() => {
    const fetchCertificatesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/viewcertificate`);
        setData(response.data);
      } catch (error) {
        toast.error("Failed to fetch certificates.");
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };
    fetchCertificatesData();
  }, []);

  const deleteCertificate = async (id) => {
    try {
      await axios.delete(`${URL}/delete/viewcertificate/${id}`);
      toast.success("Certificate deleted successfully.");
      setData((prev) => prev.filter((cert) => cert._id !== id));
    } catch {
      toast.error("Failed to delete certificate.");
    }
  };

  return (
    <div className="table-container">
      {loading ? ( // Show spinner while loading
        <div className="loading-spinner">

        </div>
      ) : data.length === 0 ? (
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
