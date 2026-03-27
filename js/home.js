const suggestionForm = document.getElementById("suggestionForm");
const formStatus = document.getElementById("formStatus");
const btnEnviarSugestao = document.getElementById("btnEnviarSugestao");

if (suggestionForm) {
  suggestionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!nome || !email || !mensagem) {
      formStatus.textContent = "Preencha todos os campos.";
      formStatus.classList.add("erro");
      return;
    }

    if (window.location.protocol === "file:") {
      formStatus.textContent = "Abra pelo Live Server ou GitHub Pages para enviar o formulário.";
      formStatus.classList.add("erro");
      return;
    }

    btnEnviarSugestao.disabled = true;
    btnEnviarSugestao.textContent = "Enviando...";
    formStatus.textContent = "Enviando sua sugestão...";
    formStatus.classList.add("ok");

    const dados = {
      nome: nome,
      email: email,
      mensagem: mensagem,
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

      const resultado = await resposta.json();

      if (resposta.ok) {
        formStatus.textContent = "Sugestão enviada com sucesso.";
        formStatus.className = "form-status ok";
        suggestionForm.reset();
      } else {
        formStatus.textContent = "Não foi possível enviar agora. Tente novamente.";
        formStatus.className = "form-status erro";
        console.error(resultado);
      }
    } catch (erro) {
      formStatus.textContent = "Erro ao enviar. Verifique a internet e tente novamente.";
      formStatus.className = "form-status erro";
      console.error(erro);
    } finally {
      btnEnviarSugestao.disabled = false;
      btnEnviarSugestao.textContent = "Enviar sugestão";
    }
  });
}