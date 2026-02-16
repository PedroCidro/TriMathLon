import { setRequestLocale } from 'next-intl/server';
import ChallengeInviteClient from './ChallengeInviteClient';

type Params = Promise<{ locale: string; challengeId: string }>;

export default async function ChallengeInvitePage({ params }: { params: Params }) {
    const { locale, challengeId } = await params;
    setRequestLocale(locale);

    return <ChallengeInviteClient challengeId={challengeId} />;
}
