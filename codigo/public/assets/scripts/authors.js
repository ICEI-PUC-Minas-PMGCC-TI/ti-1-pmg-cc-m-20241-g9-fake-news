import { USERS_ENDPOINT } from '../utils/constants.js';
import {
  getEndpointData,
  createEndpointData,
  updateEndpointDataById,
  deleteEndpointDataById,
} from './api.js';
import { createCustomElement } from '../utils/elements.js';


const authorForm = document.getElementById("authorForm");
const authorFormElements = authorForm.elements;
const authorModal = document.getElementById("authorModal");

function fillFormWithAuthorData(authorData) {
  authorFormElements["id"].value = authorData.id;
  authorFormElements["name"].value = authorData.name;
  authorFormElements["birthDate"].value = authorData.birthDate;
  authorFormElements["occupation"].value = authorData.occupation;
  authorFormElements["education"].value = authorData.education;
  authorFormElements["experience"].value = authorData.experience;
  authorFormElements["description"].value = authorData.description;
  authorFormElements["image"].value = authorData.image;
}

//Créditos: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd/7091965#7091965

function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  return monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
}

function createAuthorCard(authorData) {
  // Card Div
  const divCard = createCustomElement("div", ["card", "mb-3", "position-relative"]);

  // Row Div
  const divRow = createCustomElement("div", ["row", "g-0", "px-4"]);

  // Card Image Div
  const divCardImage = createCustomElement("div", ["col-md-2", "d-flex"]);
  const imgAuthor = createCustomElement("img", ["img-fluid", "rounded-circle", "align-self-center", "h-100", "profile-image"], null, { src: authorData.image, alt: `Imagem de ${authorData.name}` });

  // Card Text Div
  const divCardText = createCustomElement("div", ["col-md"]);
  const divCardBody = createCustomElement("div", ["card-body", "d-flex", "flex-column", "gap-2"]);
  const h5AuthorName = createCustomElement("h5", ["card-title"], authorData.name);
  const ulAuthorData = createCustomElement("ul", ["list-unstyled"]);
  const liAuthorAge = createCustomElement("li", undefined, `<b>Idade:</b> ${getAge(authorData.birthDate)} anos`);
  const liAuthorOccupation = createCustomElement("li", undefined, `<b>Ocupação:</b> ${authorData.occupation}`);
  const liAuthorEducation = createCustomElement("li", undefined, `<b>Formação:</b> ${authorData.education}`);
  const liAuthorExperience = createCustomElement("li", undefined, `<b>Experiência de trabalho:</b> Há ${authorData.experience} no mercado`);
  const pAuthorDescription = createCustomElement("p", ["card-text"], authorData.description);
  const divButtonGroup = createCustomElement("div", ["btn-group"], null, { role: "group" });
  const buttonEdit = createCustomElement("button", ["btn", "btn-primary"], "Editar", { type: "button" }, { "data-bs-toggle": "modal", "data-bs-target": "#authorModal", "data-action-type": "update" });
  const buttonDelete = createCustomElement("button", ["btn", "btn-danger"], "Excluir", { type: "button" });

  // Events
  buttonEdit.addEventListener("click", () => {
    authorForm.reset();
    fillFormWithAuthorData(authorData);
  });

  buttonDelete.addEventListener("click", () => {
    deleteEndpointDataById(USERS_ENDPOINT, authorData.id, loadAuthorData);
    authorForm.reset();
  });

  // Appends
  divCard.append(divRow);

  divRow.append(divCardImage);
  divRow.append(divCardText);

  divCardImage.append(imgAuthor);

  divCardText.append(divCardBody);

  divCardBody.append(h5AuthorName);
  divCardBody.append(ulAuthorData);
  divCardBody.append(pAuthorDescription);
  divCardBody.append(divButtonGroup);

  ulAuthorData.append(liAuthorAge);
  ulAuthorData.append(liAuthorOccupation);
  ulAuthorData.append(liAuthorEducation);
  ulAuthorData.append(liAuthorExperience);


  divButtonGroup.append(buttonEdit);
  divButtonGroup.append(buttonDelete);

  return divCard;
}

function submitAuthor(event) {
  event.preventDefault();

  if (!authorForm.checkValidity()) {
    displayMessage("Preencha o formulário corretamente.");
    return;
  }

  const formData = getFormData();
  const actionType = authorFormElements["submit"].getAttribute("data-action-type");

  const actions = {
    create: () => {
      createEndpointData(USERS_ENDPOINT, formData, loadAuthorData);
      authorForm.reset();
    },
    update: () => {
      const authorId = authorFormElements["id"].value;

      updateEndpointDataById(USERS_ENDPOINT, Number(authorId), formData, loadAuthorData);
    },
  };

  actions[actionType]();
}

function changeModalData({ relatedTarget }) {
  const actionType = relatedTarget.getAttribute("data-action-type");
  const modalTitle = authorModal.querySelector(".modal-title");
  const formRestrictedData = document.getElementById("restrictedData");

  const actions = {
    create: () => {
      modalTitle.innerText = "Cadastrar Autor";
      formRestrictedData.setAttribute("hidden", "");
    },
    update: () => {
      modalTitle.innerText = "Editar Autor";
      formRestrictedData.removeAttribute("hidden");
    },
  };

  actions[actionType]();
  authorFormElements["submit"].setAttribute("data-action-type", actionType);
}

const getFormData = () => ({
  name: authorFormElements["name"].value,
  birthDate: authorFormElements["birthDate"].value,
  occupation: authorFormElements["occupation"].value,
  education: authorFormElements["education"].value,
  experience: authorFormElements["experience"].value,
  description: authorFormElements["description"].value,
  image: authorFormElements["image"].value,
});

function loadAuthorData() {
  const authorContainer = document.getElementById("authorContainer");

  authorContainer.innerHTML = "";

  getEndpointData(USERS_ENDPOINT, (authors) => {
    authors.forEach((author) => { authorContainer.append(createAuthorCard(author)) });
  });
}

function init() {
  authorForm.addEventListener("submit", submitAuthor);

  authorModal.addEventListener("show.bs.modal", changeModalData);

  loadAuthorData();
}

window.onload = () => {
  init();
};
