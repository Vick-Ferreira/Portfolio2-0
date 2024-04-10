 
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



//skills
window.addEventListener("scroll", () => {
  console.log("Scrolling:", window.scrollY);

  // Botão de rolar para o topo
  if (window.scrollY > 20) {
      scrollToTopBtn.style.display = "block";
  } else {
      scrollToTopBtn.style.display = "none";
  }

  // Habilidades
  const habilidades = document.getElementById('habilidades');
  const alturaHabilidades = habilidades.offsetTop;
  if (window.scrollY > alturaHabilidades - window.innerHeight / 2) {
      habilidades.classList.add("mostrar-habilidades"); // Adiciona classe para mostrar as habilidades
  } else {
      habilidades.classList.remove("mostrar-habilidades"); // Remove classe para esconder as habilidades
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
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/projeto')
      .then(response => response.json())
      .then(data => {
          // Para cada projeto, cria um botão e adiciona um evento de clique para exibir os detalhes em um modal
          data.forEach(projeto => {

              const minhaDiv = document.getElementById("minhaDiv");

              const button = document.createElement("button");  
              button.classList = ('btn_modal')           
              button.innerHTML = '<img src ="./img/css.png" alt="Descrição">';
              button.addEventListener('click', function() {
                  exibirDetalhesDoProjeto(projeto);
              });
              minhaDiv.appendChild(button);
          });
      })
      .catch(error => console.error('Erro ao buscar detalhes dos projetos:', error));
}

function exibirDetalhesDoProjeto(projeto) {
   // Limpar qualquer conteúdo anterior
   const modalContent = document.getElementById('modalContent');
   modalContent.innerHTML = '';

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

 

  // Adicionar o elemento de vídeo, título e descrição ao modal
  modalContent.appendChild(tituloElement);
  modalContent.appendChild(descricaoElement);
  modalContent.appendChild(videoElement);

  // Exibir o modal
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}

function enviarFeedback(){
  const nome = document.getElementById("nome").value;
  const opiniao = document.getElementById("opiniao").value;

  const feedbackData = {
    nome: nome,
    opiniao: opiniao
  }

  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/feedback', {
    method:'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(feedbackData) //carregando corpo da requisição com os dados recuperados pelas cont declaradas a cima, vindo do form do html
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
// Chamar a função ao carregar a página
buscarProjetos();







