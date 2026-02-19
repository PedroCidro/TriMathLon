export type LearnSection =
    | { type: 'heading'; level: 2 | 3; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'display-math'; latex: string }
    | { type: 'table'; headers: string[]; rows: string[][] }
    | { type: 'blockquote'; text: string }
    | { type: 'divider' }
    | { type: 'graph'; id: string }
    | { type: 'callout'; text: string };

export const limitesIntroSectionsEn: LearnSection[] = [
    // --- The problem algebra can't solve ---
    { type: 'heading', level: 2, text: 'The problem algebra can\'t solve' },
    { type: 'paragraph', text: 'Consider the function:' },
    { type: 'display-math', latex: 'f(x) = \\frac{x^2 - 1}{x - 1}' },
    { type: 'paragraph', text: 'Simple question: what is $f(1)$?' },
    { type: 'paragraph', text: 'Let\'s plug in:' },
    { type: 'display-math', latex: 'f(1) = \\frac{1^2 - 1}{1 - 1} = \\frac{0}{0}' },
    { type: 'paragraph', text: 'Algebra breaks down. Division by zero is undefined — the function **does not exist** at $x = 1$.' },
    { type: 'paragraph', text: 'But can we figure out where $f(x)$ is **heading** as $x$ approaches 1?' },
    { type: 'graph', id: 'limit-hole' },

    // --- Getting close ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Getting close' },
    { type: 'paragraph', text: 'We can\'t compute $f(1)$, but we can compute $f(x)$ for values **near** 1:' },
    {
        type: 'table',
        headers: ['$x$', '$f(x)$'],
        rows: [
            ['$0.5$', '$1.5$'],
            ['$0.9$', '$1.9$'],
            ['$0.99$', '$1.99$'],
            ['$0.999$', '$1.999$'],
            ['$1.001$', '$2.001$'],
            ['$1.01$', '$2.01$'],
            ['$1.1$', '$2.1$'],
            ['$1.5$', '$2.5$'],
        ],
    },
    { type: 'paragraph', text: 'From the left: $1.5 \\to 1.9 \\to 1.99 \\to 1.999 \\to \\ldots$' },
    { type: 'paragraph', text: 'From the right: $2.5 \\to 2.1 \\to 2.01 \\to 2.001 \\to \\ldots$' },
    { type: 'paragraph', text: 'From both sides, $f(x)$ is heading towards **2**.' },
    { type: 'paragraph', text: 'The graph makes it obvious: $f(x) = \\frac{x^2 - 1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x + 1$ for $x \\neq 1$.' },
    { type: 'paragraph', text: 'It\'s the line $y = x + 1$, but with a **hole** at $x = 1$. The function doesn\'t exist there, but everything around it screams "2".' },

    // --- The notation ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The notation' },
    { type: 'paragraph', text: 'We write:' },
    { type: 'display-math', latex: '\\lim_{x \\to 1} f(x) = 2' },
    { type: 'paragraph', text: 'Read as: **"the limit of $f(x)$ as $x$ approaches 1 is 2."**' },
    { type: 'paragraph', text: 'What each piece means:' },
    {
        type: 'table',
        headers: ['Symbol', 'Meaning'],
        rows: [
            ['$\\lim$', '"the limit"'],
            ['$x \\to 1$', '"as $x$ approaches 1" (without ever being 1)'],
            ['$f(x)$', '"of the function $f$"'],
            ['$= 2$', '"equals 2"'],
        ],
    },
    { type: 'paragraph', text: '$f(x)$ can get **as close** to 2 as we want — we just need $x$ to be close enough to 1.' },
    { type: 'paragraph', text: 'But... "close enough" is vague. How do we make this **precise**?' },

    // --- The square experiment ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The square experiment' },
    { type: 'paragraph', text: 'Before the formal definition, let\'s build intuition with a visual example.' },
    { type: 'paragraph', text: 'Imagine a square with area 1.' },
    { type: 'graph', id: 'geometric-square' },
    { type: 'paragraph', text: 'We fill half. Filled area: $\\frac{1}{2}$. Remaining: $\\frac{1}{2}$.' },
    { type: 'paragraph', text: 'We fill half of what\'s left. Area: $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$. Remaining: $\\frac{1}{4}$.' },
    { type: 'paragraph', text: 'Again. Area: $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$. Remaining: $\\frac{1}{8}$.' },
    { type: 'paragraph', text: 'And again, and again, and again...' },
    { type: 'paragraph', text: 'At each step, the sum gets **closer** to 1, but never exceeds it. The remaining piece becomes microscopic — $\\frac{1}{16}$, $\\frac{1}{32}$, $\\frac{1}{64}$...' },
    { type: 'paragraph', text: 'Result:' },
    { type: 'display-math', latex: '\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + \\cdots = 1' },
    { type: 'paragraph', text: 'An **infinite** sum that "reaches" 1 — even though it never stops adding.' },
    { type: 'paragraph', text: 'This is a limit:' },
    { type: 'display-math', latex: '\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{1}{2^k} = 1' },

    // --- The challenge: formalizing "getting close" ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The challenge: formalizing "getting close"' },
    { type: 'paragraph', text: 'Let\'s go back to our limit. Remember our function?' },
    { type: 'display-math', latex: 'f(x) = \\frac{x^2 - 1}{x - 1}, \\qquad \\lim_{x \\to 1} f(x) = 2' },
    { type: 'paragraph', text: 'Imagine someone doubts it. And challenges you:' },
    { type: 'blockquote', text: '"Prove that $f(x)$ stays within a distance of $0.5$ from the value $2$."' },
    { type: 'paragraph', text: 'That distance is **$\\varepsilon$** (epsilon). It\'s the **tolerance** — how close you demand $f(x)$ to be to $L = 2$.' },
    { type: 'graph', id: 'epsilon-band' },
    { type: 'paragraph', text: 'Visually: it\'s a **horizontal band** around $y = 2$.' },
    { type: 'paragraph', text: 'Now, how do we guarantee $f(x)$ stays inside that band?' },
    { type: 'paragraph', text: 'Answer: if $x$ stays within $0.5$ of $1$, then $f(x)$ stays inside the band.' },
    { type: 'paragraph', text: 'That distance is **$\\delta$** (delta). It\'s the **control** — how close $x$ needs to be to $a = 1$.' },
    { type: 'graph', id: 'delta-band' },
    { type: 'paragraph', text: 'If $x$ is in the blue band → $f(x)$ stays in the green band.' },

    // --- Tightening the challenge ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Tightening the challenge' },
    { type: 'paragraph', text: 'Now the skeptic demands more:' },
    {
        type: 'table',
        headers: ['Challenge ($\\varepsilon$)', 'Response ($\\delta$)', 'Works?'],
        rows: [
            ['$\\varepsilon = 0.5$', '$\\delta = 0.5$', '✓'],
            ['$\\varepsilon = 0.1$', '$\\delta = 0.1$', '✓'],
            ['$\\varepsilon = 0.01$', '$\\delta = 0.01$', '✓'],
            ['$\\varepsilon = 0.0001$', '$\\delta = 0.0001$', '✓'],
            ['Any $\\varepsilon > 0$', '$\\delta = \\varepsilon$', '✓ Always'],
        ],
    },
    { type: 'graph', id: 'epsilon-triptych' },
    { type: 'paragraph', text: 'No matter how small $\\varepsilon$ is, there **always** exists a $\\delta$ that works.' },
    { type: 'callout', text: 'The skeptic never wins. That is the essence of the limit.' },

    // --- The formal definition ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The formal definition' },
    { type: 'paragraph', text: 'Everything we just saw is written as:' },
    { type: 'display-math', latex: '\\forall\\, \\varepsilon > 0, \\quad \\exists\\, \\delta > 0 \\quad \\text{such that} \\quad 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon' },
    { type: 'paragraph', text: 'Let\'s break down each piece:' },
    {
        type: 'table',
        headers: ['Symbol', 'Meaning', 'Visual'],
        rows: [
            ['$\\forall\\, \\varepsilon > 0$', '"For **any** tolerance $\\varepsilon$"', 'The horizontal band (green)'],
            ['$\\exists\\, \\delta > 0$', '"there **exists** a control $\\delta$"', 'The vertical band (blue)'],
            ['$0 < |x - a| < \\delta$', '"if $x$ is within $\\delta$ of $a$ (but not $a$ itself)"', '$x$ inside the blue band'],
            ['$\\implies$', '"then"', ''],
            ['$|f(x) - L| < \\varepsilon$', '"$f(x)$ is within $\\varepsilon$ of $L$"', '$f(x)$ inside the green band'],
        ],
    },
    { type: 'paragraph', text: 'In plain English:' },
    { type: 'blockquote', text: '"No matter how tight the challenge ($\\varepsilon$), I can always find a control ($\\delta$) such that if $x$ is in the blue band, $f(x)$ stays in the green band."' },
    { type: 'paragraph', text: 'The limit exists when this game **never fails**, for any $\\varepsilon > 0$.' },

    // --- Why does this matter? ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Why does this matter?' },
    { type: 'paragraph', text: 'Limits aren\'t just a chapter in the textbook. They\'re the **foundation** of all of Calculus.' },

    { type: 'heading', level: 3, text: 'The derivative is a limit' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}" },
    { type: 'paragraph', text: 'The instantaneous rate of change is the limit of the average rate as the interval shrinks to zero.' },

    { type: 'heading', level: 3, text: 'The integral is a limit' },
    { type: 'display-math', latex: '\\int_a^b f(x)\\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i)\\, \\Delta x' },
    { type: 'paragraph', text: 'The area under the curve is the limit of a sum of rectangles as the number of rectangles goes to infinity.' },

    { type: 'heading', level: 3, text: 'Continuity is defined by limits' },
    { type: 'paragraph', text: 'A function is continuous at $a$ if and only if:' },
    { type: 'display-math', latex: '\\lim_{x \\to a} f(x) = f(a)' },

    { type: 'divider' },
    { type: 'paragraph', text: 'Without limits, there are no derivatives. Without limits, there are no integrals. Without limits, there is no continuity.' },
    { type: 'callout', text: '**Everything in Calculus is built on limits.**' },
    { type: 'paragraph', text: 'Now that you understand what a limit is and why it exists, it\'s time to practice.' },
];

