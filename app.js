/* ================== ВОПРОСЫ ================== */
const QUESTIONS = [
  { text: "1. За последний месяц как часто вы хотели бы заниматься сексом с партнёром?", type: "freq" },
  { text: "2. За последний месяц как часто вы хотели бы заниматься сексом в одиночку?", type: "freq" },
  { text: "3. Насколько сильным было ваше желание сексуальной активности с партнёром?", type: "desire" },
  { text: "4. Насколько сильным было ваше желание сексуальной активности в одиночку?", type: "desire" },
  { text: "5. Как часто вы испытывали сексуальное возбуждение при виде привлекательного человека?", type: "desire" },
  { text: "6. Насколько сильно вы хотели бы, чтобы партнёр возбуждал вас?", type: "desire" },
  { text: "7. Насколько сильно вы хотели бы возбуждать партнёра?", type: "desire" },
  { text: "8. Насколько важно для вас, чтобы сексуальная активность с партнёром была частью вашей жизни?", type: "desire" },
  { text: "9. Насколько сильным было ваше желание мастурбировать?", type: "desire" },
  { text: "10. За последний месяц как часто вы мастурбировали?", type: "freq" },
  { text: "11. Насколько сильным было ваше желание сексуальной активности в одиночку?", type: "desire" },
  { text: "12. Как часто у вас возникали сексуальные фантазии?", type: "desire" },
  { text: "13. Насколько сильно вы хотите реализовать свои сексуальные фантазии?", type: "desire" },
  { text: "14. Насколько сексуальное желание мотивирует вас в повседневной жизни?", type: "desire" }
];

const FREQ_LABELS = [
  "0 — Никогда",
  "1 — Реже раза в месяц",
  "2 — Раз в месяц",
  "3 — Несколько раз в месяц",
  "4 — Раз в неделю",
  "5 — Несколько раз в неделю",
  "6 — Ежедневно",
  "7 — Более раза в день"
];

const DESIRE_LABELS = [
  "0 — Нет желания",
  "1 — Очень слабое",
  "2 — Слабое",
  "3 — Умеренно слабое",
  "4 — Среднее",
  "5 — Умеренно сильное",
  "6 — Сильное",
  "7 — Очень сильное",
  "8 — Максимально сильное"
];

/* ================== ОТРИСОВКА ВОПРОСОВ ================== */
function renderQuestions() {
  const container = document.getElementById("questions-container");
  QUESTIONS.forEach((q, idx) => {
    const labels = q.type === "freq" ? FREQ_LABELS : DESIRE_LABELS;
    const block = document.createElement("div");
    block.className = "question";

    const qText = document.createElement("div");
    qText.className = "question-text";
    qText.textContent = q.text;

    const select = document.createElement("select");
    select.id = "q" + idx;
    labels.forEach((label, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = label;
      select.appendChild(opt);
    });

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = q.type === "freq" ? "Шкала частоты (0–7)" : "Шкала выраженности (0–8)";

    block.append(qText, select, hint);
    container.appendChild(block);
  });
}

/* ================== СБОР ДАННЫХ ================== */
function collectAnswers() {
  const answers = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    answers.push(parseInt(document.getElementById("q" + i).value, 10));
  }
  return answers;
}

function getGender() {
  return document.querySelector('input[name="gender"]:checked').value;
}

function getAge() {
  return parseInt(document.getElementById("age").value, 10);
}

/* ================== РАСЧЁТ БАЛЛОВ ================== */
function calculateScores(answers) {
  const dyadicIdx    = [0, 2, 3, 4, 5, 6, 7];
  const solitaryIdx  = [1, 8, 9, 10];
  const fantasiesIdx = [11, 12];
  const motivationIdx = 13;

  const sum = arr => arr.reduce((a, i) => a + answers[i], 0);

  return {
    dyadic:     sum(dyadicIdx),
    solitary:   sum(solitaryIdx),
    fantasies:  sum(fantasiesIdx),
    motivation: answers[motivationIdx]
  };
}

/* ================== ИНТЕРПРЕТАЦИЯ ================== */
function levelDyadic(v) {
  if (v < 25) return { label: "очень низкий",  desc: "Желание к партнёру выражено слабо, сексуальная активность с партнёром может не быть значимой." };
  if (v < 40) return { label: "низкий",        desc: "Желание к партнёру ниже среднего, интерес к близости с партнёром снижен." };
  if (v < 50) return { label: "средний",       desc: "Желание к партнёру в пределах типичных значений." };
  if (v < 62) return { label: "повышенный",    desc: "Желание к партнёру выше среднего, близость с партнёром играет важную роль." };
  return             { label: "высокий",        desc: "Сильно выраженное желание к партнёру, сексуальная активность — значимая часть жизни." };
}

