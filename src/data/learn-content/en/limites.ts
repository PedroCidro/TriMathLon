import type { ContentBlock } from '../index';

export const limitesContentEn: Record<string, ContentBlock[]> = {
    // =====================================================================
    // INTUITIVE LIMITS
    // =====================================================================
    intuitive_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'When we write $\\lim_{x \\to a} f(x) = L$, we are saying that as $x$ approaches $a$ (without necessarily reaching it), the values of $f(x)$ approach $L$. The limit does not care about what happens exactly at $a$ — it only cares about the behavior near $a$.\n\nThink of approaching a cliff: what matters is the trend of the terrain as you walk toward the edge, not whether you are actually standing on it. If from all sides the terrain points to the same elevation, that elevation is the limit.\n\nThis idea is the foundation of all calculus: derivatives, integrals, and series are defined by limits. Without understanding what it means to "tend toward a value," none of the rest makes sense.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\lim_{x \\to a} f(x) = L',
            content: 'Read as: "the limit of $f(x)$ as $x$ approaches $a$ is $L$." It means $f(x)$ gets arbitrarily close to $L$ when $x$ is sufficiently close to $a$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Numerical approach',
            content: 'The first way to investigate a limit is to build a table of values. We choose values of $x$ progressively closer to $a$ (from the left and from the right) and observe where $f(x)$ converges. If the values stabilize around a number $L$, we have evidence that the limit is $L$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Graphical interpretation',
            content: 'On the graph, the limit at $x = a$ is the height toward which the curve "walks" as we approach $a$. Even if there is a hole in the graph at $a$ (a removed or undefined point), the limit can still exist — it suffices that the curve heads toward a definite height.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'What the limit is NOT',
            content: 'The limit $\\lim_{x \\to a} f(x)$ is not necessarily equal to $f(a)$. Three situations illustrate this: (1) $f(a)$ may not be defined (as in $\\frac{x^2-1}{x-1}$ when $x=1$); (2) $f(a)$ may exist but differ from the limit; (3) the limit may not exist if the function behaves differently from the left and the right.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The limit is about tendency, not arrival — what matters is where the function is heading, not where it is standing.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\lim_{x \\to 2} (x^2 - 1)$.',
            solution: 'Since $f(x) = x^2 - 1$ is a polynomial (continuous everywhere), we can substitute directly:',
            solutionLatex: '\\lim_{x \\to 2} (x^2 - 1) = 2^2 - 1 = 4 - 1 = 3',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.',
            solution: 'Direct substitution gives $\\frac{0}{0}$ (indeterminate form). We factor the numerator: $x^2 - 1 = (x-1)(x+1)$. Canceling the factor $(x-1)$ (valid since $x \\neq 1$ in the limit):',
            solutionLatex: '\\lim_{x \\to 1} \\frac{(x-1)(x+1)}{x-1} = \\lim_{x \\to 1} (x+1) = 2',
        },
    ],

    // =====================================================================
    // ONE-SIDED LIMITS
    // =====================================================================
    one_sided_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Sometimes a function behaves differently when we approach a point from the left versus from the right. The left-hand limit ($x \\to a^-$) considers only values less than $a$, and the right-hand limit ($x \\to a^+$) considers only values greater than $a$.\n\nImagine a road with a step: someone coming from the left side arrives at one height, and someone coming from the right side arrives at another. If the two heights coincide, the two-sided limit exists; if they do not, the two-sided limit does not exist.\n\nOne-sided limits are essential for analyzing piecewise functions, functions with jump discontinuities, and for understanding vertical asymptotes.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L',
            content: 'The two-sided limit exists and equals $L$ if and only if both one-sided limits exist and are equal to $L$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Left-hand limit',
            content: 'We write $\\lim_{x \\to a^-} f(x) = L_1$ when, for values of $x$ less than $a$ and increasingly close to $a$, the values of $f(x)$ approach $L_1$. That is, we consider only $x < a$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Right-hand limit',
            content: 'We write $\\lim_{x \\to a^+} f(x) = L_2$ when, for values of $x$ greater than $a$ and increasingly close to $a$, the values of $f(x)$ approach $L_2$. Here we consider only $x > a$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Existence condition',
            content: 'The two-sided limit $\\lim_{x \\to a} f(x)$ exists if and only if $L_1 = L_2$. If the one-sided limits differ, we say the two-sided limit does not exist. This is the main tool for detecting jump discontinuities.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The two-sided limit exists if and only if both one-sided limits exist and agree. When they disagree, the function "jumps" — and the limit does not exist.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Analyze the one-sided limits of $f(x) = \\frac{1}{x}$ as $x \\to 0$.',
            solution: 'When $x \\to 0^+$, we have $\\frac{1}{x} \\to +\\infty$. When $x \\to 0^-$, we have $\\frac{1}{x} \\to -\\infty$. Since the one-sided limits differ:',
            solutionLatex: '\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty, \\quad \\lim_{x \\to 0^-} \\frac{1}{x} = -\\infty \\quad \\Rightarrow \\quad \\lim_{x \\to 0} \\frac{1}{x} \\text{ does not exist}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Let $f(x) = \\begin{cases} x+1 & \\text{if } x < 2 \\\\ 5 & \\text{if } x = 2 \\\\ 2x-1 & \\text{if } x > 2 \\end{cases}$. Does $\\lim_{x \\to 2} f(x)$ exist?',
            solution: 'We compute the one-sided limits. From the left: $\\lim_{x \\to 2^-}(x+1) = 3$. From the right: $\\lim_{x \\to 2^+}(2x-1) = 3$. Both equal $3$, therefore:',
            solutionLatex: '\\lim_{x \\to 2} f(x) = 3 \\quad (\\text{even though } f(2) = 5 \\neq 3)',
        },
    ],

    // =====================================================================
    // LIMIT LAWS
    // =====================================================================
    limit_laws: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'Limits respect arithmetic. If you know the limit of two functions separately, you can determine the limit of their sum, difference, product, and quotient without going back to the definition.\n\nIt is like a calculator that operates on trends: if $f(x) \\to 5$ and $g(x) \\to 3$, then $f(x) + g(x) \\to 8$, $f(x) \\cdot g(x) \\to 15$, and so on. These rules allow you to decompose complicated limits into simple, manageable pieces.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\lim[f \\pm g] = \\lim f \\pm \\lim g, \\quad \\lim[f \\cdot g] = \\lim f \\cdot \\lim g, \\quad \\lim\\frac{f}{g} = \\frac{\\lim f}{\\lim g}',
            content: 'These laws hold provided the individual limits exist and, in the case of the quotient, the limit of the denominator is nonzero.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Sum law',
            content: 'If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, then $\\lim_{x \\to a}[f(x) + g(x)] = L + M$. The idea is that if $f(x)$ is close to $L$ and $g(x)$ is close to $M$, the sum is close to $L + M$. The same logic applies to subtraction.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Product law',
            content: 'If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, then $\\lim_{x \\to a}[f(x) \\cdot g(x)] = L \\cdot M$. As a consequence, constants can be "pulled out" of the limit: $\\lim[c \\cdot f] = c \\cdot \\lim f$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Quotient law',
            content: 'If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M \\neq 0$, then $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{L}{M}$. The condition $M \\neq 0$ is essential: when the denominator tends to zero, the quotient may diverge or produce an indeterminate form $\\frac{0}{0}$ that requires other techniques.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Limit laws let you break complicated limits into simple pieces — treat each part separately and combine the results.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\lim_{x \\to 3}(2x^2 + 5x - 1)$.',
            solution: 'Applying the sum and product laws (or simply substituting, since polynomials are continuous):',
            solutionLatex: '\\lim_{x \\to 3}(2x^2 + 5x - 1) = 2(3)^2 + 5(3) - 1 = 18 + 15 - 1 = 32',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\lim_{x \\to 2}\\frac{x^2 + 1}{x - 1}$.',
            solution: 'The denominator tends to $2 - 1 = 1 \\neq 0$, so we can apply the quotient law directly:',
            solutionLatex: '\\lim_{x \\to 2}\\frac{x^2 + 1}{x - 1} = \\frac{2^2 + 1}{2 - 1} = \\frac{5}{1} = 5',
        },
    ],

    // =====================================================================
    // SQUEEZE THEOREM
    // =====================================================================
    squeeze_theorem: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'The Squeeze Theorem (also called the Sandwich Theorem) says that if a function is "squeezed" between two others that converge to the same value, then the middle function also converges to that value.\n\nImagine a person walking between two walls that meet at the same point: no matter which path they take, they will be forced to pass through that point. Similarly, if $g(x) \\leq f(x) \\leq h(x)$ and both $g$ and $h$ tend to $L$, the function $f$ has no escape.\n\nThis theorem is the ideal tool when we cannot compute the limit of $f$ directly, but we can trap $f$ between two functions whose limits we know.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: 'g(x) \\leq f(x) \\leq h(x) \\text{ and } \\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L \\implies \\lim_{x \\to a} f(x) = L',
            content: 'If $f$ is trapped between $g$ and $h$, and both tend to the same limit $L$, then $f$ also tends to $L$.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'The sandwich',
            content: 'We establish an inequality $g(x) \\leq f(x) \\leq h(x)$ that holds for all $x$ in a neighborhood of $a$ (except possibly at $a$ itself). The function $g$ is the lower bound and $h$ is the upper bound.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Both bounds converge',
            content: 'We know that $\\lim_{x \\to a} g(x) = L$ and $\\lim_{x \\to a} h(x) = L$. This means that, for $x$ sufficiently close to $a$, both $g(x)$ and $h(x)$ are arbitrarily close to $L$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'f is squeezed',
            content: 'Since $g(x) \\leq f(x) \\leq h(x)$ and both bounds are close to $L$, the function $f(x)$ is trapped in an ever-narrowing band around $L$. Therefore, $f(x)$ must also tend to $L$. Formally:',
            latex: 'L - \\varepsilon < g(x) \\leq f(x) \\leq h(x) < L + \\varepsilon',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'The Squeeze Theorem is the ideal tool when you cannot compute the limit directly, but you can trap the function between two bounds that converge to the same value.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\lim_{x \\to 0} x^2 \\sin\\!\\left(\\frac{1}{x}\\right)$.',
            solution: 'We know that $-1 \\leq \\sin(1/x) \\leq 1$ for all $x \\neq 0$. Multiplying by $x^2 \\geq 0$: $-x^2 \\leq x^2\\sin(1/x) \\leq x^2$. Since $\\lim_{x \\to 0}(-x^2) = 0$ and $\\lim_{x \\to 0} x^2 = 0$, by the Squeeze Theorem:',
            solutionLatex: '\\lim_{x \\to 0} x^2 \\sin\\!\\left(\\frac{1}{x}\\right) = 0',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Show that $\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1$ using the Squeeze Theorem.',
            solution: 'On the unit circle, for $0 < x < \\frac{\\pi}{2}$, we can show geometrically that $\\sin x \\leq x \\leq \\tan x$. Dividing everything by $\\sin x > 0$: $1 \\leq \\frac{x}{\\sin x} \\leq \\frac{1}{\\cos x}$. Inverting: $\\cos x \\leq \\frac{\\sin x}{x} \\leq 1$. Since $\\lim_{x \\to 0}\\cos x = 1$ and the upper bound is $1$:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1',
        },
    ],

    // =====================================================================
    // CONTINUITY
    // =====================================================================
    continuity: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'A function that is continuous at a point is a function with no surprises: the value it takes at the point is exactly the value you would expect based on the behavior in its neighborhood. There are no jumps, holes, or explosions.\n\nVisually, a function continuous on an interval is one whose graph can be drawn without lifting the pen from the paper. But the precise definition requires three conditions: $f(a)$ must be defined, the limit $\\lim_{x \\to a} f(x)$ must exist, and both must be equal.\n\nContinuity is the bridge between behavior "near" and "exactly at" — and it is the property that makes it possible to use direct substitution to compute limits.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: 'f \\text{ is continuous at } a \\iff \\lim_{x \\to a} f(x) = f(a)',
            content: 'A function is continuous at $a$ when the limit equals the value of the function at that point.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Three conditions',
            content: 'For $f$ to be continuous at $x = a$, three conditions must be satisfied simultaneously: (1) $f(a)$ is defined; (2) $\\lim_{x \\to a} f(x)$ exists; (3) $\\lim_{x \\to a} f(x) = f(a)$. If any one of them fails, $f$ is discontinuous at $a$.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Basic functions are continuous',
            content: 'Polynomials are continuous on all of $\\mathbb{R}$. Trigonometric functions ($\\sin$, $\\cos$) are continuous on all of $\\mathbb{R}$. The exponential $e^x$ is continuous on all of $\\mathbb{R}$. The logarithm $\\ln x$ is continuous for $x > 0$. Rational functions $\\frac{p(x)}{q(x)}$ are continuous where $q(x) \\neq 0$.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Operations preserve continuity',
            content: 'If $f$ and $g$ are continuous at $a$, then $f + g$, $f - g$, $f \\cdot g$, and $\\frac{f}{g}$ (with $g(a) \\neq 0$) are also continuous at $a$. Furthermore, the composition $f \\circ g$ is continuous. This allows us to build increasingly elaborate continuous functions from simple ones.',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'Continuity = the limit matches the function value. It is the bridge between behavior "near" and "exactly at" — and it justifies computing limits by direct substitution.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Is $f(x) = \\frac{x^2 - 4}{x - 2}$ continuous at $x = 2$?',
            solution: '$f(2)$ is not defined (division by zero), so condition (1) fails and $f$ is discontinuous at $x = 2$. However, the limit exists: factoring $x^2 - 4 = (x-2)(x+2)$:',
            solutionLatex: '\\lim_{x \\to 2}\\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2}(x+2) = 4 \\quad \\text{(removable discontinuity)}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Show that $p(x) = 3x^3 - 2x + 7$ is continuous at every point.',
            solution: 'Since $p(x)$ is a polynomial, and polynomials are continuous on all of $\\mathbb{R}$, for any $a$ we have:',
            solutionLatex: '\\lim_{x \\to a} p(x) = p(a) = 3a^3 - 2a + 7 \\quad \\text{for all } a \\in \\mathbb{R}',
        },
    ],

    // =====================================================================
    // TRIGONOMETRIC LIMITS
    // =====================================================================
    trig_limits: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'The fundamental limit $\\frac{\\sin x}{x} \\to 1$ as $x \\to 0$ is the bridge between geometry and calculus. For very small angles (in radians), the sine is practically equal to the angle itself: $\\sin(0.01) \\approx 0.01$.\n\nThis makes geometric sense: on the unit circle, when the angle $x$ is very small, the arc of length $x$ and the vertical line of length $\\sin x$ are nearly indistinguishable. The ratio $\\frac{\\sin x}{x}$ measures how well the line approximates the arc.\n\nThis limit is the key piece for differentiating $\\sin x$ and $\\cos x$, and it is the foundation of all trigonometric limits that appear in calculus.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1 \\qquad \\lim_{x \\to 0}\\frac{\\cos x - 1}{x} = 0',
            content: 'These two fundamental limits are the foundation of all trigonometric derivatives.',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Geometric argument',
            content: 'On the unit circle, consider an angle $x$ with $0 < x < \\frac{\\pi}{2}$. By comparing areas of triangles and circular sectors, we obtain the fundamental inequality:',
            latex: '\\sin x \\leq x \\leq \\tan x',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Dividing by sin x',
            content: 'Dividing the entire inequality by $\\sin x > 0$ and inverting:',
            latex: '\\cos x \\leq \\frac{\\sin x}{x} \\leq 1',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Squeeze Theorem',
            content: 'As $x \\to 0^+$, we have $\\cos x \\to 1$ and the upper bound is $1$. By the Squeeze Theorem, $\\frac{\\sin x}{x} \\to 1$. Since $\\frac{\\sin x}{x}$ is an even function (same expression for $x$ and $-x$), the left-hand limit is also $1$.',
        },
        {
            id: 'proof-4',
            type: 'proof-step',
            stepNumber: 4,
            title: 'Consequence for (cos x - 1)/x',
            content: 'We use the identity $\\cos x - 1 = -2\\sin^2\\!\\left(\\frac{x}{2}\\right)$. Then:',
            latex: '\\frac{\\cos x - 1}{x} = \\frac{-2\\sin^2(x/2)}{x} = -\\frac{\\sin(x/2)}{x/2} \\cdot \\sin\\!\\left(\\frac{x}{2}\\right) \\to -1 \\cdot 0 = 0',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'These two fundamental limits are the foundation of all trigonometric derivatives — without them, we could not prove that the derivative of $\\sin x$ is $\\cos x$.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\lim_{x \\to 0}\\frac{\\sin(3x)}{x}$.',
            solution: 'We multiply and divide by $3$ to create the form $\\frac{\\sin(u)}{u}$ with $u = 3x$:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\sin(3x)}{x} = \\lim_{x \\to 0} 3 \\cdot \\frac{\\sin(3x)}{3x} = 3 \\cdot 1 = 3',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\lim_{x \\to 0}\\frac{\\tan x}{x}$.',
            solution: 'We write $\\tan x = \\frac{\\sin x}{\\cos x}$ and separate:',
            solutionLatex: '\\lim_{x \\to 0}\\frac{\\tan x}{x} = \\lim_{x \\to 0}\\frac{\\sin x}{x} \\cdot \\frac{1}{\\cos x} = 1 \\cdot \\frac{1}{1} = 1',
        },
    ],

    // =====================================================================
    // LIMITS AT INFINITY
    // =====================================================================
    limits_at_infinity: [
        {
            id: 'intuition',
            type: 'intuition',
            title: 'The Intuition',
            content: 'What happens to a function when $x$ grows without bound? A limit at infinity describes the long-term behavior of the function — its horizontal asymptote, if one exists.\n\nFor rational functions (quotients of polynomials), the answer depends only on the leading terms. When $x$ is huge, terms like $+3$ or $-2x$ are negligible compared to $5x^3$. It is like comparing salaries: if someone earns millions, the pennies do not matter.\n\nThis idea extends to any function: to determine the behavior at infinity, identify the dominant terms and ignore the rest.',
        },
        {
            id: 'formula',
            type: 'formula',
            title: 'Result',
            latex: '\\lim_{x \\to \\infty} \\frac{a_n x^n + \\cdots}{b_m x^m + \\cdots} = \\begin{cases} \\dfrac{a_n}{b_m} & \\text{if } n = m \\\\[6pt] 0 & \\text{if } n < m \\\\[6pt] \\pm\\infty & \\text{if } n > m \\end{cases}',
            content: 'The limit of a rational function at infinity depends on comparing the degrees of the numerator ($n$) and the denominator ($m$).',
        },
        {
            id: 'proof-1',
            type: 'proof-step',
            stepNumber: 1,
            title: 'Horizontal asymptotes',
            content: 'If $\\lim_{x \\to \\infty} f(x) = L$ (with $L$ finite), the line $y = L$ is a horizontal asymptote of the graph of $f$. The function approaches this line for large values of $x$, although it may cross it at intermediate points.',
        },
        {
            id: 'proof-2',
            type: 'proof-step',
            stepNumber: 2,
            title: 'Dominant terms',
            content: 'For very large $x$, the highest-degree term dominates all others. For example, in $3x^2 + 100x + 999$, when $x = 1000$, the term $3x^2 = 3{,}000{,}000$ makes the others ($100{,}000 + 999$) look negligible. Therefore, only the leading terms determine the behavior at infinity.',
        },
        {
            id: 'proof-3',
            type: 'proof-step',
            stepNumber: 3,
            title: 'Divide by the highest power',
            content: 'The standard technique is to divide both the numerator and the denominator by the highest power of $x$ in the denominator. This way, all terms except the leading ones produce fractions of the form $\\frac{c}{x^k}$ that tend to zero:',
            latex: '\\frac{a_n x^n + \\cdots}{b_m x^m + \\cdots} = \\frac{a_n x^{n-m} + \\cdots}{b_m + \\cdots} \\xrightarrow{x \\to \\infty} \\begin{cases} a_n/b_m & \\text{if } n = m \\\\ 0 & \\text{if } n < m \\end{cases}',
        },
        {
            id: 'insight',
            type: 'insight',
            content: 'For rational functions, the limit at infinity depends only on the leading terms — everything else becomes negligible when $x$ is sufficiently large.',
        },
        {
            id: 'example-1',
            type: 'example',
            title: 'Example 1',
            content: 'Calculate $\\lim_{x \\to \\infty}\\frac{3x^2 + 1}{5x^2 - 2}$.',
            solution: 'The degrees of the numerator and denominator are equal ($n = m = 2$). Dividing everything by $x^2$:',
            solutionLatex: '\\lim_{x \\to \\infty}\\frac{3x^2 + 1}{5x^2 - 2} = \\lim_{x \\to \\infty}\\frac{3 + \\frac{1}{x^2}}{5 - \\frac{2}{x^2}} = \\frac{3 + 0}{5 - 0} = \\frac{3}{5}',
        },
        {
            id: 'example-2',
            type: 'example',
            title: 'Example 2',
            content: 'Calculate $\\lim_{x \\to \\infty}\\frac{x}{x^2 + 1}$.',
            solution: 'The degree of the numerator ($n = 1$) is less than the degree of the denominator ($m = 2$). Dividing everything by $x^2$:',
            solutionLatex: '\\lim_{x \\to \\infty}\\frac{x}{x^2 + 1} = \\lim_{x \\to \\infty}\\frac{\\frac{1}{x}}{1 + \\frac{1}{x^2}} = \\frac{0}{1 + 0} = 0',
        },
    ],
};
