import type { ContentBlock } from './index';

export const edosContent: Record<string, ContentBlock[]> = {
    // =====================================================================
    // SEPARÁVEL
    // =====================================================================
    separable: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Uma EDO separável é aquela em que conseguimos colocar tudo que depende de $y$ de um lado e tudo que depende de $x$ do outro. É como separar ingredientes em dois recipientes: os \"$y$-ingredientes\" num lado, os \"$x$-ingredientes\" no outro.\n\nDepois, integramos cada lado separadamente. A \"separação\" parece informal — \"passamos $dx$ para o outro lado\" — mas tem fundamento rigoroso: é a regra da cadeia e o teorema da substituição trabalhando juntos.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "\\frac{dy}{dx} = f(x)g(y) \\implies \\int \\frac{dy}{g(y)} = \\int f(x)\\,dx",
            content: "Separe as variáveis e integre cada lado independentemente.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Dividir por g(y)",
            content: "Se $\\frac{dy}{dx} = f(x)g(y)$ e $g(y) \\neq 0$, dividimos ambos os lados por $g(y)$ para isolar os termos em $y$ à esquerda:",
            latex: "\\frac{1}{g(y)}\\frac{dy}{dx} = f(x)",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Integrar ambos os lados em x",
            content: "Integramos ambos os lados em relação a $x$. Isso é válido porque se duas funções são iguais, suas integrais também são:",
            latex: "\\int \\frac{1}{g(y)}\\frac{dy}{dx}\\,dx = \\int f(x)\\,dx",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Substituição",
            content: "Pelo teorema da substituição (com $y = y(x)$, logo $dy = \\frac{dy}{dx}dx$), o lado esquerdo se transforma. A \"separação\" não é manipulação mágica com diferenciais — é integração dos dois lados seguida de uma substituição:",
            latex: "\\int \\frac{1}{g(y)}\\,dy = \\int f(x)\\,dx",
        },
        {
            id: "insight",
            type: "insight",
            content: "A separação de variáveis é rigorosa: a regra da cadeia e o teorema da substituição justificam o que parece ser uma manipulação informal com diferenciais.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $\\frac{dy}{dx} = xy$ com $y(0) = 2$.",
            solution: "Separando: $\\frac{dy}{y} = x\\,dx$. Integrando: $\\ln|y| = \\frac{x^2}{2} + C$, logo $y = Ae^{x^2/2}$. Com $y(0) = 2$: $A = 2$.",
            solutionLatex: "y = 2e^{x^2/2}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $\\frac{dy}{dx} = \\frac{x^2}{y}$.",
            solution: "Separando: $y\\,dy = x^2\\,dx$. Integrando: $\\frac{y^2}{2} = \\frac{x^3}{3} + C$, logo $y^2 = \\frac{2x^3}{3} + C_1$.",
            solutionLatex: "y = \\pm\\sqrt{\\frac{2x^3}{3} + C_1}",
        },
    ],

    // =====================================================================
    // LINEAR DE 1ª ORDEM
    // =====================================================================
    first_order_linear: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Uma EDO linear de 1a ordem tem a forma $y' + P(x)y = Q(x)$. O truque genial é multiplicar a equação por um \"fator integrante\" $\\mu(x) = e^{\\int P(x)dx}$ que transforma o lado esquerdo na derivada exata de $\\mu \\cdot y$.\n\nÉ como encontrar o multiplicador mágico que faz tudo se encaixar numa derivada de produto. E o mais elegante: encontrar $\\mu$ é, em si, uma EDO separável que já sabemos resolver.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "y' + P(x)y = Q(x) \\implies y = \\frac{1}{\\mu}\\int \\mu\\,Q\\,dx, \\quad \\mu = e^{\\int P\\,dx}",
            content: "Multiplique pelo fator integrante, reconheça a derivada do produto e integre.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Engenharia reversa",
            content: "Queremos multiplicar $y' + Py = Q$ por alguma função $\\mu(x)$ tal que o lado esquerdo vire $(\\mu y)'$. Expandindo pela regra do produto: $(\\mu y)' = \\mu' y + \\mu y'$. Comparando com $\\mu(y' + Py) = \\mu y' + \\mu P y$, precisamos que $\\mu'$ cumpra:",
            latex: "\\mu' y + \\mu y' = \\mu y' + \\mu P y \\implies \\mu' = \\mu P",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Encontrando μ",
            content: "A condição $\\mu' = \\mu P$ é uma EDO separável! Separando e integrando: $\\frac{\\mu'}{\\mu} = P$, logo $\\ln|\\mu| = \\int P\\,dx$.",
            latex: "\\frac{\\mu'}{\\mu} = P \\implies \\mu = e^{\\int P\\,dx}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Com o fator integrante",
            content: "Com esse $\\mu$, multiplicamos a equação original. O lado esquerdo é exatamente a derivada de $\\mu y$ pela regra do produto:",
            latex: "(\\mu y)' = \\mu Q",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Integrando",
            content: "Integramos ambos os lados para obter $\\mu y = \\int \\mu Q\\,dx + C$. Dividindo por $\\mu$, temos a solução geral. O fator integrante é a única função que transforma a equação numa derivada de produto.",
        },
        {
            id: "insight",
            type: "insight",
            content: "O fator integrante não é mágica — é engenharia reversa: perguntamos \"o que preciso multiplicar para obter uma derivada de produto?\" e a resposta vem de uma EDO separável.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $y' + 2y = e^{-x}$.",
            solution: "$P(x) = 2$, logo $\\mu = e^{2x}$. Multiplicando: $(e^{2x}y)' = e^{2x} \\cdot e^{-x} = e^x$. Integrando: $e^{2x}y = e^x + C$.",
            solutionLatex: "y = e^{-x} + Ce^{-2x}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $y' - \\frac{y}{x} = x^2$ para $x > 0$.",
            solution: "$P(x) = -\\frac{1}{x}$, logo $\\mu = e^{-\\ln x} = \\frac{1}{x}$. Multiplicando: $\\left(\\frac{y}{x}\\right)' = x$. Integrando: $\\frac{y}{x} = \\frac{x^2}{2} + C$.",
            solutionLatex: "y = \\frac{x^3}{2} + Cx",
        },
    ],

    // =====================================================================
    // EXATA
    // =====================================================================
    exact: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Uma equação exata $M\\,dx + N\\,dy = 0$ é aquela em que já existe uma função $F(x,y)$ cuja diferencial total é exatamente $M\\,dx + N\\,dy$. Ou seja, $dF = 0$, logo $F(x,y) = C$ é a solução.\n\nO teste é simples: se $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$, a equação é exata. É como descobrir que uma combinação de peças forma um quebra-cabeça perfeito.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "M\\,dx + N\\,dy = 0 \\text{ é exata se } \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}",
            content: "Se a condição de exatidão vale, existe $F(x,y)$ tal que $F(x,y) = C$ é a solução.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Diferencial total",
            content: "Imagine uma superfície $F(x,y)$. As curvas de nível $F(x,y) = C$ são como linhas de altitude num mapa topográfico. Se nos movemos ao longo de uma curva de nível, $F$ não muda:",
            latex: "dF = F_x\\,dx + F_y\\,dy = 0",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Condição de exatidão",
            content: "Comparando $dF = 0$ com $M\\,dx + N\\,dy = 0$, temos $M = F_x$ e $N = F_y$. Pelo teorema de Schwarz, se $F$ existe, então $F_{xy} = F_{yx}$, o que exige:",
            latex: "\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Encontrando F",
            content: "Para encontrar $F$, integramos $M$ em $x$: $F = \\int M\\,dx + g(y)$, onde $g(y)$ é uma \"constante\" que pode depender de $y$. Determinamos $g(y)$ exigindo $F_y = N$: isso dá uma equação para $g'(y)$ que envolve apenas $y$.",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Solução",
            content: "A solução da EDO é a família de curvas de nível da superfície $F$. Estamos encontrando as curvas ao longo das quais a \"altitude\" $F$ é constante:",
            latex: "F(x,y) = C",
        },
        {
            id: "insight",
            type: "insight",
            content: "A condição $M_y = N_x$ verifica se as peças se encaixam num quebra-cabeça perfeito — se existe uma superfície $F$ cujas curvas de nível são as soluções.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $(2xy + 3)dx + (x^2 + 4y)dy = 0$.",
            solution: "Verificação: $M_y = 2x$ e $N_x = 2x$ — exata! $F = \\int (2xy+3)dx = x^2y + 3x + g(y)$. $F_y = x^2 + g'(y) = x^2 + 4y \\implies g'(y) = 4y \\implies g(y) = 2y^2$.",
            solutionLatex: "x^2y + 3x + 2y^2 = C",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $(ye^{xy} + 2x)dx + (xe^{xy} + 1)dy = 0$.",
            solution: "$M_y = e^{xy} + xye^{xy}$ e $N_x = e^{xy} + xye^{xy}$ — exata! $F = \\int (xe^{xy}+1)dy = e^{xy} + y + h(x)$. $F_x = ye^{xy} + h'(x) = ye^{xy} + 2x \\implies h'(x) = 2x \\implies h(x) = x^2$.",
            solutionLatex: "e^{xy} + y + x^2 = C",
        },
    ],

    // =====================================================================
    // HOMOGÊNEA
    // =====================================================================
    homogeneous: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Uma EDO homogênea é aquela onde $\\frac{dy}{dx}$ depende apenas da razão $\\frac{y}{x}$. A substituição $v = \\frac{y}{x}$ (ou seja, $y = vx$) transforma a equação numa EDO separável em $v$ e $x$.\n\nA intuição é que, se a equação \"não distingue escala\" (multiplicar $x$ e $y$ pelo mesmo fator não muda nada), então a razão $v = y/x$ é a variável natural.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "\\frac{dy}{dx} = \\phi\\!\\left(\\frac{y}{x}\\right) \\implies v + x\\frac{dv}{dx} = \\phi(v), \\quad v = \\frac{y}{x}",
            content: "Substitua $v = y/x$ para reduzir a uma EDO separável.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Invariância de escala",
            content: "Uma EDO homogênea de grau 0 tem a propriedade $f(tx,ty) = f(x,y)$ para todo $t > 0$: multiplicar $x$ e $y$ pelo mesmo fator não muda nada. Fazendo $t = 1/x$: $f(x,y) = f(1, y/x) = \\phi(y/x)$. Isso prova que $\\frac{dy}{dx}$ depende apenas da razão $v = y/x$.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Substituição natural",
            content: "A substituição $y = vx$ é natural: se a razão é o que importa, fazemos dela a nova variável. Derivando $y = vx$ pela regra do produto:",
            latex: "\\frac{dy}{dx} = v + x\\frac{dv}{dx}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "EDO separável em v",
            content: "Substituindo na EDO: $v + x\\frac{dv}{dx} = \\phi(v)$, logo $x\\frac{dv}{dx} = \\phi(v) - v$. Essa equação é separável: $\\frac{dv}{\\phi(v) - v} = \\frac{dx}{x}$. A invariância de escala garantiu que $v = y/x$ reduziria a equação a algo mais simples — não foi uma substituição aleatória.",
        },
        {
            id: "insight",
            type: "insight",
            content: "A substituição $v = y/x$ não é um truque — é a consequência natural da invariância de escala: se a equação não distingue escala, a razão $y/x$ é a variável certa.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $\\frac{dy}{dx} = \\frac{x + y}{x}$.",
            solution: "Reescrevendo: $\\frac{dy}{dx} = 1 + \\frac{y}{x}$. Com $v = y/x$: $v + xv' = 1 + v$, logo $xv' = 1$, ou seja, $\\frac{dv}{1} = \\frac{dx}{x}$. Integrando: $v = \\ln|x| + C$.",
            solutionLatex: "y = x(\\ln|x| + C)",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $(x^2 + y^2)dx - 2xy\\,dy = 0$.",
            solution: "$\\frac{dy}{dx} = \\frac{x^2+y^2}{2xy}$. Com $y = vx$: $v + xv' = \\frac{1+v^2}{2v}$. Então $xv' = \\frac{1-v^2}{2v}$. Separando: $\\frac{2v}{1-v^2}dv = \\frac{dx}{x}$. Integrando: $-\\ln|1-v^2| = \\ln|x| + C_1$, logo $\\frac{1}{1-v^2} = Ax$.",
            solutionLatex: "\\frac{x^2}{x^2-y^2} = Ax \\implies x = A(x^2-y^2)",
        },
    ],

    // =====================================================================
    // LINEAR DE 2ª ORDEM
    // =====================================================================
    second_order_linear: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "EDOs lineares de 2a ordem com coeficientes constantes ($ay'' + by' + cy = 0$) modelam oscilações — molas, circuitos, pêndulos. A ideia genial é supor $y = e^{rx}$ e ver que valor de $r$ funciona.\n\nIsso transforma a EDO numa equação do 2o grau (a equação característica), e as raízes $r$ determinam o comportamento da solução: oscila, decai, ou cresce.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "ay'' + by' + cy = 0 \\implies ar^2 + br + c = 0",
            content: "Substitua $y = e^{rx}$ e resolva a equação característica para encontrar $r$.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "O ansatz eʳˣ",
            content: "Por que tentamos $y = e^{rx}$? Porque derivar uma exponencial devolve uma exponencial: $y' = re^{rx}$, $y'' = r^2 e^{rx}$. Substituindo em $ay'' + by' + cy = 0$, fatoramos $e^{rx}$:",
            latex: "e^{rx}(ar^2 + br + c) = 0",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Raízes reais distintas",
            content: "Como $e^{rx}$ nunca é zero, devemos ter $ar^2 + br + c = 0$. Se há duas raízes reais distintas $r_1, r_2$, cada uma dá uma solução. A solução geral é a combinação linear:",
            latex: "y = C_1 e^{r_1 x} + C_2 e^{r_2 x}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Raiz dupla",
            content: "Se a raiz é dupla $r$, uma solução é $e^{rx}$, mas precisamos de duas independentes. A segunda é $xe^{rx}$, onde o fator $x$ garante independência linear:",
            latex: "y = (C_1 + C_2 x)e^{rx}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Raízes complexas",
            content: "Se as raízes são complexas $\\alpha \\pm \\beta i$, pela fórmula de Euler: $e^{(\\alpha + \\beta i)x} = e^{\\alpha x}(\\cos \\beta x + i\\sin \\beta x)$. Tomando partes real e imaginária, obtemos duas soluções reais. O $\\alpha$ controla crescimento ou decaimento e o $\\beta$ controla a oscilação:",
            latex: "y = e^{\\alpha x}(C_1 \\cos \\beta x + C_2 \\sin \\beta x)",
        },
        {
            id: "insight",
            type: "insight",
            content: "As raízes da equação característica contam toda a história: reais significam decaimento/crescimento puro, complexas significam oscilação — exatamente o que observamos em molas e circuitos.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $y'' - 5y' + 6y = 0$.",
            solution: "Equação característica: $r^2 - 5r + 6 = 0 \\implies (r-2)(r-3) = 0$, logo $r_1 = 2$, $r_2 = 3$. Raízes reais distintas.",
            solutionLatex: "y = C_1 e^{2x} + C_2 e^{3x}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $y'' + 4y = 0$.",
            solution: "Equação característica: $r^2 + 4 = 0 \\implies r = \\pm 2i$. Raízes complexas com $\\alpha = 0$, $\\beta = 2$.",
            solutionLatex: "y = C_1 \\cos(2x) + C_2 \\sin(2x)",
        },
    ],

    // =====================================================================
    // COEFICIENTES A DETERMINAR
    // =====================================================================
    undetermined_coeffs: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "O método dos coeficientes a determinar resolve EDOs não-homogêneas ($ay'' + by' + cy = g(x)$) quando $g(x)$ é um polinômio, exponencial, seno/cosseno, ou combinação desses. \"Chutamos\" que a solução particular tem a mesma forma de $g(x)$, substituímos na EDO, e determinamos os coeficientes comparando os dois lados.\n\nA solução geral é: homogênea + particular. O \"chute\" funciona porque essas famílias de funções são fechadas sob derivação — derivar não gera nada novo.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "y = y_h + y_p \\quad \\text{onde } y_p \\text{ tem a forma de } g(x)",
            content: "A solução geral é a soma da solução homogênea com uma solução particular.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Famílias fechadas",
            content: "O \"chute\" tem uma lógica precisa. Derivar um polinômio dá outro polinômio; derivar $e^{kx}$ dá um múltiplo de $e^{kx}$; derivar $\\sin$ e $\\cos$ dá $\\cos$ e $-\\sin$. Essas famílias são fechadas sob derivação — não escapam de si mesmas.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "O chute informado",
            content: "Se $g(x) = e^{5x}$, então $y_p$, $y_p'$, $y_p''$ são todos múltiplos de $e^{5x}$, e a equação $ay_p'' + by_p' + cy_p = g(x)$ vira uma equação algébrica para o coeficiente. O $y_p$ tem a mesma forma de $g(x)$ — esse é o chute informado.",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Princípio da superposição",
            content: "O princípio da superposição garante que $y = y_h + y_p$ é a solução geral: $y_h$ captura todas as soluções da homogênea (com as constantes arbitrárias), e $y_p$ ajusta para o termo forçante $g(x)$.",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Caso especial: ressonância",
            content: "Se $g(x)$ já é solução da homogênea (por exemplo $g(x) = e^{r_1 x}$), o chute $Ae^{r_1 x}$ dá zero ao substituir. Multiplicamos por $x$: $y_p = Axe^{r_1 x}$. Se a raiz for dupla, por $x^2$. Cada fator de $x$ garante independência linear:",
            latex: "y_p = Ax^k e^{r_1 x}",
        },
        {
            id: "insight",
            type: "insight",
            content: "O chute funciona porque polinômios, exponenciais e senos/cossenos formam famílias fechadas sob derivação — derivar nunca gera algo de forma diferente.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $y'' - 3y' + 2y = 4e^{5x}$.",
            solution: "Homogênea: $r^2-3r+2=0 \\implies r=1,2$, logo $y_h = C_1e^x + C_2e^{2x}$. Particular: chutamos $y_p = Ae^{5x}$. Substituindo: $25Ae^{5x} - 15Ae^{5x} + 2Ae^{5x} = 12Ae^{5x} = 4e^{5x}$, logo $A = \\frac{1}{3}$.",
            solutionLatex: "y = C_1e^x + C_2e^{2x} + \\frac{1}{3}e^{5x}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $y'' + y = 3\\sin(2x)$.",
            solution: "Homogênea: $r^2+1=0 \\implies r = \\pm i$, $y_h = C_1\\cos x + C_2\\sin x$. Chutamos $y_p = A\\cos(2x) + B\\sin(2x)$. Substituindo: $-3A\\cos(2x) - 3B\\sin(2x) = 3\\sin(2x)$, logo $A = 0$, $B = -1$.",
            solutionLatex: "y = C_1\\cos x + C_2\\sin x - \\sin(2x)",
        },
    ],

    // =====================================================================
    // TRANSFORMADA DE LAPLACE
    // =====================================================================
    laplace: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "A Transformada de Laplace converte uma EDO (difícil) numa equação algébrica (fácil). A ideia é transformar a função do \"domínio do tempo\" $t$ para o \"domínio da frequência\" $s$, onde derivadas viram multiplicações por $s$.\n\nResolvemos a álgebra no domínio de $s$, e depois aplicamos a transformada inversa para voltar ao domínio de $t$. É como traduzir um problema difícil para um idioma onde ele fica fácil, resolver lá, e traduzir a resposta de volta.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt",
            content: "A transformada converte funções do domínio do tempo para o domínio da frequência.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "A transformada",
            content: "A Transformada de Laplace é definida como uma integral imprópria que \"mistura\" a função $f(t)$ com o kernel $e^{-st}$. O parâmetro $s$ deve ser grande o suficiente para a integral convergir:",
            latex: "F(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Derivadas viram multiplicações",
            content: "A propriedade central é obtida por integração por partes: $\\int_0^\\infty e^{-st}f'(t)\\,dt = [e^{-st}f(t)]_0^\\infty + s\\int_0^\\infty e^{-st}f(t)\\,dt$. Supondo $f(t)e^{-st} \\to 0$ quando $t \\to \\infty$, o termo de fronteira dá $-f(0)$:",
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "EDO vira álgebra",
            content: "Cada derivada vira multiplicação por $s$, e as condições iniciais entram automaticamente. Assim, $y'' + ay' + by = g(t)$ se transforma em:",
            latex: "(s^2Y - sy(0) - y'(0)) + a(sY - y(0)) + bY = G(s)",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Transformada inversa",
            content: "Resolvemos a equação algébrica para $Y(s)$ com álgebra básica. Depois, consultando uma tabela de pares conhecidos (ou usando frações parciais), aplicamos a transformada inversa para voltar ao domínio do tempo e obter $y(t)$.",
        },
        {
            id: "insight",
            type: "insight",
            content: "A transformada de Laplace transforma derivadas em multiplicações por $s$ — convertendo equações diferenciais em equações algébricas, com as condições iniciais já embutidas.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Resolva $y' + 2y = 0$, $y(0) = 3$, usando Laplace.",
            solution: "Aplicando $\\mathcal{L}$: $sY(s) - y(0) + 2Y(s) = 0$, logo $(s+2)Y(s) = 3$. Então $Y(s) = \\frac{3}{s+2}$. Invertendo pela tabela:",
            solutionLatex: "y(t) = 3e^{-2t}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Resolva $y'' + y = 0$, $y(0) = 1$, $y'(0) = 0$.",
            solution: "Aplicando $\\mathcal{L}$: $s^2Y - s \\cdot 1 - 0 + Y = 0$, logo $(s^2+1)Y = s$. Então $Y(s) = \\frac{s}{s^2+1}$. Pela tabela: $\\mathcal{L}^{-1}\\left\\{\\frac{s}{s^2+1}\\right\\} = \\cos(t)$.",
            solutionLatex: "y(t) = \\cos(t)",
        },
    ],
};
