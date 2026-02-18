import type { ContentBlock } from './index';

export const integraisContent: Record<string, ContentBlock[]> = {
    // =====================================================================
    // INTEGRAIS BÁSICAS
    // =====================================================================
    basic_integrals: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Integrar é o processo inverso de derivar. Se a derivada responde "qual é a taxa de variação?", a integral responde "qual função tem essa taxa de variação?".\n\nAs integrais imediatas são as "tabuadas" da integração — fórmulas que reconhecemos de cara porque são simplesmente as derivadas conhecidas lidas de trás para frente.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
            content: 'A potência sobe em 1 e divide pelo novo expoente. Sempre adicionamos a constante $C$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Verificação pela derivada',
            content: 'A verificação revela a essência da integração. Se derivamos $\\frac{x^{n+1}}{n+1} + C$, pela regra da potência obtemos exatamente o integrando:',
            latex: '\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1} + C\\right) = (n+1) \\cdot \\frac{x^n}{n+1} = x^n',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'A constante de integração',
            content: 'Mas por que aparece o $C$? Porque a derivada de qualquer constante é zero: as funções $x^3 + 5$ e $x^3 - 100$ têm a mesma derivada $3x^2$, então ambas são antiderivadas válidas de $3x^2$. A constante $C$ absorve a informação que a derivada "apaga".',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Família de funções',
            content: 'A integral indefinida representa uma família infinita de funções paralelas, diferindo apenas por um deslocamento vertical. Essa é a conexão fundamental do Cálculo: derivar e integrar são operações inversas.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Integrar é literalmente desfazer a derivada — e a constante $C$ existe porque a derivada "apaga" deslocamentos verticais.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int (3x^2 + 4x - 1)\\,dx$.',
            solution: 'Integramos termo a termo usando a regra da potência:',
            solutionLatex: '\\int 3x^2\\,dx + \\int 4x\\,dx - \\int 1\\,dx = x^3 + 2x^2 - x + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int \\frac{1}{x}\\,dx$.',
            solution: 'Como $n = -1$ é o caso especial excluído pela fórmula da potência, usamos a antiderivada conhecida:',
            solutionLatex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C',
        },
    ],

    // =====================================================================
    // SUBSTITUIÇÃO
    // =====================================================================
    substitution: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'A substituição é a regra da cadeia ao contrário. Se a integral contém uma função e sua derivada aparece como fator, podemos trocar essa função por uma variável $u$, simplificando tudo.\n\nÉ como trocar a roupa de uma integral complicada por uma mais simples. A chave é encontrar o $u$ certo: geralmente é a função "de dentro".',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\int f(g(x))\\,g\'(x)\\,dx = \\int f(u)\\,du \\quad \\text{com } u = g(x)',
            content: 'Substituímos a função interna por $u$ e $g\'(x)\\,dx$ por $du$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'A regra da cadeia ao contrário',
            content: 'Se $F$ é a antiderivada de $f$ (ou seja, $F\' = f$), então pela regra da cadeia a derivada da composição é:',
            latex: '\\frac{d}{dx}\\left[F(g(x))\\right] = f(g(x)) \\cdot g\'(x)',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Lendo de trás para frente',
            content: 'Lendo essa igualdade de trás para frente, vemos que $F(g(x)) + C$ é a antiderivada de $f(g(x)) \\cdot g\'(x)$. Ou seja: $\\int f(g(x)) \\cdot g\'(x)\\,dx = F(g(x)) + C$. É por isso que procuramos uma função "de dentro" cuja derivada aparece como fator "do lado de fora" — quando isso acontece, a regra da cadeia garante que a substituição funciona.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'A notação u = g(x)',
            content: 'A notação $u = g(x)$, $du = g\'(x)\\,dx$ é apenas uma forma organizada de enxergar esse fato: o $g\'(x)\\,dx$ se transforma em $du$, e a integral complicada em $x$ vira uma integral simples em $u$.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'A substituição não é um truque — é a regra da cadeia lida ao contrário, reconhecendo que a derivada da função interna já está presente no integrando.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int 2x \\cdot e^{x^2}\\,dx$.',
            solution: 'Fazendo $u = x^2$, temos $du = 2x\\,dx$. A integral vira $\\int e^u\\,du$:',
            solutionLatex: '\\int e^u\\,du = e^u + C = e^{x^2} + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int \\cos(3x)\\,dx$.',
            solution: 'Com $u = 3x$, $du = 3\\,dx$, logo $dx = \\frac{du}{3}$:',
            solutionLatex: '\\int \\cos(u)\\frac{du}{3} = \\frac{1}{3}\\sin(u) + C = \\frac{1}{3}\\sin(3x) + C',
        },
    ],

    // =====================================================================
    // INTEGRAÇÃO POR PARTES
    // =====================================================================
    by_parts: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'A integração por partes é a regra do produto ao contrário. Quando temos o produto de duas funções e não conseguimos integrar diretamente, "transferimos" a derivada de uma para a outra.\n\nEscolhemos uma parte para derivar ($u$) e outra para integrar ($dv$). A regra LIATE (Logarítmica, Inversa trig, Algébrica, Trigonométrica, Exponencial) ajuda a escolher $u$.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\int u\\,dv = uv - \\int v\\,du',
            content: 'Transferimos a derivada de $u$ para $v$, trocando o integrando por um mais simples.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Regra do produto',
            content: 'Tudo começa pela regra do produto para derivadas:',
            latex: '\\frac{d}{dx}(u \\cdot v) = u\'v + uv\'',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Integrando os dois lados',
            content: 'Integrando ambos os lados em relação a $x$, obtemos:',
            latex: 'uv = \\int u\'v\\,dx + \\int uv\'\\,dx',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Rearranjando',
            content: 'Rearranjando e escrevendo na notação diferencial ($u\' dx = du$, $v\' dx = dv$):',
            latex: '\\int u\\,dv = uv - \\int v\\,du',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'A estratégia LIATE',
            content: 'Mas por que isso é útil? Porque transfere a derivada de uma função para a outra. Se $u$ é algo que simplifica ao derivar (como $x^2 \\to 2x \\to 2 \\to 0$) e $dv$ é algo fácil de integrar (como $e^x$ ou $\\sin x$), então a nova integral $\\int v\\,du$ é mais simples que a original. A regra LIATE (Logarítmica, Inversa trig, Algébrica, Trigonométrica, Exponencial) ordena de "mais quer ser $u$" para "mais quer ser $dv$": logaritmos simplificam muito ao derivar, enquanto exponenciais nem mudam ao integrar.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'A integração por partes não é um truque — é a regra do produto ao contrário, transferindo a complexidade de uma função para outra até a integral ficar simples.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int x e^x\\,dx$.',
            solution: 'Escolhemos $u = x$ ($du = dx$) e $dv = e^x dx$ ($v = e^x$). Aplicando a fórmula:',
            solutionLatex: '\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C = e^x(x-1) + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int x^2 \\sin(x)\\,dx$.',
            solution: 'Com $u = x^2$, $dv = \\sin(x)dx$: primeira aplicação dá $-x^2\\cos x + 2\\int x\\cos x\\,dx$. Aplicando por partes novamente com $u=x$, $dv=\\cos x\\,dx$:',
            solutionLatex: '-x^2\\cos x + 2(x\\sin x - \\int \\sin x\\,dx) = -x^2\\cos x + 2x\\sin x + 2\\cos x + C',
        },
    ],

    // =====================================================================
    // INTEGRAIS TRIGONOMÉTRICAS
    // =====================================================================
    trig_integrals: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Integrais trigonométricas envolvem potências e produtos de seno e cosseno. A estratégia principal é usar identidades trigonométricas para reduzir a complexidade.\n\nSe um dos expoentes é ímpar, separamos um fator e usamos $\\sin^2 + \\cos^2 = 1$ para converter o resto em uma só função — abrindo caminho para uma substituição simples.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\sin^2(x) = \\frac{1 - \\cos(2x)}{2} \\qquad \\cos^2(x) = \\frac{1 + \\cos(2x)}{2}',
            content: 'Identidades de ângulo duplo para reduzir potências pares de seno e cosseno.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Expoente ímpar: separar um fator',
            content: 'A estratégia depende de uma observação sobre paridade. Quando um dos expoentes é ímpar, separamos um fator de $\\sin x$ ou $\\cos x$ e usamos $\\sin^2 x + \\cos^2 x = 1$ para converter o resto. Exemplo:',
            latex: '\\sin^3 x = (1 - \\cos^2 x) \\cdot \\sin x',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Substituição natural',
            content: 'Com $u = \\cos x$, $du = -\\sin x\\,dx$, tudo vira polinômio em $u$. Funciona porque a identidade pitagórica converte entre $\\sin^2$ e $\\cos^2$, e o fator separado fornece exatamente o $du$ da substituição.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Expoentes pares: ângulo duplo',
            content: 'Quando ambos os expoentes são pares, não sobra fator para separar. Aí usamos as fórmulas de ângulo duplo. De $\\cos(2x) = 1 - 2\\sin^2 x = 2\\cos^2 x - 1$ isolamos as identidades de redução. Cada aplicação reduz a potência pela metade, até chegarmos a integrais de $\\cos$ e $\\sin$ simples.',
            latex: '\\sin^2 x = \\frac{1-\\cos(2x)}{2} \\qquad \\cos^2 x = \\frac{1+\\cos(2x)}{2}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'A identidade pitagórica e as fórmulas de ângulo duplo são as duas ferramentas centrais: a primeira resolve expoentes ímpares via substituição, a segunda reduz expoentes pares progressivamente.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int \\sin^3(x)\\,dx$.',
            solution: 'Separamos: $\\int \\sin^2(x)\\sin(x)\\,dx = \\int (1-\\cos^2(x))\\sin(x)\\,dx$. Com $u = \\cos(x)$, $du = -\\sin(x)dx$:',
            solutionLatex: '-\\int (1-u^2)du = -u + \\frac{u^3}{3} + C = -\\cos(x) + \\frac{\\cos^3(x)}{3} + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int \\cos^2(x)\\,dx$.',
            solution: 'Pela identidade de ângulo duplo: $\\int \\frac{1+\\cos(2x)}{2}\\,dx$:',
            solutionLatex: '\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C',
        },
    ],

    // =====================================================================
    // SUBSTITUIÇÃO TRIGONOMÉTRICA
    // =====================================================================
    trig_sub: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Quando aparecem expressões como $\\sqrt{a^2 - x^2}$, $\\sqrt{a^2 + x^2}$ ou $\\sqrt{x^2 - a^2}$, uma substituição trigonométrica transforma a raiz em algo simples.\n\nA ideia é usar o triângulo retângulo: os lados e a hipotenusa criam relações que eliminam a raiz. É como vestir a integral com uma "roupa trigonométrica" que simplifica a expressão.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\sqrt{a^2 - x^2} \\Rightarrow x = a\\sin\\theta \\qquad \\sqrt{a^2 + x^2} \\Rightarrow x = a\\tan\\theta',
            content: 'Cada forma de raiz tem uma substituição trigonométrica correspondente.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'O triângulo retângulo',
            content: 'A ideia parte de um triângulo retângulo. Cada forma de raiz corresponde a uma relação entre os lados do triângulo. A identidade pitagórica ($\\sin^2\\theta + \\cos^2\\theta = 1$ e suas variantes) "absorve" a raiz quadrada, transformando-a num monômio trigonométrico.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Para √(a² - x²)',
            content: 'Quando vemos $\\sqrt{a^2 - x^2}$, pensamos: isso parece o cateto de um triângulo com hipotenusa $a$. Se $x = a\\sin\\theta$, pela identidade pitagórica a raiz desaparece:',
            latex: 'a^2 - x^2 = a^2(1 - \\sin^2\\theta) = a^2\\cos^2\\theta \\implies \\sqrt{a^2 - x^2} = a\\cos\\theta',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Para √(a² + x²)',
            content: 'O triângulo tem catetos $a$ e $x$ e hipotenusa $\\sqrt{a^2+x^2}$. Com $x = a\\tan\\theta$:',
            latex: 'a^2 + a^2\\tan^2\\theta = a^2\\sec^2\\theta \\implies \\sqrt{a^2+x^2} = a\\sec\\theta',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Para √(x² - a²)',
            content: 'Usamos $x = a\\sec\\theta$ e a identidade $\\sec^2\\theta - 1 = \\tan^2\\theta$. Em todos os casos, a mesma lógica: a identidade pitagórica absorve a raiz quadrada. A substituição não é arbitrária — cada forma de raiz corresponde a um lado do triângulo retângulo.',
            latex: 'x^2 - a^2 = a^2(\\sec^2\\theta - 1) = a^2\\tan^2\\theta \\implies \\sqrt{x^2-a^2} = a\\tan\\theta',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Cada forma de raiz ($a^2 - x^2$, $a^2 + x^2$, $x^2 - a^2$) corresponde a um lado do triângulo retângulo — a substituição trigonométrica simplesmente traduz a raiz para a linguagem do triângulo.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int \\frac{dx}{\\sqrt{4-x^2}}$.',
            solution: 'Com $x = 2\\sin\\theta$, $dx = 2\\cos\\theta\\,d\\theta$ e $\\sqrt{4-x^2} = 2\\cos\\theta$. A integral vira $\\int \\frac{2\\cos\\theta}{2\\cos\\theta}d\\theta = \\int d\\theta$:',
            solutionLatex: '\\theta + C = \\arcsin\\!\\left(\\frac{x}{2}\\right) + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int \\frac{x^2}{\\sqrt{x^2+9}}\\,dx$.',
            solution: 'Com $x = 3\\tan\\theta$, $dx = 3\\sec^2\\theta\\,d\\theta$, $\\sqrt{x^2+9} = 3\\sec\\theta$. A integral vira $9\\int \\tan^2\\theta\\sec\\theta\\,d\\theta$. Usando $\\tan^2\\theta = \\sec^2\\theta - 1$ e resolvendo:',
            solutionLatex: '\\frac{x\\sqrt{x^2+9}}{2} - \\frac{9}{2}\\ln\\!\\left|\\frac{x+\\sqrt{x^2+9}}{3}\\right| + C',
        },
    ],

    // =====================================================================
    // FRAÇÕES PARCIAIS
    // =====================================================================
    partial_fractions: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Quando temos uma fração de polinômios, podemos quebrá-la em frações mais simples — é como decompor uma fração numérica: $\\frac{5}{6} = \\frac{1}{2} + \\frac{1}{3}$.\n\nCada fator do denominador contribui com uma fração parcial, e cada uma dessas é fácil de integrar. O passo crucial é fatorar o denominador e encontrar os coeficientes.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
            content: 'Cada fator linear do denominador contribui com uma fração parcial simples.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Fatorar o denominador',
            content: 'O primeiro passo é fatorar o denominador completamente. O Teorema da Decomposição garante: se o grau do numerador é menor que o do denominador e o denominador está fatorado, existe uma decomposição única em frações parciais.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Decompor em frações simples',
            content: 'Para cada fator linear $(x - a)$ do denominador, escrevemos uma fração $\\frac{A}{x-a}$ com coeficiente desconhecido. É como desmontar a fração em peças mais simples — assim como $\\frac{5}{6} = \\frac{1}{2} + \\frac{1}{3}$.',
            latex: '\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Encontrar os coeficientes',
            content: 'Multiplicamos ambos os lados pelo denominador original, obtendo uma igualdade entre polinômios. Substituindo valores estratégicos de $x$ (as raízes do denominador), cada equação revela um coeficiente diretamente.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Integrar cada fração',
            content: 'Cada fração $\\frac{A}{x-a}$ integra como $A\\ln|x-a|$ — algo muito mais simples que a fração original. Não estamos simplificando a função — estamos reescrevendo-a numa forma onde cada pedaço é integrável imediatamente.',
            latex: '\\int \\frac{A}{x-a}\\,dx = A\\ln|x-a| + C',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Frações parciais não simplificam a função — reescrevem-na numa forma onde cada pedaço é uma integral imediata de logaritmo.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int \\frac{5x+1}{x^2-x-2}\\,dx$.',
            solution: 'Fatorando: $x^2-x-2 = (x-2)(x+1)$. Decompomos: $\\frac{5x+1}{(x-2)(x+1)} = \\frac{A}{x-2} + \\frac{B}{x+1}$. Com $x=2$: $A = \\frac{11}{3}$. Com $x=-1$: $B = \\frac{4}{3}$.',
            solutionLatex: '\\frac{11}{3}\\ln|x-2| + \\frac{4}{3}\\ln|x+1| + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\int \\frac{3}{x^2-9}\\,dx$.',
            solution: '$x^2-9 = (x-3)(x+3)$. Decomposição: $\\frac{3}{(x-3)(x+3)} = \\frac{A}{x-3}+\\frac{B}{x+3}$. Com $x=3$: $A = \\frac{1}{2}$. Com $x=-3$: $B = -\\frac{1}{2}$.',
            solutionLatex: '\\frac{1}{2}\\ln|x-3| - \\frac{1}{2}\\ln|x+3| + C = \\frac{1}{2}\\ln\\!\\left|\\frac{x-3}{x+3}\\right| + C',
        },
    ],

    // =====================================================================
    // INTEGRAIS IMPRÓPRIAS
    // =====================================================================
    improper: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Uma integral imprópria tem algum "problema": o intervalo vai até o infinito, ou o integrando tem uma assíntota vertical. Parece impossível calcular a área de uma região infinita, mas às vezes essa área é finita!\n\nA ideia é usar limites: substituímos o infinito (ou o ponto problemático) por uma variável e vemos se o resultado converge.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_a^b f(x)\\,dx',
            content: 'Substituímos o infinito por $b$ e tomamos o limite quando $b \\to \\infty$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Substituir infinito por limite',
            content: 'Como pode uma região infinita ter área finita? Definimos a integral imprópria como um limite: calculamos a integral até $b$ e vemos se o resultado se estabiliza quando $b$ cresce.',
            latex: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_a^b f(x)\\,dx',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Critério p',
            content: 'O exemplo revelador: $\\int_1^{\\infty} \\frac{1}{x^p}\\,dx$ converge se $p > 1$ e diverge se $p \\leq 1$. A antiderivada é $\\frac{x^{1-p}}{1-p}$, e quando $1-p < 0$ (ou seja, $p > 1$), $x^{1-p} \\to 0$ quando $x \\to \\infty$ — a função cai rápido o suficiente para que a soma de todas as fatias de área convirja. Com $p = 1$ temos $\\ln x$, que cresce sem limite.',
            latex: '\\int_1^{\\infty} \\frac{1}{x^p}\\,dx \\quad \\begin{cases} \\text{converge} & \\text{se } p > 1 \\\\ \\text{diverge} & \\text{se } p \\leq 1 \\end{cases}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Descontinuidades',
            content: 'Para integrais com assíntota vertical (como $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$), a lógica é a mesma: substituímos o ponto problemático por um limite e verificamos se a área se estabiliza. Infinito não significa automaticamente divergente — depende de quão rápido a função se comporta.',
            latex: '\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx = \\lim_{a \\to 0^+} \\int_a^1 x^{-1/2}\\,dx',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Infinito não significa automaticamente divergente — a convergência depende de quão rápido a função vai a zero comparada com o crescimento do intervalo.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$.',
            solution: 'Aplicamos a definição com limite:',
            solutionLatex: '\\lim_{b \\to \\infty}\\left[-\\frac{1}{x}\\right]_1^b = \\lim_{b \\to \\infty}\\left(-\\frac{1}{b}+1\\right) = 1',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Determine se $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ converge.',
            solution: 'Há descontinuidade em $x=0$. Substituímos pelo limite $a \\to 0^+$:',
            solutionLatex: '\\lim_{a \\to 0^+}[2\\sqrt{x}]_a^1 = \\lim_{a \\to 0^+}(2-2\\sqrt{a}) = 2',
        },
    ],
};
