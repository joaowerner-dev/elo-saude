const suggestionForm = document.getElementById("suggestionForm");
const formStatus = document.getElementById("formStatus");
const btnEnviarSugestao = document.getElementById("btnEnviarSugestao");

if (suggestionForm) {
  suggestionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!nome || !email || !mensagem) {
      formStatus.textContent = "Preencha todos os campos.";
      formStatus.classList.add("erro");
      return;
    }

    if (window.location.protocol === "file:") {
      formStatus.textContent = "Abra pelo Live Server ou GitHub Pages.";
      formStatus.classList.add("erro");
      return;
    }

    btnEnviarSugestao.disabled = true;
    btnEnviarSugestao.textContent = "Enviando...";
    formStatus.textContent = "Enviando sua sugestão...";
    formStatus.classList.add("ok");

    const dados = {
      nome,
      email,
      mensagem,
      _subject: "Nova sugestão - Elo Saúde",
      _template: "table"
    };

    try {
      const resposta = await fetch("https://formsubmit.co/ajax/elosaudeconexao@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (resposta.ok) {
        formStatus.textContent = "Sugestão enviada com sucesso.";
        formStatus.className = "form-status ok";
        suggestionForm.reset();
      } else {
        formStatus.textContent = "Erro ao enviar.";
        formStatus.className = "form-status erro";
      }
    } catch (erro) {
      formStatus.textContent = "Erro de conexão.";
      formStatus.className = "form-status erro";
      console.error(erro);
    } finally {
      btnEnviarSugestao.disabled = false;
      btnEnviarSugestao.textContent = "Enviar sugestão";
    }
  });
}

function obterPostagens() {
  return JSON.parse(localStorage.getItem("postagensEloSaude")) || [];
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto || "";
  return div.innerHTML;
}

function obterResumo(postagem) {
  if (Array.isArray(postagem.blocos)) {
    const blocoTexto = postagem.blocos.find(
      (bloco) => bloco.tipo === "texto" && typeof bloco.conteudo === "string" && bloco.conteudo.trim()
    );

    if (blocoTexto) {
      const texto = blocoTexto.conteudo.trim();
      return texto.length > 120 ? `${texto.slice(0, 120)}...` : texto;
    }
  }

  if (typeof postagem.texto === "string" && postagem.texto.trim()) {
    const texto = postagem.texto.trim();
    return texto.length > 120 ? `${texto.slice(0, 120)}...` : texto;
  }

  return "Clique para ver mais.";
}

function obterImagem(postagem) {
  if (Array.isArray(postagem.blocos)) {
    const blocoImagem = postagem.blocos.find(
      (bloco) => bloco.tipo === "imagem" && bloco.conteudo
    );
    return blocoImagem ? blocoImagem.conteudo : "";
  }

  return postagem.imagem || "";
}

function abrirNoticia(id) {
  localStorage.setItem("postagemSelecionada", id);
  window.location.href = "noticia.html";
}

window.abrirNoticia = abrirNoticia;

function renderizarNoticiasHome() {
  const listaNoticias = document.getElementById("lista-noticias");
  if (!listaNoticias) return;

  const postagens = obterPostagens();

  if (postagens.length === 0) {
    listaNoticias.innerHTML = `
      <article class="card-noticia">
        <div class="card-conteudo">
          <h3>Nenhuma postagem</h3>
          <p class="post-texto">Crie uma postagem no painel do administrador.</p>
        </div>
      </article>
    `;
    return;
  }

  listaNoticias.innerHTML = postagens.map((postagem) => {
    const imagem = obterImagem(postagem);
    const resumo = obterResumo(postagem);

    return `
      <article class="card-noticia">
        ${imagem ? `<img src="${imagem}" alt="${escaparHtml(postagem.titulo || "Imagem da postagem")}" class="card-image">` : ""}
        <div class="card-conteudo">
          <span class="card-date">${postagem.data || ""}</span>
          <h3>${escaparHtml(postagem.titulo || "Sem título")}</h3>
          <p class="post-texto">${escaparHtml(resumo)}</p>
          <button class="btn btn-primary btn-small" onclick="abrirNoticia('${postagem.id}')">
            Ler postagem
          </button>
        </div>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", renderizarNoticiasHome);