import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './BarChart.css';

const PriceBarChart = ({ selectedMonth }) => {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        const fetchBarData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/barChart'
                    , {
                    params: { month: selectedMonth }
                });
                setBarData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBarData();
    }, [selectedMonth]);

    return (
        <BarChart
            width={600}
            height={300}
            data={barData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default PriceBarChart;
