export type Department = {
    id: string;
    name: string;
};

export type InstitutionConfig = {
    id: string;
    name: string;
    emailDomains: string[];
    landingHeadline: string;
    landingSubline: string;
    premiumHeadline: string;
    departments?: Department[];
};

const institutions: InstitutionConfig[] = [
    {
        id: 'usp',
        name: 'USP',
        emailDomains: ['@usp.br'],
        landingHeadline: 'JustMathing para estudantes da USP',
        landingSubline: '50% de desconto para estudantes',
        premiumHeadline: '50% de desconto para estudantes da USP',
        departments: [
            { id: 'poli', name: 'Escola Politecnica (Poli)' },
            { id: 'ime', name: 'Instituto de Matematica e Estatistica (IME)' },
            { id: 'if', name: 'Instituto de Fisica (IF)' },
            { id: 'icmc', name: 'Instituto de Ciencias Matematicas e de Computacao (ICMC)' },
            { id: 'each', name: 'Escola de Artes, Ciencias e Humanidades (EACH)' },
            { id: 'eesc', name: 'Escola de Engenharia de Sao Carlos (EESC)' },
            { id: 'fea', name: 'Faculdade de Economia, Administracao e Contabilidade (FEA)' },
            { id: 'outro', name: 'Outro' },
        ],
    },
    {
        id: 'ufscar',
        name: 'UFSCar',
        emailDomains: ['@estudante.ufscar.br'],
        landingHeadline: 'JustMathing para estudantes da UFSCar',
        landingSubline: 'Feito pra quem enfrenta o Calculo na UFSCar',
        premiumHeadline: 'Feito pra quem enfrenta o Calculo na UFSCar',
    },
];

export function detectInstitution(email: string): InstitutionConfig | null {
    const lower = email.toLowerCase();
    for (const inst of institutions) {
        if (inst.emailDomains.some(domain => lower.endsWith(domain))) {
            return inst;
        }
    }
    return null;
}

export function getInstitutionById(id: string): InstitutionConfig | null {
    return institutions.find(inst => inst.id === id) ?? null;
}
