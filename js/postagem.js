const formPostagem = document.getElementById("formPostagem");
const tituloInput = document.getElementById("titulo");
const erroTitulo = document.getElementById("erroTitulo");
const mensagemPostagem = document.getElementById("mensagemPostagem");
const editor = document.getElementById("editor");
const listaPostagensAdmin = document.getElementById("listaPostagensAdmin");

const btnAddTexto = document.getElementById("btnAddTexto");
const btnAddImagem = document.getElementById("btnAddImagem");
const btnAddVideo = document.getElementById("btnAddVideo");

// Proteção simples
if (localStorage.getItem("adminLogado") !== "true") {
  window.location.href = "admin.html";
}

btnAddTexto.addEventListener("click", adicionarBlocoTexto);
btnAddImagem.addEventListener("click", adicionarBlocoImagem);
btnAddVideo.addEventListener("click", adicionarBlocoVideo);

function obterPostagens() {
  return JSON.parse(localStorage.getItem("postagensEloSaude")) || [];
}

function salvarPostagens(postagens) {
  localStorage.setItem("postagensEloSaude", JSON.stringify(postagens));
}

function formatarData() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function criarBotaoExcluir(bloco) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "btn-excluir-bloco";
  botao.textContent = "Excluir bloco";
  botao.addEventListener("click", function () {
    bloco.remove();
  });
  return botao;
}

function adicionarBlocoTexto(valor = "") {
  const bloco = document.createElement("div");
  bloco.className = "bloco-editor bloco-texto";

  const label = document.createElement("label");
  label.textContent = "Bloco de texto";

  const textarea = document.createElement("textarea");
  textarea.className = "input-texto";
  textarea.placeholder = "Digite o texto da postagem...";
  textarea.value = valor;
  textarea.rows = 6;

  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  bloco.appendChild(label);
  bloco.appendChild(textarea);
  bloco.appendChild(criarBotaoExcluir(bloco));

  editor.appendChild(bloco);
  textarea.dispatchEvent(new Event("input"));
}

function adicionarBlocoImagem(imagemSalva = "") {
  const bloco = document.createElement("div");
  bloco.className = "bloco-editor bloco-imagem";

  const label = document.createElement("label");
  label.textContent = "Bloco de imagem";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.className = "input-imagem";

  const preview = document.createElement("img");
  preview.className = "preview-imagem-bloco";
  preview.alt = "Prévia da imagem";

  if (imagemSalva) {
    preview.src = imagemSalva;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }

  input.addEventListener("change", function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (evento) {
      preview.src = evento.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(arquivo);
  });

  bloco.appendChild(label);
  bloco.appendChild(input);
  bloco.appendChild(preview);
  bloco.appendChild(criarBotaoExcluir(bloco));

  editor.appendChild(bloco);
}

function adicionarBlocoVideo(valor = "") {
  const bloco = document.createElement("div");
  bloco.className = "bloco-editor bloco-video";

  const label = document.createElement("label");
  label.textContent = "Bloco de vídeo";

  const input = document.createElement("input");
  input.type = "url";
  input.className = "input-video";
  input.placeholder = "Cole o link do YouTube";
  input.value = valor;

  bloco.appendChild(label);
  bloco.appendChild(input);
  bloco.appendChild(criarBotaoExcluir(bloco));

  editor.appendChild(bloco);
}

function converterLinkYouTubeParaEmbed(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return url;
  } catch (error) {
    return url;
  }
}

function renderizarPostagensAdmin() {
  const postagens = obterPostagens();

  if (postagens.length === 0) {
    listaPostagensAdmin.innerHTML = `
      <p class="sem-postagem">Nenhuma postagem cadastrada ainda.</p>
    `;
    return;
  }

  listaPostagensAdmin.innerHTML = postagens.map((postagem) => {
    let resumo = "";

    postagem.blocos.forEach((bloco) => {
      if (bloco.tipo === "texto") {
        resumo += `<p>${bloco.conteudo}</p>`;
      }

      if (bloco.tipo === "imagem") {
        resumo += `<img src="${bloco.conteudo}" alt="Imagem da postagem" class="thumb-admin-grande">`;
      }

      if (bloco.tipo === "video") {
        resumo += `
          <div class="video-admin-box">
            <a href="${bloco.conteudo}" target="_blank">Abrir vídeo</a>
          </div>
        `;
      }
    });

    return `
      <article class="postagem-admin-item">
        <div class="postagem-admin-conteudo">
          <h3>${postagem.titulo}</h3>
          <p><strong>Data:</strong> ${postagem.data}</p>
          <div class="postagem-admin-resumo">
            ${resumo}
          </div>
          <button
            type="button"
            class="btn-excluir"
            onclick="excluirPostagem('${postagem.id}')"
          >
            Excluir postagem
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function excluirPostagem(id) {
  const postagens = obterPostagens().filter((postagem) => postagem.id !== id);
  salvarPostagens(postagens);
  renderizarPostagensAdmin();
}

window.excluirPostagem = excluirPostagem;

formPostagem.addEventListener("submit", function (event) {
  event.preventDefault();

  const titulo = tituloInput.value.trim();

  erroTitulo.textContent = "";
  mensagemPostagem.textContent = "";
  mensagemPostagem.className = "mensagem";

  let valido = true;

  if (!titulo) {
    erroTitulo.textContent = "Digite o título da postagem.";
    valido = false;
  }

  const blocosSalvos = [];
  const blocosEditor = editor.querySelectorAll(".bloco-editor");

  if (blocosEditor.length === 0) {
    mensagemPostagem.textContent = "Adicione pelo menos um bloco de texto, imagem ou vídeo.";
    mensagemPostagem.classList.add("erro");
    return;
  }

  blocosEditor.forEach((bloco) => {
    if (bloco.classList.contains("bloco-texto")) {
      const texto = bloco.querySelector(".input-texto").value.trim();
      if (texto) {
        blocosSalvos.push({
          tipo: "texto",
          conteudo: texto
        });
      }
    }

    if (bloco.classList.contains("bloco-imagem")) {
      const imagem = bloco.querySelector(".preview-imagem-bloco").src;
      if (imagem) {
        blocosSalvos.push({
          tipo: "imagem",
          conteudo: imagem
        });
      }
    }

    if (bloco.classList.contains("bloco-video")) {
      const link = bloco.querySelector(".input-video").value.trim();
      if (link) {
        blocosSalvos.push({
          tipo: "video",
          conteudo: link
        });
      }
    }
  });

  if (!valido) return;

  if (blocosSalvos.length === 0) {
    mensagemPostagem.textContent = "Preencha algum conteúdo antes de salvar.";
    mensagemPostagem.classList.add("erro");
    return;
  }

  const novaPostagem = {
    id: Date.now().toString(),
    titulo: titulo,
    data: formatarData(),
    blocos: blocosSalvos
  };

  const postagens = obterPostagens();
  postagens.unshift(novaPostagem);
  salvarPostagens(postagens);

  mensagemPostagem.textContent = "Postagem salva com sucesso.";
  mensagemPostagem.classList.add("sucesso");

  formPostagem.reset();
  editor.innerHTML = "";

  renderizarPostagensAdmin();
});

renderizarPostagensAdmin();