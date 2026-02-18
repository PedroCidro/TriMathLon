import type { ContentBlock } from './index';

export const limitesContent: Record<string, ContentBlock[]> = {
    // =====================================================================
    // LIMITES INTUITIVOS
    // =====================================================================
    intuitive_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Quando escrevemos $\\lim_{x \\to a} f(x) = L$, estamos dizendo que, à medida que $x$ se aproxima de $a$ (sem necessariamente chegar lá), os valores de $f(x)$ se aproximam de $L$. O limite não se importa com o que acontece exatamente em $a$ — ele se importa apenas com o comportamento nas vizinhanças de $a$.\n\nPense em se aproximar de um penhasco: o que importa é a tendência do terreno conforme você caminha em direção à borda, não se você está ou não pisando nela. Se de todos os lados o terreno aponta para a mesma altitude, essa altitude é o limite.\n\nEssa ideia é a base de todo o cálculo: derivadas, integrais e séries são definidas por limites. Sem entender o que significa "tender a um valor", nada do resto faz sentido.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\lim_{x \\to a} f(x) = L',
            content: 'Lê-se: "o limite de $f(x)$ quando $x$ tende a $a$ é $L$". Significa que $f(x)$ fica arbitrariamente próximo de $L$ quando $x$ está suficientemente próximo de $a$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Aproximação numérica',
            content: 'A primeira forma de investigar um limite é construir uma tabela de valores. Escolhemos valores de $x$ cada vez mais próximos de $a$ (pela esquerda e pela direita) e observamos para onde $f(x)$ converge. Se os valores se estabilizam em torno de um número $L$, temos evidência de que o limite é $L$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Interpretação gráfica',
            content: 'No gráfico, o limite em $x = a$ é a altura para a qual a curva "caminha" quando nos aproximamos de $a$. Mesmo que haja um buraco no gráfico em $a$ (um ponto removido ou indefinido), o limite ainda pode existir — basta que a curva se dirija a uma altura definida.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'O que o limite NÃO é',
            content: 'O limite $\\lim_{x \\to a} f(x)$ não é necessariamente igual a $f(a)$. Três situações ilustram isso: (1) $f(a)$ pode não estar definido (como em $\\frac{x^2-1}{x-1}$ quando $x=1$); (2) $f(a)$ pode existir mas diferir do limite; (3) o limite pode não existir se a função se comporta diferentemente pela esquerda e pela direita.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O limite é sobre tendência, não sobre chegada — o que importa é para onde a função está caminhando, não onde ela está pisando.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\lim_{x \\to 2} (x^2 - 1)$.',
            solution: 'Como $f(x) = x^2 - 1$ é um polinômio (contínuo em toda parte), podemos substituir diretamente:',
            solutionLatex: '\\lim_{x \\to 2} (x^2 - 1) = 2^2 - 1 = 4 - 1 = 3',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.',
            solution: 'Substituição direta dá $\\frac{0}{0}$ (indeterminação). Fatoramos o numerador: $x^2 - 1 = (x-1)(x+1)$. Cancelando o fator $(x-1)$ (válido pois $x \\neq 1$ no limite):',
            solutionLatex: '\\lim_{x \\to 1} \\frac{(x-1)(x+1)}{x-1} = \\lim_{x \\to 1} (x+1) = 2',
        },
    ],

    // =====================================================================
    // LIMITES LATERAIS
    // =====================================================================
    one_sided_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Às vezes, uma função se comporta de maneira diferente quando nos aproximamos de um ponto pela esquerda e pela direita. O limite pela esquerda ($x \\to a^-$) considera apenas valores menores que $a$, e o limite pela direita ($x \\to a^+$) considera apenas valores maiores que $a$.\n\nImagine uma estrada com um degrau: quem vem do lado esquerdo chega a uma altura, e quem vem do lado direito chega a outra. Se as duas alturas coincidem, o limite bilateral existe; se não coincidem, o limite bilateral não existe.\n\nLimites laterais são essenciais para analisar funções definidas por partes, funções com descontinuidades de salto, e para entender assíntotas verticais.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L',
            content: 'O limite bilateral existe e vale $L$ se e somente se ambos os limites laterais existem e são iguais a $L$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Limite pela esquerda',
            content: 'Escrevemos $\\lim_{x \\to a^-} f(x) = L_1$ quando, para valores de $x$ menores que $a$ e cada vez mais próximos de $a$, os valores de $f(x)$ se aproximam de $L_1$. Ou seja, consideramos apenas $x < a$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Limite pela direita',
            content: 'Escrevemos $\\lim_{x \\to a^+} f(x) = L_2$ quando, para valores de $x$ maiores que $a$ e cada vez mais próximos de $a$, os valores de $f(x)$ se aproximam de $L_2$. Aqui consideramos apenas $x > a$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Condição de existência',
            content: 'O limite bilateral $\\lim_{x \\to a} f(x)$ existe se e somente se $L_1 = L_2$. Se os limites laterais são diferentes, dizemos que o limite bilateral não existe. Essa é a ferramenta principal para detectar descontinuidades de salto.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O limite bilateral existe se e somente se os dois limites laterais existem e são iguais. Quando discordam, a função "salta" — e o limite não existe.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Analise os limites laterais de $f(x) = \\frac{1}{x}$ quando $x \\to 0$.',
            solution: 'Quando $x \\to 0^+$, temos $\\frac{1}{x} \\to +\\infty$. Quando $x \\to 0^-$, temos $\\frac{1}{x} \\to -\\infty$. Como os limites laterais são diferentes:',
            solutionLatex: '\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty, \\quad \\lim_{x \\to 0^-} \\frac{1}{x} = -\\infty \\quad \\Rightarrow \\quad \\lim_{x \\to 0} \\frac{1}{x} \\text{ não existe}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Seja $f(x) = \\begin{cases} x+1 & \\text{se } x < 2 \\\\ 5 & \\text{se } x = 2 \\\\ 2x-1 & \\text{se } x > 2 \\end{cases}$. O limite $\\lim_{x \\to 2} f(x)$ existe?',
            solution: 'Calculamos os limites laterais. Pela esquerda: $\\lim_{x \\to 2^-}(x+1) = 3$. Pela direita: $\\lim_{x \\to 2^+}(2x-1) = 3$. Ambos valem $3$, portanto:',
            solutionLatex: '\\lim_{x \\to 2} f(x) = 3 \\quad (\\text{embora } f(2) = 5 \\neq 3)',
        },
    ],

    // =====================================================================
    // PROPRIEDADES DE LIMITES
    // =====================================================================
    limit_laws: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Limites respeitam a aritmética. Se você conhece o limite de duas funções separadamente, pode determinar o limite da soma, da diferença, do produto e do quociente delas sem precisar voltar à definição.\n\nÉ como uma calculadora que opera sobre tendências: se $f(x) \\to 5$ e $g(x) \\to 3$, então $f(x) + g(x) \\to 8$, $f(x) \\cdot g(x) \\to 15$, e assim por diante. Essas regras permitem decompor limites complicados em pedaços simples e tratáveis.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\lim[f \\pm g] = \\lim f \\pm \\lim g, \\quad \\lim[f \\cdot g] = \\lim f \\cdot \\lim g, \\quad \\lim\\frac{f}{g} = \\frac{\\lim f}{\\lim g}',
            content: 'As leis valem desde que os limites individuais existam e, no caso do quociente, que o limite do denominador seja diferente de zero.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Lei da soma',
            content: 'Se $\\lim_{x \\to a} f(x) = L$ e $\\lim_{x \\to a} g(x) = M$, então $\\lim_{x \\to a}[f(x) + g(x)] = L + M$. A ideia é que, se $f(x)$ está perto de $L$ e $g(x)$ está perto de $M$, a soma está perto de $L + M$. A mesma lógica se aplica à subtração.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Lei do produto',
            content: 'Se $\\lim_{x \\to a} f(x) = L$ e $\\lim_{x \\to a} g(x) = M$, então $\\lim_{x \\to a}[f(x) \\cdot g(x)] = L \\cdot M$. Como consequência, constantes podem ser "puxadas para fora" do limite: $\\lim[c \\cdot f] = c \\cdot \\lim f$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Lei do quociente',
            content: 'Se $\\lim_{x \\to a} f(x) = L$ e $\\lim_{x \\to a} g(x) = M \\neq 0$, então $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{L}{M}$. A condição $M \\neq 0$ é essencial: quando o denominador tende a zero, o quociente pode divergir ou gerar uma indeterminação $\\frac{0}{0}$ que precisa de outras técnicas.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'As propriedades de limites permitem quebrar limites complicados em pedaços simples — trate cada parte separadamente e combine os resultados.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\lim_{x \\to 3}(2x^2 + 5x - 1)$.',
            solution: 'Aplicando as leis da soma e do produto (ou simplesmente substituindo, pois polinômios são contínuos):',
            solutionLatex: '\\lim_{x \\to 3}(2x^2 + 5x - 1) = 2(3)^2 + 5(3) - 1 = 18 + 15 - 1 = 32',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\lim_{x \\to 2}\\frac{x^2 + 1}{x - 1}$.',
            solution: 'O denominador tende a $2 - 1 = 1 \\neq 0$, então podemos aplicar a lei do quociente diretamente:',
            solutionLatex: '\\lim_{x \\to 2}\\frac{x^2 + 1}{x - 1} = \\frac{2^2 + 1}{2 - 1} = \\frac{5}{1} = 5',
        },
    ],

    // =====================================================================
    // TEOREMA DO CONFRONTO (SQUEEZE THEOREM)
    // =====================================================================
    squeeze_theorem: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'O Teorema do Confronto (também chamado Teorema do Sanduíche) diz que, se uma função está "espremida" entre duas outras que convergem para o mesmo valor, então a função do meio também converge para esse valor.\n\nImagine uma pessoa caminhando entre duas paredes que se encontram no mesmo ponto: não importa que caminho ela tome, ela será forçada a passar por aquele ponto. Da mesma forma, se $g(x) \\leq f(x) \\leq h(x)$ e tanto $g$ quanto $h$ tendem a $L$, a função $f$ não tem escapatória.\n\nEsse teorema é a ferramenta ideal quando não conseguimos calcular o limite de $f$ diretamente, mas conseguimos encurralar $f$ entre duas funções cujos limites conhecemos.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: 'g(x) \\leq f(x) \\leq h(x) \\text{ e } \\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L \\implies \\lim_{x \\to a} f(x) = L',
            content: 'Se $f$ está presa entre $g$ e $h$, e ambas tendem ao mesmo limite $L$, então $f$ também tende a $L$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'O sanduíche',
            content: 'Estabelecemos uma desigualdade $g(x) \\leq f(x) \\leq h(x)$ que vale para todo $x$ numa vizinhança de $a$ (exceto possivelmente em $a$). A função $g$ é a cota inferior e $h$ é a cota superior.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Ambas as cotas convergem',
            content: 'Sabemos que $\\lim_{x \\to a} g(x) = L$ e $\\lim_{x \\to a} h(x) = L$. Isso significa que, para $x$ suficientemente próximo de $a$, tanto $g(x)$ quanto $h(x)$ estão arbitrariamente próximos de $L$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'f está espremida',
            content: 'Como $g(x) \\leq f(x) \\leq h(x)$ e ambas as cotas estão próximas de $L$, a função $f(x)$ está encurralada numa faixa cada vez mais estreita em torno de $L$. Portanto, $f(x)$ também deve tender a $L$. Formalmente:',
            latex: 'L - \\varepsilon < g(x) \\leq f(x) \\leq h(x) < L + \\varepsilon',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'O Teorema do Confronto é a ferramenta ideal quando não conseguimos calcular o limite diretamente, mas podemos encurralar a função entre duas cotas que convergem ao mesmo valor.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\lim_{x \\to 0} x^2 \\sin\\!\\left(\\frac{1}{x}\\right)$.',
            solution: 'Sabemos que $-1 \\leq \\sin(1/x) \\leq 1$ para todo $x \\neq 0$. Multiplicando por $x^2 \\geq 0$: $-x^2 \\leq x^2\\sin(1/x) \\leq x^2$. Como $\\lim_{x \\to 0}(-x^2) = 0$ e $\\lim_{x \\to 0} x^2 = 0$, pelo Teorema do Confronto:',
            solutionLatex: '\\lim_{x \\to 0} x^2 \\sin\\!\\left(\\frac{1}{x}\\right) = 0',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Mostre que $\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1$ usando o Teorema do Confronto.',
            solution: 'No círculo unitário, para $0 < x < \\frac{\\pi}{2}$, podemos mostrar geometricamente que $\\sin x \\leq x \\leq \\tan x$. Dividindo tudo por $\\sin x > 0$: $1 \\leq \\frac{x}{\\sin x} \\leq \\frac{1}{\\cos x}$. Invertendo: $\\cos x \\leq \\frac{\\sin x}{x} \\leq 1$. Como $\\lim_{x \\to 0}\\cos x = 1$ e o limite da cota superior é $1$:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1',
        },
    ],

    // =====================================================================
    // CONTINUIDADE
    // =====================================================================
    continuity: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'Uma função contínua em um ponto é uma função sem surpresas: o valor que ela assume no ponto é exatamente o valor que você esperaria com base no comportamento nas vizinhanças. Não há saltos, buracos ou explosões.\n\nDe forma visual, uma função contínua num intervalo é aquela cujo gráfico pode ser desenhado sem levantar o lápis do papel. Mas a definição precisa exige três condições: $f(a)$ deve estar definido, o limite $\\lim_{x \\to a} f(x)$ deve existir, e ambos devem ser iguais.\n\nContinuidade é a ponte entre o comportamento "perto de" e "exatamente em" — e é a propriedade que torna possível usar substituição direta para calcular limites.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: 'f \\text{ é contínua em } a \\iff \\lim_{x \\to a} f(x) = f(a)',
            content: 'A função é contínua em $a$ quando o limite coincide com o valor da função naquele ponto.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Três condições',
            content: 'Para $f$ ser contínua em $x = a$, três condições devem ser satisfeitas simultaneamente: (1) $f(a)$ está definido; (2) $\\lim_{x \\to a} f(x)$ existe; (3) $\\lim_{x \\to a} f(x) = f(a)$. Se qualquer uma falhar, $f$ é descontínua em $a$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Funções básicas são contínuas',
            content: 'Polinômios são contínuos em todo $\\mathbb{R}$. Funções trigonométricas ($\\sin$, $\\cos$) são contínuas em todo $\\mathbb{R}$. A exponencial $e^x$ é contínua em todo $\\mathbb{R}$. O logaritmo $\\ln x$ é contínuo para $x > 0$. Funções racionais $\\frac{p(x)}{q(x)}$ são contínuas onde $q(x) \\neq 0$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Operações preservam continuidade',
            content: 'Se $f$ e $g$ são contínuas em $a$, então $f + g$, $f - g$, $f \\cdot g$ e $\\frac{f}{g}$ (com $g(a) \\neq 0$) também são contínuas em $a$. Além disso, a composição $f \\circ g$ é contínua. Isso permite construir funções contínuas cada vez mais elaboradas a partir de funções simples.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Continuidade = o limite coincide com o valor da função. É a ponte entre o comportamento "perto de" e "exatamente em" — e é o que justifica calcular limites por substituição direta.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'A função $f(x) = \\frac{x^2 - 4}{x - 2}$ é contínua em $x = 2$?',
            solution: '$f(2)$ não está definido (divisão por zero), então a condição (1) falha e $f$ é descontínua em $x = 2$. Porém, o limite existe: fatorando $x^2 - 4 = (x-2)(x+2)$:',
            solutionLatex: '\\lim_{x \\to 2}\\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2}(x+2) = 4 \\quad \\text{(descontinuidade removível)}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Mostre que $p(x) = 3x^3 - 2x + 7$ é contínua em todo ponto.',
            solution: 'Como $p(x)$ é um polinômio, e polinômios são contínuos em todo $\\mathbb{R}$, para qualquer $a$ temos:',
            solutionLatex: '\\lim_{x \\to a} p(x) = p(a) = 3a^3 - 2a + 7 \\quad \\text{para todo } a \\in \\mathbb{R}',
        },
    ],

    // =====================================================================
    // LIMITES TRIGONOMÉTRICOS
    // =====================================================================
    trig_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'O limite fundamental $\\frac{\\sin x}{x} \\to 1$ quando $x \\to 0$ é a ponte entre geometria e cálculo. Para ângulos muito pequenos (em radianos), o seno é praticamente igual ao próprio ângulo: $\\sin(0{,}01) \\approx 0{,}01$.\n\nIsso faz sentido geometricamente: no círculo unitário, quando o ângulo $x$ é muito pequeno, o arco de comprimento $x$ e a reta vertical de comprimento $\\sin x$ são quase indistinguíveis. A razão $\\frac{\\sin x}{x}$ mede quão bem a reta aproxima o arco.\n\nEsse limite é a peça-chave para derivar $\\sin x$ e $\\cos x$, e é a base de todos os limites trigonométricos que aparecem no cálculo.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1 \\qquad \\lim_{x \\to 0}\\frac{\\cos x - 1}{x} = 0',
            content: 'Esses dois limites fundamentais são a base de todas as derivadas trigonométricas.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Argumento geométrico',
            content: 'No círculo unitário, considere um ângulo $x$ com $0 < x < \\frac{\\pi}{2}$. Comparando áreas de triângulos e setores circulares, obtemos a desigualdade fundamental:',
            latex: '\\sin x \\leq x \\leq \\tan x',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Dividindo por sin x',
            content: 'Dividindo toda a desigualdade por $\\sin x > 0$ e invertendo:',
            latex: '\\cos x \\leq \\frac{\\sin x}{x} \\leq 1',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Teorema do Confronto',
            content: 'Quando $x \\to 0^+$, temos $\\cos x \\to 1$ e a cota superior é $1$. Pelo Teorema do Confronto, $\\frac{\\sin x}{x} \\to 1$. Como $\\frac{\\sin x}{x}$ é uma função par (mesma expressão para $x$ e $-x$), o limite pela esquerda também é $1$.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Consequência para (cos x - 1)/x',
            content: 'Usamos a identidade $\\cos x - 1 = -2\\sin^2\\!\\left(\\frac{x}{2}\\right)$. Então:',
            latex: '\\frac{\\cos x - 1}{x} = \\frac{-2\\sin^2(x/2)}{x} = -\\frac{\\sin(x/2)}{x/2} \\cdot \\sin\\!\\left(\\frac{x}{2}\\right) \\to -1 \\cdot 0 = 0',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Esses dois limites fundamentais são a base de todas as derivadas trigonométricas — sem eles, não conseguiríamos provar que a derivada de $\\sin x$ é $\\cos x$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\lim_{x \\to 0}\\frac{\\sin(3x)}{x}$.',
            solution: 'Multiplicamos e dividimos por $3$ para criar a forma $\\frac{\\sin(u)}{u}$ com $u = 3x$:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\sin(3x)}{x} = \\lim_{x \\to 0} 3 \\cdot \\frac{\\sin(3x)}{3x} = 3 \\cdot 1 = 3',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\lim_{x \\to 0}\\frac{\\tan x}{x}$.',
            solution: 'Escrevemos $\\tan x = \\frac{\\sin x}{\\cos x}$ e separamos:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\tan x}{x} = \\lim_{x \\to 0}\\frac{\\sin x}{x} \\cdot \\frac{1}{\\cos x} = 1 \\cdot \\frac{1}{1} = 1',
        },
    ],

    // =====================================================================
    // LIMITES NO INFINITO
    // =====================================================================
    limits_at_infinity: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'A Intuição',
            content: 'O que acontece com uma função quando $x$ cresce sem parar? Um limite no infinito descreve o comportamento de longo prazo da função — sua assíntota horizontal, se existir.\n\nPara funções racionais (quociente de polinômios), a resposta depende apenas dos termos de maior grau. Quando $x$ é enorme, termos como $+3$ ou $-2x$ são insignificantes comparados a $5x^3$. É como comparar salários: se alguém ganha milhões, os centavos não importam.\n\nEssa ideia se estende a qualquer função: para determinar o comportamento no infinito, identifique os termos dominantes e ignore o resto.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Resultado',
            latex: '\\lim_{x \\to \\infty} \\frac{a_n x^n + \\cdots}{b_m x^m + \\cdots} = \\begin{cases} \\dfrac{a_n}{b_m} & \\text{se } n = m \\\\[6pt] 0 & \\text{se } n < m \\\\[6pt] \\pm\\infty & \\text{se } n > m \\end{cases}',
            content: 'O limite de uma função racional no infinito depende da comparação entre os graus do numerador ($n$) e do denominador ($m$).',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Assíntotas horizontais',
            content: 'Se $\\lim_{x \\to \\infty} f(x) = L$ (com $L$ finito), a reta $y = L$ é uma assíntota horizontal do gráfico de $f$. A função se aproxima dessa reta para valores grandes de $x$, embora possa cruzá-la em pontos intermediários.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Termos dominantes',
            content: 'Para $x$ muito grande, o termo de maior grau domina todos os outros. Por exemplo, em $3x^2 + 100x + 999$, quando $x = 1000$, o termo $3x^2 = 3.000.000$ faz os outros ($100.000 + 999$) parecerem desprezíveis. Por isso, apenas os termos de maior grau determinam o comportamento no infinito.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Dividir pelo maior grau',
            content: 'A técnica padrão é dividir numerador e denominador pela maior potência de $x$ presente no denominador. Com isso, todos os termos exceto os dominantes geram frações da forma $\\frac{c}{x^k}$ que tendem a zero:',
            latex: '\\frac{a_n x^n + \\cdots}{b_m x^m + \\cdots} = \\frac{a_n x^{n-m} + \\cdots}{b_m + \\cdots} \\xrightarrow{x \\to \\infty} \\begin{cases} a_n/b_m & \\text{se } n = m \\\\ 0 & \\text{se } n < m \\end{cases}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Para funções racionais, o limite no infinito depende apenas dos termos de maior grau — todo o resto se torna insignificante quando $x$ é suficientemente grande.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Exemplo 1',
            content: 'Calcule $\\lim_{x \\to \\infty}\\frac{3x^2 + 1}{5x^2 - 2}$.',
            solution: 'Os graus do numerador e do denominador são iguais ($n = m = 2$). Dividindo tudo por $x^2$:',
            solutionLatex: '\\lim_{x \\to \\infty}\\frac{3x^2 + 1}{5x^2 - 2} = \\lim_{x \\to \\infty}\\frac{3 + \\frac{1}{x^2}}{5 - \\frac{2}{x^2}} = \\frac{3 + 0}{5 - 0} = \\frac{3}{5}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Exemplo 2',
            content: 'Calcule $\\lim_{x \\to \\infty}\\frac{x}{x^2 + 1}$.',
            solution: 'O grau do numerador ($n = 1$) é menor que o grau do denominador ($m = 2$). Dividindo tudo por $x^2$:',
            solutionLatex: '\\lim_{x \\to \\infty}\\frac{x}{x^2 + 1} = \\lim_{x \\to \\infty}\\frac{\\frac{1}{x}}{1 + \\frac{1}{x^2}} = \\frac{0}{1 + 0} = 0',
        },
    ],
};
