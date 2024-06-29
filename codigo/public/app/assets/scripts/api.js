const apiUrl = '/authors';

function displayMessage(message) {
    const messagesContainer = document.getElementById('msgContainer');
    const divMessage = createCustomElement("div", ["alert", "alert-warning", "alert-dismissible", "fade", "show"], message, { role: "alert" });
    const buttonCloseMessage = createCustomElement("button", ["btn-close"], null, {}, { "data-bs-dismiss": "alert" });
    divMessage.append(buttonCloseMessage);
    messagesContainer.append(divMessage);
}

function getAuthors(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler autores via API JSONServer:', error);
            displayMessage("Erro ao ler autores");
        });
}

function createAuthor(author, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Autor inserido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir autor via API JSONServer:', error);
            displayMessage("Erro ao inserir autor");
        });
}

function updateAuthor(id, author, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Autor alterado com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar autor via API JSONServer:', error);
            displayMessage("Erro ao atualizar autor");
        });
}

function deleteAuthor(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Autor removido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover autor via API JSONServer:', error);
            displayMessage("Erro ao remover autor");
        });
}
