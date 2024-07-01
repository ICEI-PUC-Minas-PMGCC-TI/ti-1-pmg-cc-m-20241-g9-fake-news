import { getEndpointDataById } from "../assets/scripts/api.js";
import { NEWS_ENDPOINT } from "../assets/utils/constants.js";

function loadNews() {
    const params = new URL(document.location).searchParams;
    const id = parseInt(params.get("id"));

    getEndpointDataById(NEWS_ENDPOINT, `${id}?_expand=author`, (news) => {
        //news - news.id
        //news.author - news.author.id
        const newsItem = data.news[0]; // Pega a primeira notícia como exemplo
        const author = data.authors.find(author => author.id === newsItem.authorId);

        const newsHTML = `
            <h2 class="news-title">${newsItem.title}</h2>
            <p class="news-author">Por ${author ? author.name : 'Autor desconhecido'}</p>
            <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image">
            <p class="news-description">${newsItem.description}</p>
            <div class="news-content">${newsItem.content}</div>
            <p class="news-tags">Tags: ${newsItem.tags.join(', ')}</p>
            <p class="news-views">${newsItem.views} visualizações</p>
        `;

        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = newsHTML;
    });
}

window.onload = () => {
    loadNews();
}