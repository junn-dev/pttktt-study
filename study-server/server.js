const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC = path.join(__dirname, "public");

const topics = [
  { id: "recurrence", group: "Câu 1", name: "Độ phức tạp đệ quy", visual: "tree", fields: [{ name: "a", label: "Số lời gọi a", value: "2" }, { name: "b", label: "Chia kích thước b", value: "2" }, { name: "f", label: "Chi phí ngoài", value: "n" }] },
  { id: "zero", group: "BFS - DFS", name: "Mọi con đường về 0", visual: "stateTree", fields: [{ name: "n", label: "n", value: "6" }] },
  { id: "water", group: "BFS - DFS", name: "Đong nước", visual: "levels", fields: [{ name: "n", label: "Bình 1", value: "3" }, { name: "m", label: "Bình 2", value: "5" }, { name: "k", label: "Cần đong", value: "4" }] },
  { id: "split", group: "Quay lui", name: "Chia của", visual: "decision", fields: [{ name: "items", label: "Giá trị các món", value: "2 3 7 8 10" }] },
  { id: "coinBacktrack", group: "Quay lui", name: "Đổi tiền quay lui", visual: "decision", fields: [{ name: "coins", label: "Mệnh giá", value: "10 5 2" }, { name: "target", label: "Số tiền", value: "17" }] },
  { id: "schedule", group: "Tham lam", name: "Lập lịch", visual: "timeline", fields: [{ name: "jobs", label: "Công việc start-end", value: "1-3,2-5,4-7,6-9,8-10" }] },
  { id: "priority", group: "Tham lam", name: "Hàng đợi ưu tiên", visual: "heap", fields: [{ name: "values", label: "Các số", value: "5 1 7 3" }, { name: "mode", label: "max hoặc min", value: "max" }] },
  { id: "detective", group: "Tham lam", name: "Trinh thám", visual: "windows", fields: [{ name: "values", label: "Dãy số", value: "1 3 -1 -3 5 3 6 7" }, { name: "k", label: "k", value: "3" }] },
  { id: "median", group: "Tham lam", name: "Phần tử trung vị", visual: "twoHeaps", fields: [{ name: "values", label: "Dãy số", value: "5 2 10 1 7" }] },
  { id: "delivery", group: "Tham lam", name: "Giao hàng", visual: "table", fields: [{ name: "orders", label: "Đơn deadline-profit", value: "2-100,1-50,2-10" }] },
  { id: "coinDp", group: "Quy hoạch động", name: "Đổi tiền quy hoạch động", visual: "dp", fields: [{ name: "coins", label: "Mệnh giá", value: "1 3 4" }, { name: "target", label: "Số tiền", value: "6" }] },
  { id: "lcs", group: "Quy hoạch động", name: "Xâu con chung dài nhất", visual: "dp", fields: [{ name: "x", label: "Xâu X", value: "ABCBDAB" }, { name: "y", label: "Xâu Y", value: "BDCABA" }] },
  { id: "knapsack", group: "Quy hoạch động", name: "Sắp xếp ba lô", visual: "dp", fields: [{ name: "capacity", label: "Sức chứa", value: "7" }, { name: "items", label: "Vật weight-value", value: "3-4,4-5,2-3" }] },
  { id: "square", group: "Quy hoạch động", name: "Cắt hình vuông ít nhất", visual: "cut", fields: [{ name: "n", label: "Chiều cao", value: "2" }, { name: "m", label: "Chiều rộng", value: "3" }] },
];

const codeFiles = {
  recurrence: "B03_12_1_26/dophuctap.cpp",
  zero: "B05_26_1_26/zero.cpp",
  robot: "B05_26_1_26/robot.cpp",
  water: "B06_2_2_26/dong nuoc.cpp",
  queen: "B10_16_3_26_try/quan hau.cpp",
  split: "B11_23_3_26/chia cua.cpp",
  coinBacktrack: "B12_30_3_26/try_doiitien.cpp",
  schedule: "B07_2_3_26_greedy/lap lich.cpp",
  dance: "B07_2_3_26_greedy/khieu vu.cpp",
  priority: "B07_2_3_26_greedy/hang doi utien.cpp",
  metal: "B07_2_3_26_greedy/noi thanh kim loai.cpp",
  detective: "B08_9_3_26/trinh tham.cpp",
  median: "B08_9_3_26/phan tu trung vi.cpp",
  delivery: "B08_9_3_26/giao hang.cpp",
  coinDp: "B13_6_4_26/do tien.cpp",
  lcs: "B13_6_4_26/xccdn.cpp",
  knapsack: "B13_6_4_26/balo.cpp",
  square: "B14_16_4_26/cat hinh vuong.cpp",
};

topics.splice(0, topics.length,
  { id: "recurrence", group: "Câu 1", name: "Độ phức tạp đệ quy", visual: "tree", fields: [{ name: "a", label: "Số lời gọi a", value: "2" }, { name: "b", label: "Chia kích thước b", value: "2" }, { name: "f", label: "Chi phí ngoài", value: "n" }] },
  { id: "zero", group: "BFS - DFS", name: "Mọi con đường về 0", visual: "stateTree", fields: [{ name: "n", label: "n", value: "6" }] },
  { id: "water", group: "BFS - DFS", name: "Đong nước", visual: "levels", fields: [{ name: "n", label: "Bình 1", value: "3" }, { name: "m", label: "Bình 2", value: "5" }, { name: "k", label: "Cần đong", value: "4" }] },
  { id: "split", group: "Quay lui", name: "Chia của", visual: "decision", fields: [{ name: "items", label: "Giá trị các món", value: "2 3 7 8 10" }] },
  { id: "coinBacktrack", group: "Quay lui", name: "Đổi tiền quay lui", visual: "decision", fields: [{ name: "coins", label: "Mệnh giá", value: "10 5 2" }, { name: "target", label: "Số tiền", value: "17" }] },
  { id: "schedule", group: "Tham lam", name: "Lập lịch", visual: "timeline", fields: [{ name: "jobs", label: "Công việc start-end", value: "1-3,2-5,4-7,6-9,8-10" }] },
  { id: "priority", group: "Tham lam", name: "Hàng đợi ưu tiên", visual: "heap", fields: [{ name: "values", label: "Các số", value: "5 1 7 3" }, { name: "mode", label: "max hoặc min", value: "max" }] },
  { id: "detective", group: "Tham lam", name: "Trinh thám", visual: "windows", fields: [{ name: "values", label: "Dãy số", value: "1 3 -1 -3 5 3 6 7" }, { name: "k", label: "k", value: "3" }] },
  { id: "median", group: "Tham lam", name: "Phần tử trung vị", visual: "twoHeaps", fields: [{ name: "values", label: "Dãy số", value: "5 2 10 1 7" }] },
  { id: "delivery", group: "Tham lam", name: "Giao hàng", visual: "table", fields: [{ name: "orders", label: "Đơn deadline-profit", value: "2-100,1-50,2-10" }] },
  { id: "coinDp", group: "Quy hoạch động", name: "Đổi tiền quy hoạch động", visual: "dp", fields: [{ name: "coins", label: "Mệnh giá", value: "1 3 4" }, { name: "target", label: "Số tiền", value: "6" }] },
  { id: "lcs", group: "Quy hoạch động", name: "Xâu con chung dài nhất", visual: "dp", fields: [{ name: "x", label: "Xâu X", value: "ABCBDAB" }, { name: "y", label: "Xâu Y", value: "BDCABA" }] },
  { id: "knapsack", group: "Quy hoạch động", name: "Sắp xếp ba lô", visual: "dp", fields: [{ name: "capacity", label: "Sức chứa", value: "7" }, { name: "items", label: "Vật weight-value", value: "3-4,4-5,2-3" }] },
  { id: "square", group: "Quy hoạch động", name: "Cắt hình vuông ít nhất", visual: "cut", fields: [{ name: "n", label: "Chiều cao", value: "2" }, { name: "m", label: "Chiều rộng", value: "3" }] }
);

