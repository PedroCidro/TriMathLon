import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8F7F4]">
            <SignIn />
        </div>
    )
}
