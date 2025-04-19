import React, { useState } from 'react';

function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add logic to save this data to Firestore
    console.log({ amount, category, type, date, notes });
  };

  return (
    <div className="container py-4 mt-5">
      <h2 className="text-light">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label text-light">Amount</label>
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
          <label htmlFor="category" className="form-label text-light">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label text-light">Type</label>
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label text-light">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notes" className="form-label text-light">Notes</label>
          <textarea
            className="form-control"
            id="notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Add Transaction</button>
      </form>
    </div>
  );
}

export default AddTransaction;
