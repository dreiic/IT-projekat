const express = require('express');
const cors = require('cors');
const app = express();

// Privremeno skladište korisnika (kasnije ćemo dodati bazu)
let users = [
    { id: 1, email: "test@example.com", password: "123456", name: "Test Korisnik" }
];

app.use(cors());
app.use(express.json());

// Registracija
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    
    // Provera da li korisnik već postoji
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: "Email već postoji" });
    }
    
    const newUser = { id: users.length + 1, email, password, name };
    users.push(newUser);
    
    res.json({ success: true, user: newUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: "Pogrešni podaci" });
    }
    
    res.json({ success: true, user });
});

// Ruta za igre (zaštitićemo je kasnije)
app.get('/api/games', (req, res) => {
    res.json([
        { id: 1, title: "The Witcher 3", rating: 5 },
        { id: 2, title: "Cyberpunk 2077", rating: 4 }
    ]);
});

app.listen(3000, () => console.log('Server radi na portu 3000'));

// Dodajte ispod postojećih ruta
let games = [
    {
        id: 1,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg",
        ratings: [
            { userId: 1, rating: 5, comment: "Najbolja RPG igra ikada!" }
        ]
    },
    // ... ostale igre
];

// Ruta za ocjenjivanje
app.post('/api/games/:id/rate', (req, res) => {
    const gameId = parseInt(req.params.id);
    const { userId, rating, comment } = req.body;
    
    const game = games.find(g => g.id === gameId);
    if (!game) return res.status(404).json({ error: "Igra nije pronađena" });
    
    // Da li je korisnik već ocenio?
    const existingRating = game.ratings.find(r => r.userId === userId);
    if (existingRating) {
        existingRating.rating = rating;
        existingRating.comment = comment;
    } else {
        game.ratings.push({ userId, rating, comment });
    }
    
    res.json({ success: true, game });
});

// Ruta za dobijanje prosečne ocene
app.get('/api/games/:id', (req, res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (!game) return res.status(404).json({ error: "Igra nije pronađena" });
    
    const avgRating = game.ratings.reduce((sum, r) => sum + r.rating, 0) / game.ratings.length;
    
    res.json({
        ...game,
        avgRating: avgRating || 0,
        ratingCount: game.ratings.length
    });
});

// ADMIN RUTE
app.get('/api/admin/games', (req, res) => {
    // Provera admin prava (kasnije ćemo dodati middleware)
    res.json(featuredGames);
});

app.post('/api/admin/games', (req, res) => {
    const { title, genre, cover } = req.body;
    const newGame = {
        id: featuredGames.length + 1,
        title,
        genre,
        cover,
        ratings: []
    };
    featuredGames.push(newGame);
    res.json({ success: true, game: newGame });
});

app.delete('/api/admin/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const index = featuredGames.findIndex(g => g.id === gameId);
    if (index !== -1) {
        featuredGames.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Igra nije pronađena" });
    }
});