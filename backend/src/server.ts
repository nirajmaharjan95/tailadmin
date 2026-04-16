import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './routes/employeeRoutes.js';
import productRouter from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.set('etag', false);
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api/employees', router);
app.use('/api/products', productRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
