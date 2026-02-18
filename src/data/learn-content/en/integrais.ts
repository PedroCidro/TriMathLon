import type { ContentBlock } from '../index';

export const integraisContentEn: Record<string, ContentBlock[]> = {
    // =====================================================================
    // BASIC INTEGRALS
    // =====================================================================
    basic_integrals: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Integration is the reverse process of differentiation. If the derivative answers "what is the rate of change?", the integral answers "what function has this rate of change?".\n\nBasic integrals are the "multiplication tables" of integration — formulas we recognize immediately because they are simply known derivatives read backwards.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
            content: 'The power goes up by 1 and divides by the new exponent. Always add the constant $C$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Verification by differentiation',
            content: 'The verification reveals the essence of integration. If we differentiate $\\frac{x^{n+1}}{n+1} + C$, by the power rule we get exactly the integrand:',
            latex: '\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1} + C\\right) = (n+1) \\cdot \\frac{x^n}{n+1} = x^n',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'The constant of integration',
            content: 'But why does $C$ appear? Because the derivative of any constant is zero: the functions $x^3 + 5$ and $x^3 - 100$ have the same derivative $3x^2$, so both are valid antiderivatives of $3x^2$. The constant $C$ absorbs the information that differentiation "erases".',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Family of functions',
            content: 'The indefinite integral represents an infinite family of parallel functions, differing only by a vertical shift. This is the fundamental connection of Calculus: differentiating and integrating are inverse operations.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Integrating is literally undoing the derivative — and the constant $C$ exists because differentiation "erases" vertical shifts.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int (3x^2 + 4x - 1)\\,dx$.',
            solution: 'We integrate term by term using the power rule:',
            solutionLatex: '\\int 3x^2\\,dx + \\int 4x\\,dx - \\int 1\\,dx = x^3 + 2x^2 - x + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int \\frac{1}{x}\\,dx$.',
            solution: 'Since $n = -1$ is the special case excluded by the power formula, we use the known antiderivative:',
            solutionLatex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C',
        },
    ],

    // =====================================================================
    // SUBSTITUTION
    // =====================================================================
    substitution: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Substitution is the chain rule in reverse. If the integral contains a function and its derivative appears as a factor, we can replace that function with a variable $u$, simplifying everything.\n\nIt\'s like changing the clothes of a complicated integral to simpler ones. The key is finding the right $u$: usually it\'s the "inner" function.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\int f(g(x))\\,g\'(x)\\,dx = \\int f(u)\\,du \\quad \\text{with } u = g(x)',
            content: 'We replace the inner function with $u$ and $g\'(x)\\,dx$ with $du$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'The chain rule in reverse',
            content: 'If $F$ is the antiderivative of $f$ (i.e., $F\' = f$), then by the chain rule the derivative of the composition is:',
            latex: '\\frac{d}{dx}\\left[F(g(x))\\right] = f(g(x)) \\cdot g\'(x)',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Reading backwards',
            content: 'Reading this equality backwards, we see that $F(g(x)) + C$ is the antiderivative of $f(g(x)) \\cdot g\'(x)$. That is: $\\int f(g(x)) \\cdot g\'(x)\\,dx = F(g(x)) + C$. This is why we look for an "inner" function whose derivative appears as a factor "outside" — when this happens, the chain rule guarantees the substitution works.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'The notation u = g(x)',
            content: 'The notation $u = g(x)$, $du = g\'(x)\\,dx$ is just an organized way to see this fact: the $g\'(x)\\,dx$ transforms into $du$, and the complicated integral in $x$ becomes a simple integral in $u$.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Substitution isn\'t a trick — it\'s the chain rule read backwards, recognizing that the derivative of the inner function is already present in the integrand.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int 2x \\cdot e^{x^2}\\,dx$.',
            solution: 'Setting $u = x^2$, we have $du = 2x\\,dx$. The integral becomes $\\int e^u\\,du$:',
            solutionLatex: '\\int e^u\\,du = e^u + C = e^{x^2} + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int \\cos(3x)\\,dx$.',
            solution: 'With $u = 3x$, $du = 3\\,dx$, so $dx = \\frac{du}{3}$:',
            solutionLatex: '\\int \\cos(u)\\frac{du}{3} = \\frac{1}{3}\\sin(u) + C = \\frac{1}{3}\\sin(3x) + C',
        },
    ],

    // =====================================================================
    // INTEGRATION BY PARTS
    // =====================================================================
    by_parts: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Integration by parts is the product rule in reverse. When we have the product of two functions and can\'t integrate directly, we "transfer" the derivative from one to the other.\n\nWe choose a part to differentiate ($u$) and another to integrate ($dv$). The LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) helps choose $u$.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\int u\\,dv = uv - \\int v\\,du',
            content: 'We transfer the derivative from $u$ to $v$, replacing the integrand with a simpler one.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Product rule',
            content: 'Everything starts from the product rule for derivatives:',
            latex: '\\frac{d}{dx}(u \\cdot v) = u\'v + uv\'',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Integrating both sides',
            content: 'Integrating both sides with respect to $x$, we get:',
            latex: 'uv = \\int u\'v\\,dx + \\int uv\'\\,dx',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Rearranging',
            content: 'Rearranging and writing in differential notation ($u\' dx = du$, $v\' dx = dv$):',
            latex: '\\int u\\,dv = uv - \\int v\\,du',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'The LIATE strategy',
            content: 'But why is this useful? Because it transfers the derivative from one function to the other. If $u$ is something that simplifies when differentiated (like $x^2 \\to 2x \\to 2 \\to 0$) and $dv$ is something easy to integrate (like $e^x$ or $\\sin x$), then the new integral $\\int v\\,du$ is simpler than the original. The LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) orders from "most wants to be $u$" to "most wants to be $dv$": logarithms simplify greatly when differentiated, while exponentials don\'t even change when integrated.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Integration by parts isn\'t a trick — it\'s the product rule in reverse, transferring complexity from one function to the other until the integral becomes simple.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int x e^x\\,dx$.',
            solution: 'We choose $u = x$ ($du = dx$) and $dv = e^x dx$ ($v = e^x$). Applying the formula:',
            solutionLatex: '\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C = e^x(x-1) + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int x^2 \\sin(x)\\,dx$.',
            solution: 'With $u = x^2$, $dv = \\sin(x)dx$: the first application gives $-x^2\\cos x + 2\\int x\\cos x\\,dx$. Applying by parts again with $u=x$, $dv=\\cos x\\,dx$:',
            solutionLatex: '-x^2\\cos x + 2(x\\sin x - \\int \\sin x\\,dx) = -x^2\\cos x + 2x\\sin x + 2\\cos x + C',
        },
    ],

    // =====================================================================
    // TRIGONOMETRIC INTEGRALS
    // =====================================================================
    trig_integrals: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Trigonometric integrals involve powers and products of sine and cosine. The main strategy is to use trigonometric identities to reduce the complexity.\n\nIf one of the exponents is odd, we separate one factor and use $\\sin^2 + \\cos^2 = 1$ to convert the rest into a single function — paving the way for a simple substitution.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\sin^2(x) = \\frac{1 - \\cos(2x)}{2} \\qquad \\cos^2(x) = \\frac{1 + \\cos(2x)}{2}',
            content: 'Double angle identities for reducing even powers of sine and cosine.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Odd exponent: separate one factor',
            content: 'The strategy depends on a parity observation. When one of the exponents is odd, we separate a factor of $\\sin x$ or $\\cos x$ and use $\\sin^2 x + \\cos^2 x = 1$ to convert the rest. Example:',
            latex: '\\sin^3 x = (1 - \\cos^2 x) \\cdot \\sin x',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Natural substitution',
            content: 'With $u = \\cos x$, $du = -\\sin x\\,dx$, everything becomes a polynomial in $u$. This works because the Pythagorean identity converts between $\\sin^2$ and $\\cos^2$, and the separated factor provides exactly the $du$ for the substitution.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Even exponents: double angle',
            content: 'When both exponents are even, there\'s no factor left to separate. Then we use the double angle formulas. From $\\cos(2x) = 1 - 2\\sin^2 x = 2\\cos^2 x - 1$ we isolate the reduction identities. Each application reduces the power by half, until we reach simple $\\cos$ and $\\sin$ integrals.',
            latex: '\\sin^2 x = \\frac{1-\\cos(2x)}{2} \\qquad \\cos^2 x = \\frac{1+\\cos(2x)}{2}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The Pythagorean identity and double angle formulas are the two central tools: the first solves odd exponents via substitution, the second progressively reduces even exponents.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int \\sin^3(x)\\,dx$.',
            solution: 'We separate: $\\int \\sin^2(x)\\sin(x)\\,dx = \\int (1-\\cos^2(x))\\sin(x)\\,dx$. With $u = \\cos(x)$, $du = -\\sin(x)dx$:',
            solutionLatex: '-\\int (1-u^2)du = -u + \\frac{u^3}{3} + C = -\\cos(x) + \\frac{\\cos^3(x)}{3} + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int \\cos^2(x)\\,dx$.',
            solution: 'By the double angle identity: $\\int \\frac{1+\\cos(2x)}{2}\\,dx$:',
            solutionLatex: '\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C',
        },
    ],

    // =====================================================================
    // TRIGONOMETRIC SUBSTITUTION
    // =====================================================================
    trig_sub: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'When expressions like $\\sqrt{a^2 - x^2}$, $\\sqrt{a^2 + x^2}$ or $\\sqrt{x^2 - a^2}$ appear, a trigonometric substitution transforms the root into something simple.\n\nThe idea is to use the right triangle: the sides and hypotenuse create relationships that eliminate the root. It\'s like dressing the integral in a "trigonometric outfit" that simplifies the expression.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\sqrt{a^2 - x^2} \\Rightarrow x = a\\sin\\theta \\qquad \\sqrt{a^2 + x^2} \\Rightarrow x = a\\tan\\theta',
            content: 'Each root form has a corresponding trigonometric substitution.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'The right triangle',
            content: 'The idea starts from a right triangle. Each root form corresponds to a relationship between the sides of the triangle. The Pythagorean identity ($\\sin^2\\theta + \\cos^2\\theta = 1$ and its variants) "absorbs" the square root, transforming it into a trigonometric monomial.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'For √(a² - x²)',
            content: 'When we see $\\sqrt{a^2 - x^2}$, we think: this looks like the leg of a triangle with hypotenuse $a$. If $x = a\\sin\\theta$, by the Pythagorean identity the root disappears:',
            latex: 'a^2 - x^2 = a^2(1 - \\sin^2\\theta) = a^2\\cos^2\\theta \\implies \\sqrt{a^2 - x^2} = a\\cos\\theta',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'For √(a² + x²)',
            content: 'The triangle has legs $a$ and $x$ and hypotenuse $\\sqrt{a^2+x^2}$. With $x = a\\tan\\theta$:',
            latex: 'a^2 + a^2\\tan^2\\theta = a^2\\sec^2\\theta \\implies \\sqrt{a^2+x^2} = a\\sec\\theta',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'For √(x² - a²)',
            content: 'We use $x = a\\sec\\theta$ and the identity $\\sec^2\\theta - 1 = \\tan^2\\theta$. In all cases, the same logic: the Pythagorean identity absorbs the square root. The substitution is not arbitrary — each root form corresponds to a side of the right triangle.',
            latex: 'x^2 - a^2 = a^2(\\sec^2\\theta - 1) = a^2\\tan^2\\theta \\implies \\sqrt{x^2-a^2} = a\\tan\\theta',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Each root form ($a^2 - x^2$, $a^2 + x^2$, $x^2 - a^2$) corresponds to a side of the right triangle — the trigonometric substitution simply translates the root into the language of the triangle.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int \\frac{dx}{\\sqrt{4-x^2}}$.',
            solution: 'With $x = 2\\sin\\theta$, $dx = 2\\cos\\theta\\,d\\theta$ and $\\sqrt{4-x^2} = 2\\cos\\theta$. The integral becomes $\\int \\frac{2\\cos\\theta}{2\\cos\\theta}d\\theta = \\int d\\theta$:',
            solutionLatex: '\\theta + C = \\arcsin\\!\\left(\\frac{x}{2}\\right) + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int \\frac{x^2}{\\sqrt{x^2+9}}\\,dx$.',
            solution: 'With $x = 3\\tan\\theta$, $dx = 3\\sec^2\\theta\\,d\\theta$, $\\sqrt{x^2+9} = 3\\sec\\theta$. The integral becomes $9\\int \\tan^2\\theta\\sec\\theta\\,d\\theta$. Using $\\tan^2\\theta = \\sec^2\\theta - 1$ and solving:',
            solutionLatex: '\\frac{x\\sqrt{x^2+9}}{2} - \\frac{9}{2}\\ln\\!\\left|\\frac{x+\\sqrt{x^2+9}}{3}\\right| + C',
        },
    ],

    // =====================================================================
    // PARTIAL FRACTIONS
    // =====================================================================
    partial_fractions: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'When we have a fraction of polynomials, we can break it into simpler fractions — it\'s like decomposing a numerical fraction: $\\frac{5}{6} = \\frac{1}{2} + \\frac{1}{3}$.\n\nEach factor of the denominator contributes a partial fraction, and each of these is easy to integrate. The crucial step is factoring the denominator and finding the coefficients.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
            content: 'Each linear factor of the denominator contributes a simple partial fraction.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Factor the denominator',
            content: 'The first step is to completely factor the denominator. The Decomposition Theorem guarantees: if the degree of the numerator is less than that of the denominator and the denominator is factored, there exists a unique partial fraction decomposition.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Decompose into simple fractions',
            content: 'For each linear factor $(x - a)$ of the denominator, we write a fraction $\\frac{A}{x-a}$ with unknown coefficient. It\'s like disassembling the fraction into simpler pieces — just as $\\frac{5}{6} = \\frac{1}{2} + \\frac{1}{3}$.',
            latex: '\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Find the coefficients',
            content: 'We multiply both sides by the original denominator, obtaining an equality between polynomials. Substituting strategic values of $x$ (the roots of the denominator), each equation directly reveals a coefficient.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Integrate each fraction',
            content: 'Each fraction $\\frac{A}{x-a}$ integrates as $A\\ln|x-a|$ — something much simpler than the original fraction. We\'re not simplifying the function — we\'re rewriting it in a form where each piece is immediately integrable.',
            latex: '\\int \\frac{A}{x-a}\\,dx = A\\ln|x-a| + C',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Partial fractions don\'t simplify the function — they rewrite it in a form where each piece is an immediate logarithm integral.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int \\frac{5x+1}{x^2-x-2}\\,dx$.',
            solution: 'Factoring: $x^2-x-2 = (x-2)(x+1)$. We decompose: $\\frac{5x+1}{(x-2)(x+1)} = \\frac{A}{x-2} + \\frac{B}{x+1}$. With $x=2$: $A = \\frac{11}{3}$. With $x=-1$: $B = \\frac{4}{3}$.',
            solutionLatex: '\\frac{11}{3}\\ln|x-2| + \\frac{4}{3}\\ln|x+1| + C',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\int \\frac{3}{x^2-9}\\,dx$.',
            solution: '$x^2-9 = (x-3)(x+3)$. Decomposition: $\\frac{3}{(x-3)(x+3)} = \\frac{A}{x-3}+\\frac{B}{x+3}$. With $x=3$: $A = \\frac{1}{2}$. With $x=-3$: $B = -\\frac{1}{2}$.',
            solutionLatex: '\\frac{1}{2}\\ln|x-3| - \\frac{1}{2}\\ln|x+3| + C = \\frac{1}{2}\\ln\\!\\left|\\frac{x-3}{x+3}\\right| + C',
        },
    ],

    // =====================================================================
    // IMPROPER INTEGRALS
    // =====================================================================
    improper: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'An improper integral has some "problem": the interval goes to infinity, or the integrand has a vertical asymptote. It seems impossible to calculate the area of an infinite region, but sometimes that area is finite!\n\nThe idea is to use limits: we replace infinity (or the problematic point) with a variable and see if the result converges.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_a^b f(x)\\,dx',
            content: 'We replace infinity with $b$ and take the limit as $b \\to \\infty$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Replace infinity with a limit',
            content: 'How can an infinite region have finite area? We define the improper integral as a limit: we compute the integral up to $b$ and see if the result stabilizes as $b$ grows.',
            latex: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_a^b f(x)\\,dx',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'The p-criterion',
            content: 'The revealing example: $\\int_1^{\\infty} \\frac{1}{x^p}\\,dx$ converges if $p > 1$ and diverges if $p \\leq 1$. The antiderivative is $\\frac{x^{1-p}}{1-p}$, and when $1-p < 0$ (i.e., $p > 1$), $x^{1-p} \\to 0$ as $x \\to \\infty$ — the function falls fast enough for the sum of all area slices to converge. With $p = 1$ we have $\\ln x$, which grows without bound.',
            latex: '\\int_1^{\\infty} \\frac{1}{x^p}\\,dx \\quad \\begin{cases} \\text{converges} & \\text{if } p > 1 \\\\ \\text{diverges} & \\text{if } p \\leq 1 \\end{cases}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Discontinuities',
            content: 'For integrals with a vertical asymptote (like $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$), the logic is the same: we replace the problematic point with a limit and check if the area stabilizes. Infinity doesn\'t automatically mean divergent — it depends on how fast the function behaves.',
            latex: '\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx = \\lim_{a \\to 0^+} \\int_a^1 x^{-1/2}\\,dx',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Infinity doesn\'t automatically mean divergent — convergence depends on how fast the function approaches zero compared to the growth of the interval.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$.',
            solution: 'We apply the definition with a limit:',
            solutionLatex: '\\lim_{b \\to \\infty}\\left[-\\frac{1}{x}\\right]_1^b = \\lim_{b \\to \\infty}\\left(-\\frac{1}{b}+1\\right) = 1',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Determine if $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ converges.',
            solution: 'There is a discontinuity at $x=0$. We replace with the limit $a \\to 0^+$:',
            solutionLatex: '\\lim_{a \\to 0^+}[2\\sqrt{x}]_a^1 = \\lim_{a \\to 0^+}(2-2\\sqrt{a}) = 2',
        },
    ],
};
