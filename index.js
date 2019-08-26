const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];


//MIDDLEWARES
//-------------------------------
function checkUsers(req, res, next) {
    const { id } = req.params;
    const proj = projects.find(p => p.id == id);

    if (!proj) {

        return res.status(400).json({ error: 'User does not exists' })
    }
    return next();
}
//-------------------------------

//Número de requisições;

function logRequests(req, res, next) {
    numberOfRequests++;

    console.log(`Número de requisições: ${numberOfRequests}`);

    return next();
}

server.use(logRequests);



//-------------------------------
//CRIANDO UM NOVO PROJETO;
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    }

     projects.push(project);

    return res.json({ resposta: 'Projeto cadastrado!!' });

});

//LISTANDO TODOS OS PROJETOS
server.get('/projects', (req, res) => {

    return res.json(projects);
}),

    //Alterando os dado no meu array;
    server.put('/projects/:id', checkUsers, (req, res) => {
        const { id } = req.params;
        const { title } = req.body;

        const proj = projects.find(p => p.id == id);

        proj.title = title;

        return res.json(proj);

    }),

    //Deletetando um projeto
    server.delete('/projects/:id', checkUsers, (req, res) => {
        const { id } = req.params;

        const proj = projects.findIndex(p => p.id == id);

        projects.splice(proj, 1);

        return res.send();

    });


//Adicionando Tarefa;
server.post('/projects/:id/tasks', checkUsers, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const proj = projects.find(p => p.id == id);

    proj.tasks.push(title);

    return res.json(proj);




});

server.listen(5000);