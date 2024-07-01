import { NEWS_ENDPOINT, PARTNERS_ENDPOINT } from '../utils/constants.js';
import { createCustomElement } from '../utils/elements.js';
import { getEndpointData } from './api.js';
import { getFormattedDate } from '../utils/utility.js';

function createPartnerCard(partnerData) {
  return `<a class="col-sm-3 card text-bg-dark flex-grow-1" href="${partnerData.website}">
  <img src="${partnerData.image}" class="card-img img-fluid h-100" alt="Logo de ${partnerData.name}" style="max-height: 300px;">
  <div class="card-img-overlay">
    <h5 class="card-title">${partnerData.name}</h5>
  </div>
</a>`;
}

function loadPortaisData() {
  const portaisContainer = document.getElementById("portaisContainer");

  portaisContainer.innerHTML = "";

  getEndpointData(PARTNERS_ENDPOINT, (partners) => {
    partners.forEach((partnerData) => { portaisContainer.insertAdjacentHTML("beforeend", createPartnerCard(partnerData)); });
  });
}

function init() {
  loadPortaisData();
}

window.onload = async () => {
  init();
};