function readCode(id) {
  const rel = codeFiles[id];
  if (!rel) return { path: "", code: "// Cha c file code mu cho mc ny." };
  const full = path.join(__dirname, "..", rel);
  try {
    return { path: rel, code: fs.readFileSync(full, "utf8") };
  } catch (e) {
    return { path: rel, code: `// Khng c c file: ${rel}\n// ${e.message}` };
  }
}

function nums(s) {
  return String(s || "").trim().split(/[\s,]+/).filter(Boolean).map(Number).filter(Number.isFinite);
}
function pairs(s) {
  return String(s || "").split(",").map(x => x.trim()).filter(Boolean).map(x => {
    const [a, b] = x.split("-").map(Number);
    return [a, b];
  }).filter(p => p.every(Number.isFinite));
}
function json(res, code, data) {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

const solvers = {
  recurrence(input) {
    const a = clamp(Number(input.a || 2), 1, 8);
    const b = clamp(Number(input.b || 2), 2, 8);
    const f = String(input.f || "n").trim();
    const log = Math.log(a) / Math.log(b);
    const g = `n^${log.toFixed(3).replace(/\.000$/, "")}`;
    let result = `So snh f(n)=${f} vi g(n)=n^(log_${b} ${a})=${g}.`;
    if (f === "1" || f.toLowerCase() === "o(1)") result += " Nu f(n) nh hn g(n), kt qu thng l Theta(g(n)).";
    else if (f === "n" && a === b) result += " V f(n)=Theta(g(n)) nn T(n)=Theta(n log n).";
    else result += " Dng Master theorem theo 3 trng hp  kt lun.";
    const traceRows = [
      { "Tng": 0, "S bi ton": 1, "Kch thc": "n", "Chi ph mi bi": f, "Tng tng": f },
      { "Tng": 1, "S bi ton": a, "Kch thc": `n/${b}`, "Chi ph mi bi": `f(n/${b})`, "Tng tng": `${a}f(n/${b})` },
      { "Tng": 2, "S bi ton": `${a}^2`, "Kch thc": `n/${b}^2`, "Chi ph mi bi": `f(n/${b}^2)`, "Tng tng": `${a}^2 f(n/${b}^2)` },
      { "Tng": "...", "S bi ton": "...", "Kch thc": "...", "Chi ph mi bi": "...", "Tng tng": "..." },
      { "Tng": `log_${b}n`, "S bi ton": `${a}^(log_${b}n)`, "Kch thc": "1", "Chi ph mi bi": "O(1)", "Tng tng": `n^(log_${b}${a})` },
    ];
    return {
      visual: "tree",
      summary: `T(n)=${a}T(n/${b})+${f}`,
      steps: [`iu kin dng: T(1)=O(1).`, `C ${a} li gi kch thc n/${b}.`, `Chi ph ngoi  quy l ${f}.`, result],
      tree: [{ label: "n" }, ...Array.from({ length: a }, (_, i) => ({ label: `n/${b}`, parent: 0 }))],
      trace: { headers: ["Tng","S bi ton","Kch thc","Chi ph mi bi","Tng tng"], rows: traceRows },
    };
  },
  zero(input) {
    const start = clamp(Number(input.n || 6), 0, 10000);
    const seen = new Set([start]);
    const stack = [start];
    const edges = [];
    const steps = [];
    const traceRows = [{ "Bc": 0, "Xt": "-", "Stack": `[${stack.join(", ")}]`, "Seen": `{${[...seen].join(", ")}}`, "Sinh mi": "-" }];
    let stepNo = 1;
    while (stack.length && seen.size < 80) {
      const u = stack.pop();
      const born = [];
      for (let a = 1; a * a <= u; a++) if (u % a === 0) {
        const b = u / a, v = (a - 1) * (b + 1);
        edges.push([u, v, `a=${a}`]);
        if (!seen.has(v)) { seen.add(v); stack.push(v); born.push(v); }
      }
      steps.push(`Xt ${u}: sinh ${born.length ? born.join(", ") : "khng c trng thi mi"}.`);
      traceRows.push({ "Bc": stepNo++, "Xt": u, "Stack": `[${stack.join(", ")}]`, "Seen": `{${[...seen].sort((a,b)=>a-b).join(", ")}}`, "Sinh mi": born.join(", ") || "-" });
    }
    return { visual: "stateTree", summary: `Cc s i c: ${[...seen].sort((a,b)=>a-b).join(", ")}`, steps, edges, trace: { headers: ["Bc","Xt","Stack","Seen","Sinh mi"], rows: traceRows } };
  },
  robot(input) {
    const x = clamp(Number(input.x || 4), 0, 10000), y = clamp(Number(input.y || 3), 0, 10000);
    const key = p => `${p[0]},${p[1]}`;
    const seen = new Set([key([x,y])]), stack = [[x,y]], edges = [], steps = [];
    const traceRows = [{ "Bc": 0, "Xt": "-", "Stack": `(${x},${y})`, "Seen": `{(${x},${y})}`, "Sinh mi": "-" }];
    let stepNo = 1;
    while (stack.length && seen.size < 80) {
      const [u,v] = stack.pop();
      const born = [];
      if (u % 2 === 0) { const z = [v, u/2]; edges.push([[u,v], z, "x chn"]); if (!seen.has(key(z))) { seen.add(key(z)); stack.push(z); born.push(`(${z})`); } }
      if (v % 2 === 1) { const z = [(v+1)/2, u]; edges.push([[u,v], z, "y l"]); if (!seen.has(key(z))) { seen.add(key(z)); stack.push(z); born.push(`(${z})`); } }
      steps.push(`Xt (${u},${v}): ${born.length ? "sinh " + born.join(", ") : "khng sinh mi"}.`);
      traceRows.push({ "Bc": stepNo++, "Xt": `(${u},${v})`, "Stack": stack.map(p=>`(${p})`).join(" "), "Seen": `{${[...seen].slice(0,12).join("; ")}}`, "Sinh mi": born.join(", ") || "-" });
    }
    return { visual: "stateGraph", summary: `S trng thi phn bit: ${seen.size}`, steps, edges, trace: { headers: ["Bc","Xt","Stack","Seen","Sinh mi"], rows: traceRows } };
  },
  water(input) {
    const n = clamp(Number(input.n || 3), 1, 50), m = clamp(Number(input.m || 5), 1, 50), k = clamp(Number(input.k || 4), 0, 50);
    const q = [[0,0]], dist = new Map([["0,0",0]]), parent = new Map(), action = new Map();
    let target = null;
    for (let qi = 0; qi < q.length; qi++) {
      const [x,y] = q[qi], z = x + y;
      const nxt = [
        [[0,y]," ht bnh 1"], [[n,y]," y bnh 1"], [[x,0]," ht bnh 2"], [[x,m]," y bnh 2"],
        [[Math.max(0,z-m),Math.min(z,m)],"Rt 1 sang 2"], [[Math.min(z,n),Math.max(0,z-n)],"Rt 2 sang 1"]
      ];
      for (const [v, act] of nxt) {
        const key = v.join(",");
        if (!dist.has(key)) {
          dist.set(key, dist.get(`${x},${y}`) + 1); parent.set(key, [x,y]); action.set(key, act); q.push(v);
          if (v[0] === k || v[1] === k) { target = v; qi = q.length; break; }
        }
      }
    }
    const levels = {};
    for (const [key, d] of dist) (levels[d] ||= []).push(`(${key})`);
    const traceRows = [];
    for (const [key, d] of dist) {
      const par = parent.get(key);
      traceRows.push({ "Bc": d, "Trng thi": `(${key})`, "T": par ? `(${par.join(",")})` : "-", "Thao tc": action.get(key) || "Khi to", "Ghi ch": key.split(",").map(Number).includes(k) ? "Gp mc tiu" : "" });
    }
    return { visual: "levels", summary: target ? `ong c sau ${dist.get(target.join(","))} bc` : "Khng ong c", steps: Object.keys(levels).map(d => `Bc ${d}: ${levels[d].join(" ")}`), levels, trace: { headers: ["Bc","Trng thi","T","Thao tc","Ghi ch"], rows: traceRows } };
  },
  queen(input) {
    const n = clamp(Number(input.n || 4), 1, 8), sol = [], col = [], d1 = [], d2 = [], x = [];
    const traceRows = [];
    let order = 1;
    function bt(r) {
      if (sol.length >= 8) return;
      traceRows.push({ "Bc": order++, "Hm": `TRY(${r})`, "Xt": "-", "Trng thi": `[${x.slice(0,r).map(v=>v+1).join(", ")}]`, "Kt lun": r===n ? " n hng, in nghim" : `Vo hng ${r+1}` });
      if (r === n) { sol.push([...x]); return; }
      for (let c = 0; c < n; c++) {
        const ok = !col[c] && !d1[r-c+n] && !d2[r+c];
        traceRows.push({ "Bc": order++, "Hm": `TRY(${r})`, "Xt": `ct ${c+1}`, "Trng thi": `[${x.slice(0,r).map(v=>v+1).join(", ")}]`, "Kt lun": ok ? "Hp l -> t hu" : "Khng hp l -> b" });
        if (ok) {
          x[r] = c; col[c] = d1[r-c+n] = d2[r+c] = true;
          traceRows.push({ "Bc": order++, "Hm": `TRY(${r})`, "Xt": `t (${r+1},${c+1})`, "Trng thi": `[${x.slice(0,r+1).map(v=>v+1).join(", ")}]`, "Kt lun": `Gi TRY(${r+1})` });
          bt(r+1);
          col[c] = d1[r-c+n] = d2[r+c] = false;
          traceRows.push({ "Bc": order++, "Hm": `TRY(${r})`, "Xt": `li (${r+1},${c+1})`, "Trng thi": `[${x.slice(0,r).map(v=>v+1).join(", ")}]`, "Kt lun": "B nh du, th ct tip" });
        }
      }
    }
    bt(0);
    const first = sol[0] || [];
    function valid(prefix, r, c) {
      for (let i=0;i<prefix.length;i++) if (prefix[i]===c || Math.abs(i-r)===Math.abs(prefix[i]-c)) return false;
      return true;
    }
    const branchLevels = [];
    let prefix = [];
    for (let r=0;r<Math.min(n, first.length);r++) {
      branchLevels.push(Array.from({length:n},(_,c)=>({
        label:`H${r+1}:C${c+1}`,
        status: c===first[r] ? "ok" : valid(prefix,r,c) ? "try" : "cut",
        note: c===first[r] ? "chn" : valid(prefix,r,c) ? "th nhnh khc" : "loi"
      })));
      prefix.push(first[r]);
    }
    return { visual: "board", summary: `Tm c ${sol.length}${sol.length === 8 ? "+" : ""} nghim minh ha`, steps: traceRows.map(r=>`${r["Hm"]}: ${r["Xt"]} - ${r["Kt lun"]}`), board: { n, queens: first }, branch: { title: "Cy nhnh quay lui: mi tng l mt hng, mi nhnh l mt ct th", levels: branchLevels }, trace: { headers: ["Bc","Hm","Xt","Trng thi","Kt lun"], rows: traceRows } };
  },
  split(input) {
    const a = nums(input.items).slice(0, 20), T = a.reduce((s,x)=>s+x,0), half = Math.floor(T/2);
    let best = 0, bestSet = [];
    function bt(i, sum, set) {
      if (sum > half) return;
      if (sum > best) { best = sum; bestSet = [...set]; }
      if (i === a.length) return;
      bt(i+1, sum+a[i], [...set, a[i]]); bt(i+1, sum, set);
    }
    bt(0,0,[]);
    const branchLevels = [[{ label:"A=0", status:"ok", note:"gc" }]];
    let running = 0;
    for (let i=0;i<Math.min(a.length, 5);i++) {
      const take = running + a[i];
      const chosen = bestSet.includes(a[i]) && running + a[i] <= half;
      branchLevels.push([
        { label:`+${a[i]} => ${take}`, status: take > half ? "cut" : chosen ? "ok" : "try", note: take > half ? `>${half}` : chosen ? "chn" : "th" },
        { label:`-${a[i]} => ${running}`, status: chosen ? "skip" : "try", note:"khng chn" }
      ]);
      if (chosen) running = take;
    }
    const traceRows = [
      { "Bc": 1, "Xt": "Tng", "A": "{}", "Tt nht": 0, "Ghi ch": `T=${T}, T/2=${half}` },
      ...bestSet.map((v,i)=>({ "Bc": i+2, "Xt": v, "A": `{${bestSet.slice(0,i+1).join(", ")}}`, "Tt nht": bestSet.slice(0,i+1).reduce((s,x)=>s+x,0), "Ghi ch": "Chn vo nhm A" })),
      { "Bc": bestSet.length+2, "Xt": "Kt lun", "A": `{${bestSet.join(", ")}}`, "Tt nht": best, "Ghi ch": `Chnh lch ${T-2*best}` }
    ];
    return { visual: "decision", summary: `Chnh lch nh nht: ${T-2*best}`, steps: [`Tng T=${T}, mc tiu gn T/2=${half}.`, `Chn nhm A: ${bestSet.join("+")}=${best}.`, `Nhm B=${T-best}.`], decision: { target: half, best, bestSet }, branch: { title: "Cy nhnh quay lui: mi mn c nhnh ly / khng ly", levels: branchLevels }, trace: { headers: ["Bc","Xt","A","Tt nht","Ghi ch"], rows: traceRows } };
  },
  coinBacktrack(input) {
    const coins = nums(input.coins).slice(0, 12), M = Number(input.target || 0);
    let best = Infinity, bestUse = null;
    function bt(i, sum, used, take) {
      if (sum > M || used >= best) return;
      if (i === coins.length) {
        if (sum === M) { best = used; bestUse = take; }
        return;
      }
      for (let z = 0; sum + z * coins[i] <= M; z++) bt(i+1, sum + z*coins[i], used+z, [...take, z]);
    }
    bt(0,0,0,[]);
    const branchLevels = [[{ label:`M=${M}`, status:"ok", note:"gc" }]];
    let sumPath = 0, usedPath = 0;
    if (bestUse) {
      for (let i=0;i<coins.length;i++) {
        const maxZ = Math.min(4, Math.floor((M-sumPath)/coins[i]));
        const level = [];
        for (let z=0;z<=maxZ;z++) {
          const ns = sumPath + z*coins[i], nu = usedPath + z;
          level.push({ label:`${z} t ${coins[i]}`, status: z===(bestUse[i]||0) ? "ok" : ns>M || nu>=best ? "cut" : "try", note:`sum=${ns}, t=${nu}` });
        }
        branchLevels.push(level);
        sumPath += (bestUse[i]||0)*coins[i]; usedPath += bestUse[i]||0;
      }
    }
    const traceRows = bestUse ? coins.map((c,i)=>({ "Bc": i+1, "Mnh gi": c, "S t chn": bestUse[i] || 0, "Tng tm": coins.slice(0,i+1).reduce((s,coin,j)=>s+coin*(bestUse[j]||0),0), "Ghi ch": "Theo nhnh tt nht" })) : [{ "Bc": 1, "Mnh gi": "-", "S t chn": "-", "Tng tm": 0, "Ghi ch": "Khng i c" }];
    return { visual: "decision", summary: bestUse ? `t nht ${best} t` : "Khng i c", steps: bestUse ? coins.map((c,i)=>`${bestUse[i]} t mnh gi ${c}`) : ["Khng c t hp bng M."], decision: { coins, bestUse, target: M }, branch: { title: "Cy nhnh quay lui: mi tng l s t ca mt mnh gi", levels: branchLevels }, trace: { headers: ["Bc","Mnh gi","S t chn","Tng tm","Ghi ch"], rows: traceRows } };
  },
  schedule(input) {
    const jobs = pairs(input.jobs).sort((a,b)=>a[1]-b[1]), chosen = []; let last = -Infinity;
    const traceRows = [{ "Bc": 0, "Mc": "-", "Xt": "-", "Res": 0, "Kt lun": "Khi to" }];
    for (let i=0;i<jobs.length;i++) {
      const j = jobs[i];
      let ok = false;
      if (j[0] > last) { chosen.push(j); last = j[1]; ok = true; }
      traceRows.push({ "Bc": i+1, "Mc": last, "Xt": `(${j[0]},${j[1]})`, "Res": chosen.length, "Kt lun": ok ? "+1, chn" : "0, b" });
    }
    return { visual: "timeline", summary: `Chn ${chosen.length} cng vic`, steps: jobs.map(j => `${chosen.includes(j) ? "Chn" : "B"} (${j[0]},${j[1]})`), jobs, chosen, trace: { headers: ["Bc","Mc","Xt","Res","Kt lun"], rows: traceRows } };
  },
  dance(input) {
    const A = nums(input.a).sort((a,b)=>b-a), B = nums(input.b).sort((a,b)=>b-a), pairsOut = []; let j = 0;
    const traceRows = [];
    for (let i=0;i<A.length;i++) {
      const x = A[i];
      while (j < B.length && B[j] >= x) { traceRows.push({ "Bc": traceRows.length+1, "A[i]": x, "B[j]": B[j], "Cp": "-", "Res": pairsOut.length, "Ghi ch": "B[j] khng nh hn A[i], b B[j]" }); j++; }
      if (j < B.length) { pairsOut.push([x,B[j]]); traceRows.push({ "Bc": traceRows.length+1, "A[i]": x, "B[j]": B[j], "Cp": `${x}-${B[j]}`, "Res": pairsOut.length, "Ghi ch": "Ghp" }); j++; }
    }
    return { visual: "matching", summary: `Ghp c ${pairsOut.length} cp`, steps: pairsOut.map(p => `${p[0]} ghp ${p[1]}`), matching: { A, B, pairs: pairsOut }, trace: { headers: ["Bc","A[i]","B[j]","Cp","Res","Ghi ch"], rows: traceRows } };
  },
  priority(input) {
    const values = nums(input.values), mode = String(input.mode||"max").toLowerCase();
    const sorted = [...values].sort((a,b)=>mode==="min"?a-b:b-a);
    return { visual: "heap", summary: `Th t pop: ${sorted.join(", ")}`, steps: sorted.map(x=>`Ly ${x} khi heap.`), heap: sorted, trace: { headers: ["Bc","Heap top","Out"], rows: sorted.map((x,i)=>({ "Bc": i+1, "Heap top": x, "Out": sorted.slice(0,i+1).join(", ") })) } };
  },
  metal(input) {
    const q = nums(input.values).sort((a,b)=>a-b), steps = []; let total = 0;
    const traceRows = [];
    while (q.length > 1) { const before = `[${q.join(", ")}]`; const a=q.shift(), b=q.shift(), c=a+b; total += c; steps.push(`Ni ${a}+${b}=${c}, tng=${total}`); q.push(c); q.sort((x,y)=>x-y); traceRows.push({ "Bc": traceRows.length+1, "Heap trc": before, "Ni": `${a}+${b}=${c}`, "Heap sau": `[${q.join(", ")}]`, "Cost": total }); }
    return { visual: "heapSteps", summary: `Chi ph nh nht: ${total}`, steps, trace: { headers: ["Bc","Heap trc","Ni","Heap sau","Cost"], rows: traceRows } };
  },
  detective(input) {
    const a = nums(input.values), k = clamp(Number(input.k||3),1,100), windows = [];
    for (let i=0;i+k<=a.length;i++) windows.push({ items:a.slice(i,i+k), max: Math.max(...a.slice(i,i+k)) });
    return { visual: "windows", summary: `Kt qu: ${windows.map(w=>w.max).join(" ")}`, steps: windows.map(w=>`[${w.items.join(", ")}] => max ${w.max}`), windows, trace: { headers: ["Bc","Ca s","Max","Out"], rows: windows.map((w,i)=>({ "Bc": i+1, "Ca s": `[${w.items.join(", ")}]`, "Max": w.max, "Out": windows.slice(0,i+1).map(x=>x.max).join(" ") })) } };
  },
  median(input) {
    const a = nums(input.values), med = [];
    const traceRows = [];
    for (let i=0;i<a.length;i++) { const s=a.slice(0,i+1).sort((x,y)=>x-y); med.push(s[Math.floor((s.length-1)/2)]); const left=s.slice(0,Math.floor((s.length+1)/2)); const right=s.slice(Math.floor((s.length+1)/2)); traceRows.push({ "Bc": i+1, "Xt": a[i], "L": `{${left.join(", ")}}`, "R": `{${right.join(", ")}}`, "Out": med[i] }); }
    return { visual: "twoHeaps", summary: `Trung v: ${med.join(" ")}`, steps: a.map((x,i)=>`Sau khi thm ${x}: trung v ${med[i]}`), medians: med, trace: { headers: ["Bc","Xt","L","R","Out"], rows: traceRows } };
  },
  delivery(input) {
    const orders = pairs(input.orders), maxD = Math.max(0, ...orders.map(o=>o[0])), steps = []; let total = 0, heap = [];
    const traceRows = [];
    for (let day=maxD; day>=1; day--) { heap.push(...orders.filter(o=>o[0]===day).map(o=>o[1])); heap.sort((a,b)=>b-a); const before = `[${heap.join(", ")}]`; const pick = heap.shift(); if (pick) total += pick; steps.push(`Ngy ${day}: chn ${pick || "khng c"}, tng=${total}`); traceRows.push({ "Ngy": day, "Heap": before, "Chn": pick || "-", "Tng": total }); }
    return { visual: "table", summary: `Tng tin ln nht: ${total}`, steps, trace: { headers: ["Ngy","Heap","Chn","Tng"], rows: traceRows } };
  },
  coinDp(input) {
    const coins = nums(input.coins), M = Number(input.target||0), INF = 1e9;
    const C = Array.from({length: coins.length+1},()=>Array(M+1).fill(INF)); for(let i=0;i<=coins.length;i++) C[i][0]=0;
    const steps = ["Khoi tao C[i][0]=0, C[0][j]=INF."];
    for(let i=1;i<=coins.length;i++) {
      for(let j=1;j<=M;j++){ C[i][j]=C[i-1][j]; if(coins[i-1]<=j) C[i][j]=Math.min(C[i][j],1+C[i][j-coins[i-1]]); }
      steps.push(`Xet menh gia ${coins[i-1]}: dien xong hang i=${i}.`);
    }
    steps.push(`Ket luan o C[${coins.length}][${M}].`);
    const table = C.map(r=>r.map(x=>x>=INF?"":x));
    const traceRows = table.map((row,i)=>({ "Bc": i, "Xt": i===0 ? "Khi to" : `a[${i}]=${coins[i-1]}`, "Hng C[i][0..M]": `[${row.join(", ")}]`, "Ghi ch": i===0 ? "C[0][j]=INF" : "Dng min(khng ly, ly)" }));
    return { visual: "dp", summary: C[coins.length][M]>=INF ? "Khng i c" : `t nht ${C[coins.length][M]} t`, steps, table, trace: { headers: ["Bc","Xt","Hng C[i][0..M]","Ghi ch"], rows: traceRows } };
  },
  lcs(input) {
    const x=String(input.x||""), y=String(input.y||""), C=Array.from({length:x.length+1},()=>Array(y.length+1).fill(0));
    const steps = ["Khoi tao hang 0 va cot 0 bang 0."];
    for(let i=1;i<=x.length;i++) {
      for(let j=1;j<=y.length;j++) C[i][j]=x[i-1]===y[j-1]?C[i-1][j-1]+1:Math.max(C[i-1][j],C[i][j-1]);
      steps.push(`Dien xong hang ${i} ung voi ky tu '${x[i-1]}'.`);
    }
    steps.push(`Ket luan C[${x.length}][${y.length}]=${C[x.length][y.length]}.`);
    const traceRows = C.map((row,i)=>({ "Bc": i, "Xt k t X": i===0 ? "-" : x[i-1], "Hng C[i][*]": `[${row.join(", ")}]`, "Ghi ch": i===0 ? "Khi to" : "in theo k t Y" }));
    return { visual: "dp", summary: ` di LCS: ${C[x.length][y.length]}`, steps, table: C, rowLabels:[""].concat(x.split("")), colLabels:[""].concat(y.split("")), trace: { headers: ["Bc","Xt k t X","Hng C[i][*]","Ghi ch"], rows: traceRows } };
  },
  knapsack(input) {
    const cap = Number(input.capacity||0), items = pairs(input.items), C=Array.from({length:items.length+1},()=>Array(cap+1).fill(0));
    const steps = ["Khoi tao bang C voi hang 0 bang 0."];
    for(let i=1;i<=items.length;i++) {
      for(let j=1;j<=cap;j++){ const [w,v]=items[i-1]; C[i][j]=C[i-1][j]; if(w<=j) C[i][j]=Math.max(C[i][j],v+C[i-1][j-w]); }
      steps.push(`Xet vat ${i} (w=${items[i-1][0]}, v=${items[i-1][1]}): dien xong hang ${i}.`);
    }
    steps.push(`Ket luan C[${items.length}][${cap}]=${C[items.length][cap]}.`);
    const traceRows = C.map((row,i)=>({ "Bc": i, "Xt vt": i===0 ? "-" : `w=${items[i-1][0]}, v=${items[i-1][1]}`, "Hng C[i][0..m]": `[${row.join(", ")}]`, "Ghi ch": i===0 ? "Khi to" : "Max(khng ly, ly)" }));
    return { visual: "dp", summary: `Gi tr ln nht: ${C[items.length][cap]}`, steps, table: C, trace: { headers: ["Bc","Xt vt","Hng C[i][0..m]","Ghi ch"], rows: traceRows } };
  },
  square(input) {
    const n=clamp(Number(input.n||2),1,30), m=clamp(Number(input.m||3),1,30), C=Array.from({length:n+1},()=>Array(m+1).fill(0));
    const steps = ["Dien bang tu cac hinh nho len hinh lon."];
    for(let i=1;i<=n;i++) {
      for(let j=1;j<=m;j++){ if(i===j) C[i][j]=1; else { C[i][j]=1e9; for(let k=1;k<=Math.floor(i/2);k++) C[i][j]=Math.min(C[i][j],C[k][j]+C[i-k][j]); for(let k=1;k<=Math.floor(j/2);k++) C[i][j]=Math.min(C[i][j],C[i][k]+C[i][j-k]); } }
      steps.push(`Dien xong cac hinh co chieu cao ${i}.`);
    }
    steps.push(`Ket luan C[${n}][${m}]=${C[n][m]}.`);
    const traceRows = C.map((row,i)=> i===0 ? null : ({ "Bc": i, "Chiu cao": i, "Cc C[i][j]": `[${row.slice(1).join(", ")}]`, "Ghi ch": "Th ct ngang/dc" })).filter(Boolean);
    return { visual: "cut", summary: `t nht ${C[n][m]} hnh vung`, steps, table: C, rect: { n, m }, trace: { headers: ["Bc","Chiu cao","Cc C[i][j]","Ghi ch"], rows: traceRows } };
  },
};

function limitedRows(rows, max = 260) {
  if (rows.length <= max) return rows;
  return rows.slice(0, max).concat([{ Buoc: "...", Ham: "...", Xet: "...", Trang_thai: `Da an bot ${rows.length - max} dong de man hinh de doc`, Ket_luan: "Nhap vi du nho khi luyen tinh tay" }]);
}

solvers.split = function(input) {
  const a = nums(input.items || "2 3 7 8 10");
  const T = a.reduce((s, x) => s + x, 0);
  const half = Math.floor(T / 2);
  let best = 0, bestSet = [], ord = 1;
  const rows = [], levels = [];
  function add(row) { rows.push({ Buoc: ord++, ...row }); }
  function bt(i, sum, set) {
    add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: i < a.length ? `a[${i}]=${a[i]}` : "het do", Trang_thai: `A={${set.join(",") || "rong"}}, sum=${sum}, best=${best}`, Ket_luan: "Vao ham" });
    if (sum > half) {
      add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: `sum>${half}`, Trang_thai: "Nhanh vuot T/2", Ket_luan: "Cat nhanh, quay lui" });
      levels.push({ level: i, nodes: [{ text: `sum ${sum}>${half}`, status: "bad" }] });
      return;
    }
    if (sum > best) {
      best = sum; bestSet = set.slice();
      add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: "cap nhat", Trang_thai: `best=${best}, A={${bestSet.join(",")}}`, Ket_luan: `chenh lech=${T - 2 * best}` });
    }
    if (i === a.length) {
      add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: "i==n", Trang_thai: `A={${set.join(",") || "rong"}}`, Ket_luan: "Het do, quay lui" });
      return;
    }
    levels.push({ level: i, nodes: [{ text: `Lay ${a[i]} -> ${sum + a[i]}`, status: sum + a[i] <= half ? "ok" : "bad" }, { text: `Khong lay ${a[i]} -> ${sum}`, status: "wait" }] });
    add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: `lay a[${i}]=${a[i]}`, Trang_thai: `sum moi=${sum + a[i]}`, Ket_luan: `Goi TRY(${i + 1}, ${sum + a[i]})` });
    bt(i + 1, sum + a[i], set.concat(a[i]));
    add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: `khong lay a[${i}]=${a[i]}`, Trang_thai: `sum giu=${sum}`, Ket_luan: `Goi TRY(${i + 1}, ${sum})` });
    bt(i + 1, sum, set);
    add({ Ham: `TRY(i=${i}, sum=${sum})`, Xet: "quay lui", Trang_thai: `Tra ve muc i=${i - 1}`, Ket_luan: "Da xet xong 2 nhanh" });
  }
  bt(0, 0, []);
  function makeSplitTree(i, sum, set) {
    const node = { label: i === 0 ? `A={}, sum=0` : `A={${set.join(",") || "rong"}}, sum=${sum}`, status: sum > half ? "cut" : (sum === best ? "ok" : "try") };
    if (sum > half) { node.note = `cat vi > ${half}`; return node; }
    if (i >= a.length || i >= 5) { node.note = i >= a.length ? "la" : "rut gon"; return node; }
    node.children = [
      { edge: `lay ${a[i]}`, ...makeSplitTree(i + 1, sum + a[i], set.concat(a[i])) },
      { edge: `khong lay ${a[i]}`, ...makeSplitTree(i + 1, sum, set) }
    ];
    return node;
  }
  return {
    visual: "branch",
    summary: `Tong T=${T}, can A<=${half}. Tot nhat A={${bestSet.join(",")}} co tong ${best}, chenh lech ${T - 2 * best}.`,
    steps: rows.map(r => `${r.Ham}: ${r.Ket_luan}`),
    branch: { title: "Cay quay lui Chia cua: moi tang la mot mon, tach 2 nhanh lay / khong lay", levels },
    branchTree: { title: `Cay nhanh de chep thi: muc tieu sum <= ${half}`, root: makeSplitTree(0, 0, []) },
    trace: { headers: ["Buoc", "Ham", "Xet", "Trang_thai", "Ket_luan"], rows: limitedRows(rows) }
  };
};

