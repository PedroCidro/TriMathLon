import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagina nao encontrada</h1>
                <p className="text-gray-500 mb-8">
                    A pagina que voce procura nao existe ou foi movida.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-black text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-md"
                >
                    Voltar ao inicio
                </Link>
            </div>
        </div>
    );
}
