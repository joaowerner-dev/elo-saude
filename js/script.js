document.addEventListener("DOMContentLoaded", () => {
  const dataHojeEl = document.getElementById("dataHoje");
  const eventoHojeEl = document.getElementById("eventoHoje");
  const tituloEventoEl = document.getElementById("tituloEvento");

  if (!dataHojeEl || !eventoHojeEl || !tituloEventoEl) return;

  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");

  const chaveHoje = `${dia}${mes}`; // 🔥 SEM BARRA

  const diasSemana = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];

  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

  dataHojeEl.textContent =
    `${diasSemana[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

  const datasEspeciais = {

    // JANEIRO
    "0101": "Confraternização Universal.",
    "0401": "Dia do Braille.",
    "0601": "Dia de Reis.",
    "2001": "Dia do Farmacêutico.",

    // FEVEREIRO
    "0402": "Dia Mundial do Câncer.",
    "1102": "Mulheres na Ciência.",
    "1602": "Carnaval.",
    "1702": "Carnaval.",
    "1802": "Quarta-feira de Cinzas.",

    // MARÇO
    "0803": "Dia da Mulher.",
    "1403": "Dia do Pi.",
    "2103": "Síndrome de Down.",
    "2203": "Dia da Água.",

    // ABRIL
    "0204": "Conscientização do Autismo.",
    "0704": "Dia Mundial da Saúde.",
    "2104": "Tiradentes.",

    // MAIO
    "0105": "Dia do Trabalhador.",
    "1205": "Dia da Enfermagem.",
    "1505": "Dia da Família.",

    // JUNHO
    "1206": "Dia dos Namorados.",
    "1406": "Doação de Sangue.",
    "1806": "Orgulho Autista.",

    // JULHO
    "2007": "Dia do Amigo.",
    "2607": "Dia dos Avós.",

    // AGOSTO
    "1108": "Dia do Estudante.",
    "2208": "Folclore.",

    // SETEMBRO
    "0709": "Independência do Brasil.",
    "1009": "Prevenção ao Suicídio.",
    "2109": "Pessoa com Deficiência.",

    // OUTUBRO
    "1210": "Dia das Crianças.",
    "1510": "Dia do Professor.",

    // NOVEMBRO
    "0211": "Finados.",
    "1511": "Proclamação da República.",
    "2011": "Consciência Negra.",

    // DEZEMBRO
    "2512": "Natal.",
    "3112": "Ano Novo."
  };

  const campanhasMensais = {
    "01": "Janeiro Branco — saúde mental.",
    "02": "Fevereiro Roxo.",
    "03": "Março Azul.",
    "04": "Abril Azul — autismo.",
    "05": "Maio — saúde e família.",
    "06": "Junho Vermelho — doação de sangue.",
    "07": "Julho Amarelo.",
    "08": "Agosto Dourado.",
    "09": "Setembro Amarelo.",
    "10": "Outubro Rosa.",
    "11": "Novembro Azul.",
    "12": "Dezembro Vermelho."
  };

  const mensagemPositiva =
    "✨ Hoje é um novo dia para cuidar de você 💙";

  if (datasEspeciais[chaveHoje]) {
    tituloEventoEl.textContent = "Data especial de hoje";
    eventoHojeEl.textContent = datasEspeciais[chaveHoje];
  } else if (campanhasMensais[mes]) {
    tituloEventoEl.textContent = "Campanha do mês";
    eventoHojeEl.textContent = campanhasMensais[mes];
  } else {
    tituloEventoEl.textContent = "Mensagem do dia";
    eventoHojeEl.textContent = mensagemPositiva;
  }
});