solvers.coinBacktrack = function(input) {
  const coins = nums(input.coins || "1 3 4").sort((a,b)=>b-a);
  const M = Number(input.target || 6);
  let best = Infinity, bestUse = [], ord = 1;
  const rows = [], levels = [];
  function add(row) { rows.push({ Buoc: ord++, ...row }); }
  function bt(pos, remain, cnt, use) {
    add({ Ham: `TRY(pos=${pos}, remain=${remain})`, Xet: pos < coins.length ? `menh gia ${coins[pos]}` : "het menh gia", Trang_thai: `chon=[${use.join(",") || "0"}], so to=${cnt}, best=${best === Infinity ? "INF" : best}`, Ket_luan: "Vao ham" });
    if (remain === 0) {
      if (cnt < best) { best = cnt; bestUse = use.slice(); }
      add({ Ham: `TRY(pos=${pos}, remain=0)`, Xet: "du tien", Trang_thai: `best=${best}, cach=${bestUse.join(",")}`, Ket_luan: "Cap nhat dap an va quay lui" });
      return;
    }
    if (pos === coins.length || cnt >= best) {
      add({ Ham: `TRY(pos=${pos}, remain=${remain})`, Xet: pos === coins.length ? "het loai tien" : "so to>=best", Trang_thai: "Khong can di tiep", Ket_luan: "Cat nhanh" });
      return;
    }
    const coin = coins[pos], maxTake = Math.floor(remain / coin);
    const nodes = [];
    for (let z = maxTake; z >= 0; z--) {
      nodes.push({ text: `${z} to ${coin}`, status: "wait" });
      add({ Ham: `TRY(pos=${pos}, remain=${remain})`, Xet: `z=${z} to menh gia ${coin}`, Trang_thai: `remain moi=${remain - z * coin}, so to moi=${cnt + z}`, Ket_luan: `Goi TRY(${pos + 1}, ${remain - z * coin})` });
      bt(pos + 1, remain - z * coin, cnt + z, use.concat(`${z}x${coin}`));
    }
    levels.push({ level: pos, nodes });
    add({ Ham: `TRY(pos=${pos}, remain=${remain})`, Xet: "quay lui", Trang_thai: `Da thu z=${maxTake}..0`, Ket_luan: "Tra ve muc truoc" });
  }
  bt(0, M, 0, []);
  function makeCoinTree(pos, remain, cnt) {
    const node = { label: pos === 0 ? `M=${M}` : `con ${remain}, ${cnt} to`, status: remain === 0 ? "ok" : (pos >= coins.length || cnt >= best ? "cut" : "try") };
    if (remain === 0) { node.note = "du tien"; return node; }
    if (pos >= coins.length || cnt >= best || pos >= 4) { node.note = pos >= coins.length ? "het menh gia" : "cat"; return node; }
    const coin = coins[pos], maxTake = Math.floor(remain / coin);
    node.children = [];
    for (let z = maxTake; z >= 0; z--) {
      node.children.push({ edge: `${z} to ${coin}`, ...makeCoinTree(pos + 1, remain - z * coin, cnt + z) });
    }
    return node;
  }
  return {
    visual: "branch",
    summary: best === Infinity ? `Khong doi duoc ${M}` : `It nhat ${best} to: ${bestUse.join(", ")}`,
    steps: rows.map(r => `${r.Ham}: ${r.Ket_luan}`),
    branch: { title: "Cay quay lui Doi tien: moi tang la mot menh gia, moi nhanh la so to z duoc chon", levels },
    branchTree: { title: "Cay nhanh de chep thi: chon so to cho tung menh gia", root: makeCoinTree(0, M, 0) },
    trace: { headers: ["Buoc", "Ham", "Xet", "Trang_thai", "Ket_luan"], rows: limitedRows(rows) }
  };
};

