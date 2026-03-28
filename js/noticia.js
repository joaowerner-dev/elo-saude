function obterPostagens() {
  return JSON.parse(localStorage.getItem("postagensEloSaude")) || [];
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto || "";
  return div.innerHTML;
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

    return "";
  } catch (error) {
    return "";
  }
}

function renderizarNoticia() {
  const conteudoNoticia = document.getElementById("conteudoNoticia");
  const idSelecionado = localStorage.getItem("postagemSelecionada");
  const postagens = obterPostagens();

  if (!conteudoNoticia) return;

  const postagem = postagens.find((item) => item.id === idSelecionado);

  if (!postagem) {
    conteudoNoticia.innerHTML = `
      <article class="noticia-card">
        <h1 class="titulo-noticia">Postagem não encontrada</h1>
        <p class="post-texto">Não foi possível abrir esta notícia.</p>
      </article>
    `;
    return;
  }

  let conteudoHtml = "";

  if (Array.isArray(postagem.blocos)) {
    postagem.blocos.forEach((bloco) => {
      if (bloco.tipo === "texto" && typeof bloco.conteudo === "string") {
        conteudoHtml += `<p class="post-texto">${escaparHtml(bloco.conteudo)}</p>`;
      }

      if (bloco.tipo === "imagem" && bloco.conteudo) {
        conteudoHtml += `
          <img
            src="${bloco.conteudo}"
            alt="Imagem da postagem"
            class="imagem-noticia"
          >
        `;
      }

      if (bloco.tipo === "video" && bloco.conteudo) {
        const embedUrl = converterLinkYouTubeParaEmbed(bloco.conteudo);

        if (embedUrl) {
          conteudoHtml += `
            <div class="video-postagem">
              <iframe
                src="${embedUrl}"
                title="Vídeo da postagem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          `;
        } else {
          conteudoHtml += `
            <p class="post-texto">
              <a href="${bloco.conteudo}" target="_blank" rel="noopener noreferrer">
                Assistir vídeo
              </a>
            </p>
          `;
        }
      }
    });
  } else {
    if (postagem.imagem) {
      conteudoHtml += `
        <img
          src="${postagem.imagem}"
          alt="${escaparHtml(postagem.titulo || "Imagem da postagem")}"
          class="imagem-noticia"
        >
      `;
    }

    if (typeof postagem.texto === "string" && postagem.texto.trim()) {
      conteudoHtml += `<p class="post-texto">${escaparHtml(postagem.texto)}</p>`;
    }

    if (postagem.link) {
      conteudoHtml += `
        <p class="post-texto">
          <a href="${postagem.link}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary">
            Abrir conteúdo
          </a>
        </p>
      `;
    }
  }

  conteudoNoticia.innerHTML = `
    <article class="noticia-card">
      <span class="card-date">${postagem.data || ""}</span>
      <h1 class="titulo-noticia">${escaparHtml(postagem.titulo || "Sem título")}</h1>
      ${conteudoHtml}
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", renderizarNoticia);