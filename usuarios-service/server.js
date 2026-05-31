const express = require('express');
const app = express();
const PORT = 3002; // Porta Usuários

app.use(express.json());

// BD simulado em array
let usuarios = [
    { id: 1, nome: "Paulinho", email: "paulinho@ads.com" },
    { id: 2, nome: "Bia", email: "bia@ads.com" }
];

// Rota 1: GET /usuarios - retornas lista
app.get('/usuarios', (req, res) => {
    res.status(200).json(usuarios);
});

// Rota 2: GET /usuarios/:id - retorna um usuário específico
app.get('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === usuarioId);

    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    
    res.status(200).json(usuario);
});

// Rota 3: POST /usuarios - cadastrando novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    const novoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const novoUsuario = { id: novoId, nome, email };
    usuarios.push(novoUsuario);

    res.status(201).json(novoUsuario);
});

app.listen(PORT, () => {
    console.log(`Usuarios-Service ON na porta ${PORT}`);
});