solvers.coinDp = function(input) {
  const coins = nums(input.coins || "1 3 4"), M = Number(input.target || 6), INF = 1e8;
  const C = Array.from({ length: coins.length + 1 }, () => Array(M + 1).fill(INF));
  const rows = []; let ord = 1;
  for (let i = 0; i <= coins.length; i++) C[i][0] = 0;
  rows.push({ Buoc: ord++, Vong_lap: "khoi tao", Xet: "C[i][0]=0, C[0][j]=INF", Cong_thuc: "-", Gia_tri: "Cot 0 bang 0" });
  for (let i = 1; i <= coins.length; i++) {
    for (let j = 1; j <= M; j++) {
      const notTake = C[i - 1][j];
      const canTake = coins[i - 1] <= j;
      const take = canTake ? 1 + C[i][j - coins[i - 1]] : INF;
      C[i][j] = Math.min(notTake, take);
      rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `a[${i}]=${coins[i - 1]}`, Cong_thuc: canTake ? `min(C[${i-1}][${j}]=${notTake>=INF?"INF":notTake}, 1+C[${i}][${j-coins[i-1]}]=${take>=INF?"INF":take})` : `a[${i}]=${coins[i - 1]} > j=${j} nen C[${i}][${j}]=C[${i-1}][${j}]`, Gia_tri: `C[${i}][${j}]=${C[i][j]>=INF?"INF":C[i][j]}` });
    }
  }
  const shown = C.map(r => r.map(v => v >= INF ? "" : v));
  return { visual: "dp", summary: C[coins.length][M] >= INF ? `Khong doi duoc ${M}` : `It nhat ${C[coins.length][M]} to`, steps: rows.map(r => `${r.Vong_lap}: ${r.Gia_tri}`), table: shown, trace: { headers: ["Buoc", "Vong_lap", "Xet", "Cong_thuc", "Gia_tri"], rows: limitedRows(rows) } };
};

