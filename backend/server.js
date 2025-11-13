import express from 'express';
import cors from 'cors';
import connetDB from './config/db.js';
import { errorHandler } from './middleware/middleware.js';
import router from './routes/routes.js';
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'


connetDB()

const app = express();

app.use(cors(
  { origin: 'http://localhost:5173',
    credentials: true,
   }
));
app.use(express.json());

// Routes
// app.use('/api', router);
app.use('/api',authRoutes)
app.use('/api/upload',uploadRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(3000, function() {
    console.log("Server running on port 3000");
});
