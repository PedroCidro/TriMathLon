import type { ContentBlock } from './index';

export const derivadasContent: Record<string, ContentBlock[]> = {
    // =====================================================================
    // REGRA DA POTÊNCIA
    // =====================================================================
    power_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Derivar é medir quanto a saída muda quando a entrada muda um pouquinho. A regra da potência responde essa pergunta para qualquer $x^n$.\n\nComece com um caso concreto: $x^3 = x \\cdot x \\cdot x$. Se $x$ cresce um pouquinho (de $x$ para $x + h$), cada um dos três fatores é "afetado" por vez, enquanto os outros dois ficam como estavam.\n\nSe o primeiro fator muda: $(x+h) \\cdot x \\cdot x$. Se o segundo muda: $x \\cdot (x+h) \\cdot x$. Se o terceiro: $x \\cdot x \\cdot (x+h)$. Cada caso contribui com $x^2 \\cdot h$ de variação — e são 3 casos. Por isso a derivada de $x^3$ é $3x^2$.\n\nO padrão é claro: o expoente desce como coeficiente (são $n$ maneiras de escolher qual fator muda) e diminui em 1 (os outros $n - 1$ fatores ficam como $x$).',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\frac{d}{dx}\\left(x^n\\right) = n \\cdot x^{n-1}',
            content: 'O expoente desce como coeficiente. O expoente diminui em 1.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definição de derivada',
            content: 'Começamos pela definição:',
            latex: '\\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Expandindo (x+h)ⁿ',
            content: 'Pense em $(x+h)^n$ como o produto de $n$ fatores: $(x+h)(x+h)\\cdots(x+h)$. Ao expandir, cada termo vem de escolher $x$ ou $h$ em cada fator.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Termo principal',
            content: 'Escolhendo $x$ em todos os fatores: $x^n$. Escolhendo $h$ em exatamente 1 fator e $x$ nos outros $n-1$: são $n$ formas de fazer isso.',
            latex: 'n \\cdot x^{n-1} \\cdot h',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Termos que somem',
            content: 'Todos os outros termos têm $h^2$ ou potências maiores. Subtraindo $x^n$, dividindo por $h$, e fazendo $h \\to 0$, eles desaparecem. Sobra:',
            latex: 'n \\cdot x^{n-1}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O expoente "desce" por causa de combinatória pura — o $n$ conta de quantas maneiras podemos escolher qual dos $n$ fatores contribui com o $h$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Encontre a derivada de $f(x) = x^5$.',
            solution: 'Aplicando a regra da potência:',
            solutionLatex: "f'(x) = 5x^{5-1} = 5x^4",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = 3x^4 - 2x^3 + 7x$.',
            solution: 'Derivando termo a termo:',
            solutionLatex: "g'(x) = 3 \\cdot 4x^3 - 2 \\cdot 3x^2 + 7 = 12x^3 - 6x^2 + 7",
        },
    ],

    // =====================================================================
    // REGRA DO PRODUTO
    // =====================================================================
    product_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Quando duas quantidades que variam são multiplicadas, a variação total vem de duas contribuições: a primeira função muda enquanto a segunda fica parada, e depois a segunda muda enquanto a primeira fica parada.\n\nImagine a área de um retângulo cujos lados $u$ e $v$ estão crescendo — o acréscimo de área vem tanto do aumento na largura quanto do aumento na altura.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: "\\frac{d}{dx}\\left[u \\cdot v\\right] = u' \\cdot v + u \\cdot v'",
            content: 'Derivada do primeiro vezes o segundo, mais o primeiro vezes a derivada do segundo.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definição de derivada',
            content: 'Pela definição, queremos calcular o limite abaixo. O problema é que dois fatores estão mudando ao mesmo tempo.',
            latex: '\\lim_{h \\to 0} \\frac{u(x+h)v(x+h) - u(x)v(x)}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'O truque: somar e subtrair',
            content: 'Para isolar cada variação, somamos e subtraímos $u(x+h)v(x)$ no numerador — isso não muda o valor, mas separa em duas partes.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Duas contribuições',
            content: 'A primeira parte captura a variação de $v$ enquanto $u$ está "quase parado" em $x+h$; a segunda captura a variação de $u$ enquanto $v$ está parado em $x$.',
            latex: "u(x+h)\\frac{v(x+h)-v(x)}{h} + v(x)\\frac{u(x+h)-u(x)}{h}",
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Resultado',
            content: "Quando $h \\to 0$, $u(x+h) \\to u(x)$ por continuidade, e os quocientes viram $v'(x)$ e $u'(x)$.",
            latex: "u \\cdot v' + u' \\cdot v",
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'A variação total de um produto é a soma de cada fator variando enquanto o outro fica fixo — como a área de um retângulo crescendo.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Derive $f(x) = x^2 \\cdot \\sin(x)$.',
            solution: "Sejam $u = x^2$ e $v = \\sin(x)$. Então $u' = 2x$ e $v' = \\cos(x)$. Pela regra do produto:",
            solutionLatex: "f'(x) = 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = e^x \\cdot \\ln(x)$.',
            solution: "Com $u = e^x$ e $v = \\ln(x)$: $u' = e^x$, $v' = \\frac{1}{x}$.",
            solutionLatex: "g'(x) = e^x \\cdot \\ln(x) + e^x \\cdot \\frac{1}{x} = e^x\\!\\left(\\ln(x) + \\frac{1}{x}\\right)",
        },
    ],

    // =====================================================================
    // REGRA DO QUOCIENTE
    // =====================================================================
    quotient_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'A regra do quociente trata de como a razão entre duas funções muda. Quando o numerador cresce, a fração tende a crescer; quando o denominador cresce, a fração tende a diminuir.\n\nA fórmula captura essa "competição" entre numerador e denominador, sempre dividindo pelo quadrado do denominador para manter as unidades corretas.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: "\\frac{d}{dx}\\!\\left[\\frac{u}{v}\\right] = \\frac{u' \\cdot v - u \\cdot v'}{v^2}",
            content: 'Derivada do numerador vezes denominador, menos numerador vezes derivada do denominador, sobre o denominador ao quadrado.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Partindo da regra do produto',
            content: 'Em vez de partir da definição, derivamos a regra do quociente da regra do produto — mostrando que não é uma fórmula separada para decorar. Se $u = \\frac{u}{v} \\cdot v$, aplicamos a regra do produto:',
            latex: "u' = \\left(\\frac{u}{v}\\right)' \\cdot v + \\frac{u}{v} \\cdot v'",
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Isolando a derivada',
            content: 'Isolamos $\\left(\\frac{u}{v}\\right)\'$:',
            latex: "\\left(\\frac{u}{v}\\right)' = \\frac{u' - \\frac{u}{v} \\cdot v'}{v}",
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Simplificando',
            content: "Multiplicando numerador e denominador por $v$, obtemos a forma final. O sinal de menos aparece naturalmente: quando o denominador $v$ cresce, a fração diminui — esse efeito negativo é o $-uv'$.",
            latex: "\\frac{u'v - uv'}{v^2}",
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Não precisa decorar: basta lembrar da regra do produto e isolar. O sinal de menos reflete a competição entre numerador e denominador.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Derive $f(x) = \\frac{x^2 + 1}{x - 3}$.',
            solution: "Com $u = x^2 + 1$, $v = x - 3$: $u' = 2x$, $v' = 1$.",
            solutionLatex: "f'(x) = \\frac{2x(x-3) - (x^2+1)(1)}{(x-3)^2} = \\frac{x^2 - 6x - 1}{(x-3)^2}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = \\frac{\\sin(x)}{x}$.',
            solution: "Com $u = \\sin(x)$ e $v = x$: $u' = \\cos(x)$, $v' = 1$.",
            solutionLatex: "g'(x) = \\frac{\\cos(x) \\cdot x - \\sin(x) \\cdot 1}{x^2} = \\frac{x\\cos(x) - \\sin(x)}{x^2}",
        },
    ],

    // =====================================================================
    // REGRA DA CADEIA
    // =====================================================================
    chain_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'A regra da cadeia lida com funções compostas — funções dentro de funções. Pense em duas engrenagens conectadas: se a engrenagem interna gira a uma certa taxa e a externa amplifica esse giro, a taxa total é o produto das duas.\n\nA derivada da função "de fora" avaliada na função "de dentro", vezes a derivada da função de dentro.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: "\\frac{d}{dx}\\left[f(g(x))\\right] = f'(g(x)) \\cdot g'(x)",
            content: 'Derivada da externa avaliada na interna, vezes derivada da interna.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Variação da função interna',
            content: "Se $y = f(u)$ e $u = g(x)$, uma pequena variação $\\Delta x$ primeiro causa uma variação em $u$ pela definição de derivada de $g$:",
            latex: "\\Delta u \\approx g'(x) \\cdot \\Delta x",
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Propagação para a externa',
            content: "Essa variação $\\Delta u$, por sua vez, causa uma variação em $y$ pela definição de derivada de $f$:",
            latex: "\\Delta y \\approx f'(u) \\cdot \\Delta u",
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Combinando as variações',
            content: "Substituindo $\\Delta u$: $\\Delta y \\approx f'(g(x)) \\cdot g'(x) \\cdot \\Delta x$. Dividindo por $\\Delta x$:",
            latex: "\\frac{\\Delta y}{\\Delta x} \\approx f'(g(x)) \\cdot g'(x)",
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'No limite',
            content: 'No limite ($\\Delta x \\to 0$), a aproximação vira igualdade. É como engrenagens conectadas: a taxa total é o produto das taxas de cada elo. Se a função de dentro triplica a variação e a de fora dobra, a variação total é $\\times 6$.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Taxas de variação se multiplicam ao longo da composição — como engrenagens conectadas onde cada elo amplifica o movimento.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Derive $f(x) = (3x^2 + 1)^5$.',
            solution: 'A função externa é $u^5$ e a interna é $u = 3x^2 + 1$. Pela regra da cadeia:',
            solutionLatex: "f'(x) = 5(3x^2+1)^4 \\cdot 6x = 30x(3x^2+1)^4",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = \\sin(x^3)$.',
            solution: 'Externa: $\\sin(u)$, interna: $u = x^3$.',
            solutionLatex: "g'(x) = \\cos(x^3) \\cdot 3x^2 = 3x^2\\cos(x^3)",
        },
    ],

    // =====================================================================
    // FUNÇÕES TRIGONOMÉTRICAS
    // =====================================================================
    trig_basic: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'As funções trigonométricas descrevem movimentos circulares e oscilações. A derivada de $\\sin(x)$ é $\\cos(x)$ porque, no círculo unitário, a taxa de variação da coordenada vertical (seno) em um dado ponto é exatamente a coordenada horizontal (cosseno) naquele ponto.\n\nCada função trigonométrica tem uma derivada que pode ser expressa em termos das outras.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\frac{d}{dx}(\\sin x) = \\cos x \\qquad \\frac{d}{dx}(\\cos x) = -\\sin x',
            content: 'Seno vira cosseno. Cosseno vira menos seno.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Fórmula de soma',
            content: 'Vamos provar que a derivada de $\\sin x$ é $\\cos x$ pela definição. Calculamos $\\lim_{h \\to 0}\\frac{\\sin(x+h)-\\sin(x)}{h}$. Pela fórmula de soma:',
            latex: '\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Substituindo no limite',
            content: 'Substituindo e reorganizando, o limite se separa em duas partes:',
            latex: '\\sin x \\cdot \\frac{\\cos h - 1}{h} + \\cos x \\cdot \\frac{\\sin h}{h}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Limites fundamentais',
            content: 'Tudo depende de dois limites. Primeiro: $\\lim_{h \\to 0}\\frac{\\sin h}{h} = 1$ — para ângulos muito pequenos, o arco e a corda do círculo unitário são praticamente iguais. Segundo: $\\lim_{h \\to 0}\\frac{\\cos h - 1}{h} = 0$ — o cosseno se afasta de $1$ muito mais devagar que $h$ se afasta de $0$.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Resultado',
            content: 'Com esses limites, o primeiro termo zera e o segundo dá $\\cos x$. Para $\\cos x$, o argumento é análogo, mas $\\cos(x+h) = \\cos x \\cos h - \\sin x \\sin h$ — o sinal de menos na fórmula de soma é o responsável pelo $-\\sin x$ na derivada.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O ciclo das derivadas trigonométricas ($\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$) reflete a geometria do círculo unitário.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Derive $f(x) = 3\\sin(x) + 2\\cos(x)$.',
            solution: 'Derivando termo a termo:',
            solutionLatex: "f'(x) = 3\\cos(x) + 2(-\\sin(x)) = 3\\cos(x) - 2\\sin(x)",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = \\tan(x)$.',
            solution: 'Escrevendo $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$ e aplicando a regra do quociente:',
            solutionLatex: "g'(x) = \\frac{\\cos^2(x) + \\sin^2(x)}{\\cos^2(x)} = \\frac{1}{\\cos^2(x)} = \\sec^2(x)",
        },
    ],

    // =====================================================================
    // EXPONENCIAL E LOGARÍTMICA
    // =====================================================================
    exp_log: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'A função $e^x$ é a única função que é igual à sua própria derivada — ela cresce a uma taxa proporcional ao seu valor atual. Já $\\ln(x)$, sendo a inversa de $e^x$, tem derivada $\\frac{1}{x}$: quanto maior o valor de $x$, mais devagar o logaritmo cresce.\n\nEssas duas funções formam a base de modelos de crescimento e decaimento na natureza.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\frac{d}{dx}(e^x) = e^x \\qquad \\frac{d}{dx}(\\ln x) = \\frac{1}{x}',
            content: 'A exponencial é sua própria derivada. O logaritmo tem derivada $1/x$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definição para eˣ',
            content: 'Calculamos pela definição de derivada, fatorando $e^x$:',
            latex: '\\lim_{h \\to 0}\\frac{e^{x+h}-e^x}{h} = e^x \\cdot \\lim_{h \\to 0}\\frac{e^h - 1}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'O que torna e especial',
            content: 'O número $e \\approx 2{,}718$ é o único valor de base para o qual $\\lim_{h \\to 0}\\frac{b^h - 1}{h} = 1$. Para qualquer outra base, esse limite seria uma constante diferente de $1$, e a derivada teria um fator extra. Com base $e$, o fator é $1$ e a derivada é simplesmente $e^x$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Para ln(x): derivação implícita',
            content: 'Para $\\ln(x)$, usamos que ela é a inversa de $e^x$: se $y = \\ln x$, então $x = e^y$. Derivando implicitamente:',
            latex: '1 = e^y \\cdot \\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O número $e$ é especial porque é a única base em que a exponencial é igual à sua própria derivada — crescimento proporcional ao próprio tamanho.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Derive $f(x) = 5e^x - 3\\ln(x)$.',
            solution: 'Derivando termo a termo:',
            solutionLatex: "f'(x) = 5e^x - \\frac{3}{x}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Derive $g(x) = x^2 e^x$ (use a regra do produto).',
            solution: 'Com $u = x^2$ e $v = e^x$:',
            solutionLatex: "g'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = xe^x(2 + x)",
        },
    ],

    // =====================================================================
    // DERIVAÇÃO IMPLÍCITA
    // =====================================================================
    implicit: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Às vezes não conseguimos (ou não queremos) isolar $y$ em função de $x$. Na derivação implícita, derivamos os dois lados da equação em relação a $x$, lembrando que $y$ depende de $x$.\n\nEntão cada vez que derivamos um termo com $y$, aparece um $\\frac{dy}{dx}$ pela regra da cadeia. Depois, basta isolar $\\frac{dy}{dx}$.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: 'F(x,y) = 0 \\implies \\frac{dy}{dx} = -\\frac{F_x}{F_y}',
            content: 'Derive tudo em relação a $x$, trate $y$ como função de $x$, e isole $\\frac{dy}{dx}$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'y depende de x',
            content: 'A derivação implícita não é uma técnica nova — é a regra da cadeia aplicada com um detalhe crucial: $y$ depende de $x$, mesmo que não saibamos explicitar como.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Derivando F(x,y) = 0',
            content: 'Quando temos $F(x,y) = 0$, derivamos ambos os lados em relação a $x$. Termos com $x$ puro são derivados normalmente. Cada termo com $y$ recebe um fator $\\frac{dy}{dx}$ pela regra da cadeia.',
            latex: 'F_x + F_y \\cdot \\frac{dy}{dx} = 0',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Isolando dy/dx',
            content: 'Isolando (desde que $F_y \\neq 0$). O Teorema da Função Implícita garante que, nessas condições, $y$ de fato é uma função diferenciável de $x$ na vizinhança do ponto.',
            latex: '\\frac{dy}{dx} = -\\frac{F_x}{F_y}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Não precisamos isolar $y$ para encontrar $\\frac{dy}{dx}$ — basta derivar a equação inteira respeitando a dependência e resolver para $\\frac{dy}{dx}$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Encontre $\\frac{dy}{dx}$ para $x^2 + y^2 = 25$.',
            solution: 'Derivando ambos os lados: $2x + 2y\\frac{dy}{dx} = 0$. Isolando:',
            solutionLatex: "\\frac{dy}{dx} = -\\frac{x}{y}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Encontre $\\frac{dy}{dx}$ para $x^3 + y^3 = 6xy$.',
            solution: 'Derivando: $3x^2 + 3y^2\\frac{dy}{dx} = 6y + 6x\\frac{dy}{dx}$. Reagrupando $(3y^2 - 6x)\\frac{dy}{dx} = 6y - 3x^2$:',
            solutionLatex: "\\frac{dy}{dx} = \\frac{6y - 3x^2}{3y^2 - 6x} = \\frac{2y - x^2}{y^2 - 2x}",
        },
    ],
};
