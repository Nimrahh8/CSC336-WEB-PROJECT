// app.js - Main Express Server (Simplified)
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const indexRouter = require('./routes/index');
const checkoutRouter = require('./routes/checkout');
const crudRouter = require('./routes/crud');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware - Use Express's built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/checkout', checkoutRouter);
app.use('/crud', crudRouter);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f6fa;
            }
            .error-container { text-align: center; }
            h1 { color: #cc2b7d; font-size: 72px; margin: 0; }
            p { font-size: 24px; color: #333; }
            a { color: #cc2b7d; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>404</h1>
            <p>Page Not Found</p>
            <a href="/">Go Home</a>
        </div>
    </body>
    </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
