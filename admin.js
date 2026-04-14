// 1. CONFIGURAÇÃO DO BANCO (Igual fizemos na Fase 1)
const supabaseUrl = "https://rayopmbtdjbtutloyxwi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheW9wbWJ0ZGpidHV0bG95eHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzExMzcsImV4cCI6MjA4OTg0NzEzN30.6zYtqdD7o0I3w4RRgI_Jj6GsbBqRDfZyaGNrUInQL6s";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. VERIFICAÇÃO DE ACESSO
async function verificarAcesso() {
  // Pergunta ao Supabase: Tem alguém logado?
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (!user) {
    alert("Área restrita! Faça login primeiro.");
    window.location.href = "login.html"; // Expulsa o invasor
  } else {
    // Se estiver logado, mostra quem é
    document.getElementById("nome-usuario").innerText = user.email;
  }
}
verificarAcesso();

// 3. FUNÇÃO DE CADASTRO
async function cadastrarProduto() {
  // Captura os valores digitados no HTML
  let nomeProduto = document.getElementById("input-nome").value;
  let precoProduto = document.getElementById("input-preco").value;
  let imagemProduto = document.getElementById("input-imagem").value;
  let aviso = document.getElementById("mensagem-aviso");

  // Validação de segurança básica
  if (nomeProduto === "" || precoProduto === "") {
    aviso.innerText = "Preencha todos os campos!";
    aviso.style.color = "red";
    return;
  }

  aviso.innerText = "Salvando na nuvem...";
  aviso.style.color = "blue";

  // Envia o comando INSERT para a tabela 'produtos' no Supabase
  let { error } = await banco.from("produtos").insert([
    {
      nome: nomeProduto,
      preco: precoProduto,
      imagem_url: imagemProduto,
    },
  ]);

  // Verifica se deu erro ou se foi sucesso
  if (error) {
    aviso.innerText = "Erro ao salvar: " + error.message;
    aviso.style.color = "red";
  } else {
    aviso.innerText = "Produto cadastrado com sucesso!";
    aviso.style.color = "green";

    // Limpa as caixas de texto para o próximo cadastro
    document.getElementById("input-nome").value = "";
    document.getElementById("input-preco").value = "";
    document.getElementById("input-imagem").value = "";
  }
}

// 4. FUNÇÃO DE LOGOUT
async function sairDoSistema() {
  await banco.auth.signOut();
  window.location.href = "index.html"; // Manda de volta para a vitrine pública
}
