import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function MathRenderer({ latex, className = "", display = false }: { latex: string, className?: string, display?: boolean }) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(latex, containerRef.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [latex, display]);

    return <span ref={containerRef} className={cn(
        display
            ? "block max-w-full overflow-x-auto"
            : "inline max-w-full overflow-x-auto align-baseline [&>.katex]:inline",
        className
    )} />;
}
