import express from "express";
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Servidor ON`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
  console.log("Servidor en puerto 8080");
});
