import type { ContentBlock } from '../index';

export const aplicacoesContentEn: Record<string, ContentBlock[]> = {
    // =====================================================================
    // L'HÔPITAL'S RULE
    // =====================================================================
    lhopital: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "When we try to compute a limit and get the indeterminate form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, it seems like we're at a dead end. L'Hôpital's Rule offers an elegant way out: instead of computing the limit of the original ratio, we compute the limit of the ratio of the derivatives.\n\nThe idea is simple: if both the numerator and denominator are going to zero (or to infinity), what matters is the speed at which each one gets there. The derivative measures exactly this speed. So comparing the derivatives is comparing the rates of approach — and that determines the limit.\n\nFor example, $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$ gives $\\frac{0}{0}$. But $\\sin(x)$ approaches $0$ at the same speed as $x$ (since $\\cos(0) = 1$), so the limit is $1$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
            content: "If $\\lim_{x \\to a} f(x) = \\lim_{x \\to a} g(x) = 0$ (or both $\\pm\\infty$), and if $g'(x) \\neq 0$ near $a$, and if the limit on the right side exists (or is $\\pm\\infty$), then the two limits are equal.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "The indeterminate form 0/0",
            content: "Suppose $f(a) = g(a) = 0$ and that $f$ and $g$ are differentiable near $a$. We want to compute $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$. Since both equal $0$ at $a$, we can write:",
            latex: "\\frac{f(x)}{g(x)} = \\frac{f(x) - f(a)}{g(x) - g(a)}",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Cauchy's Mean Value Theorem",
            content: "Cauchy's Mean Value Theorem (a generalization of the classical MVT) guarantees that, for $x \\neq a$, there exists a point $c$ between $a$ and $x$ such that:",
            latex: "\\frac{f(x) - f(a)}{g(x) - g(a)} = \\frac{f'(c)}{g'(c)}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Taking the limit",
            content: "As $x \\to a$, the point $c$ (which is between $a$ and $x$) also tends to $a$. Therefore:",
            latex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{c \\to a} \\frac{f'(c)}{g'(c)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
        },
        {
            id: "insight",
            type: "insight",
            content: "L'Hôpital converts difficult limits into (possibly) easier ones. But be careful: it only works for indeterminate forms $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$. And if the new limit is also indeterminate, you can apply the rule again!",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "Calculate $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.",
            solution: "We have the form $\\frac{0}{0}$. Applying L'Hôpital, we differentiate the numerator and denominator separately:",
            solutionLatex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = \\lim_{x \\to 0} \\frac{\\cos(x)}{1} = \\cos(0) = 1",
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "Calculate $\\lim_{x \\to \\infty} \\frac{\\ln(x)}{x}$.",
            solution: "We have the form $\\frac{\\infty}{\\infty}$. Applying L'Hôpital:",
            solutionLatex: "\\lim_{x \\to \\infty} \\frac{\\ln(x)}{x} = \\lim_{x \\to \\infty} \\frac{\\frac{1}{x}}{1} = \\lim_{x \\to \\infty} \\frac{1}{x} = 0",
        },
    ],

    // =====================================================================
    // RELATED RATES
    // =====================================================================
    related_rates: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "Related rates problems connect the rates of change of quantities that depend on each other through some geometric or physical equation. For example, if a spherical balloon is being inflated, the growth rate of the radius and the growth rate of the volume are linked by the formula for the volume of a sphere.\n\nThe secret is: differentiate the equation relating the quantities with respect to time $t$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "\\frac{dV}{dt} = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}",
            content: "If two quantities are connected by an equation, their rates of change in time are also connected — by the chain rule applied to time $t$.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Equation connecting the quantities",
            content: "If two quantities are connected by an equation, their rates of change in time are also connected. This is the chain rule applied to time $t$. If we have $F(x, y) = 0$ where $x = x(t)$ and $y = y(t)$, differentiating with respect to $t$:",
            latex: "F_x \\frac{dx}{dt} + F_y \\frac{dy}{dt} = 0",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Differentiating with respect to time",
            content: "This equation connects the two rates — knowing one, we find the other. In the balloon case: $V = \\frac{4}{3}\\pi r^3$ holds at all times. Differentiating with respect to $t$:",
            latex: "\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Substituting known values",
            content: "Knowing $\\frac{dV}{dt}$ and $r$ at a given instant, we find $\\frac{dr}{dt}$. The method works because the geometric or physical equation is true at every instant — and therefore its time derivative is too. This derivative is exactly what connects the rates of change to each other.",
        },
        {
            id: "insight",
            type: "insight",
            content: "The key to related rates problems is identifying the equation that connects the quantities. Once found, the chain rule with respect to $t$ does the rest — transforming a relationship between quantities into a relationship between rates.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "A $5$m ladder leans against a wall. The base slides at $1$ m/s. At what rate is the top descending when the base is $3$m from the wall?",
            solution: "From the relation $x^2 + y^2 = 25$, differentiating with respect to $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. With $x=3$, $y=4$ and $\\frac{dx}{dt}=1$: $6(1) + 8\\frac{dy}{dt} = 0$.",
            solutionLatex: "\\frac{dy}{dt} = -\\frac{3}{4} \\text{ m/s (the top descends)}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "A spherical balloon is inflated at $\\frac{dV}{dt} = 100$ cm$^3$/s. What is $\\frac{dr}{dt}$ when $r = 5$ cm?",
            solution: "$V = \\frac{4}{3}\\pi r^3 \\implies \\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$. With $r=5$: $100 = 4\\pi(25)\\frac{dr}{dt} = 100\\pi\\frac{dr}{dt}$.",
            solutionLatex: "\\frac{dr}{dt} = \\frac{1}{\\pi} \\approx 0.318 \\text{ cm/s}",
        },
    ],

    // =====================================================================
    // MEAN VALUE THEOREM
    // =====================================================================
    mean_value_theorem: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "Imagine you drove 100 km in exactly 1 hour. Your average speed was 100 km/h. The Mean Value Theorem guarantees that, at some instant during the trip, your speedometer read exactly 100 km/h — no more, no less.\n\nIn mathematical terms: if a function is continuous and differentiable, then at some point the instantaneous rate of change (derivative) equals the average rate of change over the interval. The function cannot go from $A$ to $B$ without, at some moment, having exactly the slope of the line connecting $A$ to $B$.\n\nThis theorem is the foundation of many results in calculus — it connects local behavior (derivative at a point) to global behavior (total variation).",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a} \\quad \\text{for some } c \\in (a, b)",
            content: "If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists at least one point $c$ in the interior of the interval where the derivative equals the average rate of change.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "The statement",
            content: "Hypotheses: $f$ is continuous on the closed interval $[a,b]$ and differentiable on the open interval $(a,b)$. Conclusion: there exists $c \\in (a,b)$ such that $f'(c) = \\frac{f(b)-f(a)}{b-a}$. The idea of the proof is to reduce to Rolle's Theorem.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Rolle's Theorem",
            content: "Rolle's Theorem is the special case where $f(a) = f(b)$. In this case, the average rate is zero, and the theorem guarantees there exists $c \\in (a,b)$ with $f'(c) = 0$. Geometrically: if the function starts and ends at the same value, at some point it has a horizontal tangent.",
            latex: "f(a) = f(b) \\implies \\exists\\, c \\in (a,b) : f'(c) = 0",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Reducing to Rolle's Theorem",
            content: "We define an auxiliary function that subtracts the secant line from the graph of $f$:",
            latex: "h(x) = f(x) - \\left[f(a) + \\frac{f(b)-f(a)}{b-a}(x-a)\\right]",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Applying Rolle",
            content: "Observe that $h(a) = 0$ and $h(b) = 0$. Also, $h$ is continuous on $[a,b]$ and differentiable on $(a,b)$. By Rolle's Theorem, there exists $c \\in (a,b)$ with $h'(c) = 0$. But $h'(c) = f'(c) - \\frac{f(b)-f(a)}{b-a}$, so:",
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
        },
        {
            id: "insight",
            type: "insight",
            content: "The MVT guarantees that at some point the instantaneous rate equals the average rate. It's the bridge between derivative (local) and variation (global), and is used to prove inequalities, uniqueness of roots, and many other results in calculus.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "Find the $c$ guaranteed by the MVT for $f(x) = x^2$ on the interval $[1, 3]$.",
            solution: "The average rate is $\\frac{f(3)-f(1)}{3-1} = \\frac{9-1}{2} = 4$. We need $f'(c) = 4$, i.e., $2c = 4$:",
            solutionLatex: "c = 2 \\in (1, 3)",
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "Show that there exists $c \\in (0, 2)$ such that $f'(c) = 1$ for $f(x) = x^3 - 3x$.",
            solution: "The average rate is $\\frac{f(2)-f(0)}{2-0} = \\frac{(8-6)-0}{2} = \\frac{2}{2} = 1$. By the MVT, there exists $c$ with $f'(c) = 1$, i.e., $3c^2 - 3 = 1$, so $c^2 = \\frac{4}{3}$:",
            solutionLatex: "c = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3} \\approx 1.155 \\in (0, 2)",
        },
    ],

    // =====================================================================
    // GRAPH ANALYSIS
    // =====================================================================
    graph_sketching: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "The first derivative tells us if the function is going up or down. The second derivative tells us if it's curving upward or downward. Together, these two pieces of information give a complete picture of the graph's shape.\n\nThink of a road: the first derivative is the slope (uphill or downhill). The second derivative is how the slope is changing — whether it's getting steeper or leveling off. Points where the slope is zero are hilltops or valley bottoms. Points where the curvature changes direction are inflection points.\n\nWith derivatives, we don't need to plot hundreds of points — we can understand the global behavior of the function from local information.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "f'(x) > 0 \\Rightarrow \\text{increasing} \\qquad f''(x) > 0 \\Rightarrow \\text{concave up}",
            content: "$f'(x) > 0$: function increasing. $f'(x) < 0$: function decreasing. $f''(x) > 0$: concave up ($\\cup$ shape). $f''(x) < 0$: concave down ($\\cap$ shape).",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Critical points",
            content: "Critical points are where $f'(c) = 0$ or $f'(c)$ doesn't exist. At these points, the function may have a local maximum, local minimum, or neither (like $f(x) = x^3$ at $x = 0$).",
            latex: "f'(c) = 0 \\quad \\text{or} \\quad f'(c) \\text{ does not exist}",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "First derivative test",
            content: "Analyze the sign of $f'$ around the critical point. If $f'$ changes from positive to negative, it's a local maximum. If it changes from negative to positive, it's a local minimum. If the sign doesn't change, it's not an extremum.",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Second derivative and concavity",
            content: "The second derivative measures how the slope is changing. If $f''(x) > 0$, the slope is increasing — the curve opens upward. If $f''(x) < 0$, the slope is decreasing — the curve opens downward. At a critical point, $f''(c) > 0$ indicates a local minimum and $f''(c) < 0$ indicates a local maximum.",
            latex: "f''(c) > 0 \\Rightarrow \\text{local minimum} \\qquad f''(c) < 0 \\Rightarrow \\text{local maximum}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Inflection points",
            content: "Inflection points are where the concavity changes — the function goes from $\\cup$ to $\\cap$ or vice versa. They occur where $f''(x) = 0$ (or doesn't exist) and $f''$ changes sign. At these points, the curve crosses its tangent line.",
        },
        {
            id: "insight",
            type: "insight",
            content: "Two derivatives give a complete picture of a function's shape: the first reveals where it rises and falls, the second reveals how it curves. Together, they allow sketching the graph without calculating dozens of points.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "Sketch the graph of $f(x) = x^3 - 3x$.",
            solution: "$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$. Critical points: $x = -1$ and $x = 1$. $f'$ changes from $+$ to $-$ at $x=-1$ (local max $f(-1)=2$) and from $-$ to $+$ at $x=1$ (local min $f(1)=-2$). $f''(x) = 6x$: inflection at $x=0$.",
            solutionLatex: "\\text{Local max: } (-1,\\, 2) \\qquad \\text{Local min: } (1,\\, -2) \\qquad \\text{Inflection: } (0,\\, 0)",
        },
        {
            id: "graph-1",
            type: "graph",
            title: "Graph",
            content: "f(x) = x\u00B3 \u2212 3x",
            fn: "Math.pow(x,3) - 3*x",
            domain: [-3, 3] as [number, number],
            annotations: [
                { x: -1, y: 2, label: "Max (-1, 2)", type: "max" as const },
                { x: 1, y: -2, label: "Min (1, -2)", type: "min" as const },
                { x: 0, y: 0, label: "Inflection (0, 0)", type: "inflection" as const },
            ],
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "Analyze $f(x) = x^4 - 4x^3$.",
            solution: "$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$. Critical points: $x = 0$ and $x = 3$. At $x=0$, $f'$ doesn't change sign (not an extremum). At $x=3$, $f'$ changes from $-$ to $+$ (local min). $f''(x) = 12x^2 - 24x = 12x(x-2)$: inflections at $x=0$ and $x=2$.",
            solutionLatex: "\\text{Local min: } (3,\\, -27) \\qquad \\text{Inflections: } (0,\\, 0) \\text{ and } (2,\\, -16)",
        },
        {
            id: "graph-2",
            type: "graph",
            title: "Graph",
            content: "f(x) = x\u2074 \u2212 4x\u00B3",
            fn: "Math.pow(x,4) - 4*Math.pow(x,3)",
            domain: [-1.5, 5] as [number, number],
            annotations: [
                { x: 3, y: -27, label: "Min (3, -27)", type: "min" as const },
                { x: 0, y: 0, label: "Inflection (0, 0)", type: "inflection" as const },
                { x: 2, y: -16, label: "Inflection (2, -16)", type: "inflection" as const },
            ],
        },
    ],

    // =====================================================================
    // OPTIMIZATION
    // =====================================================================
    optimization: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "Optimization problems ask: what is the largest (or smallest) possible value? Maximize profit, minimize cost, find the most efficient shape — all reduce to finding where the derivative is zero.\n\nThe intuition is geometric: at a maximum or minimum point, the function stops going up and starts going down (or vice versa). At this transitional instant, the tangent line slope is zero. So the strategy is: set up the objective function, differentiate, set equal to zero, and solve.\n\nBut beware: zero derivative is necessary, not sufficient. We need to verify whether the point is truly a maximum or minimum (and not a saddle point), and also check the endpoints of the domain.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "f'(c) = 0 \\quad \\text{or} \\quad f'(c) \\text{ does not exist} \\quad \\Rightarrow \\quad c \\text{ is a candidate for extremum}",
            content: "At a local maximum or minimum, $f'(c) = 0$ or $f'(c)$ doesn't exist. These are the critical points — the only candidates for local extrema.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Model the problem",
            content: "Identify the objective function (what we want to maximize or minimize) and the constraint (the relationship between variables). Use the constraint to eliminate one variable, ending up with a function of a single variable.",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "Find critical points",
            content: "Differentiate the objective function and set it equal to zero. Solve to find the critical points:",
            latex: "f'(x) = 0",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "Classify",
            content: "Use the second derivative test: if $f''(c) > 0$, it's a local minimum; if $f''(c) < 0$, it's a local maximum. Or use the first derivative test, analyzing the sign change of $f'$.",
            latex: "f''(c) > 0 \\Rightarrow \\text{min} \\qquad f''(c) < 0 \\Rightarrow \\text{max}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Check domain endpoints",
            content: "If the domain is a closed interval $[a,b]$, the absolute maximum or minimum may occur at the endpoints $a$ or $b$, not just at critical points. Compare the values of $f$ at all candidates (critical points and endpoints) to determine the absolute extremum.",
        },
        {
            id: "insight",
            type: "insight",
            content: "Zero derivative is a necessary but not sufficient condition for an extremum — always verify with the second derivative test or by comparing values. On closed intervals, don't forget to check the domain endpoints.",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "Maximize the area of a rectangle with perimeter $20$.",
            solution: "If the sides are $x$ and $y$, we have $2x + 2y = 20$, so $y = 10 - x$. The area is $A(x) = x(10-x) = 10x - x^2$. Differentiating: $A'(x) = 10 - 2x = 0$, so $x = 5$ and $y = 5$. $A''(x) = -2 < 0$, confirming a maximum.",
            solutionLatex: "A_{\\max} = 5 \\times 5 = 25",
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "Minimize the total surface area of a cylindrical can with volume $V$.",
            solution: "The total area is $A = 2\\pi r^2 + 2\\pi r h$ and the volume is $V = \\pi r^2 h$, so $h = \\frac{V}{\\pi r^2}$. Substituting: $A(r) = 2\\pi r^2 + \\frac{2V}{r}$. Differentiating and setting equal to zero: $A'(r) = 4\\pi r - \\frac{2V}{r^2} = 0$, so $r^3 = \\frac{V}{2\\pi}$.",
            solutionLatex: "r = \\left(\\frac{V}{2\\pi}\\right)^{\\!1/3} \\qquad h = 2r \\quad \\text{(height = diameter)}",
        },
    ],

    // =====================================================================
    // TAYLOR POLYNOMIALS
    // =====================================================================
    taylor_polynomial: [
        {
            id: "intuition",
            type: "intuition",
            title: "The Intuition",
            content: "Any smooth function can be approximated by a polynomial — and polynomials are much easier to compute. Taylor's idea is to build a polynomial that agrees with the original function not just in value, but also in the first derivative, second derivative, and so on.\n\nThink of it this way: the zero-order approximation is a constant value (matching the point). The first-order is a tangent line (matching the slope). The second-order is a parabola (matching the curvature). Each additional term captures a finer level of the function's behavior.\n\nThe more terms we add, the better the approximation near the expansion point. Taylor is the best possible polynomial approximation — no other polynomial of the same degree does better near $a$.",
        },
        {
            id: "formula",
            type: "formula",
            title: "Result",
            latex: "f(x) \\approx \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x-a)^k",
            content: "The degree $n$ Taylor polynomial centered at $a$ uses the derivatives of $f$ at $a$ up to order $n$. The factorial $k!$ in the denominator ensures that the $k$-th derivative of the polynomial matches $f^{(k)}(a)$.",
        },
        {
            id: "proof-1",
            type: "proof-step",
            stepNumber: 1,
            title: "Zero-order condition",
            content: "We want a polynomial $P(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + \\cdots$ that approximates $f$ near $a$. The most basic condition is $P(a) = f(a)$. Evaluating at $x = a$, all terms with $(x-a)$ vanish:",
            latex: "c_0 = f(a)",
        },
        {
            id: "proof-2",
            type: "proof-step",
            stepNumber: 2,
            title: "First-order condition",
            content: "We also want $P'(a) = f'(a)$. Differentiating: $P'(x) = c_1 + 2c_2(x-a) + \\cdots$. Evaluating at $a$:",
            latex: "c_1 = f'(a)",
        },
        {
            id: "proof-3",
            type: "proof-step",
            stepNumber: 3,
            title: "The general pattern",
            content: "Continuing, $P''(a) = 2c_2$, so $c_2 = \\frac{f''(a)}{2}$. For the $k$-th derivative: $P^{(k)}(a) = k! \\cdot c_k$, so $c_k = \\frac{f^{(k)}(a)}{k!}$. The factorial appears naturally from the repeated differentiation of $(x-a)^k$.",
            latex: "c_k = \\frac{f^{(k)}(a)}{k!}",
        },
        {
            id: "proof-4",
            type: "proof-step",
            stepNumber: 4,
            title: "Taylor remainder",
            content: "The error of the approximation is given by the Taylor remainder (Lagrange form): there exists $\\xi$ between $a$ and $x$ such that the error is exactly the next term of the series, evaluated at $\\xi$. This allows estimating the accuracy of the approximation.",
            latex: "R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}",
        },
        {
            id: "insight",
            type: "insight",
            content: "Each additional term improves the approximation — Taylor is the best possible polynomial approximation near the expansion point. In practice, a few terms already give excellent results: the series for $e^x$ with 10 terms gives 9 decimal places of accuracy!",
        },
        {
            id: "example-1",
            type: "example",
            title: "Example 1",
            content: "Find the Taylor polynomial of $e^x$ centered at $a = 0$ up to degree $4$.",
            solution: "All derivatives of $e^x$ are $e^x$, and $e^0 = 1$. So $f^{(k)}(0) = 1$ for all $k$:",
            solutionLatex: "e^x \\approx 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\frac{x^4}{24}",
        },
        {
            id: "example-2",
            type: "example",
            title: "Example 2",
            content: "Find the Taylor polynomial of $\\sin(x)$ centered at $a = 0$ up to degree $5$.",
            solution: "The derivatives of $\\sin(x)$ at $0$ are: $f(0)=0$, $f'(0)=1$, $f''(0)=0$, $f'''(0)=-1$, $f^{(4)}(0)=0$, $f^{(5)}(0)=1$. The even terms vanish:",
            solutionLatex: "\\sin(x) \\approx x - \\frac{x^3}{6} + \\frac{x^5}{120}",
        },
    ],
};
