const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.js");

const PORT = 5000;

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/products")
  .then(() => {
    console.log("Успешное подключение к БД");
  })
  .catch((error) => {
    console.log("Ошибка при подключении к БД: " + error);
  });

app.get("/televizor", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
    console.log(products);
  } catch (error) {
    console.log("Ошибка при получении телевизоров: " + error);
    res.status(500).json({ error: "Ошибка при получении телевизоров" });
  }
});

app.post("/addtelevizor1", async (req, res) => {
  try {
    const { title, description, price, model } = req.body;
    const newProduct = await Product.create({
      title,
      description,
      price,
      model,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Ошибка при создании телевизора: " + error);
    res.status(500).json({ error: "Ошибка при создании телевизора" });
  }
});

app.patch("/televizor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, model } = req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price, model },
      { new: true }
    );

    if (!updateProduct) {
      return res.status(404).send("Телевизор не найден");
    }

    res.json(updateProduct);
  } catch (error) {
    console.error("Не удалось выполнить команду:", error);
    res.status(500).send("Произошла ошибка");
  }
});

app.delete("/deletetelevizor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send("Телевизор не найден");
    }

    res.send("Телевизор успешно удален!");
  } catch (error) {
    console.log("Ошибка при удалении: " + error);
    res.status(500).send("Ошибка при удалении");
  }
});

app.listen(PORT, () => {
  console.log("Сервер успешно запущен на порту: " + PORT);
});
