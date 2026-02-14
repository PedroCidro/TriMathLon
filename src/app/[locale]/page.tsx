import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import LocaleToggle from '@/components/ui/LocaleToggle';
import LandingSections from '@/components/landing/LandingSections';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // If already logged in, go straight to dashboard
    const { userId } = await auth();
    if (userId) {
        return redirect('/dashboard');
    }

    const t = await getTranslations('Landing');

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-900">
                    <Image src="/logo-icon.png" alt="JustMathing Logo" width={261} height={271} priority className="h-10 sm:h-16 w-auto" />
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/sobre"
                        className="hidden sm:flex font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href="/sign-in/[[...sign-in]]"
                        className="hidden sm:flex font-bold text-gray-900 hover:text-blue-600 transition-colors mr-4"
                    >
                        {t('signIn')}
                    </Link>
                    <LocaleToggle />
                    <Link
                        href="/sign-up/[[...sign-up]]"
                        className="bg-blue-600 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                    >
                        {t('getStarted')}
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20">
                {/* Hero Section — server-rendered, visible on first paint */}
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        {t('heroTitle')}<span className="text-blue-600">{t('heroHighlight')}</span>.
                    </h1>

                    <p className="animate-fade-in-up-delay-1 text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {t.rich('heroSubtitle', {
                            em: (chunks) => <em>{chunks}</em>,
                        })}
                    </p>

                    <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/sign-up/[[...sign-up]]"
                            className="flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                        >
                            {t('heroCtaFree')}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Below-fold sections — client component, lazy KaTeX */}
                <LandingSections />
            </main>
        </div>
    );
}
