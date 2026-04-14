// 0. VARIÁVEL DO CARRINHO
// Tenta carregar o carrinho salvo no navegador, ou começa um vazio []
let carrinho = JSON.parse(localStorage.getItem("meu_carrinho")) || [];

// 1. CONFIGURAÇÃO DO BANCO DE DADOS
const supabaseUrl = "https://rayopmbtdjbtutloyxwi.supabase.co";
const supabaseKey = "sb_publishable_d4rRuWw-1Yosty_MM2fc7g_tiWOZZuY";

// Inicia a conexão
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNÇÃO PARA BUSCAR E DESENHAR OS PRODUTOS
async function carregarCatalogo() {
  // Faz um SELECT * FROM produtos na nuvem
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  let vitrine = document.getElementById("vitrine");
  vitrine.innerHTML = ""; // Limpa a tela

  // Loop para desenhar cada produto na tela
  produtos.forEach((item) => {
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "card-produto";
    div.innerHTML = `
      <img src="${item.imagem_url}" width="150">
      <h3>${item.nome}</h3>
      <p>${precoFormatado}</p>
      <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
        Adicionar ao Carrinho
      </button>
    `;
    vitrine.appendChild(div);
  });
}

// 1. ADICIONAR ITEM
function adicionarAoCarrinho(nome, preco) {
  const item = { nome, preco };
  carrinho.push(item); // Adiciona na lista
  atualizarCarrinho(); // Atualiza a tela
}

// 2. ATUALIZAR A TELA E O LOCALSTORAGE
function atualizarCarrinho() {
  const listaHtml = document.getElementById("lista-carrinho");
  const totalHtml = document.getElementById("valor-total");

  listaHtml.innerHTML = ""; // Limpa a lista visual
  let somaTotal = 0;

  carrinho.forEach((item, index) => {
    somaTotal += item.preco;
    listaHtml.innerHTML += `
      <li>
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        <button onclick="removerItem(${index})">❌</button>
      </li>
    `;
  });

  // Atualiza o valor total na tela
  totalHtml.innerText = somaTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // SALVA A LISTA NO NAVEGADOR (LocalStorage)
  localStorage.setItem("meu_carrinho", JSON.stringify(carrinho));
}

// 3. REMOVER ITEM INDIVIDUAL
function removerItem(index) {
  carrinho.splice(index, 1); // Remove apenas o item clicado
  atualizarCarrinho(); // Atualiza a tela e o LocalStorage
}

// 4. LIMPAR TUDO
function esvaziarCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// 5. FINALIZAR COMPRA
function finalizarCompra() {
  alert("Compra finalizada! Obrigado por comprar conosco.");
  carrinho = [];
  atualizarCarrinho();
}

// Inicializa o catálogo e o carrinho ao carregar a página
carregarCatalogo();
atualizarCarrinho();
