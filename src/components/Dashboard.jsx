import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash, FaMoneyBillWave, FaPlus, FaList } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import APP_NAME from "../config";

const Dashboard = () => {
  const [income, setIncome] = useState("");
  const [incomeData, setIncomeData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const categoryArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(categoryArray);
  };

  // Fetch income data from Firestore
  const fetchIncome = async () => {
    const incomeCollection = collection(db, "income");
    const snapshot = await getDocs(incomeCollection);
    const incomeArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIncomeData(incomeArray);
  };

  // Fetch expenses data from Firestore
  const fetchExpenses = async () => {
    const expensesCollection = collection(db, "expenses");
    const snapshot = await getDocs(expensesCollection);
    const expensesArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setExpenses(expensesArray);
  };

  // Format date to get month and year
  const getMonthYear = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  // Filter income and expenses based on selected month
  const filteredIncome = incomeData.filter((item) => {
    const date = item.date?.toDate();
    return getMonthYear(date) === selectedMonth;
  });

  const filteredExpenses = expenses.filter((item) => {
    const date = item.date?.toDate();
    return getMonthYear(date) === selectedMonth;
  });

  // Calculate total income, total expense, and remaining balance
  const totalIncome = filteredIncome.reduce(
    (acc, item) => acc + parseFloat(item.amount || 0),
    0
  );
  const totalExpense = filteredExpenses.reduce(
    (acc, item) => acc + parseFloat(item.amount || 0),
    0
  );
  const remaining = totalIncome - totalExpense;

  // Add income to Firestore
  const addIncomeToFirestore = async () => {
    if (income) {
      try {
        await addDoc(collection(db, "income"), {
          amount: parseFloat(income),
          date: Timestamp.now(),
        });
        toast.success("Income added!");
        setIncome("");
        fetchIncome();
      } catch (error) {
        toast.error("Error adding income!");
      }
    } else {
      toast.warning("Enter valid income");
    }
  };

  // Delete income from Firestore
  const deleteIncome = async (id) => {
    if (window.confirm("Are you sure to delete this Income?")) {
      await deleteDoc(doc(db, "income", id));
      toast.success("Deleted!");
      fetchIncome();
    }
  };

  // Add expense to Firestore
  const addExpenseToFirestore = async () => {
    if (expenseCategory && expenseAmount) {
      try {
        const selectedDate = expenseDate
          ? Timestamp.fromDate(new Date(expenseDate))
          : Timestamp.now();

        await addDoc(collection(db, "expenses"), {
          category: expenseCategory,
          amount: parseFloat(expenseAmount),
          date: selectedDate,
        });

        toast.success("Expense added!");
        setExpenseCategory("");
        setExpenseAmount("");
        setExpenseDate(""); // clear optional field
        fetchExpenses();
      } catch (error) {
        toast.error("Error adding expense!");
      }
    } else {
      toast.warning("Fill category & amount");
    }
  };

  // Delete expense from Firestore
  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure to delete this expense?")) {
      await deleteDoc(doc(db, "expenses", id));
      toast.success("Deleted!");
      fetchExpenses();
    }
  };

  // Group expenses by category
  const groupExpensesByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const { category } = expense;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(expense);
      return acc;
    }, {});
  };

  // Group expenses by category
  const expensesByCategory = groupExpensesByCategory(filteredExpenses);

  // useEffect hook to fetch data
  useEffect(() => {
    fetchIncome();
    fetchExpenses();
    fetchCategories();
  }, []);

  return (
    <div
      style={{
        backgroundImage: 'url("https://wallpapercave.com/wp/wp6662135.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <ToastContainer />
        <h2 className="text-center text-dark mb-4"> {APP_NAME}</h2>

        {/* Month Filter */}
        <div className="text-center my-3">
          <label className="form-label fw-bold text-white">Select Month:</label>
          <input
            type="month"
            className="form-control"
            style={{ maxWidth: "300px", margin: "0 auto" }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        {/* Summary */}
        <div className="row text-center mb-4 mt-3">
          <div className="col-md-4 mb-2">
            <div className="card p-3">
              <h4>Total Income</h4>
              <h3 className="text-success">₹{totalIncome.toFixed(2)}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card p-3">
              <h4>Total Expense</h4>
              <h3 className="text-danger">₹{totalExpense.toFixed(2)}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card p-3">
              <h4>Remaining</h4>
              <h3 className="text-warning">₹{remaining.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Income Input */}
        <div className="card p-4 mb-4">
          <h4><FaPlus /> Add Income</h4>
          <input
            type="number"
            className="form-control my-2"
            placeholder="Enter income amount"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addIncomeToFirestore}>
            Add Income
          </button>

          <ul className="mt-3 list-group">
            {filteredIncome.map((item) => (
              <li
                key={item.id}
                className="list-group-item bg-dark text-white d-flex justify-content-between"
              >
                ₹{item.amount} — {item.date?.toDate().toLocaleString()}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteIncome(item.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Expense Input */}
        <div className="card p-4 mb-4">
          <h4><FaPlus /> Add Expense</h4>
          <select
            className="form-select my-2"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control my-2"
            placeholder="Enter amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <input
            type="date"
            className="form-control my-2"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />

          <button className="btn btn-danger" onClick={addExpenseToFirestore}>
            Add Expense
          </button>

          <ul className="mt-3 list-group">
            {filteredExpenses.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white"
              >
                <span>
                  {item.category} — ₹{item.amount} <br />
                  <small>{item.date?.toDate().toLocaleString()}</small>
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteExpense(item.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Category-wise Expenses Section */}
        <div className="card p-4 mb-4">
          <h4><FaList /> Category-wise Expenses</h4>
          {Object.keys(expensesByCategory).length === 0 ? (
            <p>No expenses recorded for any category.</p>
          ) : (
            Object.keys(expensesByCategory).map((category) => (
              <div key={category}>
                <h5>{category}</h5>
                <ul className="list-group mb-3">
                  {expensesByCategory[category].map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white"
                    >
                      <span>
                        ₹{item.amount} <br />
                        <small>{item.date?.toDate().toLocaleString()}</small>
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteExpense(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
