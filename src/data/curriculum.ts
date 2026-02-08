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
    topics: Topic[];
};

export const curriculum: Module[] = [
    {
        id: 'derivadas',
        title: 'Derivadas',
        description: 'Regras de derivação, regra da cadeia e taxas relacionadas.',
        iconLatex: '\\frac{d}{dx}',
        color: 'bg-blue-50 border-blue-100 hover:border-blue-300',
        barColor: 'bg-blue-500',
        topics: [
            { id: 'power_rule', title: 'Regra da Potência', description: 'Derivada de x^n', difficulty: 'Easy' },
            { id: 'product_rule', title: 'Regra do Produto', description: 'd(uv) = uv\' + vu\'', difficulty: 'Medium' },
            { id: 'quotient_rule', title: 'Regra do Quociente', description: 'Derivada de divisões', difficulty: 'Medium' },
            { id: 'chain_rule', title: 'Regra da Cadeia', description: 'Funções compostas f(g(x))', difficulty: 'Medium' },
            { id: 'trig_basic', title: 'Funções Trigonométricas', description: 'Sin, Cos, Tan, etc', difficulty: 'Medium' },
            { id: 'exp_log', title: 'Exponencial e Logarítmica', description: 'e^x, ln(x), a^x', difficulty: 'Medium' },
            { id: 'implicit', title: 'Derivação Implícita', description: 'Quando y não está isolado', difficulty: 'Hard' },
            { id: 'related_rates', title: 'Taxas Relacionadas', description: 'Problemas de aplicação', difficulty: 'Hard' },
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
    {
        id: 'edos',
        title: 'EDOs',
        description: 'Equações diferenciais de 1ª e 2ª ordem.',
        iconLatex: '\\frac{dy}{dt}',
        color: 'bg-yellow-50 border-yellow-100 hover:border-yellow-300',
        barColor: 'bg-yellow-500',
        topics: [
            { id: 'separable', title: 'Variáveis Separáveis', description: 'f(y)dy = g(x)dx', difficulty: 'Easy' },
            { id: 'first_order_linear', title: 'Lineares de 1ª Ordem', description: 'Fator integrante', difficulty: 'Medium' },
            { id: 'exact', title: 'Equações Exatas', description: 'Mdx + Ndy = 0', difficulty: 'Medium' },
            { id: 'homogeneous', title: 'Equações Homogêneas', description: 'Substituição v = y/x', difficulty: 'Hard' },
            { id: 'second_order_linear', title: '2ª Ordem Lineares', description: 'Coeficientes constantes', difficulty: 'Medium' },
            { id: 'undetermined_coeffs', title: 'Coeficientes a Determinar', description: 'Solução particular', difficulty: 'Hard' },
            { id: 'laplace', title: 'Transformada de Laplace', description: 'Resolução algébrica', difficulty: 'Hard' },
        ]
    }
];
