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