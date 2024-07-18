import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import "./PieChart.css"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4', '#FF4500', '#6A5ACD', '#32CD32'];

const CategoryPieChart = ({ selectedMonth }) => {
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const fetchPieData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pieChart?month=11')
                // , {
                //     params: { month: selectedMonth }
                // });
                const data = response.data.map((item, index) => ({
                    name: item._id,
                    value: item.count,
                    color: COLORS[index % COLORS.length]
                }));
                setPieData(data);
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
            }
        };

        fetchPieData();
    }, [selectedMonth]);

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={pieData}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default CategoryPieChart;
