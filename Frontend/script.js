 
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
// Obtendo projetos do servidor
function getProjetos() {
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/projeto', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(res => res.json())
  .then(data => {
    console.log('Dados recebidos:', data);
    data.forEach(projeto => {
      const card = criarCardProjetos(projeto);
      document.getElementById('container_projetos').appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao obter projetos:', error);
  });
}

function criarCardProjetos(projeto) {
  const card = document.createElement('div');
  card.classList.add('card');

  const tituloProjeto = document.createElement('h1');
  tituloProjeto.classList.add('titulo_projeto');
  tituloProjeto.innerHTML = projeto.titulo;

  const descricaoProjeto = document.createElement('p');
  descricaoProjeto.classList.add('descricao_projeto');
  descricaoProjeto.innerHTML = projeto.descricao;

  // Criar elemento de vídeo
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container');
  const videoEmbed = document.createElement('iframe');
  videoEmbed.setAttribute('width', '560');
  videoEmbed.setAttribute('height', '315');
  videoEmbed.setAttribute('src', projeto.src);
  videoEmbed.setAttribute('frameborder', '0');
  videoEmbed.setAttribute('allowfullscreen', '');

  videoContainer.appendChild(videoEmbed);

  // Adicionar elementos ao cartão
  card.appendChild(tituloProjeto);
  card.appendChild(descricaoProjeto);
  card.appendChild(videoContainer);

  // Adicionar o ID do projeto como um atributo de dados para o card
  card.dataset.projetoId = projeto._id;

  return card;
}

getProjetos();



