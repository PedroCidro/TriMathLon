'use client';

import { ArrowRight, Dumbbell, Eye, BookOpen, Zap } from 'lucide-react';
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
            href="/sobre"
            className="font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sobre
          </Link>
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

      {/* How it Works */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Como funciona
          </h2>
          <p className="text-gray-500 text-center text-lg mb-16 max-w-2xl mx-auto">
            Cada tópico tem três modos de estudo, pensados para levar você da teoria à fluência.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-blue-600" />,
                title: 'Aprender',
                desc: 'Entenda a intuição por trás de cada técnica com explicações claras, provas e exemplos resolvidos passo a passo.',
                color: 'bg-blue-50',
              },
              {
                icon: <Dumbbell className="w-6 h-6 text-green-600" />,
                title: 'Treinar',
                desc: 'Resolva problemas no seu ritmo. Veja dicas quando precisar, confira a resposta e avalie sua confiança — o sistema se adapta a você.',
                color: 'bg-green-50',
              },
              {
                icon: <Eye className="w-6 h-6 text-purple-600" />,
                title: 'Reconhecer',
                desc: 'Dado um problema, identifique qual técnica usar. Essa é a habilidade que separa quem sabe a matéria de quem passa na prova.',
                color: 'bg-purple-50',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            O que oferecemos
          </h2>

          <div className="space-y-12">
            {[
              {
                title: '22 tópicos de Cálculo I, II e III',
                desc: 'De regra da potência até transformada de Laplace — derivadas, integrais e EDOs organizados em ordem crescente de dificuldade.',
              },
              {
                title: 'Problemas com feedback na hora',
                desc: 'Cada exercício tem resposta, dica passo a passo e autoavaliação. Você sabe exatamente onde errou antes de ir para o próximo.',
              },
              {
                title: 'Feito para quem aprende fazendo',
                desc: 'Menos teoria passiva, mais resolução. O foco é colocar a caneta no papel desde o primeiro minuto.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="mt-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blitz Mode highlight */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-6 h-6 text-yellow-600 fill-yellow-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Modo Blitz
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            3 minutos no relógio. Máximo de problemas. 3 erros e acabou. Teste sua velocidade e consistência sob pressão — do jeito que a prova vai cobrar.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comece agora, de graça.
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            9 tópicos liberados. Sem cartão de crédito.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
          >
            Criar Conta Grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
