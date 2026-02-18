import type { ContentBlock } from '../index';

export const derivadasContentEn: Record<string, ContentBlock[]> = {
    // =====================================================================
    // POWER RULE
    // =====================================================================
    power_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Differentiating is measuring how much the output changes when the input changes by a tiny amount. The power rule answers this question for any $x^n$.\n\nStart with a concrete case: $x^3 = x \\cdot x \\cdot x$. If $x$ increases a tiny bit (from $x$ to $x + h$), each of the three factors is "affected" in turn, while the other two stay as they were.\n\nIf the first factor changes: $(x+h) \\cdot x \\cdot x$. If the second changes: $x \\cdot (x+h) \\cdot x$. If the third: $x \\cdot x \\cdot (x+h)$. Each case contributes $x^2 \\cdot h$ of variation — and there are 3 cases. That\'s why the derivative of $x^3$ is $3x^2$.\n\nThe pattern is clear: the exponent comes down as a coefficient (there are $n$ ways to choose which factor changes) and decreases by 1 (the other $n - 1$ factors remain as $x$).',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\frac{d}{dx}\\left(x^n\\right) = n \\cdot x^{n-1}',
            content: 'The exponent comes down as a coefficient. The exponent decreases by 1.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definition of derivative',
            content: 'We start from the definition:',
            latex: '\\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Expanding (x+h)ⁿ',
            content: 'Think of $(x+h)^n$ as the product of $n$ factors: $(x+h)(x+h)\\cdots(x+h)$. When expanding, each term comes from choosing $x$ or $h$ in each factor.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Leading term',
            content: 'Choosing $x$ in all factors: $x^n$. Choosing $h$ in exactly 1 factor and $x$ in the other $n-1$: there are $n$ ways to do this.',
            latex: 'n \\cdot x^{n-1} \\cdot h',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Terms that vanish',
            content: 'All other terms have $h^2$ or higher powers. Subtracting $x^n$, dividing by $h$, and taking $h \\to 0$, they disappear. What remains:',
            latex: 'n \\cdot x^{n-1}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The exponent "comes down" because of pure combinatorics — the $n$ counts how many ways we can choose which of the $n$ factors contributes the $h$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Find the derivative of $f(x) = x^5$.',
            solution: 'Applying the power rule:',
            solutionLatex: "f'(x) = 5x^{5-1} = 5x^4",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = 3x^4 - 2x^3 + 7x$.',
            solution: 'Differentiating term by term:',
            solutionLatex: "g'(x) = 3 \\cdot 4x^3 - 2 \\cdot 3x^2 + 7 = 12x^3 - 6x^2 + 7",
        },
    ],

    // =====================================================================
    // PRODUCT RULE
    // =====================================================================
    product_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'When two varying quantities are multiplied, the total variation comes from two contributions: the first function changes while the second stays fixed, then the second changes while the first stays fixed.\n\nImagine the area of a rectangle whose sides $u$ and $v$ are growing — the increase in area comes from both the increase in width and the increase in height.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: "\\frac{d}{dx}\\left[u \\cdot v\\right] = u' \\cdot v + u \\cdot v'",
            content: 'Derivative of the first times the second, plus the first times the derivative of the second.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definition of derivative',
            content: 'By the definition, we want to compute the limit below. The challenge is that two factors are changing at the same time.',
            latex: '\\lim_{h \\to 0} \\frac{u(x+h)v(x+h) - u(x)v(x)}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'The trick: add and subtract',
            content: 'To isolate each variation, we add and subtract $u(x+h)v(x)$ in the numerator — this doesn\'t change the value, but separates it into two parts.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Two contributions',
            content: 'The first part captures the variation of $v$ while $u$ is "nearly fixed" at $x+h$; the second captures the variation of $u$ while $v$ is fixed at $x$.',
            latex: "u(x+h)\\frac{v(x+h)-v(x)}{h} + v(x)\\frac{u(x+h)-u(x)}{h}",
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Result',
            content: "When $h \\to 0$, $u(x+h) \\to u(x)$ by continuity, and the quotients become $v'(x)$ and $u'(x)$.",
            latex: "u \\cdot v' + u' \\cdot v",
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The total variation of a product is the sum of each factor varying while the other stays fixed — like the area of a growing rectangle.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Differentiate $f(x) = x^2 \\cdot \\sin(x)$.',
            solution: "Let $u = x^2$ and $v = \\sin(x)$. Then $u' = 2x$ and $v' = \\cos(x)$. By the product rule:",
            solutionLatex: "f'(x) = 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = e^x \\cdot \\ln(x)$.',
            solution: "With $u = e^x$ and $v = \\ln(x)$: $u' = e^x$, $v' = \\frac{1}{x}$.",
            solutionLatex: "g'(x) = e^x \\cdot \\ln(x) + e^x \\cdot \\frac{1}{x} = e^x\\!\\left(\\ln(x) + \\frac{1}{x}\\right)",
        },
    ],

    // =====================================================================
    // QUOTIENT RULE
    // =====================================================================
    quotient_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'The quotient rule deals with how the ratio of two functions changes. When the numerator grows, the fraction tends to grow; when the denominator grows, the fraction tends to shrink.\n\nThe formula captures this "competition" between numerator and denominator, always dividing by the square of the denominator to keep the units correct.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: "\\frac{d}{dx}\\!\\left[\\frac{u}{v}\\right] = \\frac{u' \\cdot v - u \\cdot v'}{v^2}",
            content: 'Derivative of the numerator times the denominator, minus the numerator times the derivative of the denominator, over the denominator squared.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Starting from the product rule',
            content: 'Instead of starting from the definition, we derive the quotient rule from the product rule — showing it\'s not a separate formula to memorize. If $u = \\frac{u}{v} \\cdot v$, we apply the product rule:',
            latex: "u' = \\left(\\frac{u}{v}\\right)' \\cdot v + \\frac{u}{v} \\cdot v'",
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Isolating the derivative',
            content: 'We isolate $\\left(\\frac{u}{v}\\right)\'$:',
            latex: "\\left(\\frac{u}{v}\\right)' = \\frac{u' - \\frac{u}{v} \\cdot v'}{v}",
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Simplifying',
            content: "Multiplying numerator and denominator by $v$, we get the final form. The minus sign appears naturally: when the denominator $v$ grows, the fraction shrinks — this negative effect is the $-uv'$.",
            latex: "\\frac{u'v - uv'}{v^2}",
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'No need to memorize: just remember the product rule and isolate. The minus sign reflects the competition between numerator and denominator.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Differentiate $f(x) = \\frac{x^2 + 1}{x - 3}$.',
            solution: "With $u = x^2 + 1$, $v = x - 3$: $u' = 2x$, $v' = 1$.",
            solutionLatex: "f'(x) = \\frac{2x(x-3) - (x^2+1)(1)}{(x-3)^2} = \\frac{x^2 - 6x - 1}{(x-3)^2}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = \\frac{\\sin(x)}{x}$.',
            solution: "With $u = \\sin(x)$ and $v = x$: $u' = \\cos(x)$, $v' = 1$.",
            solutionLatex: "g'(x) = \\frac{\\cos(x) \\cdot x - \\sin(x) \\cdot 1}{x^2} = \\frac{x\\cos(x) - \\sin(x)}{x^2}",
        },
    ],

    // =====================================================================
    // CHAIN RULE
    // =====================================================================
    chain_rule: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'The chain rule handles composite functions — functions inside functions. Think of two connected gears: if the inner gear turns at a certain rate and the outer one amplifies that turn, the total rate is the product of the two.\n\nThe derivative of the "outer" function evaluated at the "inner" function, times the derivative of the inner function.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: "\\frac{d}{dx}\\left[f(g(x))\\right] = f'(g(x)) \\cdot g'(x)",
            content: 'Derivative of the outer evaluated at the inner, times derivative of the inner.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Variation of the inner function',
            content: "If $y = f(u)$ and $u = g(x)$, a small variation $\\Delta x$ first causes a variation in $u$ by the definition of the derivative of $g$:",
            latex: "\\Delta u \\approx g'(x) \\cdot \\Delta x",
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Propagation to the outer function',
            content: "This variation $\\Delta u$, in turn, causes a variation in $y$ by the definition of the derivative of $f$:",
            latex: "\\Delta y \\approx f'(u) \\cdot \\Delta u",
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Combining the variations',
            content: "Substituting $\\Delta u$: $\\Delta y \\approx f'(g(x)) \\cdot g'(x) \\cdot \\Delta x$. Dividing by $\\Delta x$:",
            latex: "\\frac{\\Delta y}{\\Delta x} \\approx f'(g(x)) \\cdot g'(x)",
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'In the limit',
            content: 'In the limit ($\\Delta x \\to 0$), the approximation becomes an equality. It\'s like connected gears: the total rate is the product of the rates at each link. If the inner function triples the variation and the outer doubles it, the total variation is $\\times 6$.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Rates of change multiply along a composition — like connected gears where each link amplifies the motion.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Differentiate $f(x) = (3x^2 + 1)^5$.',
            solution: 'The outer function is $u^5$ and the inner is $u = 3x^2 + 1$. By the chain rule:',
            solutionLatex: "f'(x) = 5(3x^2+1)^4 \\cdot 6x = 30x(3x^2+1)^4",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = \\sin(x^3)$.',
            solution: 'Outer: $\\sin(u)$, inner: $u = x^3$.',
            solutionLatex: "g'(x) = \\cos(x^3) \\cdot 3x^2 = 3x^2\\cos(x^3)",
        },
    ],

    // =====================================================================
    // TRIGONOMETRIC FUNCTIONS
    // =====================================================================
    trig_basic: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Trigonometric functions describe circular motion and oscillations. The derivative of $\\sin(x)$ is $\\cos(x)$ because, on the unit circle, the rate of change of the vertical coordinate (sine) at a given point is exactly the horizontal coordinate (cosine) at that point.\n\nEach trigonometric function has a derivative that can be expressed in terms of the others.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\frac{d}{dx}(\\sin x) = \\cos x \\qquad \\frac{d}{dx}(\\cos x) = -\\sin x',
            content: 'Sine becomes cosine. Cosine becomes negative sine.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Sum formula',
            content: 'Let\'s prove that the derivative of $\\sin x$ is $\\cos x$ from the definition. We compute $\\lim_{h \\to 0}\\frac{\\sin(x+h)-\\sin(x)}{h}$. By the sum formula:',
            latex: '\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Substituting into the limit',
            content: 'Substituting and rearranging, the limit splits into two parts:',
            latex: '\\sin x \\cdot \\frac{\\cos h - 1}{h} + \\cos x \\cdot \\frac{\\sin h}{h}',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Fundamental limits',
            content: 'Everything depends on two limits. First: $\\lim_{h \\to 0}\\frac{\\sin h}{h} = 1$ — for very small angles, the arc and chord of the unit circle are practically equal. Second: $\\lim_{h \\to 0}\\frac{\\cos h - 1}{h} = 0$ — the cosine departs from $1$ much more slowly than $h$ departs from $0$.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Result',
            content: 'With these limits, the first term vanishes and the second gives $\\cos x$. For $\\cos x$, the argument is analogous, but $\\cos(x+h) = \\cos x \\cos h - \\sin x \\sin h$ — the minus sign in the sum formula is responsible for the $-\\sin x$ in the derivative.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The cycle of trigonometric derivatives ($\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$) reflects the geometry of the unit circle.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Differentiate $f(x) = 3\\sin(x) + 2\\cos(x)$.',
            solution: 'Differentiating term by term:',
            solutionLatex: "f'(x) = 3\\cos(x) + 2(-\\sin(x)) = 3\\cos(x) - 2\\sin(x)",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = \\tan(x)$.',
            solution: 'Writing $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$ and applying the quotient rule:',
            solutionLatex: "g'(x) = \\frac{\\cos^2(x) + \\sin^2(x)}{\\cos^2(x)} = \\frac{1}{\\cos^2(x)} = \\sec^2(x)",
        },
    ],

    // =====================================================================
    // EXPONENTIAL AND LOGARITHMIC
    // =====================================================================
    exp_log: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'The function $e^x$ is the only function that equals its own derivative — it grows at a rate proportional to its current value. Meanwhile, $\\ln(x)$, being the inverse of $e^x$, has derivative $\\frac{1}{x}$: the larger the value of $x$, the more slowly the logarithm grows.\n\nThese two functions form the foundation of growth and decay models in nature.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\frac{d}{dx}(e^x) = e^x \\qquad \\frac{d}{dx}(\\ln x) = \\frac{1}{x}',
            content: 'The exponential is its own derivative. The logarithm has derivative $1/x$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Definition for eˣ',
            content: 'We compute by the definition of derivative, factoring out $e^x$:',
            latex: '\\lim_{h \\to 0}\\frac{e^{x+h}-e^x}{h} = e^x \\cdot \\lim_{h \\to 0}\\frac{e^h - 1}{h}',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'What makes e special',
            content: 'The number $e \\approx 2.718$ is the only base value for which $\\lim_{h \\to 0}\\frac{b^h - 1}{h} = 1$. For any other base, this limit would be a constant different from $1$, and the derivative would have an extra factor. With base $e$, the factor is $1$ and the derivative is simply $e^x$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'For ln(x): implicit differentiation',
            content: 'For $\\ln(x)$, we use that it\'s the inverse of $e^x$: if $y = \\ln x$, then $x = e^y$. Differentiating implicitly:',
            latex: '1 = e^y \\cdot \\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The number $e$ is special because it\'s the only base where the exponential equals its own derivative — growth proportional to its own size.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Differentiate $f(x) = 5e^x - 3\\ln(x)$.',
            solution: 'Differentiating term by term:',
            solutionLatex: "f'(x) = 5e^x - \\frac{3}{x}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Differentiate $g(x) = x^2 e^x$ (use the product rule).',
            solution: 'With $u = x^2$ and $v = e^x$:',
            solutionLatex: "g'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = xe^x(2 + x)",
        },
    ],

    // =====================================================================
    // IMPLICIT DIFFERENTIATION
    // =====================================================================
    implicit: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Sometimes we can\'t (or don\'t want to) solve for $y$ in terms of $x$. In implicit differentiation, we differentiate both sides of the equation with respect to $x$, remembering that $y$ depends on $x$.\n\nSo every time we differentiate a term with $y$, a $\\frac{dy}{dx}$ appears by the chain rule. Then we just solve for $\\frac{dy}{dx}$.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: 'F(x,y) = 0 \\implies \\frac{dy}{dx} = -\\frac{F_x}{F_y}',
            content: 'Differentiate everything with respect to $x$, treat $y$ as a function of $x$, and solve for $\\frac{dy}{dx}$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'y depends on x',
            content: 'Implicit differentiation isn\'t a new technique — it\'s the chain rule applied with a crucial detail: $y$ depends on $x$, even if we don\'t know explicitly how.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Differentiating F(x,y) = 0',
            content: 'When we have $F(x,y) = 0$, we differentiate both sides with respect to $x$. Pure $x$ terms are differentiated normally. Each term with $y$ gets a factor of $\\frac{dy}{dx}$ by the chain rule.',
            latex: 'F_x + F_y \\cdot \\frac{dy}{dx} = 0',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Solving for dy/dx',
            content: 'Solving (provided $F_y \\neq 0$). The Implicit Function Theorem guarantees that, under these conditions, $y$ is indeed a differentiable function of $x$ in a neighborhood of the point.',
            latex: '\\frac{dy}{dx} = -\\frac{F_x}{F_y}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'We don\'t need to solve for $y$ to find $\\frac{dy}{dx}$ — just differentiate the entire equation respecting the dependency and solve for $\\frac{dy}{dx}$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Find $\\frac{dy}{dx}$ for $x^2 + y^2 = 25$.',
            solution: 'Differentiating both sides: $2x + 2y\\frac{dy}{dx} = 0$. Solving:',
            solutionLatex: "\\frac{dy}{dx} = -\\frac{x}{y}",
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Find $\\frac{dy}{dx}$ for $x^3 + y^3 = 6xy$.',
            solution: 'Differentiating: $3x^2 + 3y^2\\frac{dy}{dx} = 6y + 6x\\frac{dy}{dx}$. Rearranging $(3y^2 - 6x)\\frac{dy}{dx} = 6y - 3x^2$:',
            solutionLatex: "\\frac{dy}{dx} = \\frac{6y - 3x^2}{3y^2 - 6x} = \\frac{2y - x^2}{y^2 - 2x}",
        },
    ],
};
