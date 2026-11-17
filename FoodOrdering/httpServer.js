const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const foods = [
  { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
  { id: 2, foodName: 'Veg Burger', category: 'Fast Food', price: 120, availability: true },
  { id: 3, foodName: 'Pasta', category: 'Italian', price: 200, availability: false }
];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the Online Food Ordering Application!</h1><p>Explore /foods, /about, or /menu</p>');
  }

  else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h2>About Us</h2><p>Serving fresh, hot meals</p>');
  }

  else if (url === '/foods' && method === 'GET') {
    const availableFoods = foods.filter((item) => item.availability === true);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(availableFoods));
  }

  else if (url === '/add-food' && method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newFood = JSON.parse(body);
        const { id, foodName, category, price, availability } = newFood;

        if (
          id === undefined ||
          !foodName ||
          !category ||
          price === undefined ||
          typeof availability !== 'boolean'
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              error: 'Missing or invalid required fields: id, foodName, category, price, availability'
            })
          );
        }

        foods.push({ id, foodName, category, price, availability });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Food item added successfully', food: newFood }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  }

  else if (url === '/menu' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'menu.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Internal Server Error: Unable to load menu.html');
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '404 Route Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});