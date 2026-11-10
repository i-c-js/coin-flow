// Draws the research figures as SVG from research/results.json.
// Usage: npm run figures
import { readFileSync, writeFileSync } from "node:fs";

const results = JSON.parse(readFileSync("research/results.json", "utf8"));
const METHODS = ["NAIVE", "SMA", "SES", "HOLT", "DAMPED"];
const COLORS: Record<string, string> = { SMA: "#008f88", HOLT: "#e5563a", DAMPED: "#4a72d6" };
const INK = "#0f2233", SOFT = "#4a5d6b", GRID = "#e3ecea", MUTED = "#b9c8cc";
const FONT = `font-family="Helvetica, Arial, sans-serif"`;

function frame(width: number, height: number, title: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<rect width="${width}" height="${height}" fill="#ffffff"/>
<text x="24" y="34" ${FONT} font-size="20" font-weight="700" fill="${INK}">${title}</text>
${body}
</svg>\n`;
}

function yAxis(x0: number, x1: number, top: number, bottom: number, max: number, step: number) {
  let out = "";
  for (let v = 0; v <= max; v += step) {
    const y = bottom - ((bottom - top) * v) / max;
    out += `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${GRID}"/>`;
    out += `<text x="${x0 - 8}" y="${y + 4}" ${FONT} font-size="13" fill="${SOFT}" text-anchor="end">${v}</text>`;
  }
  return out;
}

// Figure 1: mean absolute error per method
{
  const W = 720, H = 420, left = 70, right = W - 24, top = 70, bottom = H - 60, max = 250;
  const slot = (right - left) / METHODS.length;
  let body = `<text x="24" y="56" ${FONT} font-size="14" fill="${SOFT}">MAE, lei / week · ${results.config.ledgers} ledgers · ${results.config.forecastsPerMethod} forecasts per method · lower is better</text>`;
  body += yAxis(left, right, top, bottom, max, 50);
  METHODS.forEach((m, i) => {
    const mae = results.overall[m].mae;
    const h = ((bottom - top) * mae) / max;
    const x = left + i * slot + slot * 0.2;
    const w = slot * 0.6;
    const fill = m === results.hypotheses.bestMethod ? COLORS.SMA : MUTED;
    body += `<path d="M${x},${bottom} V${bottom - h + 4} q0,-4 4,-4 H${x + w - 4} q4,0 4,4 V${bottom} Z" fill="${fill}"/>`;
    body += `<text x="${x + w / 2}" y="${bottom - h - 8}" ${FONT} font-size="15" font-weight="700" fill="${INK}" text-anchor="middle">${mae.toFixed(0)}</text>`;
    body += `<text x="${x + w / 2}" y="${bottom + 22}" ${FONT} font-size="14" fill="${INK}" text-anchor="middle">${m}${m === "DAMPED" ? "*" : ""}</text>`;
  });
  body += `<text x="${right}" y="${H - 12}" ${FONT} font-size="12" fill="${SOFT}" text-anchor="end">* exploratory, added after the main experiment</text>`;
  writeFileSync("research/figures/mae-by-method.svg", frame(W, H, "Forecast error by method", body));
}

// Figure 2: sensitivity to noise (rising-trend ledgers)
{
  const W = 720, H = 420, left = 70, right = W - 110, top = 70, bottom = H - 60, max = 200;
  const rows = results.sensitivity as Record<string, number>[];
  const xAt = (i: number) => left + ((right - left) * i) / (rows.length - 1);
  const yAt = (v: number) => bottom - ((bottom - top) * v) / max;
  let body = `<text x="24" y="56" ${FONT} font-size="14" fill="${SOFT}">MAE (lei / week) on rising-trend ledgers as day-to-day noise grows</text>`;
  body += yAxis(left, right, top, bottom, max, 50);
  rows.forEach((r, i) => {
    body += `<text x="${xAt(i)}" y="${bottom + 22}" ${FONT} font-size="13" fill="${SOFT}" text-anchor="middle">σ = ${r.noise}</text>`;
  });
  for (const m of ["SMA", "DAMPED", "HOLT"]) {
    const pts = rows.map((r, i) => `${xAt(i)},${yAt(r[m])}`).join(" ");
    body += `<polyline points="${pts}" fill="none" stroke="${COLORS[m]}" stroke-width="2.5"/>`;
    rows.forEach((r, i) => (body += `<circle cx="${xAt(i)}" cy="${yAt(r[m])}" r="5" fill="#fff" stroke="${COLORS[m]}" stroke-width="2.5"/>`));
    const last = rows[rows.length - 1];
    const labelY = yAt(last[m]) + (m === "DAMPED" ? 0 : m === "SMA" ? 10 : -2) + 4;
    body += `<text x="${right + 12}" y="${labelY}" ${FONT} font-size="14" font-weight="700" fill="${INK}">${m} ${last[m].toFixed(0)}</text>`;
  }
  writeFileSync("research/figures/sensitivity.svg", frame(W, H, "When would trend models win?", body));
}
console.log("Figures written to research/figures/");
