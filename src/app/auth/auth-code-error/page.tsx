'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Authentication Error
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                    <p className="text-sm text-red-600">
                        {error || "Oops! Something went wrong while signing you in."}
                    </p>
                </div>
                <div className="mt-5">
                    <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense>
            <ErrorContent />
        </Suspense>
    )
}
