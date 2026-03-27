const formLogin = document.getElementById("formLogin");
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const erroUsuario = document.getElementById("erroUsuario");
const erroSenha = document.getElementById("erroSenha");
const mensagemLogin = document.getElementById("mensagemLogin");
const toggleSenha = document.getElementById("toggleSenha");

/* DADOS DE LOGIN */
const usuarioCorreto = "admin";
const senhaCorreta = "123456";

/* MOSTRAR / OCULTAR SENHA */
if (toggleSenha) {
  toggleSenha.addEventListener("click", function () {
    if (senhaInput.type === "password") {
      senhaInput.type = "text";
      toggleSenha.textContent = "Ocultar";
    } else {
      senhaInput.type = "password";
      toggleSenha.textContent = "Mostrar";
    }
  });
}

/* LIMPAR ERROS */
function limparErros() {
  erroUsuario.textContent = "";
  erroSenha.textContent = "";
  mensagemLogin.textContent = "";
  mensagemLogin.className = "mensagem";

  usuarioInput.classList.remove("input-invalido");
  senhaInput.classList.remove("input-invalido");
}

/* MARCAR ERRO */
function marcarErro(input, campoErro, mensagem) {
  campoErro.textContent = mensagem;
  input.classList.add("input-invalido");
}

/* VALIDAR CAMPOS */
function validarCampos(usuario, senha) {
  let formularioValido = true;

  if (usuario === "") {
    marcarErro(usuarioInput, erroUsuario, "Digite o nome do administrador.");
    formularioValido = false;
  } else if (usuario.length < 3) {
    marcarErro(usuarioInput, erroUsuario, "O nome deve ter pelo menos 3 caracteres.");
    formularioValido = false;
  }

  if (senha === "") {
    marcarErro(senhaInput, erroSenha, "Digite a senha.");
    formularioValido = false;
  } else if (senha.length < 6) {
    marcarErro(senhaInput, erroSenha, "A senha deve ter pelo menos 6 caracteres.");
    formularioValido = false;
  }

  return formularioValido;
}

/* LOGIN */
if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    limparErros();

    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    const valido = validarCampos(usuario, senha);

    if (!valido) {
      mensagemLogin.textContent = "Preencha os campos corretamente.";
      mensagemLogin.classList.add("erro-geral");
      return;
    }

    if (usuario === usuarioCorreto && senha === senhaCorreta) {
      localStorage.setItem("adminLogado", "true");
      localStorage.setItem("adminNome", usuario);

      mensagemLogin.textContent = "Login realizado com sucesso. Redirecionando...";
      mensagemLogin.classList.add("sucesso");

      setTimeout(function () {
        window.location.href = "painel-admin.html";
      }, 1200);
    } else {
      mensagemLogin.textContent = "Nome ou senha inválidos.";
      mensagemLogin.classList.add("erro-geral");

      usuarioInput.classList.add("input-invalido");
      senhaInput.classList.add("input-invalido");
    }
  });
}