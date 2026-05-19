let topics = [];
let knowledge = null;
let current = null;
let currentResult = null;
let currentStep = 0;
const codeCache = new Map();

const nav = document.getElementById("nav");
const search = document.getElementById("search");
const title = document.getElementById("title");
const groupEl = document.getElementById("group");
const visualType = document.getElementById("visualType");
const form = document.getElementById("inputForm");
const ideaBox = document.getElementById("ideaBox");
const summary = document.getElementById("summary");
const visual = document.getElementById("visual");
const stepInfo = document.getElementById("stepInfo");
const prevStep = document.getElementById("prevStep");
const nextStep = document.getElementById("nextStep");
const showAll = document.getElementById("showAll");
const codePath = document.getElementById("codePath");
const codeEditor = document.getElementById("codeEditor");
const printPage = document.getElementById("printPage");
const toggleSidebar = document.getElementById("toggleSidebar");
let currentCode = "";
let currentCodeLine = 1;

const typeLabel = {
  tree: "Cây truy hồi",
  stateTree: "Bảng DFS",
  stateGraph: "Bảng trạng thái",
  levels: "Bảng BFS",
  board: "Cây nhánh + bàn cờ",
  decision: "Cây nhánh quay lui",
  timeline: "Bảng tham lam",
  matching: "Hai con trỏ",
  heap: "Bảng heap",
  heapSteps: "Min-heap",
  windows: "Bảng cửa sổ trượt",
  twoHeaps: "Hai heap",
  table: "Bảng tham lam",
  dp: "Bảng quy hoạch động",
  cut: "Bảng quy hoạch động"
};

