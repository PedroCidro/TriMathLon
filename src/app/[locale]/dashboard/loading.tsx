export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Nav skeleton */}
            <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-3">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
            </nav>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* XP bar skeleton */}
                <div className="mb-10 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <div className="flex justify-between mb-3">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full" />
                </div>

                {/* Module cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-64 bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
                            <div className="flex justify-between mb-8">
                                <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                                <div className="h-6 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
                            <div className="h-2 w-full bg-gray-100 rounded-full" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
