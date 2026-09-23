/*-------MENU DE NAVEGAÇÃO-------*/
const inicioBtn = document.querySelector('.inicio');

if(inicioBtn){
    inicioBtn.addEventListener('click', function(e){
        e.preventDefault();
        location.reload();
        window.scrollTo(0,0);
    });
}

/*-------LISTAGEM DE LUTAS E DADOS DOS CAMPEONATOS-------*/
const lutas = [
    {
        evento: "AJP TOUR Fortaleza",
        resultado: 1,
        medalha: "🥇",
        lutas: 4,
        vitorias: 4,
        derrotas: 0,
        finalizacoes: 3,
        tempoTotal: 822,
        linkIg: "https://www.instagram.com/p/DUS7dBJDgMg/?igsh=dmhqdWFpcWFvMGM1" // Link adicionado para não dar erro
    },
    {
        evento: "fortaleza open 2026 - NO-GI",
        resultado: 1,
        medalha: " CAT 🥇",
        lutas: 2,   
        vitorias: 2,
        derrotas: 0,
        finalizacoes: 2,
        tempoTotal: 260,
        linkIg: "https://www.instagram.com/p/DZ5777cJTgx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
    },
    {
        evento: "fortaleza open 2026 - NO-GI",
        resultado: 3,
        medalha: " ABS 🥉",
        lutas: 2,
        vitorias: 1,
        derrotas: 1,
        finalizacoes: 1,
        tempoTotal: 310,
        linkIg: "https://www.instagram.com/p/DZ5777cJTgx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
    }
];

let totalLutas = 0;
let vitorias = 0;
let derrotas = 0;
let finalizacoes = 0;
let tempoTotal = 0;
let primeiro = 0;
let segundo = 0;
let terceiro = 0;

/*-------ORDENA EVENTOS-------*/
lutas.sort((a,b) => {
    if (a.resultado === 0) return 1; // Joga eventos não realizados pro final
    if (b.resultado === 0) return -1;
    return a.resultado - b.resultado;
});

/*-------LISTA EVENTOS (AGORA INTERATIVA E SEM ERROS!)-------*/
const lista = document.querySelector(".lista-eventos"); // Declarado apenas uma vez!

lutas.forEach((luta) => {
    const item = document.createElement("li");
    item.classList.add("evento-item"); 

    let textoResultado = "";
    if(luta.resultado === 1) textoResultado = "CAMPEÃO";
    else if(luta.resultado === 2) textoResultado = "2º Lugar";
    else if(luta.resultado === 3) textoResultado = "3º Lugar";
    else if(luta.resultado === 0) textoResultado = "Aguardando evento...";

    // --- PARTE A: O Cabeçalho (O que você clica) ---
    const header = document.createElement("div");
    header.classList.add("evento-header");
    header.innerHTML = `
        <span class="evento-titulo">${luta.evento} ${luta.medalha}</span>
        <span class="seta-toggle">▼</span> `;

    // --- PARTE B: O Corpo (A gaveta escondida) ---
    // Se não tiver link cadastrado, coloca um # para não quebrar
    const linkSeguro = luta.linkIg ? luta.linkIg : "#"; 
    
    const body = document.createElement("div");
    body.classList.add("evento-body");
    body.innerHTML = `
        <p>Resultado: <strong>${textoResultado}</strong></p>
        <p>Vitórias: ${luta.vitorias} | Derrotas: ${luta.derrotas}</p>
        <p>Finalizações: ${luta.finalizacoes}</p>
        <a href="${linkSeguro}" target="_blank" rel="noopener noreferrer" class="instagram-link">
           <img src="img/ig.logo2.svg" alt="Instagram" class="icone-ig-link"> Ver post oficial
        </a>
    `;

    // --- PARTE C: O Clique (A Mágica) ---
    header.addEventListener("click", () => {
        item.classList.toggle("aberta");
    });

    item.appendChild(header);
    item.appendChild(body);
    lista.appendChild(item);
});


/*-------CALCULAR ESTATÍSTICAS-------*/
function calcularEstatisticas(){
    lutas.forEach(camp => {
        if(camp.resultado !== 0) { // Só calcula o que já aconteceu
            totalLutas += camp.lutas;
            vitorias += camp.vitorias;
            derrotas += camp.derrotas;
            finalizacoes += camp.finalizacoes;
            tempoTotal += camp.tempoTotal;

            if(camp.resultado === 1) primeiro++;
            if(camp.resultado === 2) segundo++;
            if(camp.resultado === 3) terceiro++;
        }
    });
}
calcularEstatisticas();


/*-------TEMPO MÉDIO-------*/
// Proteção contra divisão por zero se não houver lutas
const tempoMedio = totalLutas > 0 ? (tempoTotal / totalLutas) : 0;