function levelSolitary(v) {
  if (v < 6)  return { label: "очень низкий", desc: "Соло-желание практически не выражено." };
  if (v < 12) return { label: "низкий",       desc: "Соло-желание ниже среднего, интерес к индивидуальной сексуальности снижен." };
  if (v < 19) return { label: "средний",      desc: "Соло-желание в пределах типичных значений." };
  if (v < 25) return { label: "повышенный",   desc: "Соло-желание выше среднего, индивидуальная сексуальность выражена." };
  return             { label: "высокий",       desc: "Сильно выраженное соло-желание, мастурбация и индивидуальные практики значимы." };
}

function levelFantasies(v) {
  if (v < 4)  return { label: "низкий",    desc: "Сексуальные фантазии редки или отсутствуют." };
  if (v < 8)  return { label: "средний",   desc: "Фантазии встречаются с типичной частотой." };
  if (v < 13) return { label: "повышенный", desc: "Фантазийная сфера выражена, фантазии занимают заметное место." };
  return             { label: "высокий",    desc: "Богатая фантазийная сфера, фантазии — важная часть сексуальности." };
}

function levelMotivation(v) {
  if (v <= 2) return { label: "низкий",   desc: "Сексуальное желание слабо мотивирует повседневную активность." };
  if (v <= 4) return { label: "средний",  desc: "Сексуальное желание умеренно влияет на мотивацию." };
  if (v <= 6) return { label: "повышенный", desc: "Сексуальное желание заметно мотивирует в повседневной жизни." };
  return             { label: "высокий",   desc: "Сексуальное желание — один из ведущих мотиваторов." };
}

function buildInterpretation(scores, gender, age) {
  const d = scores.dyadic;
  const s = scores.solitary;
  const f = scores.fantasies;
  const m = scores.motivation;

  const ld = levelDyadic(d);
  const ls = levelSolitary(s);
  const lf = levelFantasies(f);
  const lm = levelMotivation(m);

  /* --- 1. Общий профиль --- */
  const profileLines = [];
  if (d > s * 1.8) {
    profileLines.push(
      "Профиль смещён в сторону диадного желания: сексуальность направлена преимущественно на партнёра. " +
      "Индивидуальные практики играют второстепенную роль."
    );
  } else if (s > d * 0.9) {
    profileLines.push(
      "Профиль смещён в сторону соло-желания: индивидуальная сексуальность выражена не меньше, чем партнёрская. " +
      "Это может указывать на автономный характер желания."
    );
  } else {
    profileLines.push(
      "Диадное и соло-желание сбалансированы: сексуальность реализуется и с партнёром, и индивидуально."
    );
  }

  if (gender === "Мужской") {
    profileLines.push(
      "У мужчин диадное желание обычно выше, чем соло-желание, поэтому небольшое смещение в сторону партнёра — типичная картина."
    );
  } else {
    profileLines.push(
      "У женщин диадное желание, как правило, преобладает над соло-желанием, но возможны значительные индивидуальные различия."
    );
  }

  if (age < 25) {
    profileLines.push("Возраст до 25 лет: уровень желания часто выше среднего, что является нормой.");
  } else if (age < 40) {
    profileLines.push("Возраст 25–40 лет: уровень желания обычно стабилен и близок к пиковым значениям.");
  } else if (age < 55) {
    profileLines.push("Возраст 40–55 лет: возможно постепенное снижение желания, что считается нормальным.");
  } else {
    profileLines.push("Возраст после 55 лет: снижение желания — закономерный процесс, не требующий коррекции сам по себе.");
  }

  /* --- 2. По каждой шкале --- */
  const details = [
    {
      title: `1. ДИАДНОЕ ЖЕЛАНИЕ (к партнёру) — ${d} из 56`,
      level: `Уровень: ${ld.label}`,
      desc: ld.desc,
      extra: "Ориентировочные средние по выборкам: мужчины ≈ 49, женщины ≈ 45."
    },
    {
      title: `2. СОЛО-ЖЕЛАНИЕ — ${s} из 30`,
      level: `Уровень: ${ls.label}`,
      desc: ls.desc,
      extra: "Ориентировочные средние по выборкам: мужчины ≈ 19, женщины ≈ 14."
    },
    {
      title: `3. СЕКСУАЛЬНЫЕ ФАНТАЗИИ — ${f} из 16`,
      level: `Уровень: ${lf.label}`,
      desc: lf.desc,
      extra: "Шкала отражает частоту и интенсивность сексуальных фантазий."
    },
    {
      title: `4. МОТИВАЦИЯ СЕКСУАЛЬНОЙ АКТИВНОСТИ — ${m} из 8`,
      level: `Уровень: ${lm.label}`,
      desc: lm.desc,
      extra: "Шкала показывает, насколько сексуальное желание влияет на повседневную мотивацию."
    }
  ];

  return { profile: profileLines, details };
}

/* ================== ГРАФИК ================== */
let chartInstance = null;

