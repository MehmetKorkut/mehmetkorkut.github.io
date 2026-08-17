// Transforms a raw Strava "activities.csv" export into a compact summary JSON
// for the Multisport dashboard. Keeps only aggregates — no private notes,
// per-activity rows, weather, or gear leak into the shipped bundle.
//
// Usage:  node scripts/build-activities.mjs [path/to/activities.csv]
// Default input:  ./data-source/activities.csv  (git-ignored)
// Output:         ./src/data/activities-summary.json

import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] ?? 'data-source/activities.csv';
const output = 'src/data/activities-summary.json';

// --- Minimal RFC-4180 CSV parser (handles quotes, commas, newlines) ---
function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (inQuotes) {
			if (c === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else inQuotes = false;
			} else field += c;
		} else if (c === '"') inQuotes = true;
		else if (c === ',') {
			row.push(field);
			field = '';
		} else if (c === '\n') {
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else if (c !== '\r') field += c;
	}
	if (field.length || row.length) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

// Nth occurrence of a header name (the Strava export repeats several columns).
function colIndex(header, name, occurrence = 0) {
	let seen = -1;
	for (let i = 0; i < header.length; i++) {
		if (header[i] === name) {
			seen++;
			if (seen === occurrence) return i;
		}
	}
	return -1;
}

function parseDate(s) {
	// Strava US export: "May 5, 2026, 2:34:10 PM"
	const d = new Date(s);
	return Number.isNaN(d.valueOf()) ? null : d;
}

const num = (x) => {
	const v = parseFloat(x);
	return Number.isFinite(v) ? v : 0;
};

const discipline = (t) => (t === 'Run' || t === 'Ride' || t === 'Swim' ? t : 'Other');
const DISCIPLINES = ['Run', 'Ride', 'Swim', 'Other'];

const raw = fs.readFileSync(path.resolve(input), 'utf8');
const table = parseCsv(raw);
const header = table[0];
const data = table.slice(1);

const iType = colIndex(header, 'Activity Type');
const iDate = colIndex(header, 'Activity Date');
const iDist = colIndex(header, 'Distance', 1); // detailed distance, always metres
const iMov = colIndex(header, 'Moving Time');
const iElev = colIndex(header, 'Elevation Gain');

// Accumulators
const life = Object.fromEntries(
	DISCIPLINES.map((d) => [d, { count: 0, distM: 0, movS: 0, elevM: 0 }])
);
const years = new Map(); // year -> { Run:{...}, ... }
const cal = new Map(); // "year-month" -> { movS, byType:{...} }
const runPace = new Map(); // year -> { distM, movS }
const rideSpeed = new Map(); // year -> { distM, movS }

let minYear = Infinity;
let maxYear = -Infinity;

// Compact per-activity records for client-side filtering (no PII).
const activities = [];

for (const r of data) {
	if (!r[iType]) continue;
	const d = parseDate(r[iDate]);
	if (!d) continue;
	const y = d.getFullYear();
	const m = d.getMonth() + 1;
	const disc = discipline(r[iType]);
	const distM = num(r[iDist]);
	const movS = num(r[iMov]);
	const elevM = num(r[iElev]);

	minYear = Math.min(minYear, y);
	maxYear = Math.max(maxYear, y);

	activities.push({
		y,
		m,
		t: disc,
		km: Math.round((distM / 1000) * 100) / 100,
		s: Math.round(movS),
		e: Math.round(elevM),
	});

	life[disc].count++;
	life[disc].distM += distM;
	life[disc].movS += movS;
	life[disc].elevM += elevM;

	if (!years.has(y)) {
		years.set(
			y,
			Object.fromEntries(DISCIPLINES.map((k) => [k, { count: 0, distM: 0, movS: 0 }]))
		);
	}
	const yr = years.get(y)[disc];
	yr.count++;
	yr.distM += distM;
	yr.movS += movS;

	const key = `${y}-${m}`;
	if (!cal.has(key)) cal.set(key, { movS: 0 });
	cal.get(key).movS += movS;

	if (disc === 'Run' && distM > 0) {
		if (!runPace.has(y)) runPace.set(y, { distM: 0, movS: 0 });
		runPace.get(y).distM += distM;
		runPace.get(y).movS += movS;
	}
	if (disc === 'Ride' && distM > 0) {
		if (!rideSpeed.has(y)) rideSpeed.set(y, { distM: 0, movS: 0 });
		rideSpeed.get(y).distM += distM;
		rideSpeed.get(y).movS += movS;
	}
}

const round = (n, p = 0) => {
	const f = 10 ** p;
	return Math.round(n * f) / f;
};

const totals = DISCIPLINES.reduce(
	(acc, d) => {
		acc.count += life[d].count;
		acc.distM += life[d].distM;
		acc.movS += life[d].movS;
		acc.elevM += life[d].elevM;
		return acc;
	},
	{ count: 0, distM: 0, movS: 0, elevM: 0 }
);

const byYear = [];
for (let y = minYear; y <= maxYear; y++) {
	const src = years.get(y);
	if (!src) continue;
	const entry = { year: y };
	for (const d of DISCIPLINES) {
		entry[d] = {
			hours: round(src[d].movS / 3600, 1),
			km: round(src[d].distM / 1000, 1),
			count: src[d].count,
		};
	}
	byYear.push(entry);
}

const calendar = [];
for (const [key, v] of cal) {
	const [y, m] = key.split('-').map(Number);
	calendar.push({ year: y, month: m, hours: round(v.movS / 3600, 2) });
}
calendar.sort((a, b) => a.year - b.year || a.month - b.month);

const paceByYear = [];
for (const [y, v] of [...runPace].sort((a, b) => a[0] - b[0])) {
	// minutes per km
	paceByYear.push({ year: y, paceMinKm: round(v.movS / 60 / (v.distM / 1000), 2) });
}

const speedByYear = [];
for (const [y, v] of [...rideSpeed].sort((a, b) => a[0] - b[0])) {
	// km per hour
	speedByYear.push({ year: y, speedKmh: round(v.distM / 1000 / (v.movS / 3600), 1) });
}

const summary = {
	generatedAt: new Date().toISOString().slice(0, 10),
	range: { startYear: minYear, endYear: maxYear },
	totals: {
		activities: totals.count,
		distanceKm: round(totals.distM / 1000),
		movingHours: round(totals.movS / 3600),
		elevationM: round(totals.elevM),
	},
	disciplines: Object.fromEntries(
		DISCIPLINES.map((d) => [
			d,
			{
				count: life[d].count,
				distanceKm: round(life[d].distM / 1000),
				hours: round(life[d].movS / 3600),
				elevationM: round(life[d].elevM),
			},
		])
	),
	byYear,
	calendar,
	paceByYear,
	speedByYear,
	activities,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(summary, null, 2));
console.log(
	`Wrote ${output}: ${summary.totals.activities} activities, ${summary.totals.distanceKm} km, ${summary.range.startYear}–${summary.range.endYear}`
);
