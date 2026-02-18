import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { setRequestLocale } from 'next-intl/server';
import USPLandingClient from './USPLandingClient';

export default async function USPPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const { userId } = await auth();

    let isPremium = false;
    if (userId) {
        const { data: profile } = await getSupabaseAdmin()
            .from('profiles')
            .select('is_premium')
            .eq('id', userId)
            .single();
        isPremium = !!profile?.is_premium;
    }

    return <USPLandingClient locale={locale} isLoggedIn={!!userId} isPremium={isPremium} />;
}
