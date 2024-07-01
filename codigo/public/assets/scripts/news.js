import { AUTHOR_ACCESS_LEVEL, MANAGER_ACCESS_LEVEL, NEWS_ENDPOINT } from '../utils/constants.js';
import { createCustomElement, createNavbar } from '../utils/elements.js';
import { getDateTime } from '../utils/utility.js';
import { createEndpointData, deleteEndpointDataById, getEndpointData, updateEndpointDataById } from './api.js';
import { redirectUnauthorized } from './login.js';

let user = {};
const newsForm = document.getElementById("registerForm");
const newsFormElements = newsForm.elements;
const newsModal = document.getElementById("registerModal");

function fillFormWithNewsData(newsData) {
  newsFormElements["id"].value = newsData.id;
  newsFormElements["views"].value = newsData.views;
  newsFormElements["createdAt"].value = newsData.createdAt;
  newsFormElements["updatedAt"].value = newsData.updatedAt;
  newsFormElements["author"].value = newsData.author.id;
  newsFormElements["title"].value = newsData.title;
  newsFormElements["subtitle"].value = newsData.subtitle;
  newsFormElements["image"].value = newsData.image;
  newsFormElements["description"].value = newsData.description;
  newsFormElements["featured"].checked = newsData.featured;
  newsFormElements["fake"].checked = newsData.fake;

  tinymce.get("content").setContent(newsData.content);
  $("#tags").val(newsData.tags).trigger("change");
}

function createNewsCard(newsData) {
  // Card Div
  const divCard = createCustomElement("div", ["card", "mb-3", "position-relative"]);

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
  const smallNewsCreationDate = createCustomElement("small", ["text-body-secondary"], `Criado em ${newsData.createdAt} por ${newsData.author.name}`);
  const spanNewsDateDivider = createCustomElement("span", ["flex-grow-1", "mx-5", "border-bottom", "border-black"]);
  const smallNewsUpdateDate = createCustomElement("small", ["text-body-secondary"], `Atualizado em ${newsData.updatedAt} por ${newsData.author.name}`);
  const divCategoryTags = createCustomElement("div", ["col-sm-12", "d-flex", "flex-wrap", "gap-2"]);
  const divButtonGroup = createCustomElement("div", ["btn-group"], undefined, { role: "group" });
  const buttonEdit = createCustomElement("button", ["btn", "btn-primary"], "Editar", { type: "button" }, { "data-bs-toggle": "modal", "data-bs-target": "#registerModal", "data-action-type": "update" });
  const buttonDelete = createCustomElement("button", ["btn", "btn-danger"], "Excluir", { type: "button" });

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

  // Events
  buttonEdit.addEventListener("click", () => {
    newsForm.reset();
    fillFormWithNewsData(newsData);
  });

  buttonDelete.addEventListener("click", () => {
    deleteEndpointDataById(NEWS_ENDPOINT, newsData.id, loadNewsData);
    newsForm.reset();
  });

  // Appends
  divCard.append(divRow);
  divCard.append(divCustomTags);

  divRow.append(divCardImage);
  divRow.append(divCardText);

  divCardImage.append(imgNews);

  divCardText.append(divCardBody);

  divCardBody.append(h5NewsTitle);
  divCardBody.append(pNewsDescription);
  divCardBody.append(pNewsDates);
  divCardBody.append(divCategoryTags);
  divCardBody.append(divButtonGroup);

  pNewsDates.append(smallNewsCreationDate);
  pNewsDates.append(spanNewsDateDivider);
  pNewsDates.append(smallNewsUpdateDate);

  if(user.accessLevel < AUTHOR_ACCESS_LEVEL || (user.accessLevel === AUTHOR_ACCESS_LEVEL && user.id === newsData.author.id)) {
    divButtonGroup.append(buttonEdit);
    divButtonGroup.append(buttonDelete);
  }

  spanViewsTag.prepend(iEyeIcon);

  divCustomTags.append(spanViewsTag);

  return divCard;
}

