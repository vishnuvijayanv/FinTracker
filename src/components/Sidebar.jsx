import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChartLine,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";
import { auth } from "../services/firebase"; // Make sure the firebase configuration is correct
import { signOut } from "firebase/auth";
import APP_NAME from "../config";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase signOut method
      console.log("User logged out successfully");
      // Optionally, redirect the user to login page after logout
      window.location.href = "/"; // Change '/login' to the route of your login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Toggle button for small screens */}
      {!isOpen && (
        <button className="btn toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      <div
        className={`sidebar d-flex flex-column justify-content-between ${
          isOpen ? "open" : ""
        }`}
      >
        <div>
          <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
            <h5 className="m-0 text-white">{APP_NAME}</h5>
            {/* Close button */}
            <button className="btn text-white" onClick={closeSidebar}>
              <FaTimes />
            </button>
          </div>

          <ul className="list-unstyled px-3 mt-3">
            <li className="mb-3">
              <a href="/dashboard" className="d-flex align-items-center">
                 📊 Dashboard
              </a>
            </li>
            <li className="mb-3">
              <a href="/emi-scheduler" className="d-flex align-items-center">
                 📅 EMI Scheduler
              </a>
            </li>
            <li className="mb-3">
              <a href="/add-category" className="d-flex align-items-center">
                 ➕ Add Category
              </a>
            </li>
            <li className="mb-3">
              <a href="/daily-report" className="d-flex align-items-center">
                <FaCalendarDay className="me-2" /> Daily Report
              </a>
            </li>
            <li className="mb-3">
              <a href="/weekly-report" className="d-flex align-items-center">
                <FaCalendarWeek className="me-2" /> Weekly Report
              </a>
            </li>
            <li className="mb-3">
              <a href="/monthly-report" className="d-flex align-items-center">
              <FaCalendarAlt className="me-2" /> Monthly Report
              </a>
            </li>
            <li className="mb-3">
              <a href="/yearly-report" className="d-flex align-items-center">
                <FaChartLine className="me-2" /> Yearly Report
              </a>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-3">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
