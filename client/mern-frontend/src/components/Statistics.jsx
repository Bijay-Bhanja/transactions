import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './Statistics.css'; // Create this file and add custom styles if needed

const Statistics = ({ selectedMonth }) => {
    const [statistics, setStatistics] = useState({ totalSales: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
    // console.log(statistics)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/statistics'
                    , {
                    params: { month: selectedMonth }
                });
                setStatistics(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStatistics();
    }, [selectedMonth]);

    return (
        <div className="statistics">
            <div>
                <h3>Total Sales</h3>
                <p>${statistics.totalSales}</p>
            </div>
            <div>
                <h3>Total Sold Items</h3>
                <p>{statistics.totalSoldItems}</p>
            </div>
            <div>
                <h3>Total Not Sold Items</h3>
                <p>{statistics.totalNotSoldItems}</p>
            </div>
        </div>
    );
};

export default Statistics;
