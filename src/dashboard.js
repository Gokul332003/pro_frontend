//dashboard.js

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [buyer, setBuyer] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState('');
  const [milkType, setMilkType] = useState('cow');
  const [salesData, setSalesData] = useState([]);
  const [buyersList] = useState([
    'Bhavani',
    'Sundari',
    'Rajeshwari',
    'Ravi',
    'Rent'
    // Add more buyer names as needed
  ]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('https://mern-task-app-api-ik5y.onrender.com/sales');
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };


  const handleBuyerChange = (e) => {
    setBuyer(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseFloat(e.target.value));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleMilkTypeChange = (e) => {
    setMilkType(e.target.value);
  };
  
  // Inside the Dashboard component

const handleDeleteSale = async (sale) => {
  const url = `https://mern-task-app-api-ik5y.onrender.com/sales/${sale.buyer}/${sale.date}`;
  try {
    await axios.delete(url);
    fetchSalesData();
  } catch (error) {
    console.error('Error deleting sale:', error);
  }
};

  const handleUpdateQuantity = async (sale, newQuantity) => {
    const url = `https://mern-task-app-api-ik5y.onrender.com/sales/${sale.buyer}/${sale.date}`;
    try {
      await axios.put(url, {
        quantity: parseFloat(newQuantity),
      });
      // Quantity updated successfully, fetch the updated sales data
      fetchSalesData();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleAddSale = async () => {
    if (buyer.trim() === '' || quantity === 0 || date.trim() === '') {
      return; // Don't add sale if buyer, quantity, or date is empty
    }
  
    try {
      // Check if an entry already exists for the buyer and date
      const existingSale = salesData.find(
        (sale) => sale.buyer === buyer && sale.date === date
      );
      if (existingSale) {
        const confirmUpdate = window.confirm(
          'An entry already exists for the buyer and date. Do you want to update the quantity?'
        );
        if (confirmUpdate) {
          await handleUpdateQuantity(existingSale, quantity);
        }
      } else {
        await axios.post('https://mern-task-app-api-ik5y.onrender.com/sales', {
          buyer: buyer,
          quantity: quantity,
          date: date,
          milkType: milkType,
        });
  
        setBuyer('');
        setQuantity(0);
        setDate('');
  
        fetchSalesData();
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };  

  const calculateAmount = (quantity) => {
    // Replace with your own calculation logic
    const pricePerLiter = milkType === 'cow' ? 45 : 70;
    return quantity * pricePerLiter;
  };

  const filteredSalesData = salesData.filter((sale) => sale.buyer === buyer);

  const totalLitersPurchased = filteredSalesData.reduce(
    (total, sale) => total + sale.quantity,
    0
  );

  const totalAmountPurchased = filteredSalesData.reduce(
    (total, sale) => total + calculateAmount(sale.quantity),
    0
  );

  const handleResetSalesData = async () => {
    if (!buyer) {
      return; // Only allow resetting sales data when a buyer is selected
    }
  
    try {
      await axios.delete(`https://mern-task-app-api-ik5y.onrender.com/sales/${buyer}/reset`);
      fetchSalesData();
    } catch (error) {
      console.error('Error resetting sales data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Milk Management Dashboard</h1>
      <div className="dashboard__content">
        <div className="dashboard__item">
          <h2 className="dashboard__item-title">Add Milk Sale</h2>
          <form>
            <div className="form-group">
              <label htmlFor="buyer">Buyer:</label>
              <select id="buyer" value={buyer} onChange={handleBuyerChange}>
                <option value="">Select Buyer</option>
                {buyersList.map((buyerName, index) => (
                  <option key={index} value={buyerName}>
                    {buyerName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity (liters):</label>
              <input
                className="input-field"
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="milkType">Milk Type:</label>
              <select
                id="milkType"
                value={milkType}
                onChange={handleMilkTypeChange}
              >
                <option value="cow">Cow Milk</option>
                <option value="buffalo">Buffalo Milk</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
              />
            </div>

            <button type="button" onClick={handleAddSale}>
              Add Sale
            </button>
          </form>
        </div>
        {!buyer && (
          <div className="dashboard__item">
            <h2 className="dashboard__item-title">Overall Sales Summary</h2>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Buyer</th>
                  <th>Total Liters Purchased</th>
                  <th>Total Amount Purchased</th>
                </tr>
              </thead>
              <tbody>
                {buyersList.map((buyerName, index) => {
                  const buyerSalesData = salesData.filter(
                    (sale) => sale.buyer === buyerName
                  );
                  const buyerTotalLitersPurchased = buyerSalesData.reduce(
                    (total, sale) => total + sale.quantity,
                    0
                  );
                  const buyerTotalAmountPurchased = buyerSalesData.reduce(
                    (total, sale) => total + calculateAmount(sale.quantity),
                    0
                  );
                  return (
                    <tr key={index}>
                      <td>{buyerName}</td>
                      <td>{buyerTotalLitersPurchased}</td>
                      <td>{buyerTotalAmountPurchased}</td>
                    </tr>
                  );
                })}
                <tr className="total-row" key="total">
                  <td>Total</td>
                  <td>
                    {salesData.reduce(
                      (total, sale) => total + sale.quantity,
                      0
                    )}
                  </td>
                  <td>
                    {salesData.reduce(
                      (total, sale) =>
                        total + calculateAmount(sale.quantity),
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {buyer && (
          <div className="dashboard__item">
            <h2 className="dashboard__item-title">Sales Data for {buyer}</h2>
            <div className="reset-button-container">
            <button onClick={() => handleResetSalesData(buyer)}>Reset Sales Data</button>
          </div>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Quantity (liters)</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
             <tbody>
              {filteredSalesData.map((sale, index) => (
                <tr key={index}>
                  <td>{formatDate(sale.date)}</td>
                  <td>{sale.quantity}</td>
                  <td>{calculateAmount(sale.quantity)}</td>
                  <td>
                    <button onClick={() => handleDeleteSale(sale)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">
                    Total Liters Purchased: {totalLitersPurchased}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3">
                    Total Amount Purchased: {totalAmountPurchased}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
