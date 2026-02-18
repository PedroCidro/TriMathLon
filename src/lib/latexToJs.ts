/**
 * Utilities for converting LaTeX math expressions to JavaScript expressions
 * and extracting function definitions / annotations from question text.
 *
 * Used to render interactive graphs for graph_sketching practice questions.
 */

// ── Public API ──────────────────────────────────────────────────────────────

export interface ParsedGraph {
    fn: string;
    domain: [number, number];
    annotations: Array<{ x: number; y: number; label: string; type: 'max' | 'min' | 'inflection' }>;
}

/**
 * Attempts to extract a plottable function from a question's problem text
 * and critical-point annotations from the solution text.
 * Returns null if the function can't be parsed.
 */
export function parseGraphFromQuestion(
    problem: string,
    solutionLatex: string,
): ParsedGraph | null {
    const fnResult = extractFunctionExpr(problem);
    if (!fnResult) return null;

    const annotations = extractAnnotations(solutionLatex);

    // Determine domain: use explicit interval from problem, or auto-fit
    let domain: [number, number];
    if (fnResult.domain) {
        // Pad explicit domain by 10%
        const range = fnResult.domain[1] - fnResult.domain[0];
        const pad = range * 0.1;
        domain = [fnResult.domain[0] - pad, fnResult.domain[1] + pad];
    } else {
        // Default [-5, 5], expand to include annotation x-values
        let xMin = -5, xMax = 5;
        for (const a of annotations) {
            if (a.x - 1 < xMin) xMin = a.x - 1;
            if (a.x + 1 > xMax) xMax = a.x + 1;
        }
        domain = [xMin, xMax];
    }

    return { fn: fnResult.fn, domain, annotations };
}

// ── Function extraction ─────────────────────────────────────────────────────

function extractFunctionExpr(
    problem: string,
): { fn: string; domain?: [number, number] } | null {
    // Collect all $...$ math segments
    const segments: string[] = [];
    const re = /\$([^$]+)\$/g;
    let m;
    while ((m = re.exec(problem)) !== null) segments.push(m[1]);

    for (const seg of segments) {
        // Match f(x) = expr  or  y = expr
        const fnMatch = seg.match(/(?:[fgh]\s*\(\s*x\s*\)|y)\s*=\s*(.+)/);
        if (!fnMatch) continue;

        const js = latexToJs(fnMatch[1].trim());
        if (!js || !validateExpr(js)) continue;

        // Try to pick up an explicit interval from the problem, e.g. "em [0, 5]"
        const ivMatch = problem.match(
            /\[\s*(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)\s*\]/,
        );
        const domain = ivMatch
            ? [
                  parseFloat(ivMatch[1].replace(',', '.')),
                  parseFloat(ivMatch[2].replace(',', '.')),
              ] as [number, number]
            : undefined;

        return { fn: js, domain };
    }
    return null;
}

// ── Annotation extraction ───────────────────────────────────────────────────

function extractAnnotations(
    solutionLatex: string,
): ParsedGraph['annotations'] {
    // Strip LaTeX formatting to get plain-ish text
    let text = solutionLatex;
    text = text.replace(/\$/g, '');
    text = text.replace(/\\text\{([^}]*)\}/g, '$1');
    text = text.replace(/\\[,;:!]/g, ' ');
    text = text.replace(/\\q?quad/g, ' ');
    text = text.replace(/\\left|\\right/g, '');
    text = text.replace(/\s+/g, ' ');

    const annotations: ParsedGraph['annotations'] = [];
    const pairRe = /\(\s*(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)\s*\)/g;
    let match;

    while ((match = pairRe.exec(text)) !== null) {
        const x = parseFloat(match[1].replace(',', '.'));
        const y = parseFloat(match[2].replace(',', '.'));
        const type = classifyPoint(text, match.index);
        if (!type) continue; // skip pairs without a nearby keyword (likely intervals)

        const typeLabel = type === 'max' ? 'Máx' : type === 'min' ? 'Mín' : 'Infl';
        annotations.push({ x, y, label: `${typeLabel} (${x}, ${y})`, type });
    }

    return annotations;
}

/** Find the closest keyword before the match position to classify the point. */
function classifyPoint(
    text: string,
    matchIndex: number,
): 'max' | 'min' | 'inflection' | null {
    const before = text.slice(0, matchIndex).toLowerCase();

    const keywords: { re: RegExp; type: 'max' | 'min' | 'inflection' }[] = [
        { re: /m[áa]x/g, type: 'max' },
        { re: /m[íi]n/g, type: 'min' },
        { re: /inflex/g, type: 'inflection' },
    ];

    let best: 'max' | 'min' | 'inflection' | null = null;
    let bestDist = Infinity;

    for (const kw of keywords) {
        let km;
        while ((km = kw.re.exec(before)) !== null) {
            const dist = matchIndex - km.index;
            if (dist < bestDist) {
                bestDist = dist;
                best = kw.type;
            }
        }
    }

    return bestDist <= 120 ? best : null;
}

// ── LaTeX → JavaScript converter ────────────────────────────────────────────

