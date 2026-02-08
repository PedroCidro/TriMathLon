import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // O Supabase manda um 'code' na URL quando o login dá certo
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // Se tiver um parâmetro 'next', a gente redireciona pra lá depois (ex: /dashboard)
    const rawNext = searchParams.get('next') ?? '/dashboard'
    // Validate redirect to prevent open redirect attacks
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

    if (code) {
        const supabase = await createClient()

        // Troca o código temporário por uma Sessão Real
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Fetch User to Check Onboarding Status
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                // If onboarding not completed, force redirect to onboarding
                if (profile && !profile.onboarding_completed) {
                    return NextResponse.redirect(`${origin}/onboarding`);
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // Para quando for pra Vercel
            const isLocal = origin.includes('localhost')

            if (isLocal) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // Se deu erro ou não veio código, manda pra uma página de erro
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
