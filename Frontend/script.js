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
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/ImgBtn')
    .then(resp => resp.json())
    .then(data => {
      const minhaDiv = document.getElementById("minhaDiv");
      data.forEach((imgBtn, index) => { //A IMAGEM E A POSIÇÃO DA MESMA
        const button = document.createElement("button");
        button.classList.add('btn_modal');
        const imagePath = imgBtn.imagem.replace(/\\/g, '/');
        button.style.backgroundImage = `url(${imagePath})`;
        button.style.backgroundSize = 'contain';
        button.style.backgroundRepeat = 'no-repeat';
        button.addEventListener('click', function () {
          buscarProjetoPorIndex(index); //associar cada botão de imagem ao projeto correspondente pelo índice na matriz de projetos. 
          //Chama função e passa posição da imagem que associa a posição do projeto
        });
        minhaDiv.appendChild(button);
      });
    })
    .catch(error => console.error('Erro ao buscar imagens:', error));
}
function buscarProjetoPorIndex(index) {// buscar o projeto correspondente com base nesse índice (ONDEM DE ADIÇÃO)
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/projeto')
    .then(resp => resp.json())
    .then(data => {
      const projeto = data[index];
      exibirDetalhesDoProjeto(projeto);
    })
    .catch(error => console.error('Erro ao buscar detalhes do projeto:', error));
}
function exibirDetalhesDoProjeto(projeto) {
  const videoElement = document.createElement('video');
  videoElement.classList = ('video_Element');
  videoElement.src = projeto.video;
  videoElement.controls = true; //controles de reprodução ao vídeo
  const tituloElement = document.createElement('h2');
  tituloElement.textContent = projeto.titulo;
  const descricaoElement = document.createElement('p');
  descricaoElement.textContent = projeto.descricao;
  // Add elemento de vídeo, título e descrição ao modal
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = '';
  modalContent.appendChild(tituloElement);
  modalContent.appendChild(descricaoElement);
  modalContent.appendChild(videoElement);
  // Exibir o modal
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}
criarImgBtn();

function enviarFeedback() {//mandando dados form html
  const nome = document.getElementById("nome").value;
  const opiniao = document.getElementById("opiniao").value;
  const feedbackData = {
    nome: nome,
    opiniao: opiniao
  }
  fetch('https://vitoriaferreira-portfolio-84cf0f46ab85.herokuapp.com/feedback', {
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





