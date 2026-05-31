# Atividade: Microsserviços com Node.js e Express

**Aluno:** Paulo Cesar Leite (RA: 2706512)  
**Disciplina:** Programação Web Fullstack  - Prof.: Dr. Dr. Anderson Paulo Avila Santos
**Curso:** ADS - UTFPR - Campus Cornélio Procópio  

## Como executar a aplicação

Este projeto possui 3 microsserviços independentes. Para que a plataforma funcione por completo, é necessário que os 3 estejam rodando ao mesmo tempo.

1. No VScode por exemplo, abra 3 terminais separados.
2. Em cada terminal, acesse as pastas do projeto:
   - `cd catalogo-service`
   - `cd usuarios-service`
   - `cd biblioteca-service`
3. Em cada uma das pastas, instale as dependências executando: `npm install`
4. Após a instalação, inicie cada serviço executando: `npm run dev`

As portas utilizadas são:
- **Catálogo (Jogos):** Porta 3001
- **Usuários:** Porta 3002
- **Biblioteca:** Porta 3000

## Desafios Bonus Implementados
- **Bonus 1:** Tratamento de erros no `biblioteca-service`. Se o catálogo ou o serviço de usuários caírem, a biblioteca retorna um `Status 503 (Serviço Indisponível)`.
- **Bonus 3:** O `catalogo-service` agora persiste os dados utilizando a biblioteca nativa `fs` (File System), gravando num ficheiro no arquivo `dados.json`.

---

## 🧠 Reflexão Obrigatória

**1. O que acontece com a biblioteca se o catalogo-service estiver fora do ar? E se for o usuarios-service?**
Se o `catalogo-service` cair, a biblioteca não conseguirá ir buscar os detalhes dos jogos associados ao usuário. Se o `usuarios-service` cair, a biblioteca não conseguirá identificar quem é o usuário logo no início do processo. Em qualquer situação dessas, como a biblioteca depende da composição dos dados de todos os serviços, o processo é interrompido. No código criado, foi implementado um tratamento (`try/catch` com axios) e se isto acontecer, a aplicação não bloqueia de forma brusca, retornando um erro `503 Service Unavailable` com uma mensagem amigável ao cliente.

**2. Quais são as vantagens desta separação em comparação a um servidor único que faria tudo?**
As maiores vantagens são a escalabilidade e o isolamento. No caso da Gameteca criada, se os de jogos da loja começar a ter muitos acessos, podemos aumentar os recursos (ou criar mais instâncias) apenas do `catalogo-service`, sem mexer no resto. Além disso, se o serviço de usuários tiver um bug crítico e cair, os outros serviços podem continuar rodando para outras operações que não precisem de autenticação (como listar os jogos disponíveis publicamente). Se fosse um projeto do tipo monolito, se um bug grave acontece, o servidor inteiro cai.

**3. Que problemas novos surgem ao trabalhar com microsserviços que não existiam no monolito?**
Surge uma grande complexidade na comunicação. Num monolito, para cruzar dados de utilizadores e jogos, bastaria fazer um `JOIN` rápido no banco de dados. Nos microsserviços, precisamos de fazer requisições HTTP via rede (como foi feito com o `axios`), o que é mais lento e está sujeito a falhas de conexão ou timeouts. Além disso, torna-se muito mais complexo monitorizar a aplicação, pois agora precisamos gerenciar, testar e fazer o deploy de três servidores separados em vez de apenas um.