async function boot() {
  [topics, knowledge] = await Promise.all([
    fetch("/api/topics").then(r => r.json()),
    fetch("/knowledge.json").then(r => r.json()).catch(() => null)
  ]);
  const initialId = decodeURIComponent(location.hash.replace(/^#/, ""));
  current = topics.find(t => t.id === initialId) || topics[0];
  renderNav();
  await renderTopic();
}

function renderNav() {
  const q = search.value.trim().toLowerCase();
  const groups = [...new Set(topics.map(t => t.group))];
  nav.innerHTML = groups.map(group => {
    const list = topics.filter(t => t.group === group && (!q || `${t.name} ${t.group}`.toLowerCase().includes(q)));
    if (!list.length) return "";
    return `<div class="nav-group"><h3>${escapeHtml(group)}</h3>${list.map(t => `
      <button class="topic-btn ${current?.id === t.id ? "active" : ""}" data-id="${t.id}">${escapeHtml(t.name)}</button>
    `).join("")}</div>`;
  }).join("");
  nav.querySelectorAll(".topic-btn").forEach(btn => {
    btn.onclick = async () => {
      current = topics.find(t => t.id === btn.dataset.id);
      history.replaceState(null, "", `#${encodeURIComponent(current.id)}`);
      document.body.classList.remove("nav-open");
      renderNav();
      await renderTopic();
    };
  });
}

async function renderTopic() {
  currentResult = null;
  currentStep = 0;
  title.textContent = current.name;
  groupEl.textContent = current.group;
  visualType.textContent = typeLabel[current.visual] || current.visual;
  const source = knowledge?.topics?.[current.id];
  const items = cleanKnowledgeBullets(source?.bullets);
  ideaBox.innerHTML = `
    <li class="source-line">Nguồn: ${escapeHtml(knowledge?.sourceFile || "đề cương mới nhất")}</li>
    ${items.map(x => `<li>${escapeHtml(x)}</li>`).join("")}
  `;
  form.innerHTML = current.fields.map(f => `
    <label class="field"><span>${escapeHtml(f.label)}</span><input name="${f.name}" value="${escapeHtml(f.value)}"></label>
  `).join("") + `<button type="submit">Tính minh họa</button>`;
  summary.textContent = "Bấm tính minh họa để xem từng bước.";
  visual.innerHTML = `<div class="empty">Minh họa sẽ hiện ở đây.</div>`;
  await loadCode(current.id);
  await solve();
}

function cleanKnowledgeBullets(bullets = []) {
  const fallback = ["Nêu trạng thái hoặc công thức.", "Mô tả các bước chạy theo đúng loại thuật toán.", "Kết luận độ phức tạp và lưu ý lỗi dễ sai."];
  const blocked = ["Code C/C++ mẫu", "Độ phức tạp", "#include", "using namespace", "int main", "return 0", "cin", "cout", "while(", "for(", "if(", ";", "{", "}"];
  const headingPattern = /^(\d+\.\s*)?(Ý tưởng|Minh họa|Công thức|Độ phức tạp|Code|[A-Z]\.|B\.\d+|C\.|D\.|E\.|F\.|G\.|H\.)/i;
  const cleaned = (bullets || [])
    .map(x => String(x || "").trim())
    .filter(Boolean)
    .filter(x => !blocked.some(token => x.includes(token)))
    .filter(x => !headingPattern.test(x))
    .filter(x => !/^\d+\.\s+\S/.test(x))
    .slice(0, 7);
  return cleaned.length ? cleaned : fallback;
}

form.onsubmit = e => { e.preventDefault(); solve(); };
search.oninput = renderNav;
if (printPage) printPage.onclick = () => window.print();
if (toggleSidebar) toggleSidebar.onclick = () => document.body.classList.toggle("nav-open");
window.addEventListener("hashchange", async () => {
  const id = decodeURIComponent(location.hash.replace(/^#/, ""));
  const next = topics.find(t => t.id === id);
  if (next && next.id !== current?.id) {
    current = next;
    renderNav();
    await renderTopic();
  }
});
prevStep.onclick = () => { if (currentStep > 0) { currentStep--; renderResult(); } };
nextStep.onclick = () => { const max = stepMax(); if (currentStep < max) { currentStep++; renderResult(); } };
showAll.onclick = () => { currentStep = stepMax(); renderResult(); };

async function loadCode(id) {
  if (!codeCache.has(id)) {
    const data = await fetch(`/api/code?id=${encodeURIComponent(id)}`).then(r => r.json());
    codeCache.set(id, data);
  }
  const data = codeCache.get(id);
  codePath.textContent = data.path ? `Nguồn: ${data.path}` : "";
  currentCode = data.code || "";
  currentCodeLine = 1;
  renderCodeViewer();
}

async function solve() {
  const input = Object.fromEntries(new FormData(form).entries());
  try {
    currentResult = await fetch("/api/solve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: current.id, input })
    }).then(r => r.json());
  } catch {
    visual.innerHTML = `<div class="empty">Không gọi được server. Hãy chạy lại server.</div>`;
    return;
  }
  currentStep = Math.min(1, stepMax());
  renderResult();
}

function stepMax() {
  return currentResult?.trace?.rows?.length || currentResult?.steps?.length || 0;
}

function renderResult() {
  summary.textContent = currentResult.summary || "";
  const max = stepMax();
  stepInfo.textContent = `Bước ${currentStep}/${max}`;
  prevStep.disabled = currentStep <= 0;
  nextStep.disabled = currentStep >= max;
  showAll.disabled = currentStep >= max;
  visual.innerHTML = renderStepCard(currentResult, currentStep) + renderVisual(currentResult, currentStep) + renderTrace(currentResult, currentStep);
  bindTraceClicks();
  updateCodeHighlight();
}

function renderStepCard(res, step) {
  const row = res?.trace?.rows?.[Math.max(0, Math.min((res.trace.rows.length || 1) - 1, step - 1))];
  if (!row) return "";
  const keys = res.trace.headers || Object.keys(row);
  const primary = keys.find(k => /kết luận|ket_luan|quyết định|ghi chú|gia_tri|out|sinh|cost|tổng/i.test(k)) || keys[keys.length - 1];
  const secondary = keys.filter(k => k !== primary).slice(0, 4);
  return `<section class="step-card">
    <div><span class="step-kicker">Bước hiện tại</span><strong>${escapeHtml(row[primary] ?? res.summary ?? "")}</strong></div>
    <div class="step-facts">${secondary.map(k => `<span><b>${escapeHtml(k)}</b>${escapeHtml(row[k] ?? "-")}</span>`).join("")}</div>
  </section>`;
}

function renderTrace(res, step) {
  if (!res.trace) return "";
  const active = Math.max(0, Math.min(res.trace.rows.length - 1, step - 1));
  return `<details class="trace-drawer"><summary>Bảng chạy chi tiết (${res.trace.rows.length} bước)</summary>
    <div class="trace-help">${escapeHtml(examNote(current.id))}</div>
    <table><tr>${res.trace.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
    ${res.trace.rows.map((row, i) => `<tr class="${i === active ? "active-row" : ""}" data-step="${i + 1}">
      ${res.trace.headers.map(h => `<td>${escapeHtml(row[h] ?? "")}</td>`).join("")}
    </tr>`).join("")}</table>
  </details>`;
}

function renderVisual(res, step) {
  const title = `<div class="visual-title">Minh họa để chép vào bài thi</div>`;
  if (res.visual === "board") return title + board(res.board, step) + (res.branch ? branch(res.branch, step) : "");
  if (res.branchTree) return title + branchTree(res.branchTree);
  if (res.branch) return title + branch(res.branch, step);
  if (res.visual === "levels") return title + bfsBoard(res.levels, res.trace?.rows || [], step);
  if (res.visual === "stateTree" || res.visual === "stateGraph") return title + stateBoard(res.edges, res.trace?.rows || [], step);
  if (res.visual === "timeline") return title + timeline(res, step);
  if (res.visual === "matching") return title + matching(res.matching, step);
  if (res.visual === "heapSteps") return title + heapSteps(res.trace?.rows || [], step);
  if (res.visual === "twoHeaps") return title + twoHeaps(res.trace?.rows || [], step);
  if (res.visual === "table") return title + greedyRows(res.trace?.rows || [], step);
  if (res.visual === "windows") return title + windows(res.windows, step);
  if (res.visual === "dp") return title + dpBoard(res, step);
  if (res.visual === "cut") return title + cutBoard(res);
  if (res.visual === "heap" || res.visual === "tree") return title + heap(res.heap || ["T(n)", "T(n/b)", "T(n/b)"], step);
  return "";
}

function bfsBoard(levelData = {}, rows = [], step) {
  const visibleRows = rows.slice(0, Math.max(1, step));
  const headers = rows[0] ? Object.keys(rows[0]) : ["Bước", "Trạng thái"];
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng BFS/DFS rõ từng bước</div>
    <table class="exam-table"><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
    ${visibleRows.map(r => `<tr>${headers.map(h => `<td>${escapeHtml(r[h] ?? "")}</td>`).join("")}</tr>`).join("")}</table>
    <div class="bfs-grid">${Object.entries(levelData).slice(0, Math.max(1, step + 1)).map(([level, states]) => `
      <div class="bfs-row"><div class="bfs-level">Lớp ${escapeHtml(level)}</div><div class="bfs-states">${states.map(s => `<span>${escapeHtml(s)}</span>`).join("")}</div></div>
    `).join("")}</div>
  </div>`;
}

function stateBoard(edgesData = [], rows = [], step) {
  const visibleRows = rows.slice(0, Math.max(1, step));
  const headers = rows[0] ? Object.keys(rows[0]) : ["Bước", "Xét", "Stack", "Seen"];
  const visibleEdges = edgesData.slice(0, Math.max(3, step * 3));
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng DFS/Trạng thái</div>
    <table class="exam-table"><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
    ${visibleRows.map(r => `<tr>${headers.map(h => `<td>${escapeHtml(r[h] ?? "")}</td>`).join("")}</tr>`).join("")}</table>
    <div class="edge-list">${visibleEdges.map(e => `<div class="edge"><b>${fmt(e[0])}</b><span class="arrow">→</span><b>${fmt(e[1])}</b><small>${escapeHtml(e[2] || "")}</small></div>`).join("")}</div>
  </div>`;
}

function branchTree(data) {
  return `<div class="branch-box">${data.title ? `<div class="branch-title">${escapeHtml(data.title)}</div>` : ""}
    <div class="branch-legend"><span class="legend-dot ok"></span>Nghiệm/tốt nhất <span class="legend-dot try"></span>Nhánh đang thử <span class="legend-dot cut"></span>Cắt/sai</div>
    <div class="tree-canvas">${treeNode(data.root)}</div></div>`;
}

function treeNode(node = {}) {
  const children = node.children || [];
  return `<div class="tree-node-wrap"><div class="tree-node ${node.status || ""}">
    ${node.edge ? `<small>${escapeHtml(node.edge)}</small>` : ""}<b>${escapeHtml(node.label || "")}</b>${node.note ? `<em>${escapeHtml(node.note)}</em>` : ""}
  </div>${children.length ? `<div class="tree-children">${children.map(treeNode).join("")}</div>` : ""}</div>`;
}

function branch(data, step) {
  const rawLevels = data.levels || [];
  const levels = rawLevels.slice(0, Math.min(rawLevels.length, Math.max(2, step + 1))).map(level => Array.isArray(level) ? level : (level.nodes || []));
  return `<div class="branch-box">${data.title ? `<div class="branch-title">${escapeHtml(data.title)}</div>` : ""}
    <div class="branch-legend"><span class="legend-dot ok"></span>Nhánh chọn <span class="legend-dot try"></span>Nhánh thử <span class="legend-dot cut"></span>Nhánh cắt <span class="legend-dot skip"></span>Không chọn</div>
    <div class="branch-canvas">${levels.map((level, idx) => `<div class="branch-row">
      <div class="branch-level-label">Tầng ${idx}</div>
      <div class="branch-nodes">${level.map(n => `<span class="node ${n.status || ""}">${escapeHtml(n.label || n.text || "")}${n.note ? `<small>${escapeHtml(n.note)}</small>` : ""}</span>`).join("")}</div>
    </div>`).join("")}</div></div>`;
}

function board(data = {}, step) {
  const n = data.n || 4, q = data.queens || [];
  const placed = Math.min(q.length, Math.max(0, step));
  let html = `<div class="board-wrap"><div class="board-status">Bàn cờ minh họa: đặt ${placed}/${n} quân hậu</div><div class="board" style="grid-template-columns:repeat(${n},62px)">`;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const hasQueen = r < placed && q[r] === c;
    const attacked = !hasQueen && r >= placed && q.slice(0, placed).some((qc, qr) => qc === c || Math.abs(qr - r) === Math.abs(qc - c));
    html += `<span class="cell ${(r+c)%2 ? "dark" : ""} ${hasQueen ? "q" : ""} ${attacked ? "blocked" : ""}">${hasQueen ? "Q" : attacked ? "×" : ""}</span>`;
  }
  return html + "</div></div>";
}

function timeline(res, step) {
  const jobs = (res.jobs || []).slice(0, step);
  const chosen = new Set((res.chosen || []).map(x => x.join("-")));
  const max = Math.max(12, ...jobs.map(j => j[1] + 1), 12);
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng chọn tham lam theo mốc kết thúc</div><div class="timeline" style="grid-template-columns:repeat(${max},48px)">${jobs.map(j => `<div class="job ${chosen.has(j.join("-")) ? "chosen" : ""}" style="grid-column:${j[0]}/${j[1]+1}">${j[0]}-${j[1]}</div>`).join("")}</div></div>`;
}

function matching(m = {}, step) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng ghép hai con trỏ</div><b>A:</b> ${(m.A || []).map(x => `<span class="pill">${x}</span>`).join("")}<br><b>B:</b> ${(m.B || []).map(x => `<span class="pill">${x}</span>`).join("")}<br><b>Ghép:</b> ${(m.pairs || []).slice(0, step).map(p => `<span class="pill hit">${p[0]}-${p[1]}</span>`).join("")}</div>`;
}

function heap(values = [], step) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng top/out của heap</div>${values.slice(0, Math.max(1, step)).map(x => `<span class="node">${escapeHtml(x)}</span>`).join(" ")}</div>`;
}

function heapSteps(rows = [], step) {
  const row = rows[Math.max(0, Math.min(rows.length - 1, step - 1))] || rows[0] || {};
  const cells = value => String(value || "").replace(/[\[\]]/g, "").split(",").filter(Boolean).map(x => `<span>${escapeHtml(x.trim())}</span>`).join("");
  return `<div class="exam-visual"><div class="exam-visual-head">Min-heap từng lần nối</div>
    <div class="level"><b>Trước</b>${cells(row["Heap trước"] || row["Heap trc"] || row["Heap sau thao tác"])}</div>
    <div class="window">${escapeHtml(row["Nối"] || row["Ni"] || row["Thao tác"] || "-")}</div>
    <div class="level"><b>Sau</b>${cells(row["Heap sau"] || row["Heap sau thao tác"])}</div>
  </div>`;
}

function twoHeaps(rows = [], step) {
  const row = rows[Math.max(0, Math.min(rows.length - 1, step - 1))] || rows[0] || {};
  const cells = key => String(row[key] || "").replace(/[\[\]]/g, "").split(",").filter(Boolean).map(x => `<span class="pill">${escapeHtml(x.trim())}</span>`).join("");
  return `<div class="exam-visual"><div class="exam-visual-head">Hai heap L/R</div>
    <div class="window"><b>Thêm:</b> ${escapeHtml(row["Thêm"] ?? row["Xét"] ?? row["Xt"] ?? "-")} | <b>Trung vị:</b> ${escapeHtml(row["Trung vị dưới"] ?? row["Out"] ?? "-")}</div>
    <div class="level"><b>L</b>${cells("Max-heap L") || cells("L")}</div>
    <div class="level"><b>R</b>${cells("Min-heap R") || cells("R")}</div>
  </div>`;
}

function greedyRows(rows = [], step) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng quyết định tham lam</div>${rows.slice(0, Math.max(1, step)).map(row => `<div class="window">${Object.entries(row).map(([k,v]) => `<b>${escapeHtml(k)}:</b> ${escapeHtml(v)}`).join(" | ")}</div>`).join("")}</div>`;
}

function windows(ws = [], step) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng cửa sổ trượt</div>${ws.slice(0, step).map((w, i) => `<div class="window-row"><span>Cửa sổ ${i + 1}</span><b>[${w.items.join(", ")}]</b><em>max = ${w.max}</em></div>`).join("")}</div>`;
}

function dpBoard(res, step) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng quy hoạch động C[i][j]</div>${dpTable(res.table, step, res.rowLabels, res.colLabels)}</div>`;
}

