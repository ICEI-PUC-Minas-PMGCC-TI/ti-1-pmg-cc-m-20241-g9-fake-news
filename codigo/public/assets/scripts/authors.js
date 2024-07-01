import { AUTHORS_ENDPOINT } from '../utils/constants.js';
import {
  getEndpointData,
  createEndpointData,
  updateEndpointDataById,
  deleteEndpointDataById,
} from './api.js';
import { createCustomElement, createNavbar } from '../utils/elements.js';
import { decrypt, encrypt } from '../utils/encryption.js';
import { getAgeFromDate } from '../utils/utility.js';
import { redirectUnauthorized } from './login.js';


const authorForm = document.getElementById("registerForm");
const authorFormElements = authorForm.elements;
const authorModal = document.getElementById("registerModal");

async function fillFormWithAuthorData(authorData) {
  authorFormElements["id"].value = authorData.id;
  authorFormElements["name"].value = authorData.name;
  authorFormElements["birthDate"].value = authorData.birthDate;
  authorFormElements["occupation"].value = authorData.occupation;
  authorFormElements["description"].value = authorData.description;
  authorFormElements["image"].value = authorData.image;
  authorFormElements["email"].value = authorData.email;
  authorFormElements["password"].value = await decrypt(JSON.parse(authorData.password));
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
  const liAuthorAge = createCustomElement("li", undefined, `<b>Idade:</b> ${getAgeFromDate(authorData.birthDate)} anos`);
  const liAuthorOccupation = createCustomElement("li", undefined, `<b>Ocupação:</b> ${authorData.occupation}`);
  const liAuthorEmail = createCustomElement("li", undefined, `<b>Email:</b> ${authorData.email}`);
  const pAuthorDescription = createCustomElement("p", ["card-text"], authorData.description);
  const divButtonGroup = createCustomElement("div", ["btn-group"], null, { role: "group" });
  const buttonEdit = createCustomElement("button", ["btn", "btn-primary"], "Editar", { type: "button" }, { "data-bs-toggle": "modal", "data-bs-target": "#registerModal", "data-action-type": "update" });
  const buttonDelete = createCustomElement("button", ["btn", "btn-danger"], "Excluir", { type: "button" });

  // Events
  buttonEdit.addEventListener("click", async () => {
    authorForm.reset();
    await fillFormWithAuthorData(authorData);
  });

  buttonDelete.addEventListener("click", () => {
    deleteEndpointDataById(AUTHORS_ENDPOINT, authorData.id, loadAuthorData);
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
  ulAuthorData.append(liAuthorEmail);

  divButtonGroup.append(buttonEdit);
  divButtonGroup.append(buttonDelete);

  return divCard;
}

async function submitAuthor(event) {
  event.preventDefault();

  if (!authorForm.checkValidity()) {
    displayMessage("Preencha o formulário corretamente.");
    return;
  }

  const formData = { ...getFormData(), accessLevel: 2 };
  formData.password = JSON.stringify(await encrypt(formData.password));
  const actionType = authorFormElements["submit"].getAttribute("data-action-type");

  const actions = {
    create: () => {
      createEndpointData(AUTHORS_ENDPOINT, formData, loadAuthorData);
      authorForm.reset();
    },
    update: () => {
      const authorId = authorFormElements["id"].value;

      updateEndpointDataById(AUTHORS_ENDPOINT, Number(authorId), formData, loadAuthorData);
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
  description: authorFormElements["description"].value,
  image: authorFormElements["image"].value,
  email: authorFormElements["email"].value,
  password: authorFormElements["password"].value,
});

function loadAuthorData() {
  const authorContainer = document.getElementById("authorContainer");

  authorContainer.innerHTML = "";

  getEndpointData(AUTHORS_ENDPOINT, (authors) => {
    authors.forEach((author) => { authorContainer.append(createAuthorCard(author)) });
  });
}

function init() {
  authorForm.addEventListener("submit", submitAuthor);

  authorModal.addEventListener("show.bs.modal", changeModalData);

  loadAuthorData();
}

window.onload = () => {
  const user = redirectUnauthorized(1);
  const main = document.getElementById("main");
  main.innerHTML = createNavbar({ singular: "Autor", plural: "autores" }, user?.accessLevel) + main.innerHTML;
  init();
};
