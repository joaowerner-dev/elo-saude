const formLogin = document.getElementById("formLogin");
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const erroUsuario = document.getElementById("erroUsuario");
const erroSenha = document.getElementById("erroSenha");
const mensagemLogin = document.getElementById("mensagemLogin");
const toggleSenha = document.getElementById("toggleSenha");

// ==========================
// MOSTRAR / OCULTAR SENHA
// ==========================
if (toggleSenha && senhaInput) {
  toggleSenha.addEventListener("click", () => {
    const tipoAtual = senhaInput.type;

    if (tipoAtual === "password") {
      senhaInput.type = "text";
      toggleSenha.textContent = "Ocultar";
    } else {
      senhaInput.type = "password";
      toggleSenha.textContent = "Mostrar";
    }
  });
}

// ==========================
// LIMPAR ERROS AO DIGITAR
// ==========================
usuarioInput.addEventListener("input", () => {
  erroUsuario.textContent = "";
});

senhaInput.addEventListener("input", () => {
  erroSenha.textContent = "";
});

// ==========================
// LOGIN
// ==========================
if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    erroUsuario.textContent = "";
    erroSenha.textContent = "";
    mensagemLogin.textContent = "";
    mensagemLogin.className = "mensagem";

    let valido = true;

    // VALIDAÇÃO
    if (!usuario) {
      erroUsuario.textContent = "Digite o nome do administrador.";
      valido = false;
    }

    if (!senha) {
      erroSenha.textContent = "Digite a senha.";
      valido = false;
    }

    if (!valido) return;

    // ==========================
    // CONTROLE DE TENTATIVAS
    // ==========================
    let tentativas = parseInt(localStorage.getItem("tentativasLogin")) || 0;

    if (tentativas >= 5) {
      mensagemLogin.textContent = "Muitas tentativas. Tente novamente mais tarde.";
      mensagemLogin.classList.add("erro");
      return;
    }

    // ==========================
    // LOGIN CORRETO
    // ==========================
    if (usuario === "admin" && senha === "123456") {

      localStorage.setItem("adminLogado", "true");
      localStorage.removeItem("tentativasLogin");

      mensagemLogin.textContent = "Login realizado com sucesso!";
      mensagemLogin.classList.add("sucesso");

      // DESATIVA BOTÃO
      const botao = formLogin.querySelector("button");
      botao.disabled = true;
      botao.textContent = "Entrando...";

      setTimeout(() => {
        window.location.href = "postagem.html";
      }, 1000);

    } else {
      tentativas++;
      localStorage.setItem("tentativasLogin", tentativas);

      mensagemLogin.textContent = `Usuário ou senha inválidos. Tentativa ${tentativas}/5`;
      mensagemLogin.classList.add("erro");

      senhaInput.value = "";
      senhaInput.focus();
    }
  });
}