function cutBoard(res) {
  return `<div class="exam-visual"><div class="exam-visual-head">Bảng C[i][j] cho kích thước hình chữ nhật</div>${dpTable(res.table, 99)}</div>`;
}

function dpTable(table = [], step = 99, rowLabels = null, colLabels = null) {
  const rows = table.slice(0, Math.max(1, step + 1));
  const colHead = colLabels ? `<tr><th>i\\j</th>${colLabels.map(x => `<th>${escapeHtml(x || "0")}</th>`).join("")}</tr>` : "";
  return `<table class="dp-table">${colHead}${rows.map((row, i) => `<tr>${rowLabels ? `<th>${escapeHtml(rowLabels[i] || i)}</th>` : ""}${row.map(x => `<td>${escapeHtml(String(x))}</td>`).join("")}</tr>`).join("")}</table>`;
}

function renderCodeViewer() {
  const lines = currentCode.split(/\r?\n/);
  codeEditor.innerHTML = `<div class="code-lines">${lines.map((line, i) => `<div class="code-line" data-line="${i + 1}"><span class="line-no">${i + 1}</span><code>${highlightCodeLine(line || " ")}</code></div>`).join("")}</div>`;
  updateCodeHighlight();
}

function highlightCodeLine(line) {
  const keywords = new Set("asm auto break case catch class const constexpr continue default delete do else enum explicit export extern for friend goto if inline mutable namespace new operator private protected public register return sizeof static struct switch template this throw try typedef typename union using virtual volatile while".split(" "));
  const types = new Set("bool char double float int long short signed unsigned void wchar_t size_t string vector pair map set stack queue priority_queue".split(" "));
  let out = "";
  let i = 0;
  const push = (cls, text) => { out += `<span class="${cls}">${escapeHtml(text)}</span>`; };

  while (i < line.length) {
    const rest = line.slice(i);
    if (rest.startsWith("//")) { push("tok-comment", rest); break; }
    if (rest.startsWith("#") && line.slice(0, i).trim() === "") { push("tok-pre", rest); break; }
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "\\" && j + 1 < line.length) j += 2;
        else if (line[j] === quote) { j++; break; }
        else j++;
      }
      push("tok-string", line.slice(i, j));
      i = j;
      continue;
    }
    const num = rest.match(/^\b\d+(\.\d+)?\b/);
    if (num) { push("tok-number", num[0]); i += num[0].length; continue; }
    const word = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (word) {
      const value = word[0];
      if (keywords.has(value)) push("tok-keyword", value);
      else if (types.has(value)) push("tok-type", value);
      else push("tok-ident", value);
      i += value.length;
      continue;
    }
    const op = rest.match(/^(==|!=|<=|>=|\+\+|--|&&|\|\||->|::|[+\-*/%=<>!&|^~?:;,.[\]{}()])/);
    if (op) { push("tok-op", op[0]); i += op[0].length; continue; }
    out += escapeHtml(line[i]);
    i++;
  }
  return out;
}