solvers.lcs = function(input) {
  const x = String(input.x || "ABCBDAB"), y = String(input.y || "BDCABA");
  const C = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0));
  const rows = []; let ord = 1;
  rows.push({ Buoc: ord++, Vong_lap: "khoi tao", Xet: "hang 0, cot 0", Cong_thuc: "C[0][j]=C[i][0]=0", Gia_tri: "0" });
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      if (x[i - 1] === y[j - 1]) {
        C[i][j] = C[i - 1][j - 1] + 1;
        rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `${x[i-1]} == ${y[j-1]}`, Cong_thuc: `C[${i-1}][${j-1}]+1=${C[i][j]}`, Gia_tri: `C[${i}][${j}]=${C[i][j]}` });
      } else {
        C[i][j] = Math.max(C[i - 1][j], C[i][j - 1]);
        rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `${x[i-1]} != ${y[j-1]}`, Cong_thuc: `max(C[${i-1}][${j}]=${C[i-1][j]}, C[${i}][${j-1}]=${C[i][j-1]})`, Gia_tri: `C[${i}][${j}]=${C[i][j]}` });
      }
    }
  }
  return { visual: "dp", summary: `Do dai LCS = ${C[x.length][y.length]}`, steps: rows.map(r => `${r.Vong_lap}: ${r.Gia_tri}`), table: C, rowLabels:[""].concat(x.split("")), colLabels:[""].concat(y.split("")), trace: { headers: ["Buoc", "Vong_lap", "Xet", "Cong_thuc", "Gia_tri"], rows: limitedRows(rows) } };
};

