import { setRequestLocale } from 'next-intl/server';
import GroupJoinClient from './GroupJoinClient';

type Params = Promise<{ locale: string; inviteCode: string }>;

export default async function GroupJoinPage({ params }: { params: Params }) {
    const { locale, inviteCode } = await params;
    setRequestLocale(locale);

    return <GroupJoinClient inviteCode={inviteCode} />;
}
