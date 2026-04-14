// Alterna entre texto escondido e visível
function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈"; // Troca o emoji
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

// 1. CONFIGURAÇÃO DO BANCO
const supabaseUrl = "https://rayopmbtdjbtutloyxwi.supabase.co";
const supabaseKey = "sb_publishable_d4rRuWw-1Yosty_MM2fc7g_tiWOZZuY";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. BLOQUEIO REVERSO (executa ao abrir a página)
async function verificarLoginExistente() {
  const {
    data: { user },
  } = await banco.auth.getUser();
  if (user) {
    // Se já estiver logado, pula a tela de login
    window.location.href = "admin.html";
  }
}
verificarLoginExistente();

// 3. FUNÇÃO DE LOGIN
async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");

  // Efeito de carregamento (Feedback visual)
  btn.innerText = "Verificando...";
  btn.disabled = true;

  // Comando que tenta logar no Supabase
  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "Acesso Negado: " + error.message;
    msg.style.color = "red";
    btn.innerText = "Entrar no Painel";
    btn.disabled = false; // Libera o botão novamente
  } else {
    msg.innerText = "Acesso concedido! Carregando painel...";
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }
}

// 4. ATALHO DE TECLADO (ENTER no campo de senha)
document
  .getElementById("password")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      fazerLogin();
    }
  });