solvers.knapsack = function(input) {
  const cap = Number(input.capacity || 7), items = pairs(input.items || "3,4;4,5;2,3");
  const C = Array.from({ length: items.length + 1 }, () => Array(cap + 1).fill(0));
  const rows = []; let ord = 1;
  rows.push({ Buoc: ord++, Vong_lap: "khoi tao", Xet: "hang 0", Cong_thuc: "C[0][j]=0", Gia_tri: "0" });
  for (let i = 1; i <= items.length; i++) {
    const [w, v] = items[i - 1];
    for (let j = 1; j <= cap; j++) {
      const notTake = C[i - 1][j];
      const take = w <= j ? v + C[i - 1][j - w] : "-";
      C[i][j] = w <= j ? Math.max(notTake, take) : notTake;
      rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `vat ${i}: w=${w}, v=${v}`, Cong_thuc: w <= j ? `max(khong lay=${notTake}, lay=${take})` : `w>${j} nen khong lay`, Gia_tri: `C[${i}][${j}]=${C[i][j]}` });
    }
  }
  return { visual: "dp", summary: `Gia tri lon nhat = ${C[items.length][cap]}`, steps: rows.map(r => `${r.Vong_lap}: ${r.Gia_tri}`), table: C, trace: { headers: ["Buoc", "Vong_lap", "Xet", "Cong_thuc", "Gia_tri"], rows: limitedRows(rows) } };
};

