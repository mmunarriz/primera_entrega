import { Router } from 'express';
import fs from "fs/promises";

const router = Router();

// Listar los productos de un carrito específico
router.get("/:cid", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/carrito.json", "utf8");
        const carritos = JSON.parse(data);

        // Obtener el ID del carrito de los parámetros de la ruta
        const carritoId = parseInt(req.params.cid);

        // Buscar el carrito por su ID
        const carrito = carritos.find(c => c.id === carritoId);

        if (!carrito) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        // Obtener la lista de productos del carrito
        const products = carrito.products;

        res.status(200).send({ products });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/carrito.json", "utf8");
        const carritos = JSON.parse(data);

        // Recibe un objeto JSON con los datos del nuevo carrito
        const { products } = req.body; // Obtener solamente "products" del req.body

        // Busca el último id existente y genera el nuevo id
        const lastCarritoId = carritos.length > 0 ? carritos[carritos.length - 1].id : 0;
        const newId = lastCarritoId + 1;

        // Crear el nuevo objeto del carrito
        const newCarrito = { id: newId, products }; // products es un arreglo donde se almacenan los productos del carrito

        carritos.push(newCarrito);

        // Guardar los datos en el archivo JSON
        await fs.writeFile("./src/carrito.json", JSON.stringify(carritos, null, 2), "utf8");

        res.status(200).send({ message: "Carrito agregado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/carrito.json", "utf8");
        const carritos = JSON.parse(data);

        // Obtener el ID del carrito y el ID del producto de los parámetros de la ruta
        const carritoId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Obtener la cantidad del producto
        const { quantity } = req.body;

        // Buscar el carrito por su ID
        const carrito = carritos.find(c => c.id === carritoId);

        if (!carrito) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        // Agregar un nuevo objeto de producto al arreglo "products" dentro del carrito
        // Verificar si el producto ya existe en el carrito
        const existingProduct = carrito.products.find(p => p.product.id === productId);

        if (existingProduct) {
            // Si el producto ya existe, incrementar el campo quantity
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito
            const product = { id: productId };
            carrito.products.push({ product, quantity });
        }

        // Guardar los datos en el archivo JSON
        await fs.writeFile("./src/carrito.json", JSON.stringify(carritos, null, 2), "utf8");

        res.status(200).send({ message: "Producto agregado al carrito exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
