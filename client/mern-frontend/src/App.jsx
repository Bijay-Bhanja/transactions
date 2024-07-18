
import React, { useState } from 'react';
import './App.css';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import PriceBarChart from './components/BarChart';
// import CategoryPieChart from './components/PieChart';

const App = () => {
    const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
    const [selectedYear, setSelectedYear] = useState(   2021); // Default to 2021

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
        console.log(parseInt(e.target.value))
    };

    return (
        <div className="container">
            <h1>Product Transactions</h1>
            <div className="select-date">
                <div className="select-month">
                    <label>Select Month: </label>
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month} value={month}>
                                {new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}
                                {/* {console.log(new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' }))} */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-year">
                    <label>Select Year: </label>
                    <select value={selectedYear} onChange={handleYearChange}>
                        {[2021, 2022].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <TransactionsTable selectedMonth={selectedMonth} selectedYear={selectedYear} />
            <Statistics selectedMonth={selectedMonth} selectedYear={selectedYear} />
            <h2>Price Range Bar Chart</h2>
            <div className="chart-container">
                <PriceBarChart selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </div>
            {/* <h2>Category Pie Chart</h2> */}
            {/* <div className="chart-container">
                <CategoryPieChart selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </div> */}
        </div>
    );
};

export default App;
