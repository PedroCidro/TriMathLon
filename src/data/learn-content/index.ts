export type BlockType = 'intuition' | 'formula' | 'proof-step' | 'insight' | 'example' | 'graph';

export interface ContentBlock {
    id: string;
    type: BlockType;
    title?: string;
    content: string;          // text with $...$ LaTeX delimiters
    latex?: string;           // standalone centered LaTeX
    stepNumber?: number;      // for proof-step
    solution?: string;        // for example (collapsible)
    solutionLatex?: string;   // LaTeX in solution
    fn?: string;              // JS math expression for graph (e.g. "Math.pow(x,3) - 3*x")
    domain?: [number, number]; // x-range for graph (default [-5, 5])
    annotations?: Array<{ x: number; y: number; label: string; type: 'max' | 'min' | 'inflection' }>;
}

import { derivadasContent } from './derivadas';
import { integraisContent } from './integrais';
import { aplicacoesContent } from './aplicacoes';
import { limitesContent } from './limites';

import { derivadasContentEn } from './en/derivadas';
import { integraisContentEn } from './en/integrais';
import { aplicacoesContentEn } from './en/aplicacoes';
import { limitesContentEn } from './en/limites';

export const learnContent: Record<string, ContentBlock[]> = {
    ...limitesContent,
    ...derivadasContent,
    ...aplicacoesContent,
    ...integraisContent,
};

const learnContentEn: Record<string, ContentBlock[]> = {
    ...limitesContentEn,
    ...derivadasContentEn,
    ...aplicacoesContentEn,
    ...integraisContentEn,
};

export function getLearnContent(locale: string): Record<string, ContentBlock[]> {
    return locale === 'en' ? learnContentEn : learnContent;
}
