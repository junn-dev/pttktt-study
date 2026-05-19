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

const ideaSteps = {
  recurrence: [
    "B1. Xác định kích thước đầu vào n và điều kiện dừng của hàm đệ quy.",
    "B2. Đếm số lời gọi đệ quy sinh ra từ một lời gọi: a.",
    "B3. Xác định kích thước mỗi bài toán con: n / b.",
    "B4. Xác định chi phí ngoài lời gọi đệ quy: f(n).",
    "B5. Lập biểu thức truy hồi: T(n) = aT(n / b) + f(n).",
    "B6. Dùng cây truy hồi hoặc Master để suy ra bậc O(...)."
  ],
  zero: [
    "B1. Nhập n.",
    "B2. Khai báo stack S và set out.",
    "B3. Đưa n vào S và đưa n vào out.",
    "B4. Lấy u khỏi S.",
    "B4.1. Duyệt các cặp ước (a, b) của u; sinh v = (a - 1) * (b + 1).",
    "B4.2. Nếu v chưa có trong out thì đưa v vào S và thêm v vào out.",
    "B5. Lặp lại B4 tới khi stack S rỗng.",
    "B6. Duyệt xuất các phần tử trong out ra."
  ],
  water: [
    "B1. Nhập dung tích hai bình n, m và lượng cần đong k.",
    "B2. Trạng thái là cặp (x, y): lượng nước đang có trong bình 1 và bình 2.",
    "B3. Khởi tạo queue Q với trạng thái (0, 0), đánh dấu visited.",
    "B4. Lấy một trạng thái (x, y) khỏi Q.",
    "B5. Sinh các trạng thái kế tiếp: đổ đầy, đổ hết, rót bình 1 sang bình 2, rót bình 2 sang bình 1.",
    "B6. Nếu trạng thái mới chưa visited thì đưa vào Q và lưu cha/thao tác.",
    "B7. Dừng khi có x = k hoặc y = k; truy vết đường đi từ cha."
  ],
  split: [
    "B1. Nhập dãy giá trị các món a[0..n-1], tính tổng T.",
    "B2. Mục tiêu chọn nhóm A có tổng không vượt T / 2 và càng lớn càng tốt.",
    "B3. Gọi TRY(i, sum): xét món thứ i, tổng hiện tại của nhóm A là sum.",
    "B4. Nhánh 1: không lấy a[i], gọi TRY(i + 1, sum).",
    "B5. Nhánh 2: nếu sum + a[i] <= T / 2 thì lấy a[i], gọi TRY(i + 1, sum + a[i]).",
    "B6. Khi i = n, cập nhật kết quả tốt nhất theo sum lớn nhất.",
    "B7. Đáp án chênh lệch nhỏ nhất là T - 2 * best."
  ],
  coinBacktrack: [
    "B1. Nhập các mệnh giá coin[0..n-1] và số tiền cần đổi S.",
    "B2. Sắp xếp hoặc xét các mệnh giá theo thứ tự cố định.",
    "B3. Gọi TRY(i, remain, used): xét mệnh giá i, còn phải đổi remain, đã dùng used tờ.",
    "B4. Thử số tờ k của coin[i] từ 0 tới remain / coin[i].",
    "B5. Với mỗi k, gọi TRY(i + 1, remain - k * coin[i], used + k).",
    "B6. Nếu remain = 0 thì cập nhật số tờ ít nhất.",
    "B7. Cắt nhánh khi used đã không tốt hơn đáp án hiện tại."
  ],
  schedule: [
    "B1. Nhập danh sách công việc, mỗi công việc có thời điểm bắt đầu và kết thúc.",
    "B2. Sắp xếp công việc tăng dần theo thời điểm kết thúc.",
    "B3. Chọn công việc đầu tiên sau khi sắp xếp.",
    "B4. Duyệt các công việc tiếp theo.",
    "B5. Nếu start của công việc hiện tại >= end của công việc đã chọn gần nhất thì chọn công việc đó.",
    "B6. Cập nhật end gần nhất và tiếp tục duyệt.",
    "B7. Kết quả là tập công việc không giao nhau có số lượng lớn."
  ],
  priority: [
    "B1. Nhập dãy phần tử và kiểu hàng đợi ưu tiên: max-heap hoặc min-heap.",
    "B2. Khai báo priority_queue phù hợp.",
    "B3. Lần lượt đưa từng phần tử vào heap.",
    "B4. Sau mỗi lần thêm, phần tử ưu tiên nhất nằm ở top.",
    "B5. Khi cần lấy phần tử ưu tiên, đọc top rồi pop.",
    "B6. Lặp đến khi heap rỗng hoặc đủ số phần tử cần lấy."
  ],
  detective: [
    "B1. Nhập dãy a[0..n-1] và kích thước cửa sổ k.",
    "B2. Dùng deque lưu chỉ số các phần tử có khả năng là lớn nhất/nhỏ nhất của cửa sổ.",
    "B3. Khi xét i, loại khỏi đầu deque các chỉ số đã ra khỏi cửa sổ.",
    "B4. Loại khỏi cuối deque các phần tử kém ưu tiên hơn a[i].",
    "B5. Đưa i vào cuối deque.",
    "B6. Khi i >= k - 1, phần tử ở đầu deque là đáp án của cửa sổ hiện tại.",
    "B7. Trượt cửa sổ sang phải và lặp lại."
  ],
  median: [
    "B1. Nhập lần lượt các phần tử của dãy.",
    "B2. Dùng max-heap L giữ nửa nhỏ và min-heap R giữ nửa lớn.",
    "B3. Với mỗi x, nếu x <= top(L) thì đưa vào L, ngược lại đưa vào R.",
    "B4. Cân bằng hai heap để số phần tử lệch nhau không quá 1.",
    "B5. Nếu cần trung vị dưới thì lấy top(L) khi L giữ nhiều phần tử hơn hoặc bằng R.",
    "B6. Sau mỗi lần thêm, ghi lại trạng thái hai heap và trung vị."
  ],
  delivery: [
    "B1. Nhập các đơn hàng, mỗi đơn có deadline và lợi nhuận.",
    "B2. Sắp xếp đơn hàng giảm dần theo lợi nhuận.",
    "B3. Tạo các slot thời gian còn trống từ 1 đến deadline lớn nhất.",
    "B4. Duyệt từng đơn theo thứ tự lợi nhuận.",
    "B5. Với mỗi đơn, tìm slot trống muộn nhất không vượt deadline.",
    "B6. Nếu tìm được slot thì xếp đơn vào slot đó và cộng lợi nhuận.",
    "B7. Kết quả là lịch giao hàng có tổng lợi nhuận lớn."
  ],
  coinDp: [
    "B1. Nhập các mệnh giá coin[1..n] và số tiền S.",
    "B2. Định nghĩa C[i][j] là số tờ ít nhất để đổi số tiền j bằng i loại tiền đầu.",
    "B3. Khởi tạo C[0][0] = 0, C[0][j] = vô cùng với j > 0.",
    "B4. Với từng i từ 1 đến n và j từ 0 đến S, xét không lấy coin[i]: C[i-1][j].",
    "B5. Nếu j >= coin[i], xét lấy thêm coin[i]: C[i][j - coin[i]] + 1.",
    "B6. Công thức: C[i][j] = min(C[i-1][j], C[i][j - coin[i]] + 1).",
    "B7. Đáp án là C[n][S]."
  ],
  lcs: [
    "B1. Nhập hai xâu X độ dài m và Y độ dài n.",
    "B2. Định nghĩa C[i][j] là độ dài xâu con chung dài nhất của X[1..i] và Y[1..j].",
    "B3. Khởi tạo C[0][j] = 0 và C[i][0] = 0.",
    "B4. Nếu X[i] = Y[j] thì C[i][j] = C[i-1][j-1] + 1.",
    "B5. Nếu X[i] != Y[j] thì C[i][j] = max(C[i-1][j], C[i][j-1]).",
    "B6. Điền bảng theo thứ tự từ trên xuống dưới, trái sang phải.",
    "B7. Đáp án là C[m][n]; có thể truy vết để lấy xâu."
  ],
  knapsack: [
    "B1. Nhập sức chứa W và danh sách vật có trọng lượng w[i], giá trị v[i].",
    "B2. Định nghĩa C[i][j] là giá trị lớn nhất khi xét i vật đầu với sức chứa j.",
    "B3. Khởi tạo C[0][j] = 0 và C[i][0] = 0.",
    "B4. Nếu w[i] > j thì C[i][j] = C[i-1][j].",
    "B5. Nếu w[i] <= j thì xét lấy vật i: C[i-1][j-w[i]] + v[i].",
    "B6. Công thức: C[i][j] = max(C[i-1][j], C[i-1][j-w[i]] + v[i]).",
    "B7. Đáp án là C[n][W]."
  ],
  square: [
    "B1. Nhập kích thước hình chữ nhật n x m.",
    "B2. Định nghĩa C[i][j] là số hình vuông ít nhất để cắt hình chữ nhật i x j.",
    "B3. Nếu i = j thì C[i][j] = 1.",
    "B4. Nếu i != j, thử mọi đường cắt ngang k: C[k][j] + C[i-k][j].",
    "B5. Thử mọi đường cắt dọc k: C[i][k] + C[i][j-k].",
    "B6. Lấy giá trị nhỏ nhất trong các cách cắt.",
    "B7. Đáp án là C[n][m]."
  ]
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
  const items = cleanKnowledgeBullets(source?.bullets, current.id);
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

function cleanKnowledgeBullets(bullets = [], topicId = "") {
  if (ideaSteps[topicId]) return ideaSteps[topicId];
  const fallback = ["Nêu trạng thái hoặc công thức.", "Mô tả các bước chạy theo đúng loại thuật toán.", "Minh hoạ nằm ở khung giữa; code C/C++ nằm ở khung phải."];
  const blocked = ["Code C/C++ mẫu", "Code C/C++", "Độ phức tạp", "phức tạp", "O(", "#include", "using namespace", "int main", "return 0", "cin", "cout", "while(", "for(", "if(", ";", "{", "}"];
  const headingPattern = /^(\d+\.\s*)?(Ý tưởng|Minh họa|Minh hoạ|Công thức|Độ phức tạp|Code|[A-Z]\.|B\.\d+|C\.|D\.|E\.|F\.|G\.|H\.)/i;
  const cleaned = (bullets || [])
    .map(x => String(x || "").trim())
    .filter(Boolean)
    .filter(x => !blocked.some(token => x.includes(token)))
    .filter(x => !/^\s*4\.\s*/.test(x))
    .filter(x => !headingPattern.test(x))
    .filter(x => !/^\d+\.\s+\S/.test(x))
    .slice(0, 6);
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
