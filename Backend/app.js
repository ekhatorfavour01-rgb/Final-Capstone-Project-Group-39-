const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Set DNS servers to Google and Cloudflare


const express = require('express');
const cors = require('cors');
const { POST } = require("./Config/env");
const connentDB = require("./Config/db");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const productRoutes = require('./Routes/productRoute');
const orderRoutes = require('./Routes/orderRoute');
const cartRoutes = require('./Routes/cartRoute');
const adminRoutes = require('./Routes/adminRoute');


const errorHandlerMiddleware = require("./Middleware/errorHandlerMiddleware");
const { errorResponse } = require("./Utils/apiResponse");


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'E-commerce API is running' });
});

app.use((req,res) => {
    return errorResponse(res, 404, 'Route not found');
});

// Error handling middleware
app.use(errorHandlerMiddleware);

connentDB().then(() => {
    app.listen(POST, () => {
        console.log(`Server is running on port ${POST}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with an error code
});