solvers.square = function(input) {
  const n = clamp(Number(input.n || 2), 1, 20), m = clamp(Number(input.m || 3), 1, 20);
  const C = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const rows = []; let ord = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (i === j) {
        C[i][j] = 1;
        rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `${i}x${j}`, Cong_thuc: "i==j", Gia_tri: `C[${i}][${j}]=1` });
      } else {
        let best = 1e9, formula = [];
        for (let k = 1; k <= Math.floor(i / 2); k++) {
          const val = C[k][j] + C[i - k][j];
          formula.push(`ngang k=${k}: ${val}`);
          best = Math.min(best, val);
        }
        for (let k = 1; k <= Math.floor(j / 2); k++) {
          const val = C[i][k] + C[i][j - k];
          formula.push(`doc k=${k}: ${val}`);
          best = Math.min(best, val);
        }
        C[i][j] = best;
        rows.push({ Buoc: ord++, Vong_lap: `i=${i}, j=${j}`, Xet: `${i}x${j}`, Cong_thuc: formula.join("; "), Gia_tri: `C[${i}][${j}]=${best}` });
      }
    }
  }
  return { visual: "cut", summary: `It nhat ${C[n][m]} hinh vuong`, steps: rows.map(r => `${r.Vong_lap}: ${r.Gia_tri}`), table: C, rect: { n, m }, trace: { headers: ["Buoc", "Vong_lap", "Xet", "Cong_thuc", "Gia_tri"], rows: limitedRows(rows) } };
};

solvers.schedule = function(input) {
  const jobs = pairs(input.jobs || "1-3,2-5,4-7,6-9,8-10")
    .map((p, i) => ({ name: String.fromCharCode(65 + i), start: p[0], end: p[1] }))
    .sort((a, b) => a.end - b.end || a.start - b.start);
  const chosen = [];
  const rows = [{ Bước: 0, "Danh sách sau sort": jobs.map(j => `${j.name}(${j.start},${j.end})`).join(", "), Mốc: "-∞", "Đang xét": "-", "Điều kiện": "Sắp tăng theo thời điểm kết thúc", "Quyết định": "Khởi tạo", "Res": 0 }];
  let last = -Infinity;
  for (let i = 0; i < jobs.length; i++) {
    const j = jobs[i];
    const ok = j.start > last;
    if (ok) { chosen.push([j.start, j.end]); last = j.end; }
    rows.push({
      Bước: i + 1,
      "Danh sách sau sort": jobs.map(x => `${x.name}(${x.start},${x.end})`).join(", "),
      Mốc: last === -Infinity ? "-∞" : last,
      "Đang xét": `${j.name}(${j.start},${j.end})`,
      "Điều kiện": `${j.start} > ${ok ? (chosen.length === 1 ? "-∞" : rows[rows.length - 1].Mốc) : last}`,
      "Quyết định": ok ? "Chọn, cập nhật mốc=end" : "Bỏ vì giao với việc đã chọn",
      Res: chosen.length
    });
  }
  return { visual: "timeline", summary: `Chọn ${chosen.length} công việc: ${chosen.map(j => `(${j[0]},${j[1]})`).join(", ")}`, steps: rows.map(r => `${r.Bước}: ${r["Quyết định"]}`), jobs: jobs.map(j => [j.start, j.end]), chosen, trace: { headers: ["Bước","Danh sách sau sort","Mốc","Đang xét","Điều kiện","Quyết định","Res"], rows } };
};

solvers.dance = function(input) {
  const A = nums(input.a || "180 170 160").sort((a,b)=>b-a);
  const B = nums(input.b || "175 165 150").sort((a,b)=>b-a);
  const pairsOut = [], rows = [];
  let i = 0, j = 0, step = 1;
  while (i < A.length && j < B.length) {
    const ok = B[j] < A[i];
    rows.push({ Bước: step++, "i": i, "j": j, "A[i]": A[i], "B[j]": B[j], "Điều kiện B[j] < A[i]": ok ? "Đúng" : "Sai", "Quyết định": ok ? `Ghép ${A[i]}-${B[j]}, tăng i và j` : "B[j] không phù hợp, bỏ B[j] và tăng j", "Cặp đã ghép": pairsOut.concat(ok ? [[A[i], B[j]]] : []).map(p => `${p[0]}-${p[1]}`).join(", ") || "-" });
    if (ok) { pairsOut.push([A[i], B[j]]); i++; j++; }
    else j++;
  }
  return { visual: "matching", summary: `Ghép được ${pairsOut.length} cặp`, steps: rows.map(r => r["Quyết định"]), matching: { A, B, pairs: pairsOut }, trace: { headers: ["Bước","i","j","A[i]","B[j]","Điều kiện B[j] < A[i]","Quyết định","Cặp đã ghép"], rows } };
};

