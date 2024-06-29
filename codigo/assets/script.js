function gerarIdUnico() {
    return Math.random().toString(36).substr(2, 9);
  }

  function formatarData() {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function adicionarComentario(comentario) {
    const listaComentarios = document.getElementById('lista-comentarios');
    const comentarioDiv = document.createElement('div');
    comentarioDiv.className = 'comentario';
    comentarioDiv.setAttribute('data-id-comentario', comentario.id);
    comentarioDiv.innerHTML = `
      <p><strong>Nome:</strong> ${comentario.nome}</p>
      <p><strong>Data:</strong> ${comentario.data}</p>
      <p>${comentario.conteudo}</p>
      <p class="btn-excluir" data-id-comentario="${comentario.id}">Excluir</p>
    `;
    listaComentarios.appendChild(comentarioDiv);
  }
  function excluirComentario(idComentario) {
    const comentarioDiv = document.querySelector(`.comentario[data-id-comentario="${idComentario}"]`);
    if (comentarioDiv) {
      comentarioDiv.remove();

      // Remover o comentário do Local Storage
      let comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
      comentarios = comentarios.filter(comentario => comentario.id !== idComentario);
      localStorage.setItem('comentarios', JSON.stringify(comentarios));
    }
  }

  function lidarEnvioComentario(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome');
    const comentarioInput = document.getElementById('comentario');

    const nome = nomeInput.value.trim();
    const conteudo = comentarioInput.value.trim();

    if (nome === '' || conteudo === '') {
      return;
    }

    const comentarioObj = {
      id: gerarIdUnico(),
      nome,
      conteudo,
      data: formatarData()
    };

    adicionarComentario(comentarioObj);

    let comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
    comentarios.push(comentarioObj);
    localStorage.setItem('comentarios', JSON.stringify(comentarios));

    nomeInput.value = '';
    comentarioInput.value = '';
  }

  function carregarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
    comentarios.forEach(comentario => {
      adicionarComentario(comentario);
    });
  }

  document.addEventListener('DOMContentLoaded', carregarComentarios);

  document.getElementById('form-comentario').addEventListener('submit', lidarEnvioComentario);

  document.getElementById('lista-comentarios').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-excluir')) {
      const idComentario = event.target.getAttribute('data-id-comentario');
      excluirComentario(idComentario);
    }
  });