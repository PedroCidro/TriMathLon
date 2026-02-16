import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { setRequestLocale } from 'next-intl/server';
import GroupsClient from './GroupsClient';

type Params = Promise<{ locale: string }>;

export default async function GroupsPage({ params }: { params: Params }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    return <GroupsClient />;
}
