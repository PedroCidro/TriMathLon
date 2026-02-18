import { setRequestLocale } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingSections from '@/components/landing/LandingSections';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const { userId } = await auth();
    if (userId) {
        return redirect('/dashboard');
    }

    return <LandingSections />;
}
