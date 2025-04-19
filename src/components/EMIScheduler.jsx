import React, { useState, useEffect } from "react";
import { db, messaging } from "../services/firebase";
import { getToken } from "firebase/messaging";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const EMIScheduler = () => {
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY_HERE", // 🔁 Replace this
        });
        console.log("Notification token:", token);
      } else {
        console.warn("Notification permission denied.");
      }
    } catch (err) {
      console.error("Error getting notification permission:", err);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "emis"), {
        amount: Number(amount),
        frequency,
        startDate,
        endDate,
        createdAt: Timestamp.now(),
      });
      alert("EMI Scheduled successfully!");
      setAmount("");
      setFrequency("monthly");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error saving EMI:", error);
      alert("Failed to save EMI");
    }
  };

  return (
    <div
      className=" py-4 "
      style={{
        backgroundImage: 'url("https://wallpaperaccess.com/full/8245243.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
     <div className="container mt-5 text-secondary">
        <h2 className="text-secondary">Schedule EMI</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label text-secondary">
              EMI Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="frequency" className="form-label text-secondary">
              Frequency
            </label>
            <select
              id="frequency"
              className="form-select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label text-secondary">
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label text-secondary">
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save EMI
          </button>
        </form>
     </div>
    </div>
  );
};

export default EMIScheduler;