function updateCodeHighlight() {
  if (!currentCode || !currentResult?.trace?.rows?.length) return;
  const row = currentResult.trace.rows[Math.max(0, Math.min(currentResult.trace.rows.length - 1, currentStep - 1))] || {};
  currentCodeLine = findCodeLine(row, currentCode);
  codeEditor.querySelectorAll(".code-line.active-code").forEach(el => el.classList.remove("active-code"));
  const active = codeEditor.querySelector(`.code-line[data-line="${currentCodeLine}"]`);
  if (active) {
    active.classList.add("active-code");
    active.scrollIntoView({ block: "center", inline: "nearest" });
  }
}

function findCodeLine(row, code) {
  const lines = code.split(/\r?\n/);
  const text = Object.values(row).join(" ").toLowerCase();
  const patterns = [/try|backtrack|return|pop|push|for|while|if|min|max|sort|queue|stack|visited|seen|priority_queue/];
  for (const pattern of patterns) {
    const idx = lines.findIndex(line => pattern.test(line.toLowerCase()) && text);
    if (idx >= 0) return idx + 1;
  }
  return 1;
}

function bindTraceClicks() {
  visual.querySelectorAll("tr[data-step]").forEach(row => {
    row.onclick = () => {
      currentStep = Number(row.dataset.step || 1);
      renderResult();
    };
  });
}

