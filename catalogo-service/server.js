const express = require('express');
const fs = require('fs'); // Biblioteca para ler/escrever arquivos (Bónus 3)
const app = express();
const PORT = 3001; // Porta catalogo

app.use(express.json());
const DADOS_ARQUIVO = './dados.json'; // Caminho para arquivo de dados

// Função auxiliar para ler os jogos do arquivo JSON
function lerJogos() {
    const dados = fs.readFileSync(DADOS_ARQUIVO, 'utf-8');
    return JSON.parse(dados);
}

// Função auxiliar para salvar os jogos no arquivo JSON
function salvarJogos(jogos) {
    fs.writeFileSync(DADOS_ARQUIVO, JSON.stringify(jogos, null, 2), 'utf-8');
}

// GET /jogos
app.get('/jogos', (req, res) => {
    const jogos = lerJogos();
    res.status(200).json(jogos);
});

// GET /jogos/:id
app.get('/jogos/:id', (req, res) => {
    const jogos = lerJogos();
    const jogoId = parseInt(req.params.id);
    const jogo = jogos.find(j => j.id === jogoId);

    if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado." });
    
    res.status(200).json(jogo);
});

// POST /jogos
app.post('/jogos', (req, res) => {
    const jogos = lerJogos();
    const { titulo, plataforma, genero } = req.body;

    const novoId = jogos.length > 0 ? Math.max(...jogos.map(j => j.id)) + 1 : 1;
    const novoJogo = { id: novoId, titulo, plataforma, genero };
    
    jogos.push(novoJogo);
    salvarJogos(jogos); // Bónus 3: Salva no arquivo para persistir os dados

    res.status(201).json(novoJogo);
});

// DELETE /jogos/:id
app.delete('/jogos/:id', (req, res) => {
    let jogos = lerJogos();
    const jogoId = parseInt(req.params.id);
    const index = jogos.findIndex(j => j.id === jogoId);

    if (index === -1) return res.status(404).json({ erro: "Jogo não encontrado." });

    jogos.splice(index, 1);
    salvarJogos(jogos); // Atualiza o arquivo após remover

    res.status(200).json({ mensagem: "Jogo excluído com sucesso." });
});

app.listen(PORT, () => {
    console.log(`Catálogo-Service ON na porta ${PORT}`);
});