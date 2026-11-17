const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());

let foods = [
  { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
  { id: 2, foodName: 'Veg Burger', category: 'Fast Food', price: 120, availability: true },
  { id: 3, foodName: 'Masala Dosa', category: 'South Indian', price: 150, availability: true }
];

app.get('/foods', (req, res) => {
  res.status(200).json(foods);
});

app.get('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id, 10);
  const food = foods.find((item) => item.id === foodId);

  if (!food) {
    return res.status(404).json({ error: `Food item with ID ${foodId} not found` });
  }

  res.status(200).json(food);
});

app.post('/foods', (req, res) => {
  const { id, foodName, category, price, availability } = req.body;

  if (
    id === undefined ||
    !foodName ||
    !category ||
    price === undefined ||
    typeof price !== 'number' ||
    price <= 0 ||
    typeof availability !== 'boolean'
  ) {
    return res.status(400).json({
      error: 'Invalid input. Ensure id, foodName, category, availability (boolean), and a positive numeric price are provided.'
    });
  }

  if (foods.some((item) => item.id === id)) {
    return res.status(400).json({ error: `Food item with ID ${id} already exists` });
  }

  const newFood = { id, foodName, category, price, availability };
  foods.push(newFood);

  res.status(201).json({
    message: 'Food item added successfully',
    food: newFood
  });
});

app.put('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id, 10);
  const foodIndex = foods.findIndex((item) => item.id === foodId);

  if (foodIndex === -1) {
    return res.status(404).json({ error: `Food item with ID ${foodId} not found` });
  }

  const { foodName, category, price, availability } = req.body;

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (!foodName || !category || price === undefined || typeof availability !== 'boolean') {
    return res.status(400).json({
      error: 'Missing required fields: foodName, category, price, and availability'
    });
  }

  foods[foodIndex] = {
    id: foodId,
    foodName,
    category,
    price,
    availability
  };

  res.status(200).json({
    message: 'Food item updated successfully',
    food: foods[foodIndex]
  });
});

app.delete('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id, 10);
  const foodIndex = foods.findIndex((item) => item.id === foodId);

  if (foodIndex === -1) {
    return res.status(404).json({ error: `Food item with ID ${foodId} not found` });
  }

  const deletedFood = foods.splice(foodIndex, 1)[0];

  res.status(200).json({
    message: 'Food item deleted successfully',
    food: deletedFood
  });
});

app.use((req, res) => {
  res.status(404).json({ error: '404 Endpoint Not Found' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});