'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MathRenderer from '@/components/ui/MathRenderer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-900">
          <img src="/logo-icon.png" alt="Trimathlon Logo" className="h-16 w-auto" />

        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="font-bold text-gray-900 hover:text-blue-600 transition-colors mr-4"
          >
            Entrar
          </Link>
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
          >
            Começar Agora
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20">

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]"
          >
            Masterize o <span className="text-blue-600">Cálculo</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            A melhor maneira de aprender a <em>fazer</em> matemática. Substitua palestras passivas por resolução de problemas interativa e prática deliberada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/sign-up"
              className="flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
            >
              Começar Treino Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            {
              title: "Derivadas",
              desc: "Regras de derivação, regra da cadeia e taxas relacionadas.",
              icon: <MathRenderer latex="\frac{d}{dx}" className="text-4xl text-blue-600 font-bold" />
            },
            {
              title: "Integrais",
              desc: "Técnicas de integração, áreas e volumes.",
              icon: <MathRenderer latex="\int" className="text-5xl text-purple-600 font-bold" />
            },
            {
              title: "EDOs",
              desc: "Equações diferenciais de 1ª e 2ª ordem.",
              icon: <MathRenderer latex="\frac{dy}{dt}" className="text-3xl text-yellow-600 font-bold" />
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8 text-left group"
            >
              <div className="mb-6 h-16 w-16 flex items-center justify-center rounded-2xl bg-gray-50/80 group-hover:bg-blue-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>



      </main>
    </div>
  );
}
