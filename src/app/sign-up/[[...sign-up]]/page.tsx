import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <SignUp />
        </div>
    )
}
