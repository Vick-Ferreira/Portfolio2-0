 
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
function exibirDetalhesDoProjeto() {
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/projeto')
      .then(response => response.json())
      .then(data => {
          // Extrair os detalhes do projeto, incluindo o caminho do vídeo
          const projeto = data[0]; // Supondo que haja apenas um projeto por enquanto

          // Criar um elemento de vídeo e definir o atributo src com o caminho do vídeo
          const videoElement = document.createElement('video');
          videoElement.src = projeto.video;
          videoElement.controls = true; // Adicionar controles de reprodução ao vídeo
          videoElement.width = 560; // Definir a largura do vídeo (opcional)
          videoElement.height = 315; // Definir a altura do vídeo (opcional)

          // Criar elementos para o título e descrição do projeto
          const tituloElement = document.createElement('h2');
          tituloElement.textContent = projeto.titulo;

          const descricaoElement = document.createElement('p');
          descricaoElement.textContent = projeto.descricao;

          // Limpar qualquer conteúdo anterior
          const projetoDetails = document.getElementById('projetoDetails');
          projetoDetails.innerHTML = '';

          // Adicionar o elemento de vídeo, título e descrição ao modal
          projetoDetails.appendChild(tituloElement);
          projetoDetails.appendChild(descricaoElement);
          projetoDetails.appendChild(videoElement);

        
      })
      .catch(error => console.error('Erro ao buscar detalhes do projeto:', error));
}

// Chamar a função ao carregar a página
exibirDetalhesDoProjeto();