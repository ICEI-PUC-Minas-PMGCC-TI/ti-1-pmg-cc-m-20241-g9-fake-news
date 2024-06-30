import { displayMessage } from '../utils/elements.js';

export function getEndpointData(endpoint, dataRenderer, customMessage) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            dataRenderer(data);
        })
        .catch(error => {
            console.error('Erro ao ler dados:', error);
            displayMessage("Erro ao ler dados");
        });
}

export function getEndpointDataById(endpoint, id, dataRenderer, customMessage) {
    fetch(`${endpoint}/${id}`)
        .then(response => response.json())
        .then(data => {
            dataRenderer(data);
        })
        .catch(error => {
            console.error('Erro ao ler dados:', error);
            displayMessage("Erro ao ler dados");
        });
}

export function createEndpointData(endpoint, data, dataRenderer, customMessage) {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Dados inseridos com sucesso");
            if (dataRenderer)
                dataRenderer();
        })
        .catch(error => {
            console.error('Erro ao inserir dados:', error);
            displayMessage("Erro ao inserir dados");
        });
}

export function updateEndpointDataById(endpoint, id, data, dataRenderer, customMessage) {
    fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Dados alterados com sucesso");
            if (dataRenderer)
                dataRenderer();
        })
        .catch(error => {
            console.error('Erro ao atualizar dados:', error);
            displayMessage("Erro ao atualizar dados");
        });
}

export function deleteEndpointDataById(endpoint, id, dataRenderer, customMessage) {
    fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(_ => {
            displayMessage("Dados removidos com sucesso");
            if (dataRenderer)
                dataRenderer();
        })
        .catch(error => {
            console.error('Erro ao remover dados:', error);
            displayMessage("Erro ao remover dados");
        });
}