function submitNews(event) {
  event.preventDefault();
  const textareaContent = tinymce.get("content").getContent({ format: "text" });

  if (!newsForm.checkValidity() || !textareaContent.trim() === "") {
    displayMessage("Preencha o formulário corretamente.");
    return;
  }

  const formData = getFormData();
  const actionType = newsFormElements["submit"].getAttribute("data-action-type");

  const actions = {
    create: () => {
      if (user.accessLevel === AUTHOR_ACCESS_LEVEL) formData.authorId = user.id;
      createEndpointData(NEWS_ENDPOINT, formData, loadNewsData);
      newsForm.reset();
    },
    update: () => {
      const newsId = newsFormElements["id"].value;
      updateEndpointDataById(NEWS_ENDPOINT, Number(newsId), formData, loadNewsData);
    },
  };

  actions[actionType]();
}

function changeModalData({ relatedTarget }) {
  const actionType = relatedTarget.getAttribute("data-action-type");
  const modalTitle = newsModal.querySelector(".modal-title");
  const formRestrictedData = document.getElementById("restrictedData");
  const authorRow = document.getElementById("authorRow");
  const authorSelect = document.getElementById("author");

  const actions = {
    create: () => {
      modalTitle.innerText = "Cadastrar Notícia";
      formRestrictedData.setAttribute("hidden", "");
      if (user.accessLevel === AUTHOR_ACCESS_LEVEL) authorRow.setAttribute("hidden", "");
    },
    update: () => {
      modalTitle.innerText = "Editar Notícia";
      formRestrictedData.removeAttribute("hidden");
      if (user.accessLevel === AUTHOR_ACCESS_LEVEL) {
        authorRow.removeAttribute("hidden");
        authorSelect.setAttribute("disabled", "");
      }
    },
  };

  actions[actionType]();
  newsFormElements["submit"].setAttribute("data-action-type", actionType);
}

function getFormData() {
  const date = getDateTime();

  return {
    authorId: newsFormElements["author"].value,
    title: newsFormElements["title"].value,
    subtitle: newsFormElements["subtitle"].value,
    description: newsFormElements["description"].value,
    image: newsFormElements["image"].value,
    content: tinymce.get("content").getContent(),
    tags: $("#tags").select2("data").map(({ text }) => text),
    fake: newsFormElements["fake"].checked,
    featured: newsFormElements["featured"].checked,
    views: newsFormElements["views"].value || 0,
    createdAt: newsFormElements["createdAt"].value || date,
    updatedAt: date,
  };
}

function loadNewsData(selectedTags = null) {
  const newsContainer = document.getElementById("newsContainer");
  const authorSelect = document.getElementById("author");
  const authorSelected = authorSelect.value;

  newsContainer.innerHTML = "";
  authorSelect.innerHTML = "";
  $("#tags").empty().trigger("change");

  getEndpointData(`${NEWS_ENDPOINT}?_expand=author`, (news) => {
    const authors = [];
    let tags = [];

    news
      .forEach((newsData) => {
        newsContainer.append(createNewsCard(newsData));
        tags = Array.from(new Set([...tags, ...newsData.tags]));
        if (!authors.some(({ id }) => id === newsData.author.id)) authors.push(newsData.author);
      });

    tags.forEach((tagName) => {
      const tagId = tagName;
      $("#tags")
        .append(new Option(tagName, tagId, false, false))
        .trigger("change");
    });

    authors.forEach((author) => {
      const authorOption = createCustomElement("option", undefined, author.name, { value: author.id });
      authorSelect.append(authorOption);
    });

    authorSelect.value = authorSelected;
    if (user.accessLevel === AUTHOR_ACCESS_LEVEL) authorSelect.value = user.id;

    $("#tags").val(selectedTags).trigger("change");
  });
}

function init() {
  newsForm.addEventListener("reset", () => {
    tinymce.get("content").setContent("");
    $("#tags").val(null).trigger("change");
  });

  newsForm.addEventListener("submit", submitNews);

  newsModal.addEventListener("show.bs.modal", changeModalData);

  loadNewsData();
}

window.onload = async () => {
  user = await redirectUnauthorized(AUTHOR_ACCESS_LEVEL);
  const main = document.getElementById("main");
  main.innerHTML = createNavbar({ singular: "Notícia", plural: "notícias" }, user?.accessLevel) + main.innerHTML;
  init();
};
