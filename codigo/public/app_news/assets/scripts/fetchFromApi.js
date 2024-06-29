// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza as operações de CRUD a partir de uma API baseada no JSONServer
// O servidor JSONServer fica hospedado na seguinte URL
// https://jsonserver.rommelpuc.repl.co/contatos
//
// Para fazer o seu servidor, acesse o projeto do JSONServer no Replit, faça o 
// fork do projeto e altere o arquivo db.json para incluir os dados do seu projeto.
// URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer
//
// Autor: Rommel Vieira Carneiro
// Data: 03/10/2023

// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = '/news';

function displayMessage(message) {
    const messagesContainer = document.getElementById('msgContainer');
    const divMessage = createCustomElement("div", ["alert", "alert-warning", "alert-dismissible", "fade", "show"], message, { role: "alert" });
    const buttonCloseMessage = createCustomElement("button", ["btn-close"], null, {}, { "data-bs-dismiss": "alert" });
    divMessage.append(buttonCloseMessage);
    messagesContainer.append(divMessage);
}

function getNews(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler notícias via API JSONServer:', error);
            displayMessage("Erro ao ler notícias");
        });
}

function createNews(news, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(news),
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Notícia inserida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir notícia via API JSONServer:', error);
            displayMessage("Erro ao inserir notícia");
        });
}

function updateNews(id, news, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(news),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Notícia alterada com sucesso");
            if (refreshFunction)
                refreshFunction(data.tags);
        })
        .catch(error => {
            console.error('Erro ao atualizar notícia via API JSONServer:', error);
            displayMessage("Erro ao atualizar notícia");
        });
}

function deleteNews(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Notícia removida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover notícia via API JSONServer:', error);
            displayMessage("Erro ao remover notícia");
        });
}
