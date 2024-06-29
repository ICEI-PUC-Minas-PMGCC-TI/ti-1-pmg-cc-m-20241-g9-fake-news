document.addEventListener('DOMContentLoaded', () => {
  loadSupporters();

  const supporterForm = document.getElementById('supporter-form');
  if (supporterForm) {
      supporterForm.addEventListener('submit', function(event) {
          event.preventDefault();
          addSupporter();
      });
  }
});

function loadSupporters() {
  const supporters = JSON.parse(localStorage.getItem('supporters')) || [];
  const marquee = document.getElementById('supporters-marquee');
  if (marquee) {
      marquee.innerHTML = supporters.map(supporter => {
          return `<a href="${supporter.link}" target="_blank">${supporter.name}</a>`;
      }).join('   ||   ');
  }
}

function addSupporter() {
  const name = document.getElementById('name').value.trim();
  const link = document.getElementById('link').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const startDate = document.getElementById('startDate').value.trim();
  const logo = document.getElementById('logo').files[0];

  if (!name || !link || !contact || !startDate) {
      alert('Please fill out all required fields.');
      return;
  }

  if (!isValidURL(link)) {
      alert('Please enter a valid URL.');
      return;
  }

  if (!isValidEmail(contact)) {
      alert('Please enter a valid email address.');
      return;
  }

  const newSupporter = {
      name,
      link,
      contact,
      startDate,
      logo: logo ? URL.createObjectURL(logo) : ''
  };

  const supporters = JSON.parse(localStorage.getItem('supporters')) || [];
  supporters.push(newSupporter);
  localStorage.setItem('supporters', JSON.stringify(supporters));

  alert('Supporter added successfully!');
  supporterForm.reset();

  loadSupporters();

  window.location.href = 'index.html';

}

function isValidURL(url) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}


  