export type TopicExplanation = {
    intuitionTitle: string;
    intuition: string;
    formulaLatex: string;
    proofTitle: string;
    proof: string;
    examples: Array<{
        problem: string;
        solution: string;
    }>;
};

export const explanations: Record<string, TopicExplanation> = {
    // =====================================================================
    // DERIVADAS
    // =====================================================================

    power_rule: {
        intuitionTitle: "A Intuição",
        intuition:
            "A regra da potência nos diz como a função $x^n$ muda quando $x$ muda um pouquinho. " +
            "Pense assim: se você tem $x^3$, isso é $x \\cdot x \\cdot x$. Ao derivar, cada um dos três fatores " +
            "\"tem sua vez\" de ser derivado enquanto os outros ficam parados — por isso aparece o fator $3$ na frente. " +
            "O expoente desce e diminui em um: simples e poderoso.",
        formulaLatex: "\\frac{d}{dx}\\left[x^n\\right] = n \\cdot x^{n-1}",
        proofTitle: "Por que funciona?",
        proof:
            "Pela definição de derivada, calculamos $\\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}$. " +
            "Expandindo $(x+h)^n$ pelo Binômio de Newton, o primeiro termo é $x^n$ (que cancela) e o segundo " +
            "é $n \\cdot x^{n-1} \\cdot h$. Ao dividir por $h$ e tomar o limite, todos os termos com $h$ " +
            "somem, restando exatamente $n \\cdot x^{n-1}$.",
        examples: [
            {
                problem: "Encontre a derivada de $f(x) = x^5$.",
                solution:
                    "Aplicando a regra da potência: $f'(x) = 5x^{5-1} = 5x^4$.",
            },
            {
                problem: "Derive $g(x) = 3x^4 - 2x^3 + 7x$.",
                solution:
                    "Derivando termo a termo: $g'(x) = 3 \\cdot 4x^3 - 2 \\cdot 3x^2 + 7 = 12x^3 - 6x^2 + 7$.",
            },
        ],
    },

    product_rule: {
        intuitionTitle: "A Intuição",
        intuition:
            "Quando duas quantidades que variam são multiplicadas, a variação total vem de duas contribuições: " +
            "a primeira função muda enquanto a segunda fica parada, e depois a segunda muda enquanto a primeira fica parada. " +
            "Imagine a área de um retângulo cujos lados $u$ e $v$ estão crescendo — o acréscimo de área vem tanto do " +
            "aumento na largura quanto do aumento na altura.",
        formulaLatex: "\\frac{d}{dx}\\left[u \\cdot v\\right] = u' \\cdot v + u \\cdot v'",
        proofTitle: "Por que funciona?",
        proof:
            "Partindo da definição, $\\frac{d}{dx}[u \\cdot v] = \\lim_{h \\to 0} \\frac{u(x+h)v(x+h) - u(x)v(x)}{h}$. " +
            "O truque é somar e subtrair $u(x+h)v(x)$ no numerador. Isso separa a expressão em " +
            "$u(x+h)\\frac{v(x+h)-v(x)}{h} + v(x)\\frac{u(x+h)-u(x)}{h}$. Tomando o limite, como $u$ " +
            "é contínua, obtemos $u \\cdot v' + v \\cdot u'$.",
        examples: [
            {
                problem: "Derive $f(x) = x^2 \\cdot \\sin(x)$.",
                solution:
                    "Sejam $u = x^2$ e $v = \\sin(x)$. Então $u' = 2x$ e $v' = \\cos(x)$. " +
                    "Pela regra do produto: $f'(x) = 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)$.",
            },
            {
                problem: "Derive $g(x) = e^x \\cdot \\ln(x)$.",
                solution:
                    "Com $u = e^x$ e $v = \\ln(x)$: $u' = e^x$, $v' = \\frac{1}{x}$. " +
                    "Logo $g'(x) = e^x \\cdot \\ln(x) + e^x \\cdot \\frac{1}{x} = e^x\\!\\left(\\ln(x) + \\frac{1}{x}\\right)$.",
            },
        ],
    },

    quotient_rule: {
        intuitionTitle: "A Intuição",
        intuition:
            "A regra do quociente trata de como a razão entre duas funções muda. " +
            "Quando o numerador cresce, a fração tende a crescer; quando o denominador cresce, a fração tende a diminuir. " +
            "A fórmula captura essa \"competição\" entre numerador e denominador, sempre dividindo pelo quadrado do denominador " +
            "para manter as unidades corretas.",
        formulaLatex:
            "\\frac{d}{dx}\\!\\left[\\frac{u}{v}\\right] = \\frac{u' \\cdot v - u \\cdot v'}{v^2}",
        proofTitle: "Por que funciona?",
        proof:
            "Podemos deduzir a regra do quociente a partir da regra do produto. Escrevemos $u = \\frac{u}{v} \\cdot v$ " +
            "e aplicamos a regra do produto: $u' = \\left(\\frac{u}{v}\\right)' \\cdot v + \\frac{u}{v} \\cdot v'$. " +
            "Isolando $\\left(\\frac{u}{v}\\right)'$, obtemos $\\frac{u' \\cdot v - u \\cdot v'}{v^2}$. " +
            "Note que o sinal de menos aparece naturalmente ao isolar o termo.",
        examples: [
            {
                problem: "Derive $f(x) = \\frac{x^2 + 1}{x - 3}$.",
                solution:
                    "Com $u = x^2 + 1$, $v = x - 3$: $u' = 2x$, $v' = 1$. " +
                    "Então $f'(x) = \\frac{2x(x-3) - (x^2+1)(1)}{(x-3)^2} = \\frac{x^2 - 6x - 1}{(x-3)^2}$.",
            },
            {
                problem: "Derive $g(x) = \\frac{\\sin(x)}{x}$.",
                solution:
                    "Com $u = \\sin(x)$ e $v = x$: $u' = \\cos(x)$, $v' = 1$. " +
                    "Logo $g'(x) = \\frac{\\cos(x) \\cdot x - \\sin(x) \\cdot 1}{x^2} = \\frac{x\\cos(x) - \\sin(x)}{x^2}$.",
            },
        ],
    },

    chain_rule: {
        intuitionTitle: "A Intuição",
        intuition:
            "A regra da cadeia lida com funções compostas — funções dentro de funções. " +
            "Pense em duas engrenagens conectadas: se a engrenagem interna gira a uma certa taxa e a externa " +
            "amplifica esse giro, a taxa total é o produto das duas. " +
            "A derivada da função \"de fora\" avaliada na função \"de dentro\", vezes a derivada da função de dentro.",
        formulaLatex:
            "\\frac{d}{dx}\\left[f(g(x))\\right] = f'(g(x)) \\cdot g'(x)",
        proofTitle: "Por que funciona?",
        proof:
            "Se $y = f(u)$ e $u = g(x)$, uma pequena variação $\\Delta x$ causa $\\Delta u \\approx g'(x)\\Delta x$ " +
            "e, por sua vez, $\\Delta y \\approx f'(u)\\Delta u$. Substituindo: " +
            "$\\Delta y \\approx f'(g(x)) \\cdot g'(x) \\cdot \\Delta x$. Dividindo por $\\Delta x$ e tomando " +
            "o limite, obtemos $\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)$. A prova rigorosa usa " +
            "a definição de diferenciabilidade para evitar divisão por $\\Delta u = 0$.",
        examples: [
            {
                problem: "Derive $f(x) = (3x^2 + 1)^5$.",
                solution:
                    "A função externa é $u^5$ e a interna é $u = 3x^2 + 1$. " +
                    "Pela regra da cadeia: $f'(x) = 5(3x^2+1)^4 \\cdot 6x = 30x(3x^2+1)^4$.",
            },
            {
                problem: "Derive $g(x) = \\sin(x^3)$.",
                solution:
                    "Externa: $\\sin(u)$, interna: $u = x^3$. " +
                    "Logo $g'(x) = \\cos(x^3) \\cdot 3x^2 = 3x^2\\cos(x^3)$.",
            },
        ],
    },

    trig_basic: {
        intuitionTitle: "A Intuição",
        intuition:
            "As funções trigonométricas descrevem movimentos circulares e oscilações. " +
            "A derivada de $\\sin(x)$ é $\\cos(x)$ porque, no círculo unitário, a taxa de variação " +
            "da coordenada vertical (seno) em um dado ponto é exatamente a coordenada horizontal (cosseno) naquele ponto. " +
            "Cada função trigonométrica tem uma derivada que pode ser expressa em termos das outras.",
        formulaLatex:
            "\\frac{d}{dx}[\\sin x] = \\cos x \\qquad \\frac{d}{dx}[\\cos x] = -\\sin x",
        proofTitle: "Por que funciona?",
        proof:
            "Para $\\sin(x)$, usamos $\\lim_{h \\to 0}\\frac{\\sin(x+h)-\\sin(x)}{h}$. " +
            "Pela fórmula de soma: $\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h$. " +
            "Substituindo e usando os limites fundamentais $\\lim_{h \\to 0}\\frac{\\sin h}{h} = 1$ e " +
            "$\\lim_{h \\to 0}\\frac{\\cos h - 1}{h} = 0$, obtemos $\\cos x$. " +
            "Para $\\cos(x)$, o procedimento é análogo e resulta em $-\\sin x$.",
        examples: [
            {
                problem: "Derive $f(x) = 3\\sin(x) + 2\\cos(x)$.",
                solution:
                    "$f'(x) = 3\\cos(x) + 2(-\\sin(x)) = 3\\cos(x) - 2\\sin(x)$.",
            },
            {
                problem: "Derive $g(x) = \\tan(x)$.",
                solution:
                    "Escrevendo $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$ e aplicando a regra do quociente: " +
                    "$g'(x) = \\frac{\\cos^2(x) + \\sin^2(x)}{\\cos^2(x)} = \\frac{1}{\\cos^2(x)} = \\sec^2(x)$.",
            },
        ],
    },

    exp_log: {
        intuitionTitle: "A Intuição",
        intuition:
            "A função $e^x$ é a única função que é igual à sua própria derivada — ela cresce a uma taxa " +
            "proporcional ao seu valor atual. Já $\\ln(x)$, sendo a inversa de $e^x$, tem derivada $\\frac{1}{x}$: " +
            "quanto maior o valor de $x$, mais devagar o logaritmo cresce. " +
            "Essas duas funções formam a base de modelos de crescimento e decaimento na natureza.",
        formulaLatex:
            "\\frac{d}{dx}[e^x] = e^x \\qquad \\frac{d}{dx}[\\ln x] = \\frac{1}{x}",
        proofTitle: "Por que funciona?",
        proof:
            "Para $e^x$: $\\lim_{h \\to 0}\\frac{e^{x+h}-e^x}{h} = e^x \\cdot \\lim_{h \\to 0}\\frac{e^h - 1}{h}$. " +
            "O número $e$ é definido de modo que esse último limite vale $1$, logo a derivada é $e^x$. " +
            "Para $\\ln(x)$, usamos a derivada da função inversa: se $y = \\ln x$, então $x = e^y$. " +
            "Derivando implicitamente: $1 = e^y \\cdot \\frac{dy}{dx}$, portanto $\\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}$.",
        examples: [
            {
                problem: "Derive $f(x) = 5e^x - 3\\ln(x)$.",
                solution:
                    "$f'(x) = 5e^x - \\frac{3}{x}$.",
            },
            {
                problem: "Derive $g(x) = x^2 e^x$ (use a regra do produto).",
                solution:
                    "$g'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = e^x(2x + x^2) = xe^x(2 + x)$.",
            },
        ],
    },

    implicit: {
        intuitionTitle: "A Intuição",
        intuition:
            "Às vezes não conseguimos (ou não queremos) isolar $y$ em função de $x$. " +
            "Na derivação implícita, derivamos os dois lados da equação em relação a $x$, " +
            "lembrando que $y$ depende de $x$ — então cada vez que derivamos um termo com $y$, " +
            "aparece um $\\frac{dy}{dx}$ pela regra da cadeia. Depois, basta isolar $\\frac{dy}{dx}$.",
        formulaLatex:
            "\\frac{d}{dx}[F(x,y)] = 0 \\implies \\frac{dy}{dx} = -\\frac{F_x}{F_y}",
        proofTitle: "Por que funciona?",
        proof:
            "Se $F(x,y) = 0$ define $y$ implicitamente como função de $x$, pela regra da cadeia " +
            "para funções de várias variáveis temos $\\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial y}\\cdot\\frac{dy}{dx} = 0$. " +
            "Isolando: $\\frac{dy}{dx} = -\\frac{F_x}{F_y}$ (desde que $F_y \\neq 0$). " +
            "Isso é o Teorema da Função Implícita aplicado ao caso bidimensional.",
        examples: [
            {
                problem: "Encontre $\\frac{dy}{dx}$ para $x^2 + y^2 = 25$.",
                solution:
                    "Derivando ambos os lados: $2x + 2y\\frac{dy}{dx} = 0$. " +
                    "Isolando: $\\frac{dy}{dx} = -\\frac{x}{y}$.",
            },
            {
                problem: "Encontre $\\frac{dy}{dx}$ para $x^3 + y^3 = 6xy$.",
                solution:
                    "Derivando: $3x^2 + 3y^2\\frac{dy}{dx} = 6y + 6x\\frac{dy}{dx}$. " +
                    "Reagrupando: $(3y^2 - 6x)\\frac{dy}{dx} = 6y - 3x^2$. " +
                    "Logo $\\frac{dy}{dx} = \\frac{6y - 3x^2}{3y^2 - 6x} = \\frac{2y - x^2}{y^2 - 2x}$.",
            },
        ],
    },

    related_rates: {
        intuitionTitle: "A Intuição",
        intuition:
            "Problemas de taxas relacionadas conectam as taxas de variação de grandezas que dependem uma da outra " +
            "através de alguma equação geométrica ou física. " +
            "Por exemplo, se um balão esférico está sendo inflado, a taxa de crescimento do raio e a taxa de " +
            "crescimento do volume estão ligadas pela fórmula do volume da esfera. " +
            "O segredo é: derive a equação que relaciona as grandezas em relação ao tempo $t$.",
        formulaLatex:
            "\\frac{dV}{dt} = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}",
        proofTitle: "Por que funciona?",
        proof:
            "Tudo se baseia na regra da cadeia aplicada ao tempo. Se $V = \\frac{4}{3}\\pi r^3$ e $r$ " +
            "varia com o tempo, então $\\frac{dV}{dt} = 4\\pi r^2 \\cdot \\frac{dr}{dt}$. " +
            "Em geral, qualquer equação $F(x,y) = 0$ onde $x$ e $y$ dependem de $t$ dá " +
            "$F_x \\frac{dx}{dt} + F_y \\frac{dy}{dt} = 0$, conectando as taxas. " +
            "A justificativa formal é a regra da cadeia para funções compostas com variável temporal.",
        examples: [
            {
                problem:
                    "Uma escada de $5$m encosta na parede. A base desliza a $1$ m/s. A que taxa o topo desce quando a base está a $3$m da parede?",
                solution:
                    "Pela relação $x^2 + y^2 = 25$, derivando em $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. " +
                    "Com $x=3$, $y=4$ e $\\frac{dx}{dt}=1$: $6(1) + 8\\frac{dy}{dt} = 0$, " +
                    "logo $\\frac{dy}{dt} = -\\frac{3}{4}$ m/s (o topo desce).",
            },
            {
                problem:
                    "Um balão esférico é inflado a $\\frac{dV}{dt} = 100$ cm$^3$/s. Qual é $\\frac{dr}{dt}$ quando $r = 5$ cm?",
                solution:
                    "$V = \\frac{4}{3}\\pi r^3 \\implies \\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$. " +
                    "Com $r=5$: $100 = 4\\pi(25)\\frac{dr}{dt} = 100\\pi\\frac{dr}{dt}$. " +
                    "Logo $\\frac{dr}{dt} = \\frac{1}{\\pi} \\approx 0{,}318$ cm/s.",
            },
        ],
    },

    // =====================================================================
    // INTEGRAIS
    // =====================================================================

    basic_integrals: {
        intuitionTitle: "A Intuição",
        intuition:
            "Integrar é o processo inverso de derivar. Se a derivada responde \"qual é a taxa de variação?\", " +
            "a integral responde \"qual função tem essa taxa de variação?\". " +
            "As integrais imediatas são as \"tabuadas\" da integração — fórmulas que reconhecemos de cara " +
            "porque são simplesmente as derivadas conhecidas lidas de trás para frente.",
        formulaLatex:
            "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)",
        proofTitle: "Por que funciona?",
        proof:
            "A verificação é direta: derivando $\\frac{x^{n+1}}{n+1} + C$, pela regra da potência obtemos " +
            "$(n+1) \\cdot \\frac{x^n}{n+1} = x^n$, que é exatamente o integrando. " +
            "A constante $C$ aparece porque a derivada de qualquer constante é zero, então há infinitas " +
            "antiderivadas que diferem apenas por uma constante aditiva.",
        examples: [
            {
                problem: "Calcule $\\int (3x^2 + 4x - 1)\\,dx$.",
                solution:
                    "$\\int 3x^2\\,dx + \\int 4x\\,dx - \\int 1\\,dx = x^3 + 2x^2 - x + C$.",
            },
            {
                problem: "Calcule $\\int \\frac{1}{x}\\,dx$.",
                solution:
                    "Como $n = -1$ é o caso especial: $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.",
            },
        ],
    },

    substitution: {
        intuitionTitle: "A Intuição",
        intuition:
            "A substituição é a regra da cadeia ao contrário. Se a integral contém uma função e sua derivada " +
            "aparece como fator, podemos trocar essa função por uma variável $u$, simplificando tudo. " +
            "É como trocar a roupa de uma integral complicada por uma mais simples. " +
            "A chave é encontrar o $u$ certo: geralmente é a função \"de dentro\".",
        formulaLatex:
            "\\int f(g(x))\\,g'(x)\\,dx = \\int f(u)\\,du \\quad \\text{com } u = g(x)",
        proofTitle: "Por que funciona?",
        proof:
            "Se $F$ é a antiderivada de $f$ (ou seja, $F' = f$), então pela regra da cadeia " +
            "$\\frac{d}{dx}[F(g(x))] = f(g(x)) \\cdot g'(x)$. " +
            "Portanto $\\int f(g(x))g'(x)\\,dx = F(g(x)) + C = F(u) + C$. " +
            "A substituição $u = g(x)$, $du = g'(x)\\,dx$ é apenas uma forma organizada de enxergar esse fato.",
        examples: [
            {
                problem: "Calcule $\\int 2x \\cdot e^{x^2}\\,dx$.",
                solution:
                    "Fazendo $u = x^2$, temos $du = 2x\\,dx$. " +
                    "A integral vira $\\int e^u\\,du = e^u + C = e^{x^2} + C$.",
            },
            {
                problem: "Calcule $\\int \\cos(3x)\\,dx$.",
                solution:
                    "Com $u = 3x$, $du = 3\\,dx$, logo $dx = \\frac{du}{3}$. " +
                    "$\\int \\cos(u)\\frac{du}{3} = \\frac{1}{3}\\sin(u) + C = \\frac{1}{3}\\sin(3x) + C$.",
            },
        ],
    },

    by_parts: {
        intuitionTitle: "A Intuição",
        intuition:
            "A integração por partes é a regra do produto ao contrário. Quando temos o produto de duas funções " +
            "e não conseguimos integrar diretamente, \"transferimos\" a derivada de uma para a outra. " +
            "Escolhemos uma parte para derivar ($u$) e outra para integrar ($dv$). A regra LIATE " +
            "(Logarítmica, Inversa trig, Algébrica, Trigonométrica, Exponencial) ajuda a escolher $u$.",
        formulaLatex: "\\int u\\,dv = uv - \\int v\\,du",
        proofTitle: "Por que funciona?",
        proof:
            "Pela regra do produto: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$. " +
            "Integrando ambos os lados: $uv = \\int u'v\\,dx + \\int uv'\\,dx$. " +
            "Rearranjando: $\\int uv'\\,dx = uv - \\int u'v\\,dx$, que na notação " +
            "diferencial fica $\\int u\\,dv = uv - \\int v\\,du$.",
        examples: [
            {
                problem: "Calcule $\\int x e^x\\,dx$.",
                solution:
                    "Escolhemos $u = x$ ($du = dx$) e $dv = e^x dx$ ($v = e^x$). " +
                    "$\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C = e^x(x-1) + C$.",
            },
            {
                problem: "Calcule $\\int x^2 \\sin(x)\\,dx$.",
                solution:
                    "Com $u = x^2$, $dv = \\sin(x)dx$: $\\int x^2\\sin x\\,dx = -x^2\\cos x + 2\\int x\\cos x\\,dx$. " +
                    "Aplicando por partes novamente com $u=x$, $dv=\\cos x\\,dx$: " +
                    "$= -x^2\\cos x + 2(x\\sin x - \\int \\sin x\\,dx) = -x^2\\cos x + 2x\\sin x + 2\\cos x + C$.",
            },
        ],
    },

    trig_integrals: {
        intuitionTitle: "A Intuição",
        intuition:
            "Integrais trigonométricas envolvem potências e produtos de seno e cosseno. " +
            "A estratégia principal é usar identidades trigonométricas para reduzir a complexidade. " +
            "Se um dos expoentes é ímpar, separamos um fator e usamos $\\sin^2 + \\cos^2 = 1$ para " +
            "converter o resto em uma só função — abrindo caminho para uma substituição simples.",
        formulaLatex:
            "\\sin^2(x) = \\frac{1 - \\cos(2x)}{2} \\qquad \\cos^2(x) = \\frac{1 + \\cos(2x)}{2}",
        proofTitle: "Por que funciona?",
        proof:
            "As identidades de redução de potência vêm da fórmula do cosseno do ângulo duplo: " +
            "$\\cos(2x) = \\cos^2(x) - \\sin^2(x) = 2\\cos^2(x) - 1 = 1 - 2\\sin^2(x)$. " +
            "Isolando $\\sin^2(x)$ ou $\\cos^2(x)$, obtemos as fórmulas. " +
            "Para expoentes ímpares, a estratégia algébrica funciona porque a identidade pitagórica " +
            "converte tudo para uma variável, possibilitando $u = \\cos(x)$ ou $u = \\sin(x)$.",
        examples: [
            {
                problem: "Calcule $\\int \\sin^3(x)\\,dx$.",
                solution:
                    "Separamos: $\\int \\sin^2(x)\\sin(x)\\,dx = \\int (1-\\cos^2(x))\\sin(x)\\,dx$. " +
                    "Com $u = \\cos(x)$, $du = -\\sin(x)dx$: $-\\int (1-u^2)du = -u + \\frac{u^3}{3} + C = -\\cos(x) + \\frac{\\cos^3(x)}{3} + C$.",
            },
            {
                problem: "Calcule $\\int \\cos^2(x)\\,dx$.",
                solution:
                    "Pela identidade: $\\int \\frac{1+\\cos(2x)}{2}\\,dx = \\frac{x}{2} + \\frac{\\sin(2x)}{4} + C$.",
            },
        ],
    },

    trig_sub: {
        intuitionTitle: "A Intuição",
        intuition:
            "Quando aparecem expressões como $\\sqrt{a^2 - x^2}$, $\\sqrt{a^2 + x^2}$ ou $\\sqrt{x^2 - a^2}$, " +
            "uma substituição trigonométrica transforma a raiz em algo simples. " +
            "A ideia é usar o triângulo retângulo: os lados e a hipotenusa criam relações que eliminam a raiz. " +
            "É como vestir a integral com uma \"roupa trigonométrica\" que simplifica a expressão.",
        formulaLatex:
            "\\sqrt{a^2 - x^2} \\Rightarrow x = a\\sin\\theta \\qquad \\sqrt{a^2 + x^2} \\Rightarrow x = a\\tan\\theta",
        proofTitle: "Por que funciona?",
        proof:
            "Para $\\sqrt{a^2 - x^2}$: se $x = a\\sin\\theta$, então $a^2 - x^2 = a^2(1 - \\sin^2\\theta) = a^2\\cos^2\\theta$, " +
            "logo $\\sqrt{a^2-x^2} = a\\cos\\theta$ (um monômio simples!). " +
            "Analogamente, para $\\sqrt{a^2+x^2}$ com $x = a\\tan\\theta$: " +
            "$a^2 + a^2\\tan^2\\theta = a^2\\sec^2\\theta$, então $\\sqrt{a^2+x^2} = a\\sec\\theta$. " +
            "As identidades pitagóricas são a base de todas essas simplificações.",
        examples: [
            {
                problem: "Calcule $\\int \\frac{dx}{\\sqrt{4-x^2}}$.",
                solution:
                    "Com $x = 2\\sin\\theta$, $dx = 2\\cos\\theta\\,d\\theta$ e $\\sqrt{4-x^2} = 2\\cos\\theta$. " +
                    "A integral vira $\\int \\frac{2\\cos\\theta}{2\\cos\\theta}d\\theta = \\int d\\theta = \\theta + C = \\arcsin\\!\\left(\\frac{x}{2}\\right) + C$.",
            },
            {
                problem: "Calcule $\\int \\frac{x^2}{\\sqrt{x^2+9}}\\,dx$.",
                solution:
                    "Com $x = 3\\tan\\theta$, $dx = 3\\sec^2\\theta\\,d\\theta$, $\\sqrt{x^2+9} = 3\\sec\\theta$. " +
                    "A integral vira $\\int \\frac{9\\tan^2\\theta}{3\\sec\\theta} \\cdot 3\\sec^2\\theta\\,d\\theta = 9\\int \\tan^2\\theta\\sec\\theta\\,d\\theta$. " +
                    "Usando $\\tan^2\\theta = \\sec^2\\theta - 1$: $9\\int(\\sec^3\\theta - \\sec\\theta)d\\theta$. " +
                    "Resolvendo e voltando para $x$: $\\frac{x\\sqrt{x^2+9}}{2} - \\frac{9}{2}\\ln\\!\\left|\\frac{x+\\sqrt{x^2+9}}{3}\\right| + C$.",
            },
        ],
    },

    partial_fractions: {
        intuitionTitle: "A Intuição",
        intuition:
            "Quando temos uma fração de polinômios, podemos quebrá-la em frações mais simples — " +
            "é como decompor uma fração numérica: $\\frac{5}{6} = \\frac{1}{2} + \\frac{1}{3}$. " +
            "Cada fator do denominador contribui com uma fração parcial, e cada uma dessas é fácil de integrar. " +
            "O passo crucial é fatorar o denominador e encontrar os coeficientes.",
        formulaLatex:
            "\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}",
        proofTitle: "Por que funciona?",
        proof:
            "O Teorema da Decomposição em Frações Parciais garante que toda fração racional própria " +
            "(grau do numerador menor que o do denominador) pode ser escrita como soma de frações com " +
            "denominadores sendo potências dos fatores irredutíveis. " +
            "Os coeficientes são determinados igualando numeradores e resolvendo o sistema linear resultante. " +
            "Depois, cada fração parcial $\\frac{A}{x-a}$ integra como $A\\ln|x-a| + C$.",
        examples: [
            {
                problem: "Calcule $\\int \\frac{5x+1}{x^2-x-2}\\,dx$.",
                solution:
                    "Fatorando: $x^2-x-2 = (x-2)(x+1)$. Decompomos: $\\frac{5x+1}{(x-2)(x+1)} = \\frac{A}{x-2} + \\frac{B}{x+1}$. " +
                    "Multiplicando: $5x+1 = A(x+1) + B(x-2)$. Com $x=2$: $11 = 3A \\Rightarrow A = \\frac{11}{3}$. " +
                    "Com $x=-1$: $-4 = -3B \\Rightarrow B = \\frac{4}{3}$. " +
                    "Logo $\\int\\frac{11/3}{x-2}+\\frac{4/3}{x+1}\\,dx = \\frac{11}{3}\\ln|x-2| + \\frac{4}{3}\\ln|x+1| + C$.",
            },
            {
                problem: "Calcule $\\int \\frac{3}{x^2-9}\\,dx$.",
                solution:
                    "$x^2-9 = (x-3)(x+3)$. Decomposição: $\\frac{3}{(x-3)(x+3)} = \\frac{A}{x-3}+\\frac{B}{x+3}$. " +
                    "$3 = A(x+3)+B(x-3)$. Com $x=3$: $A = \\frac{1}{2}$. Com $x=-3$: $B = -\\frac{1}{2}$. " +
                    "Integral: $\\frac{1}{2}\\ln|x-3| - \\frac{1}{2}\\ln|x+3| + C = \\frac{1}{2}\\ln\\!\\left|\\frac{x-3}{x+3}\\right| + C$.",
            },
        ],
    },

    improper: {
        intuitionTitle: "A Intuição",
        intuition:
            "Uma integral imprópria tem algum \"problema\": o intervalo vai até o infinito, ou o integrando " +
            "tem uma assíntota vertical. Parece impossível calcular a área de uma região infinita, mas " +
            "às vezes essa área é finita! A ideia é usar limites: substituímos o infinito (ou o ponto problemático) " +
            "por uma variável e vemos se o resultado converge.",
        formulaLatex:
            "\\int_a^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_a^b f(x)\\,dx",
        proofTitle: "Por que funciona?",
        proof:
            "A integral imprópria é definida como o limite da integral definida quando o extremo tende ao " +
            "infinito (ou ao ponto de descontinuidade). Se esse limite existe e é finito, dizemos que a " +
            "integral converge. Caso contrário, diverge. " +
            "Um critério útil: $\\int_1^{\\infty} \\frac{1}{x^p}dx$ converge se e somente se $p > 1$ " +
            "(teste $p$). Isso vem do fato de que $\\frac{x^{1-p}}{1-p}\\big|_1^b$ tem limite finito apenas quando $1-p < 0$.",
        examples: [
            {
                problem: "Calcule $\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$.",
                solution:
                    "$\\lim_{b \\to \\infty}\\int_1^b x^{-2}dx = \\lim_{b \\to \\infty}\\left[-\\frac{1}{x}\\right]_1^b = \\lim_{b \\to \\infty}\\left(-\\frac{1}{b}+1\\right) = 1$. A integral converge para $1$.",
            },
            {
                problem: "Determine se $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ converge.",
                solution:
                    "Há descontinuidade em $x=0$. $\\lim_{a \\to 0^+}\\int_a^1 x^{-1/2}dx = \\lim_{a \\to 0^+}[2\\sqrt{x}]_a^1 = \\lim_{a \\to 0^+}(2-2\\sqrt{a}) = 2$. Converge para $2$.",
            },
        ],
    },

    // =====================================================================
    // EDOs
    // =====================================================================

    separable: {
        intuitionTitle: "A Intuição",
        intuition:
            "Uma EDO separável é aquela em que conseguimos colocar tudo que depende de $y$ de um lado e " +
            "tudo que depende de $x$ do outro. É como separar ingredientes em dois recipientes: " +
            "os \"$y$-ingredientes\" num lado, os \"$x$-ingredientes\" no outro. " +
            "Depois, integramos cada lado separadamente.",
        formulaLatex:
            "\\frac{dy}{dx} = f(x)g(y) \\implies \\int \\frac{dy}{g(y)} = \\int f(x)\\,dx",
        proofTitle: "Por que funciona?",
        proof:
            "Se $\\frac{dy}{dx} = f(x)g(y)$, dividimos ambos os lados por $g(y)$ (supondo $g(y) \\neq 0$): " +
            "$\\frac{1}{g(y)}\\frac{dy}{dx} = f(x)$. Integrando em $x$: $\\int \\frac{1}{g(y)}\\frac{dy}{dx}dx = \\int f(x)dx$. " +
            "Pelo teorema da substituição, o lado esquerdo é $\\int \\frac{dy}{g(y)}$. " +
            "Assim, a separação de variáveis é rigorosamente justificada pela regra da cadeia e substituição.",
        examples: [
            {
                problem: "Resolva $\\frac{dy}{dx} = xy$ com $y(0) = 2$.",
                solution:
                    "Separando: $\\frac{dy}{y} = x\\,dx$. Integrando: $\\ln|y| = \\frac{x^2}{2} + C$, " +
                    "logo $y = Ae^{x^2/2}$. Com $y(0) = 2$: $A = 2$. Solução: $y = 2e^{x^2/2}$.",
            },
            {
                problem: "Resolva $\\frac{dy}{dx} = \\frac{x^2}{y}$.",
                solution:
                    "Separando: $y\\,dy = x^2\\,dx$. Integrando: $\\frac{y^2}{2} = \\frac{x^3}{3} + C$, " +
                    "logo $y^2 = \\frac{2x^3}{3} + C_1$, ou seja, $y = \\pm\\sqrt{\\frac{2x^3}{3} + C_1}$.",
            },
        ],
    },

    first_order_linear: {
        intuitionTitle: "A Intuição",
        intuition:
            "Uma EDO linear de 1a ordem tem a forma $y' + P(x)y = Q(x)$. O truque genial é multiplicar " +
            "a equação por um \"fator integrante\" $\\mu(x) = e^{\\int P(x)dx}$ que transforma o lado esquerdo " +
            "na derivada exata de $\\mu \\cdot y$. " +
            "É como encontrar o multiplicador mágico que faz tudo se encaixar numa derivada de produto.",
        formulaLatex:
            "y' + P(x)y = Q(x) \\implies y = \\frac{1}{\\mu}\\int \\mu\\,Q\\,dx, \\quad \\mu = e^{\\int P\\,dx}",
        proofTitle: "Por que funciona?",
        proof:
            "Multiplicando $y' + Py = Q$ por $\\mu = e^{\\int P\\,dx}$: $\\mu y' + \\mu Py = \\mu Q$. " +
            "Observe que $\\mu' = P\\mu$ (pela definição de $\\mu$). " +
            "Logo, $\\mu y' + \\mu' y = \\mu Q$, e o lado esquerdo é exatamente $(\\mu y)' $ pela regra do produto. " +
            "Integrando: $\\mu y = \\int \\mu Q\\,dx + C$, e isolamos $y$.",
        examples: [
            {
                problem: "Resolva $y' + 2y = e^{-x}$.",
                solution:
                    "$P(x) = 2$, $\\mu = e^{2x}$. Multiplicando: $(e^{2x}y)' = e^{2x} \\cdot e^{-x} = e^x$. " +
                    "Integrando: $e^{2x}y = e^x + C$, logo $y = e^{-x} + Ce^{-2x}$.",
            },
            {
                problem: "Resolva $y' - \\frac{y}{x} = x^2$ para $x > 0$.",
                solution:
                    "$P(x) = -\\frac{1}{x}$, $\\mu = e^{-\\ln x} = \\frac{1}{x}$. " +
                    "Multiplicando: $\\left(\\frac{y}{x}\\right)' = x$. " +
                    "Integrando: $\\frac{y}{x} = \\frac{x^2}{2} + C$, logo $y = \\frac{x^3}{2} + Cx$.",
            },
        ],
    },

    exact: {
        intuitionTitle: "A Intuição",
        intuition:
            "Uma equação exata $M\\,dx + N\\,dy = 0$ é aquela em que já existe uma função $F(x,y)$ cuja " +
            "diferencial total é exatamente $M\\,dx + N\\,dy$. Ou seja, $dF = 0$, logo $F(x,y) = C$ é a solução. " +
            "O teste é simples: se $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$, a equação é exata. " +
            "É como descobrir que uma combinação de peças forma um quebra-cabeça perfeito.",
        formulaLatex:
            "M\\,dx + N\\,dy = 0 \\text{ é exata se } \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}",
        proofTitle: "Por que funciona?",
        proof:
            "Se existe $F$ tal que $F_x = M$ e $F_y = N$, então pelo teorema de Schwarz (igualdade das derivadas mistas): " +
            "$\\frac{\\partial M}{\\partial y} = F_{xy} = F_{yx} = \\frac{\\partial N}{\\partial x}$. " +
            "Para encontrar $F$, integramos $M$ em $x$: $F = \\int M\\,dx + g(y)$, " +
            "e determinamos $g(y)$ exigindo que $F_y = N$. A solução é $F(x,y) = C$.",
        examples: [
            {
                problem: "Resolva $(2xy + 3)dx + (x^2 + 4y)dy = 0$.",
                solution:
                    "Verificação: $M_y = 2x$ e $N_x = 2x$ — exata! " +
                    "$F = \\int (2xy+3)dx = x^2y + 3x + g(y)$. " +
                    "$F_y = x^2 + g'(y) = x^2 + 4y \\implies g'(y) = 4y \\implies g(y) = 2y^2$. " +
                    "Solução: $x^2y + 3x + 2y^2 = C$.",
            },
            {
                problem: "Resolva $(ye^{xy} + 2x)dx + (xe^{xy} + 1)dy = 0$.",
                solution:
                    "$M_y = e^{xy} + xye^{xy}$ e $N_x = e^{xy} + xye^{xy}$ — exata! " +
                    "$F = \\int (xe^{xy}+1)dy = e^{xy} + y + h(x)$. " +
                    "$F_x = ye^{xy} + h'(x) = ye^{xy} + 2x \\implies h'(x) = 2x \\implies h(x) = x^2$. " +
                    "Solução: $e^{xy} + y + x^2 = C$.",
            },
        ],
    },

    homogeneous: {
        intuitionTitle: "A Intuição",
        intuition:
            "Uma EDO homogênea é aquela onde $\\frac{dy}{dx}$ depende apenas da razão $\\frac{y}{x}$. " +
            "A substituição $v = \\frac{y}{x}$ (ou seja, $y = vx$) transforma a equação numa EDO separável em $v$ e $x$. " +
            "A intuição é que, se a equação \"não distingue escala\" (multiplicar $x$ e $y$ pelo mesmo fator não muda nada), " +
            "então a razão $v = y/x$ é a variável natural.",
        formulaLatex:
            "\\frac{dy}{dx} = \\phi\\!\\left(\\frac{y}{x}\\right) \\implies v + x\\frac{dv}{dx} = \\phi(v), \\quad v = \\frac{y}{x}",
        proofTitle: "Por que funciona?",
        proof:
            "Se $f(tx,ty) = f(x,y)$ para todo $t > 0$ (homogeneidade de grau 0), " +
            "fazendo $t = 1/x$: $f(x,y) = f(1, y/x) = \\phi(y/x)$, confirmando que só depende de $v = y/x$. " +
            "Com $y = vx$: $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$. Substituindo na EDO: " +
            "$v + x\\frac{dv}{dx} = \\phi(v)$, que é separável: $\\frac{dv}{\\phi(v) - v} = \\frac{dx}{x}$.",
        examples: [
            {
                problem: "Resolva $\\frac{dy}{dx} = \\frac{x + y}{x}$.",
                solution:
                    "Reescrevendo: $\\frac{dy}{dx} = 1 + \\frac{y}{x}$. Com $v = y/x$: " +
                    "$v + xv' = 1 + v$, logo $xv' = 1$, ou seja, $\\frac{dv}{1} = \\frac{dx}{x}$. " +
                    "Integrando: $v = \\ln|x| + C$, portanto $y = x(\\ln|x| + C)$.",
            },
            {
                problem: "Resolva $(x^2 + y^2)dx - 2xy\\,dy = 0$.",
                solution:
                    "$\\frac{dy}{dx} = \\frac{x^2+y^2}{2xy}$. Com $y = vx$: $v + xv' = \\frac{1+v^2}{2v}$. " +
                    "Então $xv' = \\frac{1+v^2}{2v} - v = \\frac{1-v^2}{2v}$. Separando: $\\frac{2v}{1-v^2}dv = \\frac{dx}{x}$. " +
                    "Integrando: $-\\ln|1-v^2| = \\ln|x| + C_1$, logo $\\frac{1}{1-v^2} = Ax$. " +
                    "Voltando: $\\frac{x^2}{x^2-y^2} = Ax$, ou seja, $x = A(x^2-y^2)$.",
            },
        ],
    },

    second_order_linear: {
        intuitionTitle: "A Intuição",
        intuition:
            "EDOs lineares de 2a ordem com coeficientes constantes ($ay'' + by' + cy = 0$) modelam " +
            "oscilações — molas, circuitos, pêndulos. A ideia genial é supor $y = e^{rx}$ e ver que valor de $r$ " +
            "funciona. Isso transforma a EDO numa equação do 2o grau (a equação característica), " +
            "e as raízes $r$ determinam o comportamento da solução: oscila, decai, ou cresce.",
        formulaLatex:
            "ay'' + by' + cy = 0 \\implies ar^2 + br + c = 0",
        proofTitle: "Por que funciona?",
        proof:
            "Substituindo $y = e^{rx}$ na EDO: $ae^{rx}r^2 + be^{rx}r + ce^{rx} = 0$. " +
            "Como $e^{rx} \\neq 0$, dividimos por ele: $ar^2 + br + c = 0$. " +
            "Se as raízes são reais distintas $r_1, r_2$: $y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$. " +
            "Se a raiz é dupla $r$: $y = (C_1 + C_2 x)e^{rx}$. " +
            "Se as raízes são complexas $\\alpha \\pm \\beta i$: $y = e^{\\alpha x}(C_1 \\cos \\beta x + C_2 \\sin \\beta x)$.",
        examples: [
            {
                problem: "Resolva $y'' - 5y' + 6y = 0$.",
                solution:
                    "Equação característica: $r^2 - 5r + 6 = 0 \\implies (r-2)(r-3) = 0$, " +
                    "logo $r_1 = 2$, $r_2 = 3$. Solução geral: $y = C_1 e^{2x} + C_2 e^{3x}$.",
            },
            {
                problem: "Resolva $y'' + 4y = 0$.",
                solution:
                    "Equação característica: $r^2 + 4 = 0 \\implies r = \\pm 2i$. " +
                    "Raízes complexas com $\\alpha = 0$, $\\beta = 2$. " +
                    "Solução geral: $y = C_1 \\cos(2x) + C_2 \\sin(2x)$.",
            },
        ],
    },

    undetermined_coeffs: {
        intuitionTitle: "A Intuição",
        intuition:
            "O método dos coeficientes a determinar resolve EDOs não-homogêneas ($ay'' + by' + cy = g(x)$) " +
            "quando $g(x)$ é um polinômio, exponencial, seno/cosseno, ou combinação desses. " +
            "\"Chutamos\" que a solução particular tem a mesma forma de $g(x)$, substituímos na EDO, " +
            "e determinamos os coeficientes comparando os dois lados. A solução geral é: homogênea + particular.",
        formulaLatex:
            "y = y_h + y_p \\quad \\text{onde } y_p \\text{ tem a forma de } g(x)",
        proofTitle: "Por que funciona?",
        proof:
            "Pelo princípio da superposição para EDOs lineares, se $y_h$ resolve a parte homogênea " +
            "e $y_p$ resolve a completa, então $y = y_h + y_p$ é a solução geral. " +
            "O \"chute\" funciona porque derivadas de polinômios, exponenciais e trigonométricas " +
            "produzem funções do mesmo tipo. Quando $g(x)$ é solução da homogênea, multiplicamos " +
            "o chute por $x$ (ou $x^2$) para garantir independência linear.",
        examples: [
            {
                problem: "Resolva $y'' - 3y' + 2y = 4e^{5x}$.",
                solution:
                    "Homogênea: $r^2-3r+2=0 \\implies r=1,2$, logo $y_h = C_1e^x + C_2e^{2x}$. " +
                    "Particular: chutamos $y_p = Ae^{5x}$. $y_p'' - 3y_p' + 2y_p = 25Ae^{5x} - 15Ae^{5x} + 2Ae^{5x} = 12Ae^{5x} = 4e^{5x}$. " +
                    "Logo $A = \\frac{1}{3}$. Solução: $y = C_1e^x + C_2e^{2x} + \\frac{1}{3}e^{5x}$.",
            },
            {
                problem: "Resolva $y'' + y = 3\\sin(2x)$.",
                solution:
                    "Homogênea: $r^2+1=0 \\implies r = \\pm i$, $y_h = C_1\\cos x + C_2\\sin x$. " +
                    "Chutamos $y_p = A\\cos(2x) + B\\sin(2x)$. Substituindo: " +
                    "$-4A\\cos(2x) - 4B\\sin(2x) + A\\cos(2x) + B\\sin(2x) = 3\\sin(2x)$. " +
                    "Logo $-3A = 0$ e $-3B = 3$, ou seja, $A = 0$, $B = -1$. " +
                    "Solução: $y = C_1\\cos x + C_2\\sin x - \\sin(2x)$.",
            },
        ],
    },

    laplace: {
        intuitionTitle: "A Intuição",
        intuition:
            "A Transformada de Laplace converte uma EDO (difícil) numa equação algébrica (fácil). " +
            "A ideia é transformar a função do \"domínio do tempo\" $t$ para o \"domínio da frequência\" $s$, " +
            "onde derivadas viram multiplicações por $s$. Resolvemos a álgebra, e depois aplicamos a " +
            "transformada inversa para voltar ao domínio de $t$.",
        formulaLatex:
            "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt",
        proofTitle: "Por que funciona?",
        proof:
            "A propriedade chave é que $\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)$, obtida integrando por partes: " +
            "$\\int_0^\\infty e^{-st}f'(t)dt = [e^{-st}f(t)]_0^\\infty + s\\int_0^\\infty e^{-st}f(t)dt = -f(0) + sF(s)$. " +
            "Isso transforma $y'' + ay' + by = g(t)$ em $(s^2 + as + b)Y(s) = G(s) + \\text{condições iniciais}$, " +
            "uma equação algébrica em $Y(s)$. A linearidade da transformada garante que " +
            "a solução no domínio $s$ corresponde à solução no domínio $t$.",
        examples: [
            {
                problem: "Resolva $y' + 2y = 0$, $y(0) = 3$, usando Laplace.",
                solution:
                    "Aplicando $\\mathcal{L}$: $sY(s) - y(0) + 2Y(s) = 0$, logo $(s+2)Y(s) = 3$. " +
                    "$Y(s) = \\frac{3}{s+2}$. Invertendo: $y(t) = 3e^{-2t}$.",
            },
            {
                problem: "Resolva $y'' + y = 0$, $y(0) = 1$, $y'(0) = 0$.",
                solution:
                    "Aplicando $\\mathcal{L}$: $s^2Y - sy(0) - y'(0) + Y = 0$, logo $(s^2+1)Y = s$. " +
                    "$Y(s) = \\frac{s}{s^2+1}$. Pela tabela: $\\mathcal{L}^{-1}\\left\\{\\frac{s}{s^2+1}\\right\\} = \\cos(t)$. " +
                    "Solução: $y(t) = \\cos(t)$.",
            },
        ],
    },
};
