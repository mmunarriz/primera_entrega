import { Router } from 'express';
import fs from "fs/promises";

const router = Router();

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
        const newCarrito = { id: newId, products };

        carritos.push(newCarrito);

        // Guardar los datos en el archivo JSON
        await fs.writeFile("./src/carrito.json", JSON.stringify(carritos, null, 2), "utf8");

        res.status(200).send({ message: "Carrito agregado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
