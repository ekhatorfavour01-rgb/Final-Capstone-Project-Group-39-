const express = require('express');
const cors = require('cors');
const { PORT } = require("./Config/env");
const connectDB = require("./Config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with an error code
});