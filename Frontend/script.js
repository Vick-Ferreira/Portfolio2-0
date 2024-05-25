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


//BOTÃO TOPO
function botaoTopo() {
  // Função para mostrar o botão apenas quando a página é rolada para baixo
  function handleScroll() {
    if (window.scrollY === 0) {
      scrollToTopBtn.style.display = "none";
    } else {
      scrollToTopBtn.style.display = "block";
    }
  }
  // Função para rolar suavemente a página para o topo
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  // Adiciona o evento de rolagem para mostrar ou esconder o botão
  window.addEventListener("scroll", handleScroll);
  // Adiciona o evento de clique para rolar a página suavemente para o topo
  scrollToTopBtn.addEventListener("click", scrollToTop);
  // Chama a função para definir o estado inicial do botão corretamente
  handleScroll();
}
// Chama a função para inicializar o comportamento do botão
botaoTopo();

//SKILLS
// Função para verificar se as habilidades estão visíveis na tela
function verificarVisibilidade(elemento) {
  const posicaoTela = window.innerHeight;
  const elementoTopo = elemento.getBoundingClientRect().top;

  return elementoTopo < posicaoTela;
}

// Função para adicionar ou remover classe quando as habilidades estiverem visíveis ou não
document.addEventListener('DOMContentLoaded', () => {
  const habilidades = document.querySelector('.habilidades');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        habilidades.classList.add('mostrar');
      } else {
        habilidades.classList.remove('mostrar');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(habilidades);
});


// Adiciona o evento de scroll para chamar a função
window.addEventListener('scroll', mostrarHabilidades);

// Chama a função inicialmente para verificar a visibilidade
mostrarHabilidades();



//ELEMENTOS CRIADOS DINAMICOS COM RECUPERAÇÃO DE DADOS BACKEND.
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
        button.style.border = 'none';
        button.style.width = '300px';
        button.style.height = '300px';
        button.style.borderRadius = '10%';
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
  videoElement.autoplay = true; // Tenta reproduzir automaticamente (alguns navegadores móveis exigem que o vídeo esteja mudo para isso funcionar)
  videoElement.muted = true;    // Muta o vídeo para permitir reprodução automática em alguns navegadores móveis
  videoElement.playsInline = true; // Permite reprodução inline em navegadores móveis

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
  
  if(nome === '' || opiniao === '' ){
     alert('Por favor, preencha todos os campos.');
  }else{
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
        console.error("erro ao enviar feedback", error);
        alert("Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.");
      })
  }
}
  