function examNote(id) {
  const notes = {
    zero: "Khi chép vào bài: kẻ bảng Bước/Xét/Stack/Seen/Sinh mới.",
    robot: "Khi chép vào bài: kẻ bảng trạng thái (x,y), điều kiện sinh và Seen.",
    water: "Khi chép vào bài: kẻ bảng BFS theo lớp, ghi trạng thái cha và thao tác.",
    split: "Khi chép vào bài: vẽ cây lấy/không lấy, nhánh vượt T/2 thì cắt.",
    coinBacktrack: "Khi chép vào bài: vẽ cây theo mệnh giá, mỗi nhánh là số tờ chọn.",
    coinDp: "Khi chép vào bài: vẽ bảng C[i][j], hàng là loại tiền, cột là số tiền.",
    lcs: "Khi chép vào bài: vẽ ma trận C[i][j], hàng là X, cột là Y.",
    knapsack: "Khi chép vào bài: vẽ bảng C[i][j], hàng là vật, cột là sức chứa.",
    square: "Khi chép vào bài: vẽ bảng C[i][j] theo kích thước hình chữ nhật."
  };
  return notes[id] || "Khi chép vào bài: trình bày đúng dạng minh họa của thuật toán.";
}

function fmt(x) { return Array.isArray(x) ? `(${x.join(",")})` : escapeHtml(String(x)); }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c])); }

boot();
