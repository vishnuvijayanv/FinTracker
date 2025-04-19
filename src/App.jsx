import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/login';
import Sidebar from './components/Sidebar';
import { auth } from './services/firebase'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
import EMIScheduler from './components/EMIScheduler';
import AddTransaction from './components/AddTransaction';
import { requestNotificationPermission } from './services/notification';
import CategoryManager from './components/CategoryManager';
import DailyReport from './components/DailyReport';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log(user);
      
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar is visible only when the user is logged in */}
        {isLoggedIn && <Sidebar />}

        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/emi-scheduler" element={<EMIScheduler />} />
            <Route path="/add-category" element={<CategoryManager />} />
            <Route path="/daily-report" element={<DailyReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
