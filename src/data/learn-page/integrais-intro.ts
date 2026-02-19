import type { LearnSection } from './limites-intro';

export const integraisIntroSectionsEn: LearnSection[] = [
    // --- From derivatives to integrals ---
    { type: 'heading', level: 2, text: 'From derivatives to integrals' },
    { type: 'paragraph', text: 'You learned how to go from a function to its derivative: given $f$, find $f\'$.' },
    { type: 'paragraph', text: 'Now we go **backwards**: given the rate of change, recover the original function.' },
    { type: 'paragraph', text: 'And as a bonus, we answer a completely different-sounding question:' },
    { type: 'blockquote', text: '"How do you compute the area under a curve?"' },
    { type: 'paragraph', text: 'Remarkably, these two questions have the **same answer**. That connection is the heart of Calculus.' },

    // --- The area problem ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The area problem' },
    { type: 'paragraph', text: 'How do you compute the area under $f(x) = x^2$ from $x = 0$ to $x = 2$?' },
    { type: 'graph', id: 'area-under-curve' },
    { type: 'paragraph', text: 'It\'s not a rectangle, not a triangle, not any shape with a simple formula. The boundary is a **curve**.' },
    { type: 'paragraph', text: 'So how do we handle it? With a clever trick: approximate the curve with shapes we **do** know.' },

    // --- Rectangles to the rescue ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Rectangles to the rescue' },
    { type: 'paragraph', text: 'We know how to compute the area of a rectangle: **base $\\times$ height**. So let\'s fill the region with rectangles.' },
    { type: 'paragraph', text: 'Divide $[0, 2]$ into $4$ equal pieces. Each piece has width:' },
    { type: 'display-math', latex: '\\Delta x = \\frac{2 - 0}{4} = 0.5' },
    { type: 'paragraph', text: 'In each piece, draw a rectangle whose height equals the function at the **left endpoint** — the $x$-value where that piece starts. The area of each rectangle is $f(x_i) \\cdot \\Delta x$:' },
    {
        type: 'table',
        headers: ['Rectangle', 'Left endpoint $x_i$', 'Height $f(x_i) = x_i^2$', 'Area $= f(x_i) \\cdot \\Delta x$'],
        rows: [
            ['1st', '$0$', '$0$', '$0 \\times 0.5 = 0$'],
            ['2nd', '$0.5$', '$0.25$', '$0.25 \\times 0.5 = 0.125$'],
            ['3rd', '$1$', '$1$', '$1 \\times 0.5 = 0.5$'],
            ['4th', '$1.5$', '$2.25$', '$2.25 \\times 0.5 = 1.125$'],
        ],
    },
    { type: 'paragraph', text: 'Total area of the 4 rectangles:' },
    { type: 'display-math', latex: '0 + 0.125 + 0.5 + 1.125 = 1.75' },
    { type: 'paragraph', text: 'The exact area is $\\frac{8}{3} \\approx 2.667$, so $1.75$ is a rough estimate. The rectangles **undercount** because they miss the curved part above them.' },
    { type: 'paragraph', text: 'Can we do better? Yes — use **more** rectangles. The thinner each one is, the less curve it misses.' },

    // --- More rectangles, better answer ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'More rectangles, better answer' },
    { type: 'paragraph', text: 'Watch what happens when we go from 4 to 10 to 30 rectangles:' },
    { type: 'graph', id: 'riemann-triptych' },
    { type: 'paragraph', text: 'The gap between the rectangle tops and the curve **shrinks**. The sum gets closer to the true area:' },
    {
        type: 'table',
        headers: ['Rectangles ($n$)', 'Width ($\\Delta x$)', 'Sum', 'Error'],
        rows: [
            ['$4$', '$0.5$', '$1.75$', '$0.917$'],
            ['$10$', '$0.2$', '$2.28$', '$0.387$'],
            ['$30$', '$0.0\\overline{6}$', '$2.577$', '$0.090$'],
            ['$100$', '$0.02$', '$2.627$', '$0.040$'],
            ['$\\to \\infty$', '$\\to 0$', '$\\to 2.\\overline{6}$', '$\\to 0$'],
        ],
    },
    { type: 'paragraph', text: 'As $n$ grows, $\\Delta x$ shrinks, the rectangles become thinner, and the sum converges to $\\frac{8}{3}$.' },

    // --- The Riemann sum ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The Riemann sum' },
    { type: 'paragraph', text: 'Let\'s write what we just did in a general formula. With $n$ rectangles on $[0, 2]$:' },
    { type: 'paragraph', text: '**Width** of each rectangle:' },
    { type: 'display-math', latex: '\\Delta x = \\frac{2 - 0}{n}' },
    { type: 'paragraph', text: '**Left endpoints**:' },
    { type: 'display-math', latex: 'x_i = 0 + i \\cdot \\Delta x \\qquad (i = 0, 1, 2, \\ldots, n-1)' },
    { type: 'paragraph', text: '**Total area** of all rectangles:' },
    { type: 'display-math', latex: '\\text{area} \\approx \\sum_{i=0}^{n-1} f(x_i) \\cdot \\Delta x = \\sum_{i=0}^{n-1} x_i^2 \\cdot \\Delta x' },
    { type: 'paragraph', text: 'This is called a **Riemann sum**: the sum of (height $\\times$ width) for each rectangle.' },
    { type: 'mascot-tip', image: 'thinkingcurious', text: 'Each term $f(x_i) \\cdot \\Delta x$ is just the area of one skinny rectangle. The $\\Sigma$ adds them all up. Nothing more!' },

    // --- From sum to integral ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'From sum to integral' },
    { type: 'paragraph', text: 'The approximation gets better as $n$ grows. The **exact** area is the limit:' },
    { type: 'display-math', latex: '\\text{area} = \\lim_{n \\to \\infty} \\sum_{i=0}^{n-1} f(x_i) \\, \\Delta x' },
    { type: 'paragraph', text: 'This limit shows up so often in math that it earned its own symbol. Here is the translation, piece by piece:' },
    {
        type: 'table',
        headers: ['Riemann sum', '', 'Integral notation'],
        rows: [
            ['$\\displaystyle\\sum$  (add up all pieces)', '$\\to$', '$\\displaystyle\\int$  (stretched "S" for "sum")'],
            ['$f(x_i)$  (height of rectangle)', '$\\to$', '$f(x)$  (the function)'],
            ['$\\Delta x$  (width of rectangle)', '$\\to$', '$dx$  (infinitely thin width)'],
            ['$i = 0 \\ldots n{-}1$  (from start to end)', '$\\to$', '$a$ to $b$  (limits of integration)'],
        ],
    },
    { type: 'paragraph', text: 'Putting it together:' },
    { type: 'display-math', latex: '\\underbrace{\\sum_{i=0}^{n-1} f(x_i)\\,\\Delta x}_{\\text{Riemann sum}} \\;\\xrightarrow{\\;n \\to \\infty\\;}\\; \\underbrace{\\int_0^2 x^2 \\, dx}_{\\text{definite integral}}' },
    { type: 'paragraph', text: 'For our example:' },
    { type: 'display-math', latex: '\\int_0^2 x^2 \\, dx = \\frac{8}{3}' },
    { type: 'mascot-tip', image: 'pointing', text: 'The $dx$ isn\'t decoration! It\'s the ghost of $\\Delta x$ — the width of each rectangle after it becomes infinitely thin. The integral sign $\\int$ is the ghost of $\\Sigma$ — the sum after it has infinitely many terms.' },

    // --- The antiderivative ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The antiderivative' },
    { type: 'paragraph', text: 'Here\'s the other perspective. If the derivative answers "what\'s the rate of change?", the antiderivative answers:' },
    { type: 'blockquote', text: '"What function has this as its derivative?"' },
    { type: 'paragraph', text: 'If $F\'(x) = f(x)$, we say $F$ is an **antiderivative** of $f$.' },
    { type: 'paragraph', text: 'For example: the derivative of $x^2$ is $2x$. So $x^2$ is an antiderivative of $2x$.' },
    { type: 'paragraph', text: 'But wait: $x^2 + 5$ also has derivative $2x$. And so does $x^2 - 100$. Any constant disappears when you differentiate!' },
    { type: 'paragraph', text: 'That\'s why we always write:' },
    { type: 'display-math', latex: '\\int 2x \\, dx = x^2 + C' },
    { type: 'paragraph', text: 'The $+C$ represents the **constant of integration** — we don\'t know which constant was lost during differentiation.' },

    // --- Worked example ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Worked example: \u222B x\u00B2 dx' },
    { type: 'paragraph', text: 'The most common rule is the **power rule** for integration:' },
    { type: 'display-math', latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)' },
    { type: 'paragraph', text: 'Raise the exponent by 1, then divide by the new exponent.' },

    { type: 'heading', level: 3, text: 'Step 1: Apply the power rule' },
    { type: 'paragraph', text: 'We have $n = 2$:' },
    { type: 'display-math', latex: '\\int x^2 \\, dx = \\frac{x^{2+1}}{2+1} + C = \\frac{x^3}{3} + C' },

    { type: 'heading', level: 3, text: 'Step 2: Verify' },
    { type: 'paragraph', text: 'Differentiate the answer to check:' },
    { type: 'display-math', latex: '\\frac{d}{dx}\\left(\\frac{x^3}{3} + C\\right) = \\frac{3x^2}{3} = x^2 \\; \\checkmark' },

    { type: 'callout', text: 'Integration is the reverse of differentiation. To check an integral, just differentiate the result.' },

    // --- The Fundamental Theorem ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The Fundamental Theorem of Calculus' },
    { type: 'paragraph', text: 'Here\'s the big connection. Antiderivatives let us compute **exact areas**:' },
    { type: 'display-math', latex: '\\int_a^b f(x) \\, dx = F(b) - F(a)' },
    { type: 'paragraph', text: 'where $F$ is any antiderivative of $f$ (that is, $F\' = f$).' },
    { type: 'paragraph', text: 'Instead of summing infinitely many rectangles, we just evaluate $F$ at the endpoints and subtract!' },
    { type: 'graph', id: 'antiderivative-graph' },
    { type: 'paragraph', text: 'Let\'s verify with our example. We found $\\int x^2 \\, dx = \\frac{x^3}{3} + C$. So:' },
    { type: 'display-math', latex: '\\int_0^2 x^2 \\, dx = \\frac{2^3}{3} - \\frac{0^3}{3} = \\frac{8}{3} - 0 = \\frac{8}{3}' },
    { type: 'paragraph', text: 'Exactly what the Riemann sums converged to!' },

    // --- Why integrals matter ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Why integrals matter' },
    { type: 'paragraph', text: 'Integrals show up everywhere. Whenever you need to **accumulate** a quantity, there\'s an integral.' },

    { type: 'heading', level: 3, text: 'Physics: displacement from velocity' },
    { type: 'paragraph', text: 'If $v(t)$ is velocity, the displacement is:' },
    { type: 'display-math', latex: '\\Delta s = \\int_a^b v(t) \\, dt' },

    { type: 'heading', level: 3, text: 'Geometry: areas and volumes' },
    { type: 'paragraph', text: 'The area between curves, the volume of a solid of revolution — all computed with integrals.' },

    { type: 'heading', level: 3, text: 'Probability: total probability' },
    { type: 'paragraph', text: 'For a continuous random variable with density $f$:' },
    { type: 'display-math', latex: '\\int_{-\\infty}^{\\infty} f(x) \\, dx = 1' },

    // --- Closing ---
    { type: 'divider' },
    { type: 'paragraph', text: 'You already knew derivatives. Now you know that the integral goes in the opposite direction — and that it measures area.' },
    { type: 'callout', text: '**The integral is the limit of a sum. It undoes the derivative.**' },
    { type: 'paragraph', text: 'Now it\'s time to practice computing integrals.' },
];

