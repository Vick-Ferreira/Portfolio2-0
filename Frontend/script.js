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


function criarImgBtn() {
  fetch('http://localhost:3000/ImgBtn')
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
              button.addEventListener('click', function() {
                  buscarProjetoPorIndex(index); //associar cada botão de imagem ao projeto correspondente pelo índice na matriz de projetos. 
                  //Chama função e passa posição da imagem que associa a posição do projeto
              });
              minhaDiv.appendChild(button);
          });
      })
      .catch(error => console.error('Erro ao buscar imagens:', error));
}

function buscarProjetoPorIndex(index) {// buscar o projeto correspondente com base nesse índice (ONDEM DE ADIÇÃO)
  fetch('http://localhost:3000/projeto')
      .then(resp => resp.json())
      .then(data => {
          const projeto = data[index];
          exibirDetalhesDoProjeto(projeto);
      })
      .catch(error => console.error('Erro ao buscar detalhes do projeto:', error));
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
  
      // Adicionar o elemento de vídeo, título e descrição ao modal
      const modalContent = document.getElementById('modalContent');
      modalContent.innerHTML = '';
      modalContent.appendChild(tituloElement);
      modalContent.appendChild(descricaoElement);
      modalContent.appendChild(videoElement);
  
      // Exibir o modal
      const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
      modal.show();
  }
  
  // Chamar a função ao carregar a página
  criarImgBtn();

function enviarFeedback(){
  const nome = document.getElementById("nome").value;
  const opiniao = document.getElementById("opiniao").value;

  const feedbackData = {
    nome: nome,
    opiniao: opiniao
  }

  fetch('http://localhost:3000/feedback', {
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





