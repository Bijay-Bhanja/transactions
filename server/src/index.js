const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const cors=require("cors")
app.use(cors())
app.use(express.json())
const PORT = 5000;



mongoose.connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true })
.then((e)=>{
    console.log("created mongoo");
})

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    sold: Boolean,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
        console.log(response)
        

        const transactions = response.data.map(item => ({
            title: item.title,
            description: item.description,
            price: item.price,  
            dateOfSale: new Date(item.dateOfSale),
            category: item.category
        }));

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);
        res.status(200).send('Database initialized with seed data.');
      
    } catch (error) {
        res.status(500).send('Error initializing database.');
    }
});

app.get('/api/transactions', async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;

    if (!month) {
        return res.status(400).send('Month is required');
    }

    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    // Initialize the query object
    const query = {
        dateOfSale: {
            $gte: startDate,
            $lt: endDate
        }
    };

    // Build the $or array for title and description regex search
    const orArray = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
    ];

    // Check if the search term is a valid number and add price search condition
    const searchNumber = parseFloat(search);
    if (!isNaN(searchNumber)) {
        orArray.push({ price: searchNumber });
    }

    // Add the $or array to the query
    if (search) {
        query.$or = orArray;
    }

    try {
        const totalCount = await Transaction.countDocuments(query);
        console.log('Total Count:', totalCount);

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        console.log('Transactions:', transactions);

        res.json({
            transactions,
            totalPages: Math.ceil(totalCount / perPage)
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).send('Month is required');
    }
  
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  
    try {
      const transactions = await Transaction.find({
        dateOfSale: {
          $gte: startDate,
          $lt: endDate,
        },
      });
  
      const totalSales = transactions.reduce((acc, transaction) => acc + transaction.price, 0);
      const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
      const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;
  
      res.json({
        totalSales,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).send('Server Error');
    }
});


app.get('/api/barChart', async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).send('Month is required');
    }
  
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  
    try {
      const transactions = await Transaction.find({
        dateOfSale: {
          $gte: startDate,
          $lt: endDate,
        },
      });
  
      const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity },
      ];
  
      const barData = priceRanges.map(range => {
        const count = transactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length;
        return { range: range.range, count };
      });
  
      res.json(barData);
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).send('Server Error');
    }
});


const categories = [
    'Category A',
    'Category B',
    'Category C',
    'Category D',
    // Add more categories as needed
];

// Endpoint for fetching pie chart data
app.get('/api/pieChart', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
    }

    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const data = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Format data to match pie chart expectations
        const formattedData = categories.map(category => ({
            name: category,
            value: data.find(item => item._id === category)?.count || 0,
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));