function formatarTempo(segundos){
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos.toString().padStart(2,'0')}`;
}
const tempoMedioFormatado = formatarTempo(tempoMedio);


/*-------TAXAS-------*/
// Proteção contra divisão por zero
const taxaVitoria = totalLutas > 0 ? ((vitorias / totalLutas) * 100).toFixed(1) : "0.0";
const taxaFinalizacao = totalLutas > 0 ? ((finalizacoes / totalLutas) * 100).toFixed(1) : "0.0";


/*-------ATUALIZAR ESTATÍSTICAS-------*/
function atualizarEstatisticas(){
    animarNumero("total-lutas", totalLutas);
    animarNumero("total-vitorias", vitorias);
    animarNumero("total-derrotas", derrotas);
    animarNumero("total-ouro", primeiro);
    animarNumero("total-prata", segundo);
    animarNumero("total-bronze", terceiro);

    document.getElementById("taxa-vitoria").textContent = taxaVitoria + "%";
    document.getElementById("taxa-finalizacao").textContent = taxaFinalizacao + "%";
    document.getElementById("tempo-medio").textContent = tempoMedioFormatado;
}


/*-------ANIMAÇÃO DONUT-------*/
function atualizarGrafico(){
    const total = vitorias + derrotas;
    // Protege contra divisão por zero se o total de vitórias + derrotas for 0
    const porcentagemFinal = total > 0 ? (vitorias / total) * 100 : 0;

    const donut = document.getElementById("donut-chart");
    const texto = document.getElementById("porcentagem-vitoria");

    let progresso = 0;

    const animacao = setInterval(()=>{
        // Se a porcentagem final for 0, pula a animação para não girar eternamente
        if(porcentagemFinal === 0) {
            donut.style.background = `conic-gradient(#2ecc71 0% 0%, #e74c3c 0% 100%)`;
            texto.textContent = "0%";
            clearInterval(animacao);
            return;
        }

        progresso += 1;
        donut.style.background = `
            conic-gradient(
                #2ecc71 0% ${progresso}%,
                #e74c3c ${progresso}% 100%
            )
        `;
        texto.textContent = progresso + "%";

        if(progresso >= porcentagemFinal){
            clearInterval(animacao);
            texto.textContent = Math.round(porcentagemFinal) + "%";
        }
    }, 15);
}


/*-------CONTADOR ANIMADO-------*/
function animarNumero(id, valorFinal, duracao=1200){
    const elemento = document.getElementById(id);
    if(valorFinal === 0) { // Se for 0, não precisa animar
        elemento.textContent = "0";
        return;
    }

    let inicio = 0;
    const incremento = valorFinal / (duracao / 16);

    const timer = setInterval(()=>{
        inicio += incremento;
        if(inicio >= valorFinal){
            inicio = valorFinal;
            clearInterval(timer);
        }
        elemento.textContent = Math.floor(inicio);
    }, 16);
}


/*-------ANIMAÇÃO ENTRADA-------*/
function animarEntrada(){
    const painel = document.querySelector(".area-campanha");
    let jaAnimou = false; // Trava para animar só uma vez

    const observer = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                painel.classList.add("ativo");
                
                if(!jaAnimou) {
                    atualizarEstatisticas();
                    atualizarGrafico();
                    jaAnimou = true;
                }
            }
        });
    }, {threshold: 0.3});

    if(painel) observer.observe(painel);
}
animarEntrada();


/*-------PARTÍCULAS-------*/
function criarParticulas(){
    const container = document.querySelector(".particulas");
    if(!container) return; // Evita erro se a div não existir

    for(let i=0; i<40; i++){
        const p = document.createElement("span");
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = 8 + Math.random() * 10 + "s";
        p.style.opacity = Math.random() * 0.5;
        container.appendChild(p);
    }
}
criarParticulas();


/*-------SETA SCROLL-------*/
document.addEventListener("DOMContentLoaded", () => {
    const seta = document.querySelector(".seta-scroll");

    if(seta){
        window.addEventListener("scroll", () => {
            if(window.scrollY > 100){
                seta.style.opacity = "0";
            }else{
                seta.style.opacity = "1";
            }
        });

        seta.addEventListener("click", () => {
            document.querySelector(".secao-inferior").scrollIntoView({
                behavior:"smooth"
            });
        });
    }

    // Lógica para a segunda seta (vai para a bio)
        const setaBio = document.querySelector(".seta-proxima");
        if(setaBio) {
            setaBio.addEventListener("click", () => {
                // Por enquanto, como não temos a Parte 3, ela vai rolar 
                // para o final da página ou para onde a gente criar a nova ID
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            });
        }
});

/*------- EFEITO SANFONA EXCLUSIVA (UMA POR VEZ) -------*/
document.addEventListener("DOMContentLoaded", () => {
    const marcosCards = document.querySelectorAll(".marco-card");

    marcosCards.forEach(card => {
        const header = card.querySelector(".marco-header");
        
        if(header) {
            header.addEventListener("click", () => {
                // Se o card clicado já estiver aberto, a gente só fecha ele
                if (card.classList.contains("aberta")) {
                    card.classList.remove("aberta");
                } else {
                    // Se estiver fechado, primeiro fechamos TODOS os outros...
                    marcosCards.forEach(c => c.classList.remove("aberta"));
                    // ...e depois abrimos o que foi clicado
                    card.classList.add("aberta");
                }
            });
        }
    });
});