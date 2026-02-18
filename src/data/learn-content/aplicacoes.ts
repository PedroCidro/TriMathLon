import type { ContentBlock } from './index';

export const aplicacoesContent: Record<string, ContentBlock[]> = {
    // =====================================================================
    // REGRA DE L'HOPITAL
    // =====================================================================
    lhopital: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Quando tentamos calcular um limite e obtemos a forma indeterminada $\\frac{0}{0}$ ou $\\frac{\\infty}{\\infty}$, parece que estamos num beco sem saída. A Regra de L'Hôpital oferece uma saída elegante: em vez de calcular o limite da razão original, calculamos o limite da razão das derivadas.\n\nA ideia é simples: se tanto o numerador quanto o denominador estão indo para zero (ou para infinito), o que importa é a velocidade com que cada um chega lá. A derivada mede exatamente essa velocidade. Então comparar as derivadas é comparar as velocidades de aproximação — e isso determina o limite.\n\nPor exemplo, $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$ dá $\\frac{0}{0}$. Mas $\\sin(x)$ se aproxima de $0$ na mesma velocidade que $x$ (pois $\\cos(0) = 1$), então o limite é $1$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
            content: "Se $\\lim_{x \\to a} f(x) = \\lim_{x \\to a} g(x) = 0$ (ou ambos $\\pm\\infty$), e se $g'(x) \\neq 0$ perto de $a$, e se o limite do lado direito existe (ou é $\\pm\\infty$), então os dois limites são iguais.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "A forma indeterminada 0/0",
            content: "Suponha que $f(a) = g(a) = 0$ e que $f$ e $g$ são diferenciáveis perto de $a$. Queremos calcular $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$. Como ambos valem $0$ em $a$, podemos escrever:",
            latex: "\\frac{f(x)}{g(x)} = \\frac{f(x) - f(a)}{g(x) - g(a)}",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Teorema do Valor Médio de Cauchy",
            content: "O Teorema do Valor Médio de Cauchy (uma generalização do TVM clássico) garante que, para $x \\neq a$, existe um ponto $c$ entre $a$ e $x$ tal que:",
            latex: "\\frac{f(x) - f(a)}{g(x) - g(a)} = \\frac{f'(c)}{g'(c)}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Tomando o limite",
            content: "Quando $x \\to a$, o ponto $c$ (que está entre $a$ e $x$) também tende a $a$. Portanto:",
            latex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{c \\to a} \\frac{f'(c)}{g'(c)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
        },
        {
            id: "insight",
            type: "insight",
            content: "L'Hôpital converte limites difíceis em limites (possivelmente) mais fáceis. Mas cuidado: só funciona para formas indeterminadas $\\frac{0}{0}$ ou $\\frac{\\infty}{\\infty}$. E se o novo limite também for indeterminado, você pode aplicar a regra de novo!",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Calcule $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.",
            solution: "Temos a forma $\\frac{0}{0}$. Aplicando L'Hôpital, derivamos numerador e denominador separadamente:",
            solutionLatex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = \\lim_{x \\to 0} \\frac{\\cos(x)}{1} = \\cos(0) = 1",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Calcule $\\lim_{x \\to \\infty} \\frac{\\ln(x)}{x}$.",
            solution: "Temos a forma $\\frac{\\infty}{\\infty}$. Aplicando L'Hôpital:",
            solutionLatex: "\\lim_{x \\to \\infty} \\frac{\\ln(x)}{x} = \\lim_{x \\to \\infty} \\frac{\\frac{1}{x}}{1} = \\lim_{x \\to \\infty} \\frac{1}{x} = 0",
        },
    ],

    // =====================================================================
    // TAXAS RELACIONADAS
    // =====================================================================
    related_rates: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Problemas de taxas relacionadas conectam as taxas de variação de grandezas que dependem uma da outra através de alguma equação geométrica ou física. Por exemplo, se um balão esférico está sendo inflado, a taxa de crescimento do raio e a taxa de crescimento do volume estão ligadas pela fórmula do volume da esfera.\n\nO segredo é: derive a equação que relaciona as grandezas em relação ao tempo $t$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "\\frac{dV}{dt} = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}",
            content: "Se duas grandezas estão conectadas por uma equação, suas taxas de variação no tempo também estão — pela regra da cadeia aplicada ao tempo $t$.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Equação que conecta as grandezas",
            content: "Se duas grandezas estão conectadas por uma equação, suas taxas de variação no tempo também estão. É a regra da cadeia aplicada ao tempo $t$. Se temos $F(x, y) = 0$ onde $x = x(t)$ e $y = y(t)$, derivando em relação a $t$:",
            latex: "F_x \\frac{dx}{dt} + F_y \\frac{dy}{dt} = 0",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Derivando em relação ao tempo",
            content: "Essa equação conecta as duas taxas — conhecendo uma, encontramos a outra. No caso do balão: $V = \\frac{4}{3}\\pi r^3$ vale em todos os instantes. Derivando em $t$:",
            latex: "\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Substituindo valores conhecidos",
            content: "Conhecendo $\\frac{dV}{dt}$ e $r$ num instante, encontramos $\\frac{dr}{dt}$. O método funciona porque a equação geométrica ou física é verdadeira em todo instante — e portanto sua derivada temporal também é. Essa derivada é exatamente o que conecta as taxas de variação entre si.",
        },
        {
            id: "insight",
            type: "insight",
            content: "A chave dos problemas de taxas relacionadas é identificar a equação que conecta as grandezas. Uma vez encontrada, a regra da cadeia em relação a $t$ faz o resto — transformando uma relação entre quantidades em uma relação entre taxas.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Uma escada de $5$m encosta na parede. A base desliza a $1$ m/s. A que taxa o topo desce quando a base está a $3$m da parede?",
            solution: "Pela relação $x^2 + y^2 = 25$, derivando em $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. Com $x=3$, $y=4$ e $\\frac{dx}{dt}=1$: $6(1) + 8\\frac{dy}{dt} = 0$.",
            solutionLatex: "\\frac{dy}{dt} = -\\frac{3}{4} \\text{ m/s (o topo desce)}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Um balão esférico é inflado a $\\frac{dV}{dt} = 100$ cm$^3$/s. Qual é $\\frac{dr}{dt}$ quando $r = 5$ cm?",
            solution: "$V = \\frac{4}{3}\\pi r^3 \\implies \\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$. Com $r=5$: $100 = 4\\pi(25)\\frac{dr}{dt} = 100\\pi\\frac{dr}{dt}$.",
            solutionLatex: "\\frac{dr}{dt} = \\frac{1}{\\pi} \\approx 0{,}318 \\text{ cm/s}",
        },
    ],

    // =====================================================================
    // TEOREMA DO VALOR MÉDIO
    // =====================================================================
    mean_value_theorem: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Imagine que você dirigiu 100 km em exatamente 1 hora. Sua velocidade média foi 100 km/h. O Teorema do Valor Médio garante que, em algum instante durante a viagem, seu velocímetro marcou exatamente 100 km/h — não mais, não menos.\n\nEm termos matemáticos: se uma função é contínua e diferenciável, então em algum ponto a taxa instantânea de variação (derivada) é igual à taxa média de variação no intervalo. A função não pode ir de $A$ a $B$ sem, em algum momento, ter exatamente a inclinação da reta que liga $A$ a $B$.\n\nEsse teorema é a base de muitos resultados em cálculo — ele conecta o comportamento local (derivada num ponto) ao comportamento global (variação total).",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a} \\quad \\text{para algum } c \\in (a, b)",
            content: "Se $f$ é contínua em $[a,b]$ e diferenciável em $(a,b)$, então existe pelo menos um ponto $c$ no interior do intervalo onde a derivada é igual à taxa média de variação.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "O enunciado",
            content: "Hipóteses: $f$ é contínua no intervalo fechado $[a,b]$ e diferenciável no intervalo aberto $(a,b)$. Conclusão: existe $c \\in (a,b)$ tal que $f'(c) = \\frac{f(b)-f(a)}{b-a}$. A ideia da prova é reduzir ao Teorema de Rolle.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Teorema de Rolle",
            content: "O Teorema de Rolle é o caso especial em que $f(a) = f(b)$. Nesse caso, a taxa média é zero, e o teorema garante que existe $c \\in (a,b)$ com $f'(c) = 0$. Geometricamente: se a função começar e terminar no mesmo valor, em algum ponto ela tem tangente horizontal.",
            latex: "f(a) = f(b) \\implies \\exists\\, c \\in (a,b) : f'(c) = 0",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Reduzindo ao Teorema de Rolle",
            content: "Definimos uma função auxiliar que subtrai a reta secante do gráfico de $f$:",
            latex: "h(x) = f(x) - \\left[f(a) + \\frac{f(b)-f(a)}{b-a}(x-a)\\right]",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Aplicando Rolle",
            content: "Observe que $h(a) = 0$ e $h(b) = 0$. Além disso, $h$ é contínua em $[a,b]$ e diferenciável em $(a,b)$. Pelo Teorema de Rolle, existe $c \\in (a,b)$ com $h'(c) = 0$. Mas $h'(c) = f'(c) - \\frac{f(b)-f(a)}{b-a}$, logo:",
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
        },
        {
            id: "insight",
            type: "insight",
            content: "O TVM garante que em algum ponto a taxa instantânea é igual à taxa média. Ele é a ponte entre derivada (local) e variação (global), e é usado para provar desigualdades, unicidade de raízes e muitos outros resultados em cálculo.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Encontre o $c$ garantido pelo TVM para $f(x) = x^2$ no intervalo $[1, 3]$.",
            solution: "A taxa média é $\\frac{f(3)-f(1)}{3-1} = \\frac{9-1}{2} = 4$. Precisamos de $f'(c) = 4$, ou seja, $2c = 4$:",
            solutionLatex: "c = 2 \\in (1, 3)",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Mostre que existe $c \\in (0, 2)$ tal que $f'(c) = 1$ para $f(x) = x^3 - 3x$.",
            solution: "A taxa média é $\\frac{f(2)-f(0)}{2-0} = \\frac{(8-6)-0}{2} = \\frac{2}{2} = 1$. Pelo TVM, existe $c$ com $f'(c) = 1$, ou seja, $3c^2 - 3 = 1$, logo $c^2 = \\frac{4}{3}$:",
            solutionLatex: "c = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3} \\approx 1{,}155 \\in (0, 2)",
        },
    ],

    // =====================================================================
    // ANÁLISE DE GRÁFICOS
    // =====================================================================
    graph_sketching: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "A primeira derivada diz se a função está subindo ou descendo. A segunda derivada diz se ela está curvando para cima ou para baixo. Juntas, essas duas informações dão um retrato completo do formato do gráfico.\n\nPense numa estrada: a primeira derivada é a inclinação (subida ou descida). A segunda derivada é como a inclinação está mudando — se está ficando mais íngreme ou suavizando. Pontos onde a inclinação é zero são topos de morros ou fundos de vales. Pontos onde a curvatura muda de direção são pontos de inflexão.\n\nCom derivadas, não precisamos plotar centenas de pontos — conseguimos entender o comportamento global da função a partir de informação local.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "f'(x) > 0 \\Rightarrow \\text{crescente} \\qquad f''(x) > 0 \\Rightarrow \\text{côncava para cima}",
            content: "$f'(x) > 0$: função crescente. $f'(x) < 0$: função decrescente. $f''(x) > 0$: côncava para cima (formato $\\cup$). $f''(x) < 0$: côncava para baixo (formato $\\cap$).",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Pontos críticos",
            content: "Os pontos críticos são onde $f'(c) = 0$ ou $f'(c)$ não existe. Nesses pontos, a função pode ter um máximo local, mínimo local, ou nenhum dos dois (como $f(x) = x^3$ em $x = 0$).",
            latex: "f'(c) = 0 \\quad \\text{ou} \\quad f'(c) \\text{ não existe}",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Teste da primeira derivada",
            content: "Analise o sinal de $f'$ ao redor do ponto crítico. Se $f'$ muda de positivo para negativo, é um máximo local. Se muda de negativo para positivo, é um mínimo local. Se não muda de sinal, não é extremo.",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Segunda derivada e concavidade",
            content: "A segunda derivada mede como a inclinação está variando. Se $f''(x) > 0$, a inclinação está aumentando — a curva abre para cima. Se $f''(x) < 0$, a inclinação está diminuindo — a curva abre para baixo. No ponto crítico, $f''(c) > 0$ indica mínimo local e $f''(c) < 0$ indica máximo local.",
            latex: "f''(c) > 0 \\Rightarrow \\text{mínimo local} \\qquad f''(c) < 0 \\Rightarrow \\text{máximo local}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Pontos de inflexão",
            content: "Pontos de inflexão são onde a concavidade muda — a função passa de $\\cup$ para $\\cap$ ou vice-versa. Ocorrem onde $f''(x) = 0$ (ou não existe) e $f''$ muda de sinal. Nesses pontos, a curva cruza sua tangente.",
        },
        {
            id: "insight",
            type: "insight",
            content: "Duas derivadas dão um retrato completo do formato de uma função: a primeira revela onde ela sobe e desce, a segunda revela como ela curva. Juntas, permitem esboçar o gráfico sem calcular dezenas de pontos.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Esboce o gráfico de $f(x) = x^3 - 3x$.",
            solution: "$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$. Pontos críticos: $x = -1$ e $x = 1$. $f'$ muda de $+$ para $-$ em $x=-1$ (máximo local $f(-1)=2$) e de $-$ para $+$ em $x=1$ (mínimo local $f(1)=-2$). $f''(x) = 6x$: inflexão em $x=0$.",
            solutionLatex: "\\text{Máx local: } (-1,\\, 2) \\qquad \\text{Mín local: } (1,\\, -2) \\qquad \\text{Inflexão: } (0,\\, 0)",
        },
        {
            id: "graph-1",
            type: "graph",
            title: "Gráfico",
            content: "f(x) = x\u00B3 \u2212 3x",
            fn: "Math.pow(x,3) - 3*x",
            domain: [-3, 3],
            annotations: [
                { x: -1, y: 2, label: "Máx (-1, 2)", type: "max" },
                { x: 1, y: -2, label: "Mín (1, -2)", type: "min" },
                { x: 0, y: 0, label: "Inflexão (0, 0)", type: "inflection" },
            ],
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Analise $f(x) = x^4 - 4x^3$.",
            solution: "$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$. Pontos críticos: $x = 0$ e $x = 3$. Em $x=0$, $f'$ não muda de sinal (não é extremo). Em $x=3$, $f'$ muda de $-$ para $+$ (mínimo local). $f''(x) = 12x^2 - 24x = 12x(x-2)$: inflexões em $x=0$ e $x=2$.",
            solutionLatex: "\\text{Mín local: } (3,\\, -27) \\qquad \\text{Inflexões: } (0,\\, 0) \\text{ e } (2,\\, -16)",
        },
        {
            id: "graph-2",
            type: "graph",
            title: "Gráfico",
            content: "f(x) = x\u2074 \u2212 4x\u00B3",
            fn: "Math.pow(x,4) - 4*Math.pow(x,3)",
            domain: [-1.5, 5],
            annotations: [
                { x: 3, y: -27, label: "Mín (3, -27)", type: "min" },
                { x: 0, y: 0, label: "Inflexão (0, 0)", type: "inflection" },
                { x: 2, y: -16, label: "Inflexão (2, -16)", type: "inflection" },
            ],
        },
    ],

    // =====================================================================
    // OTIMIZAÇÃO
    // =====================================================================
    optimization: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Problemas de otimização perguntam: qual é o maior (ou menor) valor possível? Maximizar lucro, minimizar custo, encontrar a forma mais eficiente — todos se reduzem a encontrar onde a derivada é zero.\n\nA intuição é geométrica: num ponto de máximo ou mínimo, a função para de subir e começa a descer (ou vice-versa). Nesse instante de transição, a inclinação da tangente é zero. Então a estratégia é: monte a função objetivo, derive, iguale a zero e resolva.\n\nMas cuidado: derivada zero é necessário, não suficiente. Precisamos verificar se o ponto é realmente um máximo ou mínimo (e não um ponto de sela), e também checar os extremos do domínio.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "f'(c) = 0 \\quad \\text{ou} \\quad f'(c) \\text{ não existe} \\quad \\Rightarrow \\quad c \\text{ é candidato a extremo}",
            content: "Num ponto de máximo ou mínimo local, $f'(c) = 0$ ou $f'(c)$ não existe. Esses são os pontos críticos — os únicos candidatos a extremos locais.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Modelar o problema",
            content: "Identifique a função objetivo (o que queremos maximizar ou minimizar) e a restrição (o vínculo entre as variáveis). Use a restrição para eliminar uma variável, ficando com uma função de uma variável só.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Encontrar pontos críticos",
            content: "Derive a função objetivo e iguale a zero. Resolva para encontrar os pontos críticos:",
            latex: "f'(x) = 0",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Classificar",
            content: "Use o teste da segunda derivada: se $f''(c) > 0$, é mínimo local; se $f''(c) < 0$, é máximo local. Ou use o teste da primeira derivada, analisando a mudança de sinal de $f'$.",
            latex: "f''(c) > 0 \\Rightarrow \\text{mín} \\qquad f''(c) < 0 \\Rightarrow \\text{máx}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Verificar extremos do domínio",
            content: "Se o domínio é um intervalo fechado $[a,b]$, o máximo ou mínimo absoluto pode ocorrer nos extremos $a$ ou $b$, não apenas nos pontos críticos. Compare os valores de $f$ em todos os candidatos (pontos críticos e extremos) para determinar o extremo absoluto.",
        },
        {
            id: "insight",
            type: "insight",
            content: "Derivada zero é condição necessária mas não suficiente para extremo — sempre verifique com o teste da segunda derivada ou comparando valores. Em intervalos fechados, não esqueça de checar os extremos do domínio.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Maximize a área de um retângulo com perímetro $20$.",
            solution: "Se os lados são $x$ e $y$, temos $2x + 2y = 20$, logo $y = 10 - x$. A área é $A(x) = x(10-x) = 10x - x^2$. Derivando: $A'(x) = 10 - 2x = 0$, logo $x = 5$ e $y = 5$. $A''(x) = -2 < 0$, confirmando máximo.",
            solutionLatex: "A_{\\max} = 5 \\times 5 = 25",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Minimize a área total de uma lata cilíndrica de volume $V$.",
            solution: "A área total é $A = 2\\pi r^2 + 2\\pi r h$ e o volume é $V = \\pi r^2 h$, logo $h = \\frac{V}{\\pi r^2}$. Substituindo: $A(r) = 2\\pi r^2 + \\frac{2V}{r}$. Derivando e igualando a zero: $A'(r) = 4\\pi r - \\frac{2V}{r^2} = 0$, logo $r^3 = \\frac{V}{2\\pi}$.",
            solutionLatex: "r = \\left(\\frac{V}{2\\pi}\\right)^{\\!1/3} \\qquad h = 2r \\quad \\text{(altura = diâmetro)}",
        },
    ],

    // =====================================================================
    // POLINÔMIOS DE TAYLOR
    // =====================================================================
    taylor_polynomial: [
        {
            id: "intuition",
            type: "intuition",
            title: "A Intuição",
            content: "Qualquer função suave pode ser aproximada por um polinômio — e polinômios são muito mais fáceis de calcular. A ideia de Taylor é construir um polinômio que concorda com a função original não apenas no valor, mas também na primeira derivada, na segunda derivada, e assim por diante.\n\nPense assim: a aproximação de ordem zero é um valor constante (acertar o ponto). A de ordem um é uma reta tangente (acertar a inclinação). A de ordem dois é uma parábola (acertar a curvatura). Cada termo a mais captura um nível mais fino do comportamento da função.\n\nQuanto mais termos adicionamos, melhor a aproximação fica perto do ponto de expansão. Taylor é a melhor aproximação polinomial possível — nenhum outro polinômio do mesmo grau faz melhor perto de $a$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Resultado",
            latex: "f(x) \\approx \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x-a)^k",
            content: "O polinômio de Taylor de grau $n$ centrado em $a$ usa as derivadas de $f$ em $a$ até a ordem $n$. O fatorial $k!$ no denominador garante que a $k$-ésima derivada do polinômio coincida com $f^{(k)}(a)$.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Condição de ordem zero",
            content: "Queremos um polinômio $P(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + \\cdots$ que aproxime $f$ perto de $a$. A condição mais básica é que $P(a) = f(a)$. Avaliando em $x = a$, todos os termos com $(x-a)$ somem:",
            latex: "c_0 = f(a)",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Condição de primeira ordem",
            content: "Queremos também que $P'(a) = f'(a)$. Derivando: $P'(x) = c_1 + 2c_2(x-a) + \\cdots$. Avaliando em $a$:",
            latex: "c_1 = f'(a)",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "O padrão geral",
            content: "Continuando, $P''(a) = 2c_2$, logo $c_2 = \\frac{f''(a)}{2}$. Para a $k$-ésima derivada: $P^{(k)}(a) = k! \\cdot c_k$, logo $c_k = \\frac{f^{(k)}(a)}{k!}$. O fatorial aparece naturalmente da derivação repetida de $(x-a)^k$.",
            latex: "c_k = \\frac{f^{(k)}(a)}{k!}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Resto de Taylor",
            content: "O erro da aproximação é dado pelo resto de Taylor (forma de Lagrange): existe $\\xi$ entre $a$ e $x$ tal que o erro é exatamente o próximo termo da série, avaliado em $\\xi$. Isso permite estimar a precisão da aproximação.",
            latex: "R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}",
        },
        {
            id: "insight",
            type: "insight",
            content: "Cada termo adicionado melhora a aproximação — Taylor é a melhor aproximação polinomial possível perto do ponto de expansão. Na prática, poucos termos já dão excelentes resultados: a série de $e^x$ com 10 termos dá 9 casas decimais de precisão!",
        },
        {
            id: "example-1",
            type: "example",
            title: "Exemplo 1",
            content: "Encontre o polinômio de Taylor de $e^x$ em torno de $a = 0$ até grau $4$.",
            solution: "Todas as derivadas de $e^x$ são $e^x$, e $e^0 = 1$. Logo $f^{(k)}(0) = 1$ para todo $k$:",
            solutionLatex: "e^x \\approx 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\frac{x^4}{24}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Exemplo 2",
            content: "Encontre o polinômio de Taylor de $\\sin(x)$ em torno de $a = 0$ até grau $5$.",
            solution: "As derivadas de $\\sin(x)$ em $0$ são: $f(0)=0$, $f'(0)=1$, $f''(0)=0$, $f'''(0)=-1$, $f^{(4)}(0)=0$, $f^{(5)}(0)=1$. Os termos pares somem:",
            solutionLatex: "\\sin(x) \\approx x - \\frac{x^3}{6} + \\frac{x^5}{120}",
        },
    ],
};
