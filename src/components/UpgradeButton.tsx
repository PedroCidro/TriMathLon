'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function UpgradeButton() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
                }),
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);

            if (url) {
                window.location.href = url;
            } else {
                throw new Error("No URL returned from checkout session");
            }
        } catch (error: unknown) {
            console.error('Checkout error:', error);
            toast.error('Erro no checkout. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-6 py-2 rounded-full font-bold shadow-lg transform hover:-translate-y-0.5 transition-all text-sm"
        >
            <Zap className="w-4 h-4 fill-current" />
            {loading ? 'Processando...' : 'Upgrade Premium'}
        </button>
    );
}
