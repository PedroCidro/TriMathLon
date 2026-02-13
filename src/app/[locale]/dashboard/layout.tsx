import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const messages = (await import(`../../../../messages/${locale}.json`)).default;
    let explanations = {};
    try {
        explanations = (await import(`../../../../messages/explanations/${locale}.json`)).default;
    } catch {
        // Explanations file may not exist yet
    }

    const allMessages = {
        ...messages,
        Explanations: explanations,
    };

    return (
        <NextIntlClientProvider locale={locale} messages={allMessages}>
            {children}
        </NextIntlClientProvider>
    );
}