function latexToJs(latex: string): string | null {
    try {
        let s = latex;

        // Normalise unicode minus, clean decorators
        s = s.replace(/\u2212/g, '-');
        s = s.replace(/\\left/g, '');
        s = s.replace(/\\right/g, '');
        s = s.replace(/\\[,;:!]/g, ' ');
        s = s.replace(/\\q?quad/g, ' ');
        s = s.replace(/\\text\{[^}]*\}/g, '');
        s = s.replace(/\\dfrac/g, '\\frac');
        s = s.replace(/\\cdot/g, '*');
        s = s.replace(/\\times/g, '*');
        s = s.replace(/\\pi/g, 'Math.PI');

        // \frac{num}{den} → (num)/(den)
        for (let i = 0; i < 20 && s.includes('\\frac'); i++) {
            const idx = s.indexOf('\\frac');
            const numRes = extractBraced(s.slice(idx + 5));
            if (!numRes) return null;
            const denRes = extractBraced(numRes[1]);
            if (!denRes) return null;
            s = s.slice(0, idx) + `(${numRes[0]})/(${denRes[0]})` + denRes[1];
        }

        // \sqrt{expr} → Math.sqrt(expr)
        for (let i = 0; i < 20 && s.includes('\\sqrt'); i++) {
            const idx = s.indexOf('\\sqrt');
            const res = extractBraced(s.slice(idx + 5));
            if (!res) return null;
            s = s.slice(0, idx) + `Math.sqrt(${res[0]})` + res[1];
        }

        // Trig / log / exp function names
        const fns: [string, string][] = [
            ['\\\\ln', 'Math.log'],
            ['\\\\log', 'Math.log'],
            ['\\\\sin', 'Math.sin'],
            ['\\\\cos', 'Math.cos'],
            ['\\\\tan', 'Math.tan'],
            ['\\\\exp', 'Math.exp'],
        ];
        for (const [lx, js] of fns) {
            // \fn{expr}
            s = s.replace(new RegExp(`${lx}\\s*\\{([^}]+)\\}`, 'g'), `${js}($1)`);
            // \fn(expr) — just swap the command name
            s = s.replace(new RegExp(`${lx}\\s*(?=\\()`, 'g'), js);
            // \fn x — wrap the lone variable in parens
            s = s.replace(new RegExp(`${lx}\\s*([a-zA-Z])`, 'g'), `${js}($1)`);
        }

        // e^{expr} → Math.exp(expr)  (before general ^ handling)
        s = s.replace(/e\^\{([^}]+)\}/g, 'Math.exp($1)');
        s = s.replace(/e\^([a-zA-Z0-9])/g, 'Math.exp($1)');

        // ^{expr} with brace-matched exponents
        for (let i = 0; i < 20 && s.includes('^{'); i++) {
            const idx = s.indexOf('^{');
            const expRes = extractBraced(s.slice(idx + 1));
            if (!expRes) return null;
            const before = s.slice(0, idx);
            const [prefix, base] = splitBase(before);
            if (!base) return null;
            s = prefix + `Math.pow(${base},${expRes[0]})` + expRes[1];
        }

        // ^n for single-digit exponents (process rightmost first)
        for (let i = 0; i < 20 && s.includes('^'); i++) {
            const cm = s.match(/^(.*)\^(\d)(.*)$/);
            if (!cm) break;
            const [, bef, exp, aft] = cm;
            const [prefix, base] = splitBase(bef);
            if (!base) break;
            s = prefix + `Math.pow(${base},${exp})` + aft;
        }

        // Implicit multiplication
        s = s.replace(/(\d)([x(])/g, '$1*$2');
        s = s.replace(/(\d)(Math)/g, '$1*$2');
        s = s.replace(/([x)])(\()/g, '$1*$2');
        s = s.replace(/\)([xM\d])/g, ')*$1');
        s = s.replace(/x(Math)/g, 'x*$1');

        // Strip any remaining LaTeX commands
        s = s.replace(/\\[a-zA-Z]+/g, '');

        // Clean whitespace and trailing punctuation
        s = s.replace(/\s+/g, ' ').trim();
        s = s.replace(/[.,;]+$/, '');

        return s;
    } catch {
        return null;
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Extract the content of the first {...} group in `s`. Returns [content, rest] or null. */
function extractBraced(s: string): [string, string] | null {
    const t = s.trimStart();
    if (t[0] !== '{') return null;
    let depth = 0;
    for (let i = 0; i < t.length; i++) {
        if (t[i] === '{') depth++;
        else if (t[i] === '}') {
            depth--;
            if (depth === 0) return [t.slice(1, i), t.slice(i + 1)];
        }
    }
    return null;
}

/**
 * Split `s` into [prefix, base] where base is the rightmost atomic
 * expression — either a parenthesised group (possibly preceded by a
 * Math.* call) or the last alphanumeric token.
 */
function splitBase(s: string): [string, string] {
    const t = s.trimEnd();
    if (!t) return ['', ''];

    if (t.endsWith(')')) {
        let depth = 0;
        for (let i = t.length - 1; i >= 0; i--) {
            if (t[i] === ')') depth++;
            else if (t[i] === '(') {
                depth--;
                if (depth === 0) {
                    // Include preceding Math.xxx if present
                    const pre = t.slice(0, i);
                    const fnm = pre.match(/(Math\.\w+)$/);
                    const start = fnm ? i - fnm[1].length : i;
                    return [t.slice(0, start), t.slice(start)];
                }
            }
        }
    }

    const tok = t.match(/^(.*?)([a-zA-Z_]\w*|\d+(?:\.\d+)?)$/);
    if (tok) return [tok[1], tok[2]];
    return [t, ''];
}

/** Evaluate the expression at a few sample points to make sure it's valid JS. */
function validateExpr(expr: string): boolean {
    try {
        const fn = new Function('x', 'return ' + expr);
        let ok = 0;
        for (const x of [0, 1, -1, 0.5, 2, -2]) {
            try {
                if (typeof fn(x) === 'number') ok++;
            } catch { /* some points may throw (e.g. log(0)) */ }
        }
        return ok >= 2;
    } catch {
        return false;
    }
}
