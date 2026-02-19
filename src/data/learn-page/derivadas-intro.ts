import type { LearnSection } from './limites-intro';

export const derivadasIntroSectionsEn: LearnSection[] = [
    // --- From limits to derivatives ---
    { type: 'heading', level: 2, text: 'From limits to derivatives' },
    { type: 'paragraph', text: 'You already know what a limit is: it measures where a function is **heading**.' },
    { type: 'paragraph', text: 'Now we use that idea to answer a deeper question:' },
    { type: 'blockquote', text: '"How fast is a function changing at a single instant?"' },
    { type: 'paragraph', text: 'This is the central question of Calculus. And the answer is called the **derivative**.' },

    // --- The speedometer problem ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The speedometer problem' },
    { type: 'paragraph', text: 'Imagine you drive from home to the store, 100 km in 2 hours.' },
    { type: 'paragraph', text: 'Your **average speed** is:' },
    { type: 'display-math', latex: '\\text{average speed} = \\frac{\\Delta \\text{distance}}{\\Delta \\text{time}} = \\frac{100}{2} = 50\\;\\text{km/h}' },
    { type: 'paragraph', text: 'But your speedometer doesn\'t show 50 the whole time. At some point you were going 80, at another you were stopped at a red light.' },
    { type: 'paragraph', text: 'The average tells you the **overall trend**. The speedometer tells you the **instantaneous speed** — the rate of change at a single moment.' },
    { type: 'paragraph', text: 'How do we compute that? We use a limit.' },

    // --- Secant lines ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Secant lines' },
    { type: 'paragraph', text: 'Let\'s make this concrete. Consider:' },
    { type: 'display-math', latex: 'f(x) = x^2' },
    { type: 'paragraph', text: 'We want to find the "speed" of this function at $x = 1$, where $f(1) = 1$.' },
    { type: 'paragraph', text: 'Here\'s the problem: to compute a slope, you need **two points**. But we care about a single point, $x = 1$.' },
    { type: 'paragraph', text: 'Solution: pick a second point **close** to $x = 1$ and compute the slope between them. How close? We don\'t know yet — so we call that small gap **$h$**.' },
    { type: 'mascot-tip', image: 'pointing', text: 'Think of **$h$** as an error — it\'s the distance between the point we care about ($x = 1$) and a nearby point ($x = 1 + h$). The whole trick of the derivative is to make this error **shrink to zero** and see what happens to the slope.' },
    { type: 'paragraph', text: '$h$ is just a number — a small distance. It could be $1$, or $0.5$, or $0.001$. The second point sits at $x = 1 + h$, meaning "our point ($1$) plus the gap ($h$)".' },
    { type: 'paragraph', text: 'At that second point, the function value is $f(1 + h) = (1 + h)^2$.' },
    { type: 'paragraph', text: 'The line through these two points is called a **secant line**, and its slope is the average rate of change:' },
    { type: 'display-math', latex: '\\text{slope} = \\frac{f(1 + h) - f(1)}{h} = \\frac{(1 + h)^2 - 1}{h}' },
    { type: 'paragraph', text: 'Notice: the numerator is "how much $f$ changed" and the denominator is "how far apart the points are" — exactly $h$.' },
    { type: 'graph', id: 'secant-to-tangent' },
    { type: 'paragraph', text: 'What happens as $h$ gets smaller?' },
    {
        type: 'table',
        headers: ['$h$', '$1 + h$', '$(1+h)^2$', 'Slope'],
        rows: [
            ['$1$', '$2$', '$4$', '$3$'],
            ['$0.5$', '$1.5$', '$2.25$', '$2.5$'],
            ['$0.1$', '$1.1$', '$1.21$', '$2.1$'],
            ['$0.01$', '$1.01$', '$1.0201$', '$2.01$'],
            ['$0.001$', '$1.001$', '$1.002001$', '$2.001$'],
        ],
    },
    { type: 'paragraph', text: 'The slopes are heading towards **2**.' },

    // --- Secant triptych ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Watching the secant approach' },
    { type: 'paragraph', text: 'As $h$ shrinks, the secant line rotates and gets closer to **touching** the curve at a single point:' },
    { type: 'graph', id: 'secant-triptych' },
    { type: 'paragraph', text: 'The secant is becoming the **tangent line** — the line that just touches the curve at $x = 1$.' },

    // --- The tangent line ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The tangent line' },
    { type: 'paragraph', text: 'When $h \\to 0$, the secant becomes the tangent. Its slope is:' },
    { type: 'display-math', latex: '\\lim_{h \\to 0} \\frac{(1+h)^2 - 1}{h} = \\lim_{h \\to 0} \\frac{2h + h^2}{h} = \\lim_{h \\to 0}(2 + h) = 2' },
    { type: 'paragraph', text: 'The tangent line at $x = 1$ has slope **2**. This is the derivative of $f(x) = x^2$ at $x = 1$.' },
    { type: 'graph', id: 'tangent-line' },
    { type: 'paragraph', text: 'The tangent line is $y = 2x - 1$. It touches the parabola at exactly one point and gives us the instantaneous rate of change.' },

    // --- The formal definition ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The formal definition' },
    { type: 'paragraph', text: 'The derivative of $f$ at a point $x$ is defined as:' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
    { type: 'paragraph', text: 'Let\'s break down each piece:' },
    {
        type: 'table',
        headers: ['Symbol', 'Meaning'],
        rows: [
            ["$f'(x)$", '"the derivative of $f$ at $x$"'],
            ['$\\lim_{h \\to 0}$', '"the limit as $h$ approaches 0"'],
            ['$f(x+h) - f(x)$', '"the change in the function"'],
            ['$h$', '"the change in the input"'],
            ['$\\frac{f(x+h) - f(x)}{h}$', '"the average rate of change over an interval $h$"'],
        ],
    },
    { type: 'paragraph', text: 'The derivative is the **limit of the average rate of change** as the interval shrinks to zero.' },

    // --- Worked example ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Worked example: f(x) = x\u00B2' },
    { type: 'paragraph', text: 'Let\'s compute $f\'(x)$ for any $x$, not just $x = 1$.' },

    { type: 'heading', level: 3, text: 'Step 1: Set up the difference quotient' },
    { type: 'display-math', latex: '\\frac{f(x+h) - f(x)}{h} = \\frac{(x+h)^2 - x^2}{h}' },

    { type: 'heading', level: 3, text: 'Step 2: Expand' },
    { type: 'display-math', latex: '= \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}' },

    { type: 'heading', level: 3, text: 'Step 3: Simplify' },
    { type: 'display-math', latex: '= 2x + h' },

    { type: 'heading', level: 3, text: 'Step 4: Take the limit' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} (2x + h) = 2x" },

    { type: 'callout', text: 'If $f(x) = x^2$, then $f\'(x) = 2x$. The derivative of $x^2$ is $2x$.' },

    // --- What the derivative tells us ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'What the derivative tells us' },
    { type: 'paragraph', text: 'The sign of $f\'(x)$ reveals the behavior of $f$:' },
    {
        type: 'table',
        headers: ["$f'(x)$", 'Meaning', 'Graph'],
        rows: [
            ["$f'(x) > 0$", '$f$ is **increasing**', 'Curve goes up ↗'],
            ["$f'(x) < 0$", '$f$ is **decreasing**', 'Curve goes down ↘'],
            ["$f'(x) = 0$", '$f$ has a **stationary point**', 'Curve is flat →'],
        ],
    },
    { type: 'paragraph', text: 'For $f(x) = x^2$ with $f\'(x) = 2x$:' },
    { type: 'paragraph', text: 'When $x < 0$: $f\'(x) < 0$ — the parabola is **decreasing**.' },
    { type: 'paragraph', text: 'When $x = 0$: $f\'(x) = 0$ — the parabola has its **minimum**.' },
    { type: 'paragraph', text: 'When $x > 0$: $f\'(x) > 0$ — the parabola is **increasing**.' },

    // --- The derivative as a function ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'The derivative as a function' },
    { type: 'paragraph', text: 'The derivative itself is a new function. For every input $x$, $f\'(x)$ tells you the slope of $f$ at that point.' },
    {
        type: 'table',
        headers: ['$x$', '$f(x) = x^2$', "$f'(x) = 2x$"],
        rows: [
            ['$-2$', '$4$', '$-4$'],
            ['$-1$', '$1$', '$-2$'],
            ['$0$', '$0$', '$0$'],
            ['$1$', '$1$', '$2$'],
            ['$2$', '$4$', '$4$'],
        ],
    },
    { type: 'graph', id: 'derivative-function' },
    { type: 'paragraph', text: 'Left: the original function $f(x) = x^2$ (parabola). Right: the derivative $f\'(x) = 2x$ (straight line).' },
    { type: 'paragraph', text: 'Notice: where the parabola is flat ($x = 0$), the derivative crosses zero. Where the parabola is steep, the derivative is far from zero.' },

    // --- Notations ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Notations' },
    { type: 'paragraph', text: 'The derivative has several equivalent notations, each useful in different contexts:' },
    {
        type: 'table',
        headers: ['Notation', 'Name', 'When used'],
        rows: [
            ["$f'(x)$", '**Lagrange**', 'Most common in textbooks'],
            ['$\\dfrac{df}{dx}$', '**Leibniz**', 'Emphasizes "rate of change of $f$ with respect to $x$"'],
            ['$\\dot{y}$', '**Newton**', 'Physics (when the variable is time)'],
        ],
    },
    { type: 'paragraph', text: 'They all mean the same thing: the instantaneous rate of change of the function.' },

    // --- Why derivatives matter ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Why derivatives matter' },
    { type: 'paragraph', text: 'Derivatives are everywhere. They are the mathematical language for **change**.' },

    { type: 'heading', level: 3, text: 'Physics: velocity and acceleration' },
    { type: 'paragraph', text: 'If $s(t)$ is position, then $s\'(t)$ is velocity and $s\'\'(t)$ is acceleration.' },
    { type: 'display-math', latex: "v(t) = s'(t), \\qquad a(t) = v'(t) = s''(t)" },

    { type: 'heading', level: 3, text: 'Optimization: maxima and minima' },
    { type: 'paragraph', text: 'To find the maximum or minimum of a function, we set $f\'(x) = 0$ and solve. This is how engineers, economists, and data scientists find the best solutions.' },

    { type: 'heading', level: 3, text: 'Economics: marginal cost' },
    { type: 'paragraph', text: 'If $C(q)$ is the cost of producing $q$ units, then $C\'(q)$ is the **marginal cost** — how much one extra unit costs.' },

    // --- Closing ---
    { type: 'divider' },
    { type: 'paragraph', text: 'You already understood limits. Now you know that the derivative is just a limit applied to measure change.' },
    { type: 'callout', text: '**The derivative is the limit of the difference quotient. It measures instantaneous change.**' },
    { type: 'paragraph', text: 'Now it\'s time to practice computing derivatives.' },
];

export const derivadasIntroSections: LearnSection[] = [
    // --- De limites a derivadas ---
    { type: 'heading', level: 2, text: 'De limites a derivadas' },
    { type: 'paragraph', text: 'Voc\u00ea j\u00e1 sabe o que \u00e9 um limite: ele mede pra onde uma fun\u00e7\u00e3o est\u00e1 **indo**.' },
    { type: 'paragraph', text: 'Agora vamos usar essa ideia pra responder uma pergunta mais profunda:' },
    { type: 'blockquote', text: '"Qu\u00e3o r\u00e1pido uma fun\u00e7\u00e3o est\u00e1 mudando em um \u00fanico instante?"' },
    { type: 'paragraph', text: 'Essa \u00e9 a pergunta central do C\u00e1lculo. E a resposta se chama **derivada**.' },

    // --- O problema do veloc\u00edmetro ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O problema do veloc\u00edmetro' },
    { type: 'paragraph', text: 'Imagine que voc\u00ea dirige de casa at\u00e9 a loja, 100 km em 2 horas.' },
    { type: 'paragraph', text: 'Sua **velocidade m\u00e9dia** \u00e9:' },
    { type: 'display-math', latex: '\\text{velocidade m\u00e9dia} = \\frac{\\Delta \\text{dist\u00e2ncia}}{\\Delta \\text{tempo}} = \\frac{100}{2} = 50\\;\\text{km/h}' },
    { type: 'paragraph', text: 'Mas o veloc\u00edmetro n\u00e3o mostra 50 o tempo todo. Em algum momento voc\u00ea estava a 80, em outro estava parado no sem\u00e1foro.' },
    { type: 'paragraph', text: 'A m\u00e9dia te d\u00e1 a **tend\u00eancia geral**. O veloc\u00edmetro te d\u00e1 a **velocidade instant\u00e2nea** \u2014 a taxa de mudan\u00e7a em um \u00fanico instante.' },
    { type: 'paragraph', text: 'Como calcular isso? Usamos um limite.' },

    // --- Retas secantes ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Retas secantes' },
    { type: 'paragraph', text: 'Vamos tornar isso concreto. Considere:' },
    { type: 'display-math', latex: 'f(x) = x^2' },
    { type: 'paragraph', text: 'Queremos encontrar a "velocidade" dessa fun\u00e7\u00e3o em $x = 1$, onde $f(1) = 1$.' },
    { type: 'paragraph', text: 'Aqui est\u00e1 o problema: pra calcular uma inclina\u00e7\u00e3o, voc\u00ea precisa de **dois pontos**. Mas a gente s\u00f3 se importa com um \u00fanico ponto, $x = 1$.' },
    { type: 'paragraph', text: 'Solu\u00e7\u00e3o: escolher um segundo ponto **perto** de $x = 1$ e calcular a inclina\u00e7\u00e3o entre eles. Qu\u00e3o perto? A gente ainda n\u00e3o sabe \u2014 ent\u00e3o chamamos essa pequena dist\u00e2ncia de **$h$**.' },
    { type: 'mascot-tip', image: 'pointing', text: 'Pense no **$h$** como um erro \u2014 \u00e9 a dist\u00e2ncia entre o ponto que a gente quer ($x = 1$) e um ponto vizinho ($x = 1 + h$). O truque inteiro da derivada \u00e9 fazer esse erro **encolher at\u00e9 zero** e ver o que acontece com a inclina\u00e7\u00e3o.' },
    { type: 'paragraph', text: '$h$ \u00e9 s\u00f3 um n\u00famero \u2014 uma dist\u00e2ncia pequena. Pode ser $1$, ou $0{,}5$, ou $0{,}001$. O segundo ponto fica em $x = 1 + h$, ou seja, "nosso ponto ($1$) mais a dist\u00e2ncia ($h$)".' },
    { type: 'paragraph', text: 'Nesse segundo ponto, o valor da fun\u00e7\u00e3o \u00e9 $f(1 + h) = (1 + h)^2$.' },
    { type: 'paragraph', text: 'A reta que passa por esses dois pontos \u00e9 chamada de **reta secante**, e sua inclina\u00e7\u00e3o \u00e9 a taxa m\u00e9dia de varia\u00e7\u00e3o:' },
    { type: 'display-math', latex: '\\text{inclina\u00e7\u00e3o} = \\frac{f(1 + h) - f(1)}{h} = \\frac{(1 + h)^2 - 1}{h}' },
    { type: 'paragraph', text: 'Repare: o numerador \u00e9 "o quanto $f$ variou" e o denominador \u00e9 "a dist\u00e2ncia entre os pontos" \u2014 exatamente $h$.' },
    { type: 'graph', id: 'secant-to-tangent' },
    { type: 'paragraph', text: 'O que acontece quando $h$ fica menor?' },
    {
        type: 'table',
        headers: ['$h$', '$1 + h$', '$(1+h)^2$', 'Inclina\u00e7\u00e3o'],
        rows: [
            ['$1$', '$2$', '$4$', '$3$'],
            ['$0{,}5$', '$1{,}5$', '$2{,}25$', '$2{,}5$'],
            ['$0{,}1$', '$1{,}1$', '$1{,}21$', '$2{,}1$'],
            ['$0{,}01$', '$1{,}01$', '$1{,}0201$', '$2{,}01$'],
            ['$0{,}001$', '$1{,}001$', '$1{,}002001$', '$2{,}001$'],
        ],
    },
    { type: 'paragraph', text: 'As inclina\u00e7\u00f5es est\u00e3o indo pra **2**.' },

    // --- Tr\u00edptico de secantes ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Vendo a secante se aproximar' },
    { type: 'paragraph', text: 'Conforme $h$ diminui, a reta secante gira e fica mais pr\u00f3xima de **tocar** a curva em um \u00fanico ponto:' },
    { type: 'graph', id: 'secant-triptych' },
    { type: 'paragraph', text: 'A secante est\u00e1 se tornando a **reta tangente** \u2014 a reta que apenas toca a curva em $x = 1$.' },

    // --- A reta tangente ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A reta tangente' },
    { type: 'paragraph', text: 'Quando $h \\to 0$, a secante se torna a tangente. Sua inclina\u00e7\u00e3o \u00e9:' },
    { type: 'display-math', latex: '\\lim_{h \\to 0} \\frac{(1+h)^2 - 1}{h} = \\lim_{h \\to 0} \\frac{2h + h^2}{h} = \\lim_{h \\to 0}(2 + h) = 2' },
    { type: 'paragraph', text: 'A reta tangente em $x = 1$ tem inclina\u00e7\u00e3o **2**. Essa \u00e9 a derivada de $f(x) = x^2$ em $x = 1$.' },
    { type: 'graph', id: 'tangent-line' },
    { type: 'paragraph', text: 'A reta tangente \u00e9 $y = 2x - 1$. Ela toca a par\u00e1bola em exatamente um ponto e nos d\u00e1 a taxa instant\u00e2nea de varia\u00e7\u00e3o.' },

    // --- A defini\u00e7\u00e3o formal ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A defini\u00e7\u00e3o formal' },
    { type: 'paragraph', text: 'A derivada de $f$ em um ponto $x$ \u00e9 definida como:' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
    { type: 'paragraph', text: 'Vamos traduzir cada pedaço:' },
    {
        type: 'table',
        headers: ['S\u00edmbolo', 'Significado'],
        rows: [
            ["$f'(x)$", '"a derivada de $f$ em $x$"'],
            ['$\\lim_{h \\to 0}$', '"o limite quando $h$ tende a 0"'],
            ['$f(x+h) - f(x)$', '"a varia\u00e7\u00e3o da fun\u00e7\u00e3o"'],
            ['$h$', '"a varia\u00e7\u00e3o da entrada"'],
            ['$\\frac{f(x+h) - f(x)}{h}$', '"a taxa m\u00e9dia de varia\u00e7\u00e3o num intervalo $h$"'],
        ],
    },
    { type: 'paragraph', text: 'A derivada \u00e9 o **limite da taxa m\u00e9dia de varia\u00e7\u00e3o** quando o intervalo encolhe at\u00e9 zero.' },

    // --- Exemplo resolvido ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Exemplo resolvido: f(x) = x\u00B2' },
    { type: 'paragraph', text: 'Vamos calcular $f\'(x)$ para qualquer $x$, n\u00e3o apenas $x = 1$.' },

    { type: 'heading', level: 3, text: 'Passo 1: Montar o quociente de diferen\u00e7as' },
    { type: 'display-math', latex: '\\frac{f(x+h) - f(x)}{h} = \\frac{(x+h)^2 - x^2}{h}' },

    { type: 'heading', level: 3, text: 'Passo 2: Expandir' },
    { type: 'display-math', latex: '= \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}' },

    { type: 'heading', level: 3, text: 'Passo 3: Simplificar' },
    { type: 'display-math', latex: '= 2x + h' },

    { type: 'heading', level: 3, text: 'Passo 4: Tomar o limite' },
    { type: 'display-math', latex: "f'(x) = \\lim_{h \\to 0} (2x + h) = 2x" },

    { type: 'callout', text: 'Se $f(x) = x^2$, ent\u00e3o $f\'(x) = 2x$. A derivada de $x^2$ \u00e9 $2x$.' },

    // --- O que a derivada nos diz ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'O que a derivada nos diz' },
    { type: 'paragraph', text: 'O sinal de $f\'(x)$ revela o comportamento de $f$:' },
    {
        type: 'table',
        headers: ["$f'(x)$", 'Significado', 'Gr\u00e1fico'],
        rows: [
            ["$f'(x) > 0$", '$f$ est\u00e1 **crescendo**', 'Curva sobe \u2197'],
            ["$f'(x) < 0$", '$f$ est\u00e1 **decrescendo**', 'Curva desce \u2198'],
            ["$f'(x) = 0$", '$f$ tem um **ponto estacion\u00e1rio**', 'Curva \u00e9 plana \u2192'],
        ],
    },
    { type: 'paragraph', text: 'Para $f(x) = x^2$ com $f\'(x) = 2x$:' },
    { type: 'paragraph', text: 'Quando $x < 0$: $f\'(x) < 0$ \u2014 a par\u00e1bola est\u00e1 **decrescendo**.' },
    { type: 'paragraph', text: 'Quando $x = 0$: $f\'(x) = 0$ \u2014 a par\u00e1bola tem seu **m\u00ednimo**.' },
    { type: 'paragraph', text: 'Quando $x > 0$: $f\'(x) > 0$ \u2014 a par\u00e1bola est\u00e1 **crescendo**.' },

    // --- A derivada como fun\u00e7\u00e3o ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'A derivada como fun\u00e7\u00e3o' },
    { type: 'paragraph', text: 'A derivada \u00e9 uma nova fun\u00e7\u00e3o. Para cada entrada $x$, $f\'(x)$ te diz a inclina\u00e7\u00e3o de $f$ naquele ponto.' },
    {
        type: 'table',
        headers: ['$x$', '$f(x) = x^2$', "$f'(x) = 2x$"],
        rows: [
            ['$-2$', '$4$', '$-4$'],
            ['$-1$', '$1$', '$-2$'],
            ['$0$', '$0$', '$0$'],
            ['$1$', '$1$', '$2$'],
            ['$2$', '$4$', '$4$'],
        ],
    },
    { type: 'graph', id: 'derivative-function' },
    { type: 'paragraph', text: 'Esquerda: a fun\u00e7\u00e3o original $f(x) = x^2$ (par\u00e1bola). Direita: a derivada $f\'(x) = 2x$ (reta).' },
    { type: 'paragraph', text: 'Repare: onde a par\u00e1bola \u00e9 plana ($x = 0$), a derivada cruza o zero. Onde a par\u00e1bola \u00e9 \u00edngreme, a derivada est\u00e1 longe do zero.' },

    // --- Nota\u00e7\u00f5es ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Nota\u00e7\u00f5es' },
    { type: 'paragraph', text: 'A derivada tem v\u00e1rias nota\u00e7\u00f5es equivalentes, cada uma \u00fatil em contextos diferentes:' },
    {
        type: 'table',
        headers: ['Nota\u00e7\u00e3o', 'Nome', 'Quando usar'],
        rows: [
            ["$f'(x)$", '**Lagrange**', 'Mais comum em livros-texto'],
            ['$\\dfrac{df}{dx}$', '**Leibniz**', 'Enfatiza "taxa de varia\u00e7\u00e3o de $f$ em rela\u00e7\u00e3o a $x$"'],
            ['$\\dot{y}$', '**Newton**', 'F\u00edsica (quando a vari\u00e1vel \u00e9 o tempo)'],
        ],
    },
    { type: 'paragraph', text: 'Todas significam a mesma coisa: a taxa instant\u00e2nea de varia\u00e7\u00e3o da fun\u00e7\u00e3o.' },

    // --- Por que derivadas importam ---
    { type: 'divider' },
    { type: 'heading', level: 2, text: 'Por que derivadas importam' },
    { type: 'paragraph', text: 'Derivadas est\u00e3o em toda parte. S\u00e3o a linguagem matem\u00e1tica para **mudan\u00e7a**.' },

    { type: 'heading', level: 3, text: 'F\u00edsica: velocidade e acelera\u00e7\u00e3o' },
    { type: 'paragraph', text: 'Se $s(t)$ \u00e9 a posi\u00e7\u00e3o, ent\u00e3o $s\'(t)$ \u00e9 a velocidade e $s\'\'(t)$ \u00e9 a acelera\u00e7\u00e3o.' },
    { type: 'display-math', latex: "v(t) = s'(t), \\qquad a(t) = v'(t) = s''(t)" },

    { type: 'heading', level: 3, text: 'Otimiza\u00e7\u00e3o: m\u00e1ximos e m\u00ednimos' },
    { type: 'paragraph', text: 'Para encontrar o m\u00e1ximo ou m\u00ednimo de uma fun\u00e7\u00e3o, fazemos $f\'(x) = 0$ e resolvemos. \u00c9 assim que engenheiros, economistas e cientistas de dados encontram as melhores solu\u00e7\u00f5es.' },

    { type: 'heading', level: 3, text: 'Economia: custo marginal' },
    { type: 'paragraph', text: 'Se $C(q)$ \u00e9 o custo de produzir $q$ unidades, ent\u00e3o $C\'(q)$ \u00e9 o **custo marginal** \u2014 quanto custa uma unidade a mais.' },

    // --- Fechamento ---
    { type: 'divider' },
    { type: 'paragraph', text: 'Voc\u00ea j\u00e1 entendia limites. Agora sabe que a derivada \u00e9 apenas um limite aplicado pra medir mudan\u00e7a.' },
    { type: 'callout', text: '**A derivada \u00e9 o limite do quociente de diferen\u00e7as. Ela mede a mudan\u00e7a instant\u00e2nea.**' },
    { type: 'paragraph', text: 'Agora \u00e9 hora de praticar o c\u00e1lculo de derivadas.' },
];
