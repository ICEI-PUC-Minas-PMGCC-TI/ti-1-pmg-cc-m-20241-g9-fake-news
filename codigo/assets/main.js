const botaoFavoritar = document.getElementById('botaoFavoritar');
      const containerNoticias = document.getElementById('containerNoticias');
      let noticiasSalvas = [];

      if (localStorage.getItem('noticias')) {
          noticiasSalvas = JSON.parse(localStorage.getItem('noticias'));
          exibirNoticiasSalvas();
      }

      botaoFavoritar.addEventListener('click', function() {
          const elementoNoticia = document.createElement('div');
          elementoNoticia.classList.add('news-container');

          const conteudoNoticia = document.createElement('p');
          conteudoNoticia.classList.add('news-content');
          conteudoNoticia.textContent = 'teste de salvar e remover noticias';

          const botaoRemover = document.createElement('button');
          botaoRemover.classList.add('remove-button', 'btn');
          botaoRemover.textContent = 'Remover Notícia';

          botaoRemover.addEventListener('click', function() {
              containerNoticias.removeChild(elementoNoticia);
              removerNoticiaSalva(elementoNoticia);
          });

          elementoNoticia.appendChild(conteudoNoticia);
          elementoNoticia.appendChild(botaoRemover);

          containerNoticias.appendChild(elementoNoticia);
          salvarNoticia(elementoNoticia);
      });

      function salvarNoticia(noticia) {
          noticiasSalvas.push(noticia.innerHTML);
          localStorage.setItem('noticias', JSON.stringify(noticiasSalvas));
      }

      function exibirNoticiasSalvas() {
          noticiasSalvas.forEach(function(noticiaSalva) {
              const elementoNoticia = document.createElement('div');
              elementoNoticia.classList.add('news-container');
              elementoNoticia.innerHTML = noticiaSalva;

              const botaoRemover = elementoNoticia.querySelector('.remove-button');
              botaoRemover.addEventListener('click', function() {
                  containerNoticias.removeChild(elementoNoticia);
                  removerNoticiaSalva(elementoNoticia);
              });

              containerNoticias.appendChild(elementoNoticia);
          });
      }

      function removerNoticiaSalva(noticia) {
          const index = noticiasSalvas.indexOf(noticia.innerHTML);
          if (index > -1) {
              noticiasSalvas.splice(index, 1);
              localStorage.setItem('noticias', JSON.stringify(noticiasSalvas));
          }
        }