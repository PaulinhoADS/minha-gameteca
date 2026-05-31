const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000; // Porta principal - Biblioteca

app.use(express.json());

// relaciona o que cada usuario tem
let biblioteca = [
    { usuarioId: 1, jogoId: 1 },
    { usuarioId: 1, jogoId: 2 }
];

// Rota 1: POST /biblioteca - adicionando um jogo à biblioteca de um usuário
app.post('/biblioteca', (req, res) => {
    const { usuarioId, jogoId } = req.body;

    biblioteca.push({ usuarioId, jogoId });

    res.status(201).json({ mensagem: "Jogo associado ao usuário com sucesso!" });
});

// Rota 2: GET /biblioteca/:usuarioId - O motor dos Microsserviços
app.get('/biblioteca/:usuarioId', async (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);

    try {
        // Em usuarios-service busca usuario
        const respostaUsuario = await axios.get(`http://localhost:3002/usuarios/${usuarioId}`);
        const usuario = respostaUsuario.data;

        // Filtra quais são os IDs dos jogos que o usuario possui
        const relacoes = biblioteca.filter(b => b.usuarioId === usuarioId);
        const jogosIds = relacoes.map(b => b.jogoId);

        // Busca em catalogo-service os detalhes de cada jogo. Se possuir mais jogos, utiliza Promise.all para buscar todos
        const promessasJogos = jogosIds.map(id => axios.get(`http://localhost:3001/jogos/${id}`));
        const respostasJogos = await Promise.all(promessasJogos);
        const jogosCompletos = respostasJogos.map(resposta => resposta.data); // Limpa a resposta do axios, extraindo apenas os dados

        // Montando o objeto final conforme requisito
        const respostaFinal = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            jogos: jogosCompletos
        };

        res.status(200).json(respostaFinal);

    } catch (error) {
        // BÓNUS 1: Tratamento de erros de comunicação, se a chamada do axios falhar
        console.error("Falha na comunicação entre serviços:", error.message);
        res.status(503).json({ 
            erro: "Serviço indisponível (503). Não foi possível comunicar com os microsserviços internos do catálogo ou usuários." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Biblioteca-Service ON na porta ${PORT}`);
});