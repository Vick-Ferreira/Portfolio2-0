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

//animação letras
//função recursiva
var textAnimado = document.getElementById("textoAnimado");
var textAnimado2 = document.getElementById("textoAnimado2");
var texto1 = textAnimado.textContent.trim(); // Texto do primeiro h1
var texto2 = textAnimado2.textContent.trim(); // Texto do segundo h1

function animarTexto1() {
  textAnimado.textContent = ""; // Limpa o conteúdo original
  textAnimado2.textContent = ""; 
  // Adiciona cada letra do primeiro texto, com um atraso de 100 milissegundos
  for (var i = 0; i < texto1.length; i++) {
    setTimeout(function(i) {
      textAnimado.textContent += texto1[i];
      if (i === texto1.length - 1) {
        setTimeout(animarTexto2, 1000); // Após terminar o primeiro texto, inicia o segundo
      }
    }, 100 * i, i);
  }
}

function animarTexto2() {
  // Limpa o conteúdo original do segundo texto
  // Adiciona cada letra do segundo texto, com um atraso de 100 milissegundos
  for (var j = 0; j < texto2.length; j++) {
    setTimeout(function(j) {
      textAnimado2.textContent += texto2[j];
      if (j === texto2.length - 1) {
        setTimeout(animarTexto1, 1000); // Após terminar o segundo texto, reinicia o primeiro
      }
    }, 100 * j, j);
  }
}

// Inicia a animação do primeiro texto
animarTexto1();

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
      behavior: "smooth",
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
function mostrarHabilidades() {
  const habilidades = document.querySelector(".habilidades");
  const habilidadesVisiveis = verificarVisibilidade(habilidades);

  // Verifica se as habilidades estão visíveis e se a classe 'mostrar' já está aplicada
  if (habilidadesVisiveis && !habilidades.classList.contains("mostrar")) {
    habilidades.classList.add("mostrar");
  } else if (
    !habilidadesVisiveis &&
    habilidades.classList.contains("mostrar")
  ) {
    habilidades.classList.remove("mostrar");
  }
}

// Adiciona o evento de scroll para chamar a função
window.addEventListener("scroll", mostrarHabilidades);

// Chama a função inicialmente para verificar a visibilidade
mostrarHabilidades();

//ELEMENTOS CRIADOS DINAMICOS COM RECUPERAÇÃO DE DADOS BACKEND.
function criarImgBtn() {
  fetch("https://portfolio2-0-k2jz3gicva-uw.a.run.app/files")
    .then((resp) => resp.json())
    .then((data) => {
      const minhaDiv = document.getElementById("minhaDiv");
      minhaDiv.innerHTML = ""; // Limpa a div antes de adicionar novos botões
      data.forEach((imgBtn, index) => {
        const button = document.createElement("button");
        button.classList.add("btn_modal");

        const imageUrl = `https://portfolio2-0-k2jz3gicva-uw.a.run.app/files/index/${index}`;

        // Criar a imagem
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Imagem do botão"; // Adicione um atributo alt para acessibilidade

         // Cria o texto
         const buttonText = document.createElement("span");
         buttonText.classList.add("button-text");
         buttonText.textContent = "Saiba mais";

        // Adicionar a imagem como filho do botão
        button.appendChild(img);
        button.appendChild(buttonText);


        // Adicionar evento de clique ao botão
        button.addEventListener("click", function () {
          buscarVideoPorIndex(index);
        });

        minhaDiv.appendChild(button);
      });
    })
    .catch((error) => console.error("Erro ao buscar imagens:", error));
}

// Função para buscar vídeo pelo índice
function buscarVideoPorIndex(index) {
  fetch("https://portfolio2-0-k2jz3gicva-uw.a.run.app/videos")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Erro ao buscar vídeos");
      }
      return resp.json();
    })
    .then((data) => {
      const video = data[index]; // Busca o vídeo pelo índice
      if (video) {
        exibirDetalhesDoVideo(video, index);
      } else {
        console.error("Vídeo não encontrado para o índice:", index);
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar detalhes do vídeo:", error);
    });
}

// IMPORTANTE: vídeo esteja carregado o suficiente para permitir a interação do usuário assim que o modal for aberto
function exibirDetalhesDoVideo(video, index) {
  console.log("Exibindo detalhes do vídeo:", video);
  console.log("Índice do vídeo:", index);

  const videoElement = document.createElement("video");
  videoElement.classList.add("video_Element");

  const videoUrl = `https://portfolio2-0-k2jz3gicva-uw.a.run.app/videos/index/${index}`;
  console.log("URL do vídeo:", videoUrl);

  const startTime = performance.now();

  videoElement.addEventListener("loadedmetadata", () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`Tempo de carregamento do vídeo: ${loadTime} ms`);
  });

  videoElement.src = videoUrl;
  videoElement.controls = true;
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.playsInline = true;

  const tituloElement = document.createElement("h2");
  tituloElement.textContent = video.metadata.titulo;
  tituloElement.classList.add("tituloElement");

  const descricaoElement = document.createElement("p");
  descricaoElement.textContent = video.metadata.descricao;
  descricaoElement.classList.add("descricaoElement");

  const linkElement = document.createElement("a");
  linkElement.textContent = "Ver pagina.";
  linkElement.href = video.metadata.link;
  linkElement.classList.add("linkElement");
  linkElement.target = "_blank"; // Adiciona o atributo target com o valor "_blank" abrir link em outra aba


  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = "";
  modalContent.appendChild(tituloElement);
  modalContent.appendChild(descricaoElement);
  modalContent.appendChild(linkElement);
  modalContent.appendChild(videoElement);

  const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
  modal.show();
}

// Chama a função para criar os botões ao carregar a página
criarImgBtn();

function enviarFeedback() {
  //mandando dados form html
  const nome = document.getElementById("nome").value;
  const opiniao = document.getElementById("opiniao").value;

  if (nome === "" || opiniao === "") {
    alert("Por favor, preencha todos os campos.");
  } else {
    const feedbackData = {
      nome: nome,
      opiniao: opiniao,
    };
    fetch("https://portfolio2-0-k2jz3gicva-uw.a.run.app/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        alert("Feedback enviado com sucesso! Obrigada!");
        document.getElementById("feedbackForm").reset(); //Limpar formulario apos evio dos dados
      })
      .catch((error) => {
        console.error("erro ao enviar feedback", error);
        alert(
          "Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente."
        );
      });
  }
}