function drawChart(scores) {
  const ctx = document.getElementById("resultChart").getContext("2d");
  const maxValues = [56, 30, 16, 8];
  const values = [scores.dyadic, scores.solitary, scores.fantasies, scores.motivation];
  const normalized = values.map((v, i) => (v / maxValues[i]) * 100);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Диадное желание", "Соло-желание", "Фантазии", "Мотивация"],
      datasets: [{
        label: "% от максимума",
        data: normalized,
        backgroundColor: ["#4A90D9", "#50B86C", "#E8A838", "#D95B43"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 0 },  // важно: чтобы canvas был готов сразу для PDF
      scales: {
        y: { beginAtZero: true, max: 100,
             title: { display: true, text: "% от максимума" } }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (c) => {
              const i = c.dataIndex;
              return `${values[i]} баллов (${Math.round(normalized[i])}%)`;
            }
          }
        }
      }
    }
  });

  document.getElementById("chart-section").classList.remove("hidden");
}

/* ================== PDF через pdfmake ================== */
function generatePDF(scores) {
  const gender = getGender();
  const age = getAge();
  const { profile, details } = buildInterpretation(scores, gender, age);

  const chartUrl = document.getElementById("resultChart").toDataURL("image/png", 1.0);

  const content = [];

  // Заголовок
  content.push({ text: "Результаты опросника SDI-2", style: "h1" });
  content.push({ text: "Sexual Desire Inventory-2 (русская адаптация)", style: "sub" });
  content.push({ text: "\n" });

  // Демография
  content.push({ text: "Демографические данные", style: "h2" });
  content.push({ text: `Пол: ${gender}` });
  content.push({ text: `Возраст: ${age}` });
  content.push({ text: "\n" });

  // Баллы
  content.push({ text: "Баллы по шкалам", style: "h2" });
  content.push({ text: `Диадное желание: ${scores.dyadic} из 56` });
  content.push({ text: `Соло-желание: ${scores.solitary} из 30` });
  content.push({ text: `Сексуальные фантазии: ${scores.fantasies} из 16` });
  content.push({ text: `Мотивация: ${scores.motivation} из 8` });
  content.push({ text: "\n" });

  // График
  content.push({ image: chartUrl, width: 500, alignment: "center" });
  content.push({ text: "\n" });

  // Подробная интерпретация по шкалам
  content.push({ text: "Подробная интерпретация", style: "h2" });
  details.forEach(det => {
    content.push({ text: det.title, style: "h3" });
    content.push({ text: det.level, bold: true });
    content.push({ text: det.desc });
    content.push({ text: det.extra, italics: true, color: "#666" });
    content.push({ text: "\n" });
  });

  // Общий профиль
  content.push({ text: "Общий профиль", style: "h2" });
  profile.forEach(line => content.push({ text: line, margin: [0, 0, 0, 4] }));
  content.push({ text: "\n" });

  // Дисклеймер
  content.push({
    text: "ВНИМАНИЕ: результат носит ознакомительный характер и не заменяет консультацию специалиста. " +
          "Для клинической интерпретации рекомендуется обратиться к психологу или сексологу.",
    italics: true,
    color: "#8a2a2a",
    margin: [0, 12, 0, 0]
  });

  const docDefinition = {
    content,
    defaultStyle: {
      font: "Roboto",   // Roboto из vfs_fonts.js поддерживает кириллицу
      fontSize: 11,
      lineHeight: 1.35
    },
    styles: {
      h1: { fontSize: 20, bold: true, color: "#1a5490", margin: [0, 0, 0, 6] },
      sub: { fontSize: 11, color: "#666", margin: [0, 0, 0, 12] },
      h2: { fontSize: 14, bold: true, color: "#1a5490", margin: [0, 12, 0, 6] },
      h3: { fontSize: 12, bold: true, color: "#333", margin: [0, 8, 0, 2] }
    },
    pageMargins: [40, 40, 40, 50],
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: "SDI-2 · Конфиденциальный отчёт", alignment: "left", fontSize: 9, color: "#999" },
        { text: `Стр. ${currentPage} из ${pageCount}`, alignment: "right", fontSize: 9, color: "#999" }
      ],
      margin: [40, 20, 40, 0]
    })
  };

  pdfMake.createPdf(docDefinition).download("SDI-2_report.pdf");
}

/* ================== ОБРАБОТЧИКИ ================== */
function validate() {
  const age = getAge();
  if (!age || age < 18 || age > 100) {
    alert("Введите корректный возраст (18–100).");
    return false;
  }
  return true;
}

function handleShowChart() {
  if (!validate()) return;
  const scores = calculateScores(collectAnswers());
  drawChart(scores);
  document.getElementById("chart-section").scrollIntoView({ behavior: "smooth" });
}

function handleGeneratePDF() {
  if (!validate()) return;
  const scores = calculateScores(collectAnswers());

  if (!chartInstance) {
    // сначала строим график, ждём кадр, потом PDF
    drawChart(scores);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => generatePDF(scores));
    });
  } else {
    generatePDF(scores);
  }
}

/* ================== СТАРТ ================== */
window.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
  document.getElementById("btn-chart").addEventListener("click", handleShowChart);
  document.getElementById("btn-pdf").addEventListener("click", handleGeneratePDF);
});
