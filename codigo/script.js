let cliques = {
    noticia1: 0,
    noticia2: 0,
    noticia3: 0,
    noticia4: 0
};

if (localStorage.getItem('cliques')) {
    cliques = JSON.parse(localStorage.getItem('cliques'));
    for (const noticiaId in cliques) {
        document.getElementById('contagem' + capitalizeFirstLetter(noticiaId)).textContent = cliques[noticiaId];
    }
    atualizarRanking();
}

function contarClique(noticiaId) {

    cliques[noticiaId]++;
    document.getElementById('contagem' + capitalizeFirstLetter(noticiaId)).textContent = cliques[noticiaId];
    localStorage.setItem('cliques', JSON.stringify(cliques));
    atualizarRanking();
}

function atualizarRanking() {
    let cliquesArray = Object.entries(cliques);
    cliquesArray.sort((a, b) => b[1] - a[1]);
    let top3 = cliquesArray.slice(0, 3);
    let rankingContainer = document.getElementById('ranking');
    rankingContainer.innerHTML = '';
    document.querySelectorAll('.noticia').forEach(noticia => noticia.classList.remove('top'));
    top3.forEach(item => {
        let noticiaId = item[0];
        let contagem = item[1];
        let noticiaElement = document.createElement('div');
        noticiaElement.textContent = `${capitalizeFirstLetter(noticiaId)}: ${contagem} cliques`;
        rankingContainer.appendChild(noticiaElement);
        document.getElementById(noticiaId).classList.add('top');
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}