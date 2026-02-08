import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useEffect, useRef } from 'react';

export default function MathRenderer({ latex, className = "" }: { latex: string, className?: string }) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(latex, containerRef.current, {
                throwOnError: false,
                displayMode: false,
            });
        }
    }, [latex]);

    return <span ref={containerRef} className={className} />;
}
