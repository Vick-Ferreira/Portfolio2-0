const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
let currentTheme = "light";
//logica troca tema
themeToggle.addEventListener("click", () => {
  if (currentTheme === "light") {
    document.body.classList.add("dark-theme");
    themeIcon.classList.remove("bi-moon");
    themeIcon.classList.add("bi-sun");
    currentTheme = "dark";
    console.log("Tema alterado para escuro");
  } else {
    document.body.classList.remove("dark-theme");
    themeIcon.classList.remove("bi-sun");
    themeIcon.classList.add("bi-moon");
    currentTheme = "light";
    console.log("Tema alterado para claro");
  }
});

//logica apareção btn (leva ao topo), após certa rolagem
window.addEventListener("scroll", () => {
  console.log("Scrolling:", window.scrollY);
  if (window.scrollY > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
  // evento de clique ao botão para rolar suuavemente para o topo APÓS aparecer.
  scrollToTopBtn.addEventListener("click", () => {
    console.log("Botão de volta ao topo clicado");
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  // Habilidades, logica entrada e saida de habilidades da tela
  const habilidades = document.getElementById('habilidades');
  const alturaHabilidades = habilidades.offsetTop;
  if (window.scrollY > alturaHabilidades - window.innerHeight / 2) {
    habilidades.classList.add("mostrar-habilidades"); // Adiciona classe para mostrar as habilidades
  } else {
    habilidades.classList.remove("mostrar-habilidades"); // Remove classe para esconder as habilidades
  }
});



function criarImgBtn() {
  fetch('https://portfolio2-0-g6xxmbq6ra-uw.a.run.app/files')
    .then(resp => resp.json())
    .then(data => {
      const minhaDiv = document.getElementById("minhaDiv");
      minhaDiv.innerHTML = ''; // Limpa a div antes de adicionar novos botões
      data.forEach((imgBtn, index) => { //A IMAGEM E A POSIÇÃO DA MESMA
        const button = document.createElement("button");
        button.classList.add('btn_modal');
        const imageUrl = `https://portfolio2-0-g6xxmbq6ra-uw.a.run.app/files/index/${index}`;
        button.style.backgroundImage = `url(${imageUrl})`;
        button.style.backgroundSize = 'contain';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.width = '100px'; // Defina um tamanho para o botão
        button.style.height = '100px'; // Defina um tamanho para o botão
        button.addEventListener('click', function () {
          buscarVideoPorIndex(index); // Chama a função e passa o índice correto
        });
        minhaDiv.appendChild(button);
      });
    })
    .catch(error => console.error('Erro ao buscar imagens:', error));
}

// Função para buscar vídeo pelo índice
function buscarVideoPorIndex(index) {
  fetch('https://portfolio2-0-g6xxmbq6ra-uw.a.run.app/videos')
    .then(resp => resp.json())
    .then(data => {
      const video = data[index]; // Busca o vídeo pelo índice
      if (video) {
        exibirDetalhesDoVideo(video, index);
      } else {
        console.error('Vídeo não encontrado para o índice:', index);
      }
    })
    .catch(error => console.error('Erro ao buscar detalhes do vídeo:', error));
}
// Função para exibir os detalhes do vídeo no modal
function exibirDetalhesDoVideo(video, index) {
  const videoElement = document.createElement('video');
  videoElement.classList.add('video_Element');
  
  // Constrói a URL para o vídeo usando o índice
  videoElement.src = `https://portfolio2-0-g6xxmbq6ra-uw.a.run.app/videos/index/${index}`;
  videoElement.controls = true;

  const tituloElement = document.createElement('h2');
  tituloElement.textContent = video.metadata.titulo;

  const descricaoElement = document.createElement('p');
  descricaoElement.textContent = video.metadata.descricao;

  // Adiciona elementos ao modal
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = '';
  modalContent.appendChild(tituloElement);
  modalContent.appendChild(descricaoElement);
  modalContent.appendChild(videoElement);

  // Exibir o modal
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}
// Chama a função para criar os botões ao carregar a página
criarImgBtn();




function enviarFeedback() {//mandando dados form html
  const nome = document.getElementById("nome").value;
  const opiniao = document.getElementById("opiniao").value;
  const feedbackData = {
    nome: nome,
    opiniao: opiniao
  }
  fetch('https://portfolio2-0-g6xxmbq6ra-uw.a.run.app/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedbackData)
  })
    .then(resp => resp.json())
    .then(data => {
      alert("Feedback enviado com sucesso! Obrigada!");
      document.getElementById("feedbackForm").reset();//Limpar formulario apos evio dos dados
    })
    .catch(error => {
      console.error("erro ao enviar feedback")
    })
}





