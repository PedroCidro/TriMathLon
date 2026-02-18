export type Topic = {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
};

export type Module = {
    id: string;
    title: string;
    description: string;
    iconLatex: string;
    color: string;
    barColor: string;
    premiumModule?: boolean;
    topics: Topic[];
};

export function isTopicPremium(mod: Module, topicIndex: number): boolean {
    return !!mod.premiumModule || topicIndex >= 3;
}

export const curriculum: Module[] = [
    {
        id: 'limites',
        title: 'Limites',
        description: 'Limites intuitivos, laterais, propriedades e continuidade.',
        iconLatex: '\\lim',
        color: 'bg-teal-50 border-teal-100 hover:border-teal-300',
        barColor: 'bg-teal-500',
        topics: [
            { id: 'intuitive_limits', title: 'Limites Intuitivos', description: 'O que acontece quando x se aproxima?', difficulty: 'Easy' },
            { id: 'one_sided_limits', title: 'Limites Laterais', description: 'Limites pela esquerda e direita', difficulty: 'Easy' },
            { id: 'limit_laws', title: 'Propriedades de Limites', description: 'Soma, produto e quociente de limites', difficulty: 'Medium' },
            { id: 'squeeze_theorem', title: 'Teorema do Confronto', description: 'Apertando entre duas funções', difficulty: 'Medium' },
            { id: 'continuity', title: 'Continuidade', description: 'Sem saltos nem buracos', difficulty: 'Medium' },
            { id: 'trig_limits', title: 'Limites Trigonométricos', description: 'sin(x)/x e variações', difficulty: 'Hard' },
            { id: 'limits_at_infinity', title: 'Limites no Infinito', description: 'Comportamento quando x → ∞', difficulty: 'Hard' },
        ]
    },
    {
        id: 'derivadas',
        title: 'Derivadas',
        description: 'Regras de derivação, regra da cadeia e taxas relacionadas.',
        iconLatex: '\\frac{d}{dx}',
        color: 'bg-purple-50 border-purple-100 hover:border-purple-300',
        barColor: 'bg-[#7C3AED]',
        topics: [
            { id: 'power_rule', title: 'Regra da Potência', description: 'Derivada de x^n', difficulty: 'Easy' },
            { id: 'product_rule', title: 'Regra do Produto', description: 'd(uv) = uv\' + vu\'', difficulty: 'Medium' },
            { id: 'quotient_rule', title: 'Regra do Quociente', description: 'Derivada de divisões', difficulty: 'Medium' },
            { id: 'chain_rule', title: 'Regra da Cadeia', description: 'Funções compostas f(g(x))', difficulty: 'Medium' },
            { id: 'trig_basic', title: 'Funções Trigonométricas', description: 'Sin, Cos, Tan, etc', difficulty: 'Medium' },
            { id: 'exp_log', title: 'Exponencial e Logarítmica', description: 'e^x, ln(x), a^x', difficulty: 'Medium' },
            { id: 'implicit', title: 'Derivação Implícita', description: 'Quando y não está isolado', difficulty: 'Hard' },
        ]
    },
    {
        id: 'aplicacoes',
        title: 'Aplicações de Derivadas',
        description: 'L\'Hôpital, taxas relacionadas, otimização, análise de gráficos e Taylor.',
        iconLatex: "f''",
        color: 'bg-green-50 border-green-100 hover:border-green-300',
        barColor: 'bg-green-500',
        premiumModule: true,
        topics: [
            { id: 'lhopital', title: 'Regra de L\'Hôpital', description: 'Limites indeterminados 0/0, ∞/∞', difficulty: 'Easy' },
            { id: 'related_rates', title: 'Taxas Relacionadas', description: 'Problemas com taxas de variação simultâneas', difficulty: 'Medium' },
            { id: 'mean_value_theorem', title: 'Teorema do Valor Médio', description: 'Existência de ponto com derivada média', difficulty: 'Medium' },
            { id: 'graph_sketching', title: 'Análise de Gráficos', description: 'Crescimento, concavidade e assíntotas', difficulty: 'Medium' },
            { id: 'optimization', title: 'Otimização', description: 'Máximos e mínimos aplicados', difficulty: 'Hard' },
            { id: 'taylor_polynomial', title: 'Polinômios de Taylor', description: 'Aproximação polinomial de funções', difficulty: 'Hard' },
        ]
    },
    {
        id: 'integrais',
        title: 'Integrais',
        description: 'Técnicas de integração, áreas e volumes.',
        iconLatex: '\\int',
        color: 'bg-purple-50 border-purple-100 hover:border-purple-300',
        barColor: 'bg-purple-500',
        topics: [
            { id: 'basic_integrals', title: 'Integrais Imediatas', description: 'Antiderivadas básicas', difficulty: 'Easy' },
            { id: 'substitution', title: 'Substituição (u-sub)', description: 'Regra da cadeia inversa', difficulty: 'Medium' },
            { id: 'by_parts', title: 'Integração por Partes', description: 'Regra do produto inversa', difficulty: 'Medium' },
            { id: 'trig_integrals', title: 'Integrais Trigonométricas', description: 'Potências de seno e cosseno', difficulty: 'Medium' },
            { id: 'trig_sub', title: 'Substituição Trigonométrica', description: 'Para raízes quadradas', difficulty: 'Hard' },
            { id: 'partial_fractions', title: 'Frações Parciais', description: 'Integração de racionais', difficulty: 'Hard' },
            { id: 'improper', title: 'Integrais Impróprias', description: 'Limites no infinito', difficulty: 'Hard' },
        ]
    },
];
