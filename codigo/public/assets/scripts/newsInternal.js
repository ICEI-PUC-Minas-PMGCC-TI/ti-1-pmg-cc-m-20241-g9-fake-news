import { getEndpointDataById, getEndpointData, updateEndpointDataById } from "./api.js";
import { NEWS_ENDPOINT } from "../utils/constants.js";
import { appendAndSortNews } from './index.js';
import { createCustomElement } from '../utils/elements.js';
import { getFormattedDate } from '../utils/utility.js';


function loadRecommendedNews(id) {
  const recommendedNews = document.getElementById("recommendedNews");
  getEndpointData(`${NEWS_ENDPOINT}?id_ne=${id}&_limit=3`, appendAndSortNews(recommendedNews));
}

function loadNews(id) {
  
  getEndpointDataById(NEWS_ENDPOINT, `${id}?_expand=author`, (newsData) => {
    document.title = newsData.title;
    const newsContainer = document.getElementById("newsContainer");
    const {author, ...newsDataWithoutAuthor} = newsData;
    updateEndpointDataById(NEWS_ENDPOINT, id, {...newsDataWithoutAuthor, views: `${parseInt(newsDataWithoutAuthor.views) + 1}`});
    newsContainer.innerHTML = newsData.content;
    newsContainer.prepend(createCustomElement("h5", ["text-center"], newsData.subtitle));
    newsContainer.prepend(createCustomElement("img", ["img-fluid", "mx-auto", "my-0"], undefined, { src: newsData.image, alt: `Imagem de ${newsData.title}` }));
    newsContainer.prepend(createCustomElement("small", ["text-center"], `Atualizado em ${getFormattedDate(newsData.updatedAt)} por <a style="text-decoration: none" href="author.html?id=${newsData.author.id}">${newsData.author.name}</a>`));
    newsContainer.prepend(createCustomElement("h1", undefined, newsData.title));
  });
}

window.onload = () => {
  const params = new URL(document.location).searchParams;
  const id = parseInt(params.get("id"));
  loadNews(id);
  loadRecommendedNews(id);
}