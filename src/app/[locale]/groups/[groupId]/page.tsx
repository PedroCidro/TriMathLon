import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { setRequestLocale } from 'next-intl/server';
import GroupDetailClient from './GroupDetailClient';

type Params = Promise<{ locale: string; groupId: string }>;

export default async function GroupDetailPage({ params }: { params: Params }) {
    const { locale, groupId } = await params;
    setRequestLocale(locale);

    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    return <GroupDetailClient groupId={groupId} />;
}
