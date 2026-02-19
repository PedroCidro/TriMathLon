'use client';

import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

interface TableBlockProps {
    headers: string[];
    rows: string[][];
}

export default function TableBlock({ headers, rows }: TableBlockProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-purple-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-purple-50/80">
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                className="px-4 py-3 text-left font-bold text-[#1A1A2E] border-b border-purple-100"
                            >
                                {renderFormattedText(h)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr
                            key={ri}
                            className={ri % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}
                        >
                            {row.map((cell, ci) => (
                                <td
                                    key={ci}
                                    className="px-4 py-2.5 text-[#374151] border-b border-purple-50"
                                >
                                    {renderFormattedText(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