export const limitesIntroSections: LearnSection[] = [
    // --- O problema que a álgebra não resolve ---
    { type: 'heading', level: 2, text: 'O problema que a álgebra não resolve' },
    { type: 'paragraph', text: 'Considere a função:' },
    { type: 'display-math', latex: 'f(x) = \\frac{x^2 - 1}{x - 1}' },
    { type: 'paragraph', text: 'Pergunta simples: quanto vale $f(1)$?' },
    { type: 'paragraph', text: 'Vamos substituir:' },
    { type: 'display-math', latex: 'f(1) = \\frac{1^2 - 1}{1 - 1} = \\frac{0}{0}' },
    { type: 'paragraph', text: 'A álgebra trava. Divisão por zero não é definida — a função **não existe** em $x = 1$.' },
    { type: 'paragraph', text: 'Mas será que a gente pode descobrir pra onde $f(x)$ está **indo** quando $x$ se aproxima de 1?' },
    { type: 'graph', id: 'limit-hole' },

    // --- Chegando perto ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Chegando perto' },
    { type: 'paragraph', text: 'Não podemos calcular $f(1)$, mas podemos calcular $f(x)$ pra valores **perto** de 1:' },
    {
        type: 'table',
        headers: ['$x$', '$f(x)$'],
        rows: [
            ['$0{,}5$', '$1{,}5$'],
            ['$0{,}9$', '$1{,}9$'],
            ['$0{,}99$', '$1{,}99$'],
            ['$0{,}999$', '$1{,}999$'],
            ['$1{,}001$', '$2{,}001$'],
            ['$1{,}01$', '$2{,}01$'],
            ['$1{,}1$', '$2{,}1$'],
            ['$1{,}5$', '$2{,}5$'],
        ],
    },
    { type: 'paragraph', text: 'Pela esquerda: $1{,}5 \\to 1{,}9 \\to 1{,}99 \\to 1{,}999 \\to \\ldots$' },
    { type: 'paragraph', text: 'Pela direita: $2{,}5 \\to 2{,}1 \\to 2{,}01 \\to 2{,}001 \\to \\ldots$' },
    { type: 'paragraph', text: 'Dos dois lados, $f(x)$ está indo pra **2**.' },
    { type: 'paragraph', text: 'No gráfico fica óbvio: $f(x) = \\frac{x^2 - 1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x + 1$ para $x \\neq 1$.' },
    { type: 'paragraph', text: 'É a reta $y = x + 1$, mas com um **buraco** em $x = 1$. A função não existe ali, mas tudo ao redor grita "2".' },

    // --- A notação ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A notação' },
    { type: 'paragraph', text: 'Escrevemos:' },
    { type: 'display-math', latex: '\\lim_{x \\to 1} f(x) = 2' },
    { type: 'paragraph', text: 'Lê-se: **"o limite de $f(x)$ quando $x$ tende a 1 é 2."**' },
    { type: 'paragraph', text: 'O que isso quer dizer:' },
    {
        type: 'table',
        headers: ['Símbolo', 'Significado'],
        rows: [
            ['$\\lim$', '"o limite"'],
            ['$x \\to 1$', '"quando $x$ se aproxima de 1" (sem nunca ser 1)'],
            ['$f(x)$', '"da função $f$"'],
            ['$= 2$', '"é igual a 2"'],
        ],
    },
    { type: 'paragraph', text: '$f(x)$ pode chegar **tão perto** de 2 quanto a gente quiser — basta $x$ ficar perto o suficiente de 1.' },
    { type: 'paragraph', text: 'Mas... "perto o suficiente" é vago. Como tornar isso **preciso**?' },

    // --- O experimento do quadrado ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O experimento do quadrado' },
    { type: 'paragraph', text: 'Antes da definição formal, vamos construir a intuição com um exemplo visual.' },
    { type: 'paragraph', text: 'Imagine um quadrado de área 1.' },
    { type: 'graph', id: 'geometric-square' },
    { type: 'paragraph', text: 'Preenchemos metade. Área preenchida: $\\frac{1}{2}$. Falta $\\frac{1}{2}$.' },
    { type: 'paragraph', text: 'Preenchemos metade do que falta. Área: $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$. Falta $\\frac{1}{4}$.' },
    { type: 'paragraph', text: 'De novo. Área: $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$. Falta $\\frac{1}{8}$.' },
    { type: 'paragraph', text: 'E de novo, e de novo, e de novo...' },
    { type: 'paragraph', text: 'A cada passo, a soma fica **mais perto** de 1, mas nunca ultrapassa. O pedaço que falta vai ficando microscópico — $\\frac{1}{16}$, $\\frac{1}{32}$, $\\frac{1}{64}$...' },
    { type: 'paragraph', text: 'Resultado:' },
    { type: 'display-math', latex: '\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + \\cdots = 1' },
    { type: 'paragraph', text: 'Uma soma **infinita** que "chega" no 1 — mesmo sem nunca parar de somar.' },
    { type: 'paragraph', text: 'Isso é um limite:' },
    { type: 'display-math', latex: '\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{1}{2^k} = 1' },

    // --- O desafio: formalizando "chegar perto" ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O desafio: formalizando "chegar perto"' },
    { type: 'paragraph', text: 'Voltemos ao nosso limite. Lembra da função?' },
    { type: 'display-math', latex: 'f(x) = \\frac{x^2 - 1}{x - 1}, \\qquad \\lim_{x \\to 1} f(x) = 2' },
    { type: 'paragraph', text: 'Imagine que alguém duvida. E te desafia:' },
    { type: 'blockquote', text: '"Prove que $f(x)$ fica a menos de $0{,}5$ de distância do valor $2$."' },
    { type: 'paragraph', text: 'Essa distância é o **$\\varepsilon$** (épsilon). É a **tolerância** — o quanto você exige que $f(x)$ fique perto de $L = 2$.' },
    { type: 'graph', id: 'epsilon-band' },
    { type: 'paragraph', text: 'Visualmente: é uma **faixa horizontal** ao redor de $y = 2$.' },
    { type: 'paragraph', text: 'Agora, como garantir que $f(x)$ fica dentro dessa faixa?' },
    { type: 'paragraph', text: 'Resposta: se $x$ ficar a menos de $0{,}5$ do $1$, $f(x)$ fica dentro da faixa.' },
    { type: 'paragraph', text: 'Essa distância é o **$\\delta$** (delta). É o **controle** — o quanto $x$ precisa ficar perto de $a = 1$.' },
    { type: 'graph', id: 'delta-band' },
    { type: 'paragraph', text: 'Se $x$ está na faixa azul → $f(x)$ fica na faixa verde.' },

    // --- Apertando o desafio ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Apertando o desafio' },
    { type: 'paragraph', text: 'Agora o cético pede mais:' },
    {
        type: 'table',
        headers: ['Desafio ($\\varepsilon$)', 'Resposta ($\\delta$)', 'Funciona?'],
        rows: [
            ['$\\varepsilon = 0{,}5$', '$\\delta = 0{,}5$', '✓'],
            ['$\\varepsilon = 0{,}1$', '$\\delta = 0{,}1$', '✓'],
            ['$\\varepsilon = 0{,}01$', '$\\delta = 0{,}01$', '✓'],
            ['$\\varepsilon = 0{,}0001$', '$\\delta = 0{,}0001$', '✓'],
            ['Qualquer $\\varepsilon > 0$', '$\\delta = \\varepsilon$', '✓ Sempre'],
        ],
    },
    { type: 'graph', id: 'epsilon-triptych' },
    { type: 'paragraph', text: 'Não importa quão pequeno o $\\varepsilon$, **sempre** existe um $\\delta$ que funciona.' },
    { type: 'callout', text: 'O cético nunca vence. Essa é a essência do limite.' },

    // --- A definição formal ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A definição formal' },
    { type: 'paragraph', text: 'Tudo o que acabamos de ver se escreve assim:' },
    { type: 'display-math', latex: '\\forall\\, \\varepsilon > 0, \\quad \\exists\\, \\delta > 0 \\quad \\text{tal que} \\quad 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon' },
    { type: 'paragraph', text: 'Vamos traduzir cada pedaço:' },
    {
        type: 'table',
        headers: ['Símbolo', 'Significado', 'Visual'],
        rows: [
            ['$\\forall\\, \\varepsilon > 0$', '"Para **qualquer** tolerância $\\varepsilon$"', 'A faixa horizontal (verde)'],
            ['$\\exists\\, \\delta > 0$', '"**existe** um controle $\\delta$"', 'A faixa vertical (azul)'],
            ['$0 < |x - a| < \\delta$', '"se $x$ está a menos de $\\delta$ de $a$ (sem ser $a$)"', '$x$ dentro da faixa azul'],
            ['$\\implies$', '"então"', ''],
            ['$|f(x) - L| < \\varepsilon$', '"$f(x)$ está a menos de $\\varepsilon$ de $L$"', '$f(x)$ dentro da faixa verde'],
        ],
    },
    { type: 'paragraph', text: 'Em português direto:' },
    { type: 'blockquote', text: '"Não importa o quão apertado o desafio ($\\varepsilon$), eu sempre encontro um controle ($\\delta$) tal que se $x$ está na faixa azul, $f(x)$ fica na faixa verde."' },
    { type: 'paragraph', text: 'O limite existe quando esse jogo **nunca falha**, para qualquer $\\varepsilon > 0$.' },

    // --- Por que isso importa? ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Por que isso importa?' },
    { type: 'paragraph', text: 'Limite não é só um capítulo do livro. É a **fundação** de todo o Cálculo.' },

    { type: 'heading', level: 3, text: 'A derivada é um limite' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}" },
    { type: 'paragraph', text: 'A taxa de variação instantânea é o limite da taxa média quando o intervalo vai pra zero.' },

    { type: 'heading', level: 3, text: 'A integral é um limite' },
    { type: 'display-math', latex: '\\int_a^b f(x)\\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i)\\, \\Delta x' },
    { type: 'paragraph', text: 'A área sob a curva é o limite da soma de retângulos quando a quantidade de retângulos vai pro infinito.' },

    { type: 'heading', level: 3, text: 'Continuidade é definida por limites' },
    { type: 'paragraph', text: 'Uma função é contínua em $a$ se e somente se:' },
    { type: 'display-math', latex: '\\lim_{x \\to a} f(x) = f(a)' },

    { type: 'divider' },
    { type: 'paragraph', text: 'Sem limite, não existe derivada. Sem limite, não existe integral. Sem limite, não existe continuidade.' },
    { type: 'callout', text: '**Tudo no Cálculo é construído sobre limites.**' },
    { type: 'paragraph', text: 'Agora que você entende o que é limite e por que ele existe, é hora de praticar.' },
];
