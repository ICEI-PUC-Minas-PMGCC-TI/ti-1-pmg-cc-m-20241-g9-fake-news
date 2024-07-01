import {
  NEWS_URL,
  AUTHORS_URL,
  COMMENTARIES_URL,
  PARTNERS_URL,
  FAKE_URL,
  PORTALS_URL,
  INDEX_URL,
  AUTHOR_ACCESS_LEVEL,
} from "./constants.js"

export function createCustomElement(elementType, classes = [], innerHTML, attributes = {}, customAttributes = {}) {
  const createdElement = document.createElement(elementType);

  createdElement.classList.add(...classes);

  Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
    createdElement[attributeName] = attributeValue;
  });

  Object.entries(customAttributes).forEach(([attributeName, attributeValue]) => {
    createdElement.setAttribute(attributeName, attributeValue);
  });

  if (innerHTML) createdElement.innerHTML = innerHTML;

  return createdElement;
}

export function displayMessage(message) {
  const messagesContainer = document.getElementById('msgContainer');
  const divMessage = createCustomElement("div", ["alert", "alert-warning", "alert-dismissible", "fade", "show"], message, { role: "alert" });
  const buttonCloseMessage = createCustomElement("button", ["btn-close"], null, {}, { "data-bs-dismiss": "alert" });
  divMessage.append(buttonCloseMessage);
  messagesContainer.append(divMessage);
}

export function createNavbar(name, accessLevel) {
  const currentPage = window.location.pathname.replace("/pages/", "");

  let links = `<li>
                    <a class="${NEWS_URL.replace("/", "") === currentPage ? "nav-link active" : "nav-link"}" href="news.html">Notícias</a>
                  </li>`;
  if(accessLevel !== AUTHOR_ACCESS_LEVEL) {
    links += `<li>
                    <a class="${AUTHORS_URL.replace("/", "") === currentPage ? "nav-link active" : "nav-link"}" href="authors.html">Autores</a>
                  </li>
                  <li>
                    <a class="${PARTNERS_URL.replace("/", "") === currentPage ? "nav-link active" : "nav-link"}" href="partners.html">Parceiros</a>
                  </li>`;
  }

  return `<nav class="navbar bg-white fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="#"><h2>Fato Certo</h2></a>
          <div class="col">
            <h1>Gerenciamento de ${name.plural}</h1>
          </div>
          <div class="col-md-1 text-center">
            <button
              type="reset"
              form="registerForm"
              class="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
              data-action-type="create"
            >
              Cadastrar ${name.singular}
            </button>
          </div>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <h3 class="offcanvas-title" id="offcanvasNavbarLabel">Fato Certo</h3>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <div class="pt-4">
                  <li class="nav-item">
                    <h5>Gerenciamento do site</h5>
                  </li>
                  <hr>
                  ${links}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>`;
}