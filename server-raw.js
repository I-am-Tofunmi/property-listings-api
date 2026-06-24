const http = require('http'); 

const properties = [
    { id: 1, title: 'Sunny Loft Near Park', city: 'Lisbon', pricePerNight: 85 },
    { id: 2, title: 'Cozy Studio Downtown', city: 'Berlin', pricePerNight: 70 },
    { id: 3, title: 'Modern City Flat', city: 'Dublin', pricePerNight: 95 },
];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /properties
    if (method === 'GET' && url === '/properties') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(properties));
        return;
    }

    // GET /properties/:id
    if (method === 'GET' && url.startsWith('/properties/')) {
        const id = parseInt(url.split('/')[2]);
        const property = properties.find(p => p.id === id);
        if (!property) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Property not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(property));
        return;
    }

    // POST /properties
    if (method === 'POST' && url === '/properties') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const newProperty = JSON.parse(body);
                newProperty.id = properties.length + 1;
                properties.push(newProperty);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newProperty));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});