 
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
let currentTheme = "light";

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


//eventos para timeline + setas
document.addEventListener('DOMContentLoaded', function () {
    const timeline = document.getElementById('timeline');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    let scrollAmount = 0;
    // Manipulação de eventos da linha do tempo
    const events = [//obj
      { imgSrc: './img/html.png' },
      { imgSrc: './img/css.png' },
      { imgSrc: './img/bootstrap.png' },
      { imgSrc: './img/sass.png' },
      { imgSrc: './img/js.png' },
      { imgSrc: './img/node.js.png' },
      { imgSrc: './img/mongo.png'},
      { imgSrc: './img/react.png' },
      { imgSrc: './img/kotlin.png' },
    ];
    //recuperando dados da const events, e add via js de forma dinâmica
    events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      eventElement.innerHTML = `<img src="${event.imgSrc}">`;
      timeline.appendChild(eventElement);
    });
  
    // Manipulação de setas
    arrowLeft.addEventListener('click', function () {
      scrollAmount -= 200;
      timeline.scrollLeft = scrollAmount;
    });
  
    arrowRight.addEventListener('click', function () {
      scrollAmount += 200;
      timeline.scrollLeft = scrollAmount;
    });
});


window.addEventListener("scroll", () => { //fazendo com que o botão suma apos scroll
    console.log("Scrolling:", window.scrollY);
  
    if (window.scrollY > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
});

// evento de clique ao botão para rolar suavemente para o topo
scrollToTopBtn.addEventListener("click", () => {
    console.log("Botão de volta ao topo clicado");
    // Lógica para rolar suavemente para o topo da página
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});




function buscarProjetos() {
  // Realiza um fetch para obter os detalhes dos projetos
  fetch('http://localhost:3000/projeto')
      .then(response => response.json())
      .then(data => {
          // Para cada projeto, cria um botão e adiciona um evento de clique para exibir os detalhes em um modal
          data.forEach(projeto => {
              const button = document.createElement("button");              button.textContent = "Detalhes do Projeto";
              button.addEventListener('click', function() {
                  exibirDetalhesDoProjeto(projeto);
              });
              document.body.appendChild(button);
          });
      })
      .catch(error => console.error('Erro ao buscar detalhes dos projetos:', error));
}

function exibirDetalhesDoProjeto(projeto) {
  // Criar um elemento de vídeo e definir o atributo src com o caminho do vídeo
  const videoElement = document.createElement('video');
  videoElement.classList = ('video_Element');
  videoElement.src = projeto.video;
  videoElement.controls = true; // Adicionar controles de reprodução ao vídeo

  // Criar elementos para o título e descrição do projeto
  const tituloElement = document.createElement('h2');
  tituloElement.textContent = projeto.titulo;

  const descricaoElement = document.createElement('p');
  descricaoElement.textContent = projeto.descricao;

  // Limpar qualquer conteúdo anterior
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = '';

  // Adicionar o elemento de vídeo, título e descrição ao modal
  modalContent.appendChild(tituloElement);
  modalContent.appendChild(descricaoElement);
  modalContent.appendChild(videoElement);

  // Exibir o modal
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}

// Chamar a função ao carregar a página
buscarProjetos();







/*
function exibirDetalhesDoProjeto() {
  // Adiciona um evento de clique ao botão openModalBtn
  document.getElementById('openModalBtn').addEventListener('click', () => {
    // Realiza um fetch para obter os detalhes do projeto
    fetch('http://localhost:3000/projeto')
      .then(response => response.json())
      .then(data => {
        // Extrair os detalhes do projeto, incluindo o caminho do vídeo
        const projeto = data[0]; // Supondo que haja apenas um projeto por enquanto

        // Criar um elemento de vídeo e definir o atributo src com o caminho do vídeo
        const videoElement = document.createElement('video');
        videoElement.classList = ('video_Element');
        videoElement.src = projeto.video;
        videoElement.controls = true; // Adicionar controles de reprodução ao vídeo
        

        // Criar elementos para o título e descrição do projeto
        const tituloElement = document.createElement('h2');
        tituloElement.textContent = projeto.titulo;

        const descricaoElement = document.createElement('p');
        descricaoElement.textContent = projeto.descricao;

        // Limpar qualquer conteúdo anterior
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '';

        // Adicionar o elemento de vídeo, título e descrição ao modal
        modalContent.appendChild(tituloElement);
        modalContent.appendChild(descricaoElement);
        modalContent.appendChild(videoElement);

        
      })
      .catch(error => console.error('Erro ao buscar detalhes do projeto:', error));
  });
}
// Chamar a função ao carregar a página
exibirDetalhesDoProjeto();
*/