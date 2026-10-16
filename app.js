/* ---------- Вопросы ---------- */
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

/* ---------- Отрисовка вопросов ---------- */
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

    block.appendChild(qText);
    block.appendChild(select);
    block.appendChild(hint);
    container.appendChild(block);
  });
}

/* ---------- Сбор ответов ---------- */
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

/* ---------- Подсчёт ---------- */
function calculateScores(answers) {
  const dyadicIdx = [0, 2, 3, 4, 5, 6, 7];
  const solitaryIdx = [1, 8, 9, 10];
  const fantasiesIdx = [11, 12];
  const motivationIdx = 13;

  const sum = arr => arr.reduce((a, i) => a + answers[i], 0);

  return {
    dyadic: sum(dyadicIdx),
    solitary: sum(solitaryIdx),
    fantasies: sum(fantasiesIdx),
    motivation: answers[motivationIdx]
  };
}

/* ---------- Интерпретация ---------- */
function interpret(scores, gender, age) {
  const lines = [];

  let levelD = scores.dyadic < 35 ? "низкий" : (scores.dyadic < 55 ? "средний" : "высокий");
  let levelS = scores.solitary < 12 ? "низкий" : (scores.solitary < 24 ? "средний" : "высокий");
  let levelF = scores.fantasies < 6 ? "низкий" : (scores.fantasies < 12 ? "средний" : "высокий");

  lines.push(`• Диадное желание (к партнёру): ${scores.dyadic} баллов — ${levelD} уровень.`);
  lines.push(`• Соло-желание: ${scores.solitary} баллов — ${levelS} уровень.`);
  lines.push(`• Уровень сексуальных фантазий: ${scores.fantasies} баллов — ${levelF} уровень.`);
  lines.push(`• Мотивация сексуальной активности: ${scores.motivation} баллов.`);

  if (gender === "Мужской") {
    lines.push("Для мужчин средние значения диадного желания обычно выше, чем соло-желания.");
  } else {
    lines.push("У женщин соло-желание может быть менее выражено, но диадное желание сильно варьирует.");
  }

  if (age < 25) lines.push("В молодом возрасте уровень желания часто выше среднего.");
  else if (age > 50) lines.push("С возрастом желание может снижаться, что является нормальным.");

  lines.push("");
  lines.push("Результат носит ознакомительный характер и не заменяет консультацию специалиста.");

  return lines;
}

/* ---------- График ---------- */
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
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "% от максимума" }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const i = ctx.dataIndex;
              return `${values[i]} баллов (${Math.round(normalized[i])}%)`;
            }
          }
        }
      }
    }
  });

  document.getElementById("chart-section").classList.remove("hidden");
}

/* ---------- PDF ---------- */
async function generatePDF(scores) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 22;

  const gender = getGender();
  const age = getAge();
  const interp = interpret(scores, gender, age);

  // Заголовок
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(26, 84, 144);
  doc.text("Результаты опросника SDI-2", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Sexual Desire Inventory-2 (русская адаптация)", margin, y);
  y += 10;

  // Демография
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Демографические данные", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Пол: ${gender}`, margin, y); y += 6;
  doc.text(`Возраст: ${age}`, margin, y); y += 10;

  // Баллы
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Баллы по шкалам", margin, y); y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Диадное желание: ${scores.dyadic} из 56`, margin, y); y += 6;
  doc.text(`Соло-желание: ${scores.solitary} из 30`, margin, y); y += 6;
  doc.text(`Фантазии: ${scores.fantasies} из 16`, margin, y); y += 6;
  doc.text(`Мотивация: ${scores.motivation} из 8`, margin, y); y += 10;

  // График
  const canvas = document.getElementById("resultChart");
  if (canvas) {
    const chartImg = canvas.toDataURL("image/png", 1.0);
    const imgW = pageW - margin * 2;
    const imgH = imgW * 0.5;
    doc.addImage(chartImg, "PNG", margin, y, imgW, imgH);
    y += imgH + 8;
  }

  // Интерпретация
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Интерпретация", margin, y); y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  interp.forEach(line => {
    if (y > 275) {
      doc.addPage();
      y = 22;
    }
    const wrapped = doc.splitTextToSize(line, pageW - margin * 2);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 6 + 2;
  });

  doc.save("SDI-2_report.pdf");
}

/* ---------- Обработчики ---------- */
function handleShowChart() {
  const age = getAge();
  if (!age || age < 18 || age > 100) {
    alert("Введите корректный возраст (18–100).");
    return;
  }
  const answers = collectAnswers();
  const scores = calculateScores(answers);
  drawChart(scores);
  document.getElementById("chart-section").scrollIntoView({ behavior: "smooth" });
}

function handleGeneratePDF() {
  const age = getAge();
  if (!age || age < 18 || age > 100) {
    alert("Введите корректный возраст (18–100).");
    return;
  }
  const answers = collectAnswers();
  const scores = calculateScores(answers);

  // Если графика ещё нет — построим перед экспортом
  if (!chartInstance) {
    drawChart(scores);
    setTimeout(() => generatePDF(scores), 400);
  } else {
    generatePDF(scores);
  }
}

/* ---------- Инициализация ---------- */
window.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
  document.getElementById("btn-chart").addEventListener("click", handleShowChart);
  document.getElementById("btn-pdf").addEventListener("click", handleGeneratePDF);
});