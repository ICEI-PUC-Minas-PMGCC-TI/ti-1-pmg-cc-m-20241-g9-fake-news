import { AUTHOR_ACCESS_LEVEL, MANAGER_ACCESS_LEVEL, NEWS_ENDPOINT, PARTNERS_ENDPOINT } from '../utils/constants.js';
import { createCustomElement, createNavbar } from '../utils/elements.js';
import { getDateTime } from '../utils/utility.js';
import { createEndpointData, deleteEndpointDataById, getEndpointData, updateEndpointDataById } from './api.js';
import { redirectUnauthorized } from './login.js';

const partnerForm = document.getElementById("registerForm");
const partnerFormElements = partnerForm.elements;
const partnerModal = document.getElementById("registerModal");

function fillFormWithPartnerData(partnerData) {
  partnerFormElements["id"].value = partnerData.id;
  partnerFormElements["name"].value = partnerData.name;
  partnerFormElements["website"].value = partnerData.website;
  partnerFormElements["image"].value = partnerData.image;
}

function createPartnerCard(partnerData) {
  const divCard = createCustomElement("div", ["col-sm-3", "card", "text-bg-dark", "flex-grow-1"]);
  const divButtonGroup = createCustomElement("div", ["btn-group"], undefined, { role: "group" });
  const buttonEdit = createCustomElement("button", ["btn", "btn-primary"], "Editar", { type: "button" }, { "data-bs-toggle": "modal", "data-bs-target": "#registerModal", "data-action-type": "update" });
  const buttonDelete = createCustomElement("button", ["btn", "btn-danger"], "Excluir", { type: "button" });
  buttonEdit.addEventListener("click", () => {
    partnerForm.reset();
    fillFormWithPartnerData(partnerData);
  });

  buttonDelete.addEventListener("click", () => {
    deleteEndpointDataById(PARTNERS_ENDPOINT, partnerData.id, loadPartnersData);
    partnerForm.reset();
  });

  divButtonGroup.append(buttonEdit);
  divButtonGroup.append(buttonDelete);
  divCard.innerHTML += `<img src="${partnerData.image}" class="card-img img-fluid h-100" alt="Logo de ${partnerData.name}" style="max-height: 300px;">
  <div class="card-img-overlay">
    <h5 class="card-title">${partnerData.name}</h5>
  </div>`;
  divCard.append(divButtonGroup);
  return divCard;
}

function submitNews(event) {
  event.preventDefault();

  if (!partnerForm.checkValidity()) {
    displayMessage("Preencha o formulário corretamente.");
    return;
  }

  const formData = getFormData();
  const actionType = partnerFormElements["submit"].getAttribute("data-action-type");

  const actions = {
    create: () => {
      createEndpointData(PARTNERS_ENDPOINT, formData, loadPartnersData);
      partnerForm.reset();
    },
    update: () => {
      const newsId = partnerFormElements["id"].value;
      updateEndpointDataById(PARTNERS_ENDPOINT, Number(newsId), formData, loadPartnersData);
    },
  };

  actions[actionType]();
}

function changeModalData({ relatedTarget }) {
  const actionType = relatedTarget.getAttribute("data-action-type");
  const modalTitle = partnerModal.querySelector(".modal-title");
  const formRestrictedData = document.getElementById("restrictedData");

  const actions = {
    create: () => {
      modalTitle.innerText = "Cadastrar Parceiro";
      formRestrictedData.setAttribute("hidden", "");
    },
    update: () => {
      modalTitle.innerText = "Editar Parceiro";
      formRestrictedData.removeAttribute("hidden");
    },
  };

  actions[actionType]();
  partnerFormElements["submit"].setAttribute("data-action-type", actionType);
}

function getFormData() {
  return {
    name: partnerFormElements["name"].value,
    website: partnerFormElements["website"].value,
    image: partnerFormElements["image"].value,
  };
}

function loadPartnersData() {
  const partnersContainer = document.getElementById("partnersContainer");

  partnersContainer.innerHTML = "";

  getEndpointData(PARTNERS_ENDPOINT, (partners) => {
    partners
      .forEach((partnerData) => {
        partnersContainer.append(createPartnerCard(partnerData));
      });
  });
}

function init() {
  partnerForm.addEventListener("submit", submitNews);

  partnerModal.addEventListener("show.bs.modal", changeModalData);

  loadPartnersData();
}

window.onload = async () => {
  const user = await redirectUnauthorized(MANAGER_ACCESS_LEVEL);
  const main = document.getElementById("main");
  main.innerHTML = createNavbar({ singular: "Parceiro", plural: "parceiros" }, user?.accessLevel) + main.innerHTML;
  init();
};
