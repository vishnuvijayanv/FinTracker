import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [report, setReport] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);

  const fetchData = async (dateString) => {
    try {
      const selected = new Date(dateString);
      const startOfDay = new Date(selected);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const startOfWeek = new Date(selected);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [incomeSnap, expenseSnap] = await Promise.all([
        getDocs(query(collection(db, "income"), where("date", ">=", Timestamp.fromDate(startOfDay)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
        getDocs(query(collection(db, "expenses"), where("date", ">=", Timestamp.fromDate(startOfDay)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
      ]);

      const income = incomeSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);
      const expense = expenseSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);

      setReport({ income, expense, remaining: income - expense });

      // Weekly Summary
      const [weekIncomeSnap, weekExpenseSnap] = await Promise.all([
        getDocs(query(collection(db, "income"), where("date", ">=", Timestamp.fromDate(startOfWeek)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
        getDocs(query(collection(db, "expenses"), where("date", ">=", Timestamp.fromDate(startOfWeek)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
      ]);

      const weekIncome = weekIncomeSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);
      const weekExpense = weekExpenseSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);
      setWeeklySummary({ income: weekIncome, expense: weekExpense });

      // Monthly Summary
      const [monthIncomeSnap, monthExpenseSnap] = await Promise.all([
        getDocs(query(collection(db, "income"), where("date", ">=", Timestamp.fromDate(startOfMonth)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
        getDocs(query(collection(db, "expenses"), where("date", ">=", Timestamp.fromDate(startOfMonth)), where("date", "<=", Timestamp.fromDate(endOfDay)))),
      ]);

      const monthIncome = monthIncomeSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);
      const monthExpense = monthExpenseSnap.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount || 0), 0);
      setMonthlySummary({ income: monthIncome, expense: monthExpense });

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch report data");
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const chartData = {
    labels: ["Selected Date"],
    datasets: [
      {
        label: "Income",
        data: [report?.income || 0],
        backgroundColor: "#4caf50",
      },
      {
        label: "Expense",
        data: [report?.expense || 0],
        backgroundColor: "#f44336",
      },
    ],
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-vector/blue-pink-halftone-background_53876-99004.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="container text-secondary py-4">
        <h2 className="text-center mb-4">Report</h2>

        <div className="mb-4 text-center">
          <label className="me-2">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control w-auto d-inline"
          />
        </div>

        {report ? (
          <>
            <div style={{ height: "250px" }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            <div className="mt-4">
              <h4>📅 Selected Day</h4>
              <p>Income: ₹{report.income.toFixed(2)}</p>
              <p>Expense: ₹{report.expense.toFixed(2)}</p>
              <p>Remaining: ₹{report.remaining.toFixed(2)}</p>

              <h4 className="mt-4">🗓️ Weekly Summary</h4>
              <p>Income: ₹{weeklySummary?.income.toFixed(2)}</p>
              <p>Expense: ₹{weeklySummary?.expense.toFixed(2)}</p>

              <h4 className="mt-4">📈 Monthly Summary</h4>
              <p>Income: ₹{monthlySummary?.income.toFixed(2)}</p>
              <p>Expense: ₹{monthlySummary?.expense.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