export const integraisIntroSections: LearnSection[] = [
    // --- De derivadas a integrais ---
    { type: 'heading', level: 2, text: 'De derivadas a integrais' },
    { type: 'paragraph', text: 'Voc\u00ea aprendeu a ir de uma fun\u00e7\u00e3o para a sua derivada: dado $f$, encontrar $f\'$.' },
    { type: 'paragraph', text: 'Agora vamos ao **contr\u00e1rio**: dada a taxa de varia\u00e7\u00e3o, recuperar a fun\u00e7\u00e3o original.' },
    { type: 'paragraph', text: 'E de b\u00f4nus, respondemos uma pergunta que parece completamente diferente:' },
    { type: 'blockquote', text: '"Como calcular a \u00e1rea sob uma curva?"' },
    { type: 'paragraph', text: 'Incrivelmente, as duas perguntas t\u00eam a **mesma resposta**. Essa conex\u00e3o \u00e9 o cora\u00e7\u00e3o do C\u00e1lculo.' },

    // --- O problema da \u00e1rea ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O problema da \u00e1rea' },
    { type: 'paragraph', text: 'Como calcular a \u00e1rea sob $f(x) = x^2$ de $x = 0$ at\u00e9 $x = 2$?' },
    { type: 'graph', id: 'area-under-curve' },
    { type: 'paragraph', text: 'N\u00e3o \u00e9 um ret\u00e2ngulo, n\u00e3o \u00e9 um tri\u00e2ngulo, n\u00e3o \u00e9 nenhuma forma com f\u00f3rmula simples. A borda \u00e9 uma **curva**.' },
    { type: 'paragraph', text: 'Ent\u00e3o como resolvemos isso? Com um truque esperto: aproximar a curva com formas que a gente **conhece**.' },

    // --- Ret\u00e2ngulos ao resgate ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Ret\u00e2ngulos ao resgate' },
    { type: 'paragraph', text: 'A gente sabe calcular a \u00e1rea de um ret\u00e2ngulo: **base $\\times$ altura**. Ent\u00e3o vamos preencher a regi\u00e3o com ret\u00e2ngulos.' },
    { type: 'paragraph', text: 'Divida $[0, 2]$ em $4$ partes iguais. Cada parte tem largura:' },
    { type: 'display-math', latex: '\\Delta x = \\frac{2 - 0}{4} = 0{,}5' },
    { type: 'paragraph', text: 'Em cada parte, desenhe um ret\u00e2ngulo cuja altura \u00e9 o valor da fun\u00e7\u00e3o no **ponto esquerdo** \u2014 o valor de $x$ onde aquela parte come\u00e7a. A \u00e1rea de cada ret\u00e2ngulo \u00e9 $f(x_i) \\cdot \\Delta x$:' },
    {
        type: 'table',
        headers: ['Ret\u00e2ngulo', 'Ponto esquerdo $x_i$', 'Altura $f(x_i) = x_i^2$', '\u00c1rea $= f(x_i) \\cdot \\Delta x$'],
        rows: [
            ['1\u00ba', '$0$', '$0$', '$0 \\times 0{,}5 = 0$'],
            ['2\u00ba', '$0{,}5$', '$0{,}25$', '$0{,}25 \\times 0{,}5 = 0{,}125$'],
            ['3\u00ba', '$1$', '$1$', '$1 \\times 0{,}5 = 0{,}5$'],
            ['4\u00ba', '$1{,}5$', '$2{,}25$', '$2{,}25 \\times 0{,}5 = 1{,}125$'],
        ],
    },
    { type: 'paragraph', text: '\u00c1rea total dos 4 ret\u00e2ngulos:' },
    { type: 'display-math', latex: '0 + 0{,}125 + 0{,}5 + 1{,}125 = 1{,}75' },
    { type: 'paragraph', text: 'A \u00e1rea exata \u00e9 $\\frac{8}{3} \\approx 2{,}667$, ent\u00e3o $1{,}75$ \u00e9 uma estimativa grosseira. Os ret\u00e2ngulos **subestimam** porque perdem o peda\u00e7o curvo acima deles.' },
    { type: 'paragraph', text: 'D\u00e1 pra melhorar? Sim \u2014 use **mais** ret\u00e2ngulos. Quanto mais finos, menos curva eles perdem.' },

    // --- Mais ret\u00e2ngulos, melhor resposta ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Mais ret\u00e2ngulos, melhor resposta' },
    { type: 'paragraph', text: 'Veja o que acontece quando passamos de 4 para 10 e depois 30 ret\u00e2ngulos:' },
    { type: 'graph', id: 'riemann-triptych' },
    { type: 'paragraph', text: 'A lacuna entre o topo dos ret\u00e2ngulos e a curva **diminui**. A soma se aproxima da \u00e1rea real:' },
    {
        type: 'table',
        headers: ['Ret\u00e2ngulos ($n$)', 'Largura ($\\Delta x$)', 'Soma', 'Erro'],
        rows: [
            ['$4$', '$0{,}5$', '$1{,}75$', '$0{,}917$'],
            ['$10$', '$0{,}2$', '$2{,}28$', '$0{,}387$'],
            ['$30$', '$0{,}0\\overline{6}$', '$2{,}577$', '$0{,}090$'],
            ['$100$', '$0{,}02$', '$2{,}627$', '$0{,}040$'],
            ['$\\to \\infty$', '$\\to 0$', '$\\to 2{,}\\overline{6}$', '$\\to 0$'],
        ],
    },
    { type: 'paragraph', text: 'Conforme $n$ cresce, $\\Delta x$ encolhe, os ret\u00e2ngulos ficam mais finos, e a soma converge para $\\frac{8}{3}$.' },

    // --- A soma de Riemann ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A soma de Riemann' },
    { type: 'paragraph', text: 'Vamos escrever o que acabamos de fazer numa f\u00f3rmula geral. Com $n$ ret\u00e2ngulos em $[0, 2]$:' },
    { type: 'paragraph', text: '**Largura** de cada ret\u00e2ngulo:' },
    { type: 'display-math', latex: '\\Delta x = \\frac{2 - 0}{n}' },
    { type: 'paragraph', text: '**Pontos esquerdos**:' },
    { type: 'display-math', latex: 'x_i = 0 + i \\cdot \\Delta x \\qquad (i = 0, 1, 2, \\ldots, n-1)' },
    { type: 'paragraph', text: '**\u00c1rea total** de todos os ret\u00e2ngulos:' },
    { type: 'display-math', latex: '\\text{\u00e1rea} \\approx \\sum_{i=0}^{n-1} f(x_i) \\cdot \\Delta x = \\sum_{i=0}^{n-1} x_i^2 \\cdot \\Delta x' },
    { type: 'paragraph', text: 'Isso se chama **soma de Riemann**: a soma de (altura $\\times$ largura) de cada ret\u00e2ngulo.' },
    { type: 'mascot-tip', image: 'thinkingcurious', text: 'Cada termo $f(x_i) \\cdot \\Delta x$ \u00e9 s\u00f3 a \u00e1rea de um ret\u00e2ngulo fininho. O $\\Sigma$ soma todos. Nada mais!' },

    // --- Da soma pra integral ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Da soma pra integral' },
    { type: 'paragraph', text: 'A aproxima\u00e7\u00e3o melhora conforme $n$ cresce. A \u00e1rea **exata** \u00e9 o limite:' },
    { type: 'display-math', latex: '\\text{\u00e1rea} = \\lim_{n \\to \\infty} \\sum_{i=0}^{n-1} f(x_i) \\, \\Delta x' },
    { type: 'paragraph', text: 'Esse limite aparece tanto na matem\u00e1tica que ganhou um s\u00edmbolo pr\u00f3prio. Aqui vai a tradu\u00e7\u00e3o, pe\u00e7a por pe\u00e7a:' },
    {
        type: 'table',
        headers: ['Soma de Riemann', '', 'Nota\u00e7\u00e3o de integral'],
        rows: [
            ['$\\displaystyle\\sum$  (soma todas as partes)', '$\\to$', '$\\displaystyle\\int$  ("S" alongado de "soma")'],
            ['$f(x_i)$  (altura do ret\u00e2ngulo)', '$\\to$', '$f(x)$  (a fun\u00e7\u00e3o)'],
            ['$\\Delta x$  (largura do ret\u00e2ngulo)', '$\\to$', '$dx$  (largura infinitamente fina)'],
            ['$i = 0 \\ldots n{-}1$  (do in\u00edcio ao fim)', '$\\to$', '$a$ at\u00e9 $b$  (limites de integra\u00e7\u00e3o)'],
        ],
    },
    { type: 'paragraph', text: 'Juntando tudo:' },
    { type: 'display-math', latex: '\\underbrace{\\sum_{i=0}^{n-1} f(x_i)\\,\\Delta x}_{\\text{soma de Riemann}} \\;\\xrightarrow{\\;n \\to \\infty\\;}\\; \\underbrace{\\int_0^2 x^2 \\, dx}_{\\text{integral definida}}' },
    { type: 'paragraph', text: 'Pro nosso exemplo:' },
    { type: 'display-math', latex: '\\int_0^2 x^2 \\, dx = \\frac{8}{3}' },
    { type: 'mascot-tip', image: 'pointing', text: 'O $dx$ n\u00e3o \u00e9 enfeite! \u00c9 o fantasma do $\\Delta x$ \u2014 a largura de cada ret\u00e2ngulo depois que ela fica infinitamente fina. O sinal $\\int$ \u00e9 o fantasma do $\\Sigma$ \u2014 a soma depois que ela tem infinitos termos.' },

    // --- A antiderivada ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A antiderivada' },
    { type: 'paragraph', text: 'Aqui vai a outra perspectiva. Se a derivada responde "qual \u00e9 a taxa de varia\u00e7\u00e3o?", a antiderivada responde:' },
    { type: 'blockquote', text: '"Que fun\u00e7\u00e3o tem isso como derivada?"' },
    { type: 'paragraph', text: 'Se $F\'(x) = f(x)$, dizemos que $F$ \u00e9 uma **antiderivada** de $f$.' },
    { type: 'paragraph', text: 'Por exemplo: a derivada de $x^2$ \u00e9 $2x$. Logo, $x^2$ \u00e9 uma antiderivada de $2x$.' },
    { type: 'paragraph', text: 'Mas espere: $x^2 + 5$ tamb\u00e9m tem derivada $2x$. E $x^2 - 100$ tamb\u00e9m. Qualquer constante some ao derivar!' },
    { type: 'paragraph', text: 'Por isso sempre escrevemos:' },
    { type: 'display-math', latex: '\\int 2x \\, dx = x^2 + C' },
    { type: 'paragraph', text: 'O $+C$ representa a **constante de integra\u00e7\u00e3o** \u2014 n\u00e3o sabemos qual constante se perdeu durante a diferencia\u00e7\u00e3o.' },

    // --- Exemplo resolvido ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Exemplo resolvido: \u222B x\u00B2 dx' },
    { type: 'paragraph', text: 'A regra mais comum \u00e9 a **regra da pot\u00eancia** para integra\u00e7\u00e3o:' },
    { type: 'display-math', latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)' },
    { type: 'paragraph', text: 'Aumente o expoente em 1, depois divida pelo novo expoente.' },

    { type: 'heading', level: 3, text: 'Passo 1: Aplicar a regra da pot\u00eancia' },
    { type: 'paragraph', text: 'Temos $n = 2$:' },
    { type: 'display-math', latex: '\\int x^2 \\, dx = \\frac{x^{2+1}}{2+1} + C = \\frac{x^3}{3} + C' },

    { type: 'heading', level: 3, text: 'Passo 2: Verificar' },
    { type: 'paragraph', text: 'Derive o resultado para conferir:' },
    { type: 'display-math', latex: '\\frac{d}{dx}\\left(\\frac{x^3}{3} + C\\right) = \\frac{3x^2}{3} = x^2 \\; \\checkmark' },

    { type: 'callout', text: 'Integra\u00e7\u00e3o \u00e9 o inverso da diferencia\u00e7\u00e3o. Para conferir uma integral, basta derivar o resultado.' },

    // --- O Teorema Fundamental ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O Teorema Fundamental do C\u00e1lculo' },
    { type: 'paragraph', text: 'Aqui est\u00e1 a grande conex\u00e3o. Antiderivadas permitem calcular **\u00e1reas exatas**:' },
    { type: 'display-math', latex: '\\int_a^b f(x) \\, dx = F(b) - F(a)' },
    { type: 'paragraph', text: 'onde $F$ \u00e9 qualquer antiderivada de $f$ (ou seja, $F\' = f$).' },
    { type: 'paragraph', text: 'Em vez de somar infinitos ret\u00e2ngulos, basta avaliar $F$ nos extremos e subtrair!' },
    { type: 'graph', id: 'antiderivative-graph' },
    { type: 'paragraph', text: 'Vamos conferir com nosso exemplo. Encontramos $\\int x^2 \\, dx = \\frac{x^3}{3} + C$. Logo:' },
    { type: 'display-math', latex: '\\int_0^2 x^2 \\, dx = \\frac{2^3}{3} - \\frac{0^3}{3} = \\frac{8}{3} - 0 = \\frac{8}{3}' },
    { type: 'paragraph', text: 'Exatamente o valor para o qual as somas de Riemann convergiram!' },

    // --- Por que integrais importam ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Por que integrais importam' },
    { type: 'paragraph', text: 'Integrais aparecem em toda parte. Sempre que voc\u00ea precisa **acumular** uma grandeza, tem uma integral.' },

    { type: 'heading', level: 3, text: 'F\u00edsica: deslocamento a partir da velocidade' },
    { type: 'paragraph', text: 'Se $v(t)$ \u00e9 a velocidade, o deslocamento \u00e9:' },
    { type: 'display-math', latex: '\\Delta s = \\int_a^b v(t) \\, dt' },

    { type: 'heading', level: 3, text: 'Geometria: \u00e1reas e volumes' },
    { type: 'paragraph', text: 'A \u00e1rea entre curvas, o volume de um s\u00f3lido de revolu\u00e7\u00e3o \u2014 tudo calculado com integrais.' },

    { type: 'heading', level: 3, text: 'Probabilidade: probabilidade total' },
    { type: 'paragraph', text: 'Para uma vari\u00e1vel aleat\u00f3ria cont\u00ednua com densidade $f$:' },
    { type: 'display-math', latex: '\\int_{-\\infty}^{\\infty} f(x) \\, dx = 1' },

    // --- Fechamento ---
    { type: 'divider' },
    { type: 'paragraph', text: 'Voc\u00ea j\u00e1 conhecia derivadas. Agora sabe que a integral vai na dire\u00e7\u00e3o oposta \u2014 e que ela mede \u00e1rea.' },
    { type: 'callout', text: '**A integral \u00e9 o limite de uma soma. Ela desfaz a derivada.**' },
    { type: 'paragraph', text: 'Agora \u00e9 hora de praticar o c\u00e1lculo de integrais.' },
];
