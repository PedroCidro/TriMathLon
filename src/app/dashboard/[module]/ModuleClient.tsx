'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, BookOpen, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { curriculum } from '@/data/curriculum';
import { useUser } from '@clerk/nextjs';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function ModuleClient() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [isPremium, setIsPremium] = useState(false);

    // Fetch Premium Status
    useEffect(() => {
        const checkPremium = async () => {
            if (!isLoaded) {
                return;
            }
            if (!user) {
                router.push('/sign-in');
                return;
            }
            const supabase = createClient();
            const { data } = await supabase
                .from('profiles')
                .select('is_premium')
                .eq('id', user.id)
                .single();
            if (data?.is_premium) setIsPremium(true);
        };
        checkPremium();
    }, [isLoaded, router, user]);

    const moduleId = typeof params.module === 'string' ? params.module : '';
    const moduleData = curriculum.find(m => m.id === moduleId);

    if (!moduleData) {
        return (
            <div className="min-h-screen bg-gray-50 p-12 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Módulo não encontrado</h1>
                <Link href="/dashboard" className="text-blue-600 hover:underline">Voltar para o Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Voltar para Arena
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{moduleData.title}</h1>
                    <p className="text-gray-500 text-lg">{moduleData.description}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleData.topics.map((topic, i) => {
                        // Lock logic: Lock 'Hard' topics if not premium
                        // You can adjust this logic as needed
                        const isLocked = topic.difficulty === 'Hard' && !isPremium;

                        return (
                            <Link
                                href={isLocked ? '#' : `/dashboard/${moduleId}/${topic.id}`}
                                key={topic.id}
                                className={cn(
                                    "group relative p-6 bg-white border-2 rounded-2xl transition-all",
                                    isLocked
                                        ? "border-gray-100 opacity-75 cursor-not-allowed"
                                        : "border-gray-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{topic.title}</h3>
                                        <p className="text-gray-500 font-medium mb-4">{topic.description}</p>

                                        {isLocked ? (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                <Lock className="w-3 h-3" />
                                                Premium ({topic.difficulty})
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Play className="w-3 h-3 fill-current" />
                                                Começar
                                            </div>
                                        )}
                                    </div>

                                    {/* Using a generic icon or the module icon for topics since we don't have individual topic icons yet */}
                                    <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <MathRenderer latex={moduleData.iconLatex} className="font-bold text-lg" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
