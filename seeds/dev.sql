-- Dev only seed file
TRUNCATE enquiries, properties, users RESTART IDENTITY CASCADE;

-- Seed users (passwords are bcrypt hash of 'password123456')
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@toobrains.com', '$2b$12$TV2Q6snGgLe9tNb4HjIAte55QD64QBh3KT23i1rDZ3khHe0w7wwlu', 'admin'),
('Regular User', 'user@toobrains.com', '$2b$12$TV2Q6snGgLe9tNb4HjIAte55QD64QBh3KT23i1rDZ3khHe0w7wwlu', 'user');

-- Seed properties
INSERT INTO properties (owner_id, title, city, country, price_per_night, bedrooms, status) VALUES
(1, 'Lagos Island Apartment', 'Lagos', 'Nigeria', 50000, 3, 'live'),
(1, 'Abuja Central Flat', 'Abuja', 'Nigeria', 75000, 4, 'live');