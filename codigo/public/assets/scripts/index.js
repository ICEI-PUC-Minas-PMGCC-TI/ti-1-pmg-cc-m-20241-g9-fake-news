import { NEWS_ENDPOINT } from '../utils/constants.js';
import { createCustomElement } from '../utils/elements.js';
import { getEndpointData } from './api.js';
import { getFormattedDate } from '../utils/utility.js';

export function createNewsList(newsData) {
  // Card Div
  const anchorCard = createCustomElement("a", ["card", "mb-3", "position-relative"], undefined, { href: `newsInternal.html?id=${newsData.id}` });

  // Row Div
  const divRow = createCustomElement("div", ["row", "g-0"]);

  // Card Image Div
  const divCardImage = createCustomElement("div", ["col-md-4"]);
  const imgNews = createCustomElement("img", ["img-fluid", "rounded-start", "h-100", "w-100"], undefined, { src: newsData.image, alt: `Imagem de ${newsData.title}` });

  // Card Text Div
  const divCardText = createCustomElement("div", ["col-md-8"]);
  const divCardBody = createCustomElement("div", ["card-body", "d-flex", "flex-column", "gap-2"]);
  const h5NewsTitle = createCustomElement("h5", ["card-title"], newsData.title);
  const pNewsDescription = createCustomElement("p", ["card-text"], newsData.description);
  const pNewsDates = createCustomElement("p", ["card-text", "d-flex", "align-items-center"]);
  const smallNewsUpdateDate = createCustomElement("small", ["text-body-secondary"], `Atualizado em ${getFormattedDate(newsData.updatedAt)}`);
  const divCategoryTags = createCustomElement("div", ["col-sm-12", "d-flex", "flex-wrap", "gap-2"]);
  const divButtonGroup = createCustomElement("div", ["btn-group"], undefined, { role: "group" });

  newsData.tags.forEach((tag) => {
    const spanCategoryTag = createCustomElement("span", ["badge", "text-bg-dark"], tag);
    divCategoryTags.append(spanCategoryTag);
  });

  // Custom Tags Div
  const divCustomTags = createCustomElement("div", ["position-absolute", "custom-tags-container"]);

  if (newsData.fake) {
    const spanFakeTag = createCustomElement("span", ["custom-tags", "bg-danger", "border", "border-danger"], "fake")
    divCustomTags.append(spanFakeTag);
  }

  if (newsData.featured) {
    const spanFeaturedTag = createCustomElement("span", ["custom-tags", "bg-warning", "border", "border-warning"], " Em Destaque");
    const iFireIcon = createCustomElement("i", ["bi", "bi-fire", "text-danger"])
    spanFeaturedTag.prepend(iFireIcon);
    divCustomTags.append(spanFeaturedTag);
  }

  const spanViewsTag = createCustomElement("span", ["custom-tags", "bg-dark", "border", "border-dark"], ` ${newsData.views}`);
  const iEyeIcon = createCustomElement("i", ["bi", "bi-eye-fill"]);

  // Appends
  anchorCard.append(divRow);
  anchorCard.append(divCustomTags);

  divRow.append(divCardImage);
  divRow.append(divCardText);

  divCardImage.append(imgNews);

  divCardText.append(divCardBody);

  divCardBody.append(h5NewsTitle);
  divCardBody.append(pNewsDescription);
  divCardBody.append(pNewsDates);
  divCardBody.append(divCategoryTags);
  divCardBody.append(divButtonGroup);

  pNewsDates.append(smallNewsUpdateDate);

  spanViewsTag.prepend(iEyeIcon);

  divCustomTags.append(spanViewsTag);

  return anchorCard;
}

function loadNewsData() {
  const newsContainer = document.getElementById("newsContainer");

  newsContainer.innerHTML = "";

  getEndpointData(`${NEWS_ENDPOINT}`, appendAndSortNews(newsContainer));
}

export function appendAndSortNews(appendTo) {
  return (news) => {
    news
      .sort((newsA, newsB) => {
        if (newsA.featured && newsB.featured) return newsB.views - newsA.views;
        if (newsA.featured) return -1;
        if (newsB.featured) return 1;
        return newsB.views - newsA.views;
      })
      .forEach((newsData) => { appendTo.append(createNewsList(newsData)); });
  }
}

function init() {
  loadNewsData();
}

window.onload = async () => {
  init();
};
