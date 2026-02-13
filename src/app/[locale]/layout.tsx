import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });

    return {
        title: t("defaultTitle"),
        description: t("defaultDescription"),
        keywords:
            locale === "pt"
                ? ["cálculo", "derivadas", "integrais", "EDO", "matemática", "treino", "prática", "universidade"]
                : ["calculus", "derivatives", "integrals", "ODE", "mathematics", "training", "practice", "university"],
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            type: "website",
            locale: locale === "pt" ? "pt_BR" : "en_US",
            siteName: "JustMathing",
        },
        twitter: {
            card: "summary_large_image",
            title: t("ogTitle"),
            description: t("ogDescription"),
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as 'pt' | 'en')) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <ClerkProvider localization={locale === "pt" ? ptBR : undefined}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
                <Toaster richColors position="top-right" />
                <Analytics />
            </NextIntlClientProvider>
        </ClerkProvider>
    );
}