solvers.priority = function(input) {
  const values = nums(input.values || "5 1 7 3");
  const mode = String(input.mode || "max").toLowerCase() === "min" ? "min" : "max";
  const heap = [], out = [], rows = [];
  const cmp = (a, b) => mode === "min" ? a - b : b - a;
  values.forEach((v, idx) => {
    heap.push(v); heap.sort(cmp);
    rows.push({ Bước: rows.length + 1, "Thao tác": `push ${v}`, "Heap sau thao tác": `[${heap.join(", ")}]`, Top: heap[0], Out: out.join(", ") || "-" });
  });
  while (heap.length) {
    const top = heap.shift(); out.push(top);
    rows.push({ Bước: rows.length + 1, "Thao tác": `pop top=${top}`, "Heap sau thao tác": `[${heap.join(", ")}]`, Top: heap[0] ?? "-", Out: out.join(", ") });
  }
  return { visual: "heap", summary: `Thứ tự pop ${mode}-heap: ${out.join(", ")}`, steps: rows.map(r => `${r["Thao tác"]}: ${r["Heap sau thao tác"]}`), heap: out, trace: { headers: ["Bước","Thao tác","Heap sau thao tác","Top","Out"], rows } };
};

solvers.metal = function(input) {
  const heap = nums(input.values || "4 3 2 6").sort((a,b)=>a-b);
  const rows = []; let total = 0;
  while (heap.length > 1) {
    const before = `[${heap.join(", ")}]`;
    const a = heap.shift(), b = heap.shift(), c = a + b;
    total += c;
    heap.push(c); heap.sort((x,y)=>x-y);
    rows.push({ Bước: rows.length + 1, "Heap trước": before, "Lấy 2 nhỏ nhất": `${a} và ${b}`, "Nối": `${a}+${b}=${c}`, "Heap sau": `[${heap.join(", ")}]`, "Tổng chi phí": total });
  }
  return { visual: "heapSteps", summary: `Chi phí nhỏ nhất: ${total}`, steps: rows.map(r => `${r["Nối"]}, tổng=${r["Tổng chi phí"]}`), trace: { headers: ["Bước","Heap trước","Lấy 2 nhỏ nhất","Nối","Heap sau","Tổng chi phí"], rows } };
};

solvers.detective = function(input) {
  const a = nums(input.values || "1 3 -1 -3 5 3 6 7");
  const k = clamp(Number(input.k || 3), 1, Math.max(1, a.length));
  const heap = [], windows = [], rows = [], out = [];
  for (let i = 0; i < a.length; i++) {
    heap.push([a[i], i]); heap.sort((x,y)=>y[0]-x[0] || y[1]-x[1]);
    const left = i - k + 1;
    while (heap.length && heap[0][1] < left) heap.shift();
    if (i >= k - 1) {
      const items = a.slice(left, i + 1), max = heap[0][0];
      windows.push({ items, max }); out.push(max);
      rows.push({ Bước: rows.length + 1, "Thêm": `a[${i}]=${a[i]}`, "Cửa sổ": `[${items.join(", ")}]`, "Heap hợp lệ top": `(${heap[0][0]}, vị trí ${heap[0][1]})`, "Loại khỏi cửa sổ": `vị trí < ${left}`, Max: max, Out: out.join(" ") });
    } else {
      rows.push({ Bước: rows.length + 1, "Thêm": `a[${i}]=${a[i]}`, "Cửa sổ": "Chưa đủ k phần tử", "Heap hợp lệ top": `(${heap[0][0]}, vị trí ${heap[0][1]})`, "Loại khỏi cửa sổ": "-", Max: "-", Out: out.join(" ") || "-" });
    }
  }
  return { visual: "windows", summary: `Kết quả: ${out.join(" ")}`, steps: rows.map(r => `${r["Cửa sổ"]} => max ${r.Max}`), windows, trace: { headers: ["Bước","Thêm","Cửa sổ","Heap hợp lệ top","Loại khỏi cửa sổ","Max","Out"], rows } };
};

solvers.median = function(input) {
  const a = nums(input.values || "5 2 10 1 7"), rows = [], med = [];
  for (let i = 0; i < a.length; i++) {
    const s = a.slice(0, i + 1).sort((x,y)=>x-y);
    const left = s.slice(0, Math.floor((s.length + 1) / 2));
    const right = s.slice(Math.floor((s.length + 1) / 2));
    const median = left[left.length - 1]; med.push(median);
    rows.push({ Bước: i + 1, "Thêm": a[i], "Dãy đã sort để kiểm tra": `[${s.join(", ")}]`, "Max-heap L": `[${left.join(", ")}]`, "Min-heap R": `[${right.join(", ")}]`, "Cân bằng": `|L|=${left.length}, |R|=${right.length}`, "Trung vị dưới": median, Out: med.join(" ") });
  }
  return { visual: "twoHeaps", summary: `Trung vị dưới sau mỗi bước: ${med.join(" ")}`, steps: rows.map(r => `Thêm ${r["Thêm"]}: trung vị ${r["Trung vị dưới"]}`), medians: med, trace: { headers: ["Bước","Thêm","Dãy đã sort để kiểm tra","Max-heap L","Min-heap R","Cân bằng","Trung vị dưới","Out"], rows } };
};

solvers.delivery = function(input) {
  const orders = pairs(input.orders || "2-100,1-50,2-10");
  const maxD = Math.max(0, ...orders.map(o=>o[0]));
  const heap = [], rows = []; let total = 0;
  for (let day = maxD; day >= 1; day--) {
    const added = orders.filter(o => o[0] === day).map(o => o[1]);
    heap.push(...added); heap.sort((a,b)=>b-a);
    const before = `[${heap.join(", ")}]`;
    const pick = heap.length ? heap.shift() : null;
    if (pick !== null) total += pick;
    rows.push({ Ngày: day, "Đơn thêm vào heap": added.length ? added.join(", ") : "-", "Heap trước chọn": before, "Chọn profit lớn nhất": pick ?? "-", "Heap còn lại": `[${heap.join(", ")}]`, "Tổng": total });
  }
  return { visual: "table", summary: `Tổng tiền lớn nhất: ${total}`, steps: rows.map(r => `Ngày ${r.Ngày}: chọn ${r["Chọn profit lớn nhất"]}, tổng=${r["Tổng"]}`), trace: { headers: ["Ngày","Đơn thêm vào heap","Heap trước chọn","Chọn profit lớn nhất","Heap còn lại","Tổng"], rows } };
};

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = urlPath === "/" ? "index.html" : urlPath.slice(1);
  const full = path.normalize(path.join(PUBLIC, file));
  if (!full.startsWith(PUBLIC)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(full);
    const type = ext === ".html" ? "text/html; charset=utf-8" : ext === ".css" ? "text/css; charset=utf-8" : ext === ".js" ? "application/javascript; charset=utf-8" : "text/plain; charset=utf-8";
    res.writeHead(200, { "content-type": type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/topics") return json(res, 200, topics);
  if (url.pathname === "/api/code") {
    const id = url.searchParams.get("id");
    return json(res, 200, readCode(id));
  }
  if (url.pathname === "/api/solve" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const { id, input } = JSON.parse(body || "{}");
        if (!solvers[id]) return json(res, 404, { error: "Khng c thut ton ny" });
        return json(res, 200, solvers[id](input || {}));
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    });
    return;
  }
  serveStatic(req, res);
});

function startServer(port, triedNext = false) {
  server.once("error", err => {
    if (err.code === "EADDRINUSE" && !triedNext) {
      const nextPort = port + 1;
      console.log(`Port ${port} dang ban, tu dong chuyen sang http://localhost:${nextPort}`);
      startServer(nextPort, true);
      return;
    }
    console.error(err.message);
    process.exit(1);
  });
  server.listen(port, () => {
    console.log(`PTTKTT study server: http://localhost:${port}`);
  });
}

startServer(PORT);
