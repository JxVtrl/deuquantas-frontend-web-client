import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  QrCode,
  Clock,
  CreditCard,
  BarChart4,
  Users,
  Shield,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function Home() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' &&
        target.getAttribute('href')?.startsWith('#')
      ) {
        e.preventDefault();
        const id = target.getAttribute('href')?.replace('#', '');
        const element = document.getElementById(id!);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-neutral-900'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/80'>
        <div className='container mx-auto flex items-center justify-between'>
          <Link href='/' className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='112'
              height='48'
              viewBox='0 0 56 24'
              fill='none'
              className='mb-0'
            >
              <path
                d='M8.39967 21.3432C3.46054 21.3432 0 18.1845 0 13.4908C0 8.47233 3.99535 5.99262 7.64464 5.99262C9.6895 5.99262 11.3883 6.76015 12.4265 8.23616V0H16.6735V13.5203C16.6735 18.3616 13.213 21.3432 8.39967 21.3432ZM8.36821 17.6236C10.7906 17.6236 12.4265 16 12.4265 13.6679C12.4265 11.3358 10.7906 9.71218 8.36821 9.71218C5.94583 9.71218 4.30994 11.3358 4.30994 13.6679C4.30994 16 5.94583 17.6236 8.36821 17.6236Z'
                fill='#FFCC00'
              />
              <path
                d='M41.6648 24H36.474L34.0831 20.7823C32.9191 21.1365 31.6293 21.3432 30.2451 21.3432C23.8273 21.3432 19.2972 17.0923 19.2972 11.3063C19.2972 5.5203 23.8273 1.26937 30.2451 1.26937C36.6628 1.26937 41.1929 5.5203 41.1929 11.3063C41.1929 14.3469 39.9346 16.9742 37.8268 18.7454L41.6648 24ZM30.2451 17.3579C30.6855 17.3579 31.0945 17.3284 31.5034 17.2694L28.5462 13.2546H33.8L35.2156 15.203C36.065 14.1697 36.5369 12.8413 36.5369 11.3063C36.5369 7.79336 34.0202 5.25461 30.2451 5.25461C26.4699 5.25461 23.9532 7.79336 23.9532 11.3063C23.9532 14.8192 26.4699 17.3579 30.2451 17.3579Z'
                fill='#FFCC00'
              />
              <path
                d='M46.5936 14.6125V14.3764C46.5936 11.3653 48.3239 10.3026 49.7396 9.41697C50.8092 8.73801 51.7215 8.17712 51.7215 6.99631C51.7215 5.72694 50.8092 4.98893 49.425 4.98893C48.1666 4.98893 47.1284 5.72694 47.1284 7.11439V7.35055H43.1016V6.96679C43.1016 3.4834 45.8386 1.26937 49.5508 1.26937C53.2945 1.26937 56 3.42435 56 6.96679C56 10.0074 54.2697 10.952 52.7597 11.7786C51.5957 12.428 50.5575 12.9889 50.5575 14.3764V14.6125H46.5936ZM48.6385 21.3432C47.0655 21.3432 45.8701 20.2214 45.8701 18.7454C45.8701 17.2694 47.0655 16.1476 48.6385 16.1476C50.2115 16.1476 51.4069 17.2694 51.4069 18.7454C51.4069 20.2214 50.2115 21.3432 48.6385 21.3432Z'
                fill='#FFCC00'
              />
            </svg>
          </Link>

          <nav className='hidden md:flex items-center space-x-8'>
            {['Início', 'Funcionalidades', 'Como Funciona', 'Contato'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className='text-neutral-700 dark:text-neutral-200 font-medium hover:text-brand-yellow transition-colors no-underline hover:no-underline focus:no-underline active:no-underline'
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className='flex items-center gap-4'>
            <Link
              href={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000/register' : 'https://deuquantas.com.br/register'}`}
            >
              <Button
                className='bg-brand-yellow hover:bg-brand-yellow/90'
                variant='default'
              >
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='relative flex  flex-col min-h-screen'>
        {/* Hero Section */}
        <section
          className='min-h-[calc(140vh)] flex flex-col justify-center 
            relative overflow-hidden bg-gradient-to-b from-white to-brand-gray 
            dark:from-brand-dark dark:to-gray-900 
            pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6'
          id='início'
        >
          {/* Background Gradient */}
          <div
            className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
            from-white via-white to-transparent dark:from-brand-dark dark:via-brand-dark 
            dark:to-transparent opacity-70 z-0'
          />

          <div className='container max-w-7xl mx-auto relative z-10'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  type: 'spring',
                  duration: 1,
                  bounce: 0.3,
                },
              }}
              viewport={{ once: true }}
              className='flex flex-col items-center text-center'
            >
              {/* Título Principal */}
              <h1
                className='text-3xl pt-30  md:text-4xl lg:text-4xl xl:text-5xl
                font-bold tracking-tight text-neutral-900 dark:text-white
                leading-[1.2] sm:leading-[1.2] mb-6 sm:mb-8 max-w-[18ch]'
              >
                <span className='inline-block mb-2'>SUA MESA</span>
                <br className='hidden sm:block' />
                <span className='inline-block mb-2'>VALE OURO.</span>
                <br className='hidden sm:block' />
                <span className='inline-block'>NÃO A DEIXE PARADA.</span>
              </h1>

              {/* Subtítulo */}
              <p
                className='text-base sm:text-lg md:text-xl text-neutral-600 
                dark:text-neutral-300 max-w-2xl mx-auto mb-12 sm:mb-16
                leading-relaxed px-4'
              >
                Com o DeuQuantas, seus clientes pagam direto do celular.
                <br className='hidden sm:block' />
                Você gira mesas mais rápido, fatura mais e ainda vira referência
                em atendimento moderno.
              </p>

              {/* Benefits Cards */}
              <div className='w-full max-w-5xl mx-auto mb-12 sm:mb-16'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0'>
                  {[
                    {
                      icon: Clock,
                      text: 'Sem fila pra pagar',
                      description: 'Pagamento rápido e sem espera',
                    },
                    {
                      icon: Users,
                      text: 'Sem chamar garçom',
                      description: 'Autonomia total para os clientes',
                    },
                    {
                      icon: CreditCard,
                      text: 'Sem confusão na conta',
                      description: 'Divisão automática e transparente',
                    },
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.text}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: 'spring',
                          duration: 0.8,
                          delay: index * 0.2,
                          bounce: 0.3,
                        },
                      }}
                      viewport={{ once: true }}
                      className='group relative overflow-hidden rounded-xl 
                        bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                        shadow-lg hover:shadow-xl
                        border border-neutral-200/30 dark:border-neutral-700/30
                        transition-all duration-300
                        p-4 sm:p-6'
                    >
                      {/* Icon Container */}
                      <div className='flex items-center gap-4'>
                        <div
                          className='w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                          bg-gradient-to-br from-brand-yellow to-brand-yellow/70
                          flex items-center justify-center shrink-0
                          transform group-hover:scale-110 group-hover:rotate-3
                          transition-all duration-300'
                        >
                          <benefit.icon className='w-5 h-5 sm:w-6 sm:h-6 text-brand-dark' />
                        </div>

                        <div>
                          <h3
                            className='text-base sm:text-lg font-semibold 
                            text-neutral-800 dark:text-white
                            group-hover:text-brand-yellow transition-colors'
                          >
                            {benefit.text}
                          </h3>
                          <p
                            className='text-sm text-neutral-600 dark:text-neutral-300 
                            mt-1 leading-relaxed hidden sm:block'
                          >
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Form */}
              <div className='w-full max-w-xl mx-auto px-4 sm:px-0'>
                <form className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <Input
                      placeholder='Seu email para lista de espera'
                      type='email'
                      required
                      className='h-12 text-base sm:text-lg bg-transparent
                        placeholder:text-neutral-500 dark:placeholder:text-neutral-400'
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellow/90 
                      text-brand-dark font-medium text-base whitespace-nowrap
                      px-6 py-3 rounded-full transform hover:scale-105
                      transition-all duration-300 shadow-lg hover:shadow-xl'
                  >
                    Quero testar
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div
            className='absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 
            bg-brand-yellow/10 rounded-full blur-3xl opacity-75'
          />
          <div
            className='absolute top-40 -right-20 w-56 h-56 sm:w-80 sm:h-80 
            bg-brand-yellow/5 rounded-full blur-3xl opacity-75'
          />
        </section>

        {/* Features Section */}
        <section
          className='py-24 bg-brand-gray dark:bg-neutral-900'
          id='funcionalidades'
        >
          <div className='container max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='text-center mb-16'>
              <span className='text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3'>
                Funcionalidades
              </span>
              <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-6 dark:text-white'>
                Uma solução para todos
              </h3>
              <p className='text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto'>
                O &quot;Deu Quantas?&quot; otimiza a experiência tanto para os
                clientes quanto para os estabelecimentos.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-10 mb-20'>
              {/* Client Features */}
              <div>
                <div className='mb-10'>
                  <span className='inline-block px-4 py-1 bg-brand-yellow rounded-full text-sm font-medium text-brand-dark mb-4'>
                    Para Clientes
                  </span>
                  <h3 className='text-2xl font-bold mb-2 dark:text-white'>
                    Mais controle e tranquilidade
                  </h3>
                  <p className='text-neutral-600 dark:text-neutral-300'>
                    Acompanhe suas comandas, faça pedidos e pague sem
                    complicações
                  </p>
                </div>

                <div className='space-y-6'>
                  {[
                    {
                      icon: <QrCode size={24} />,
                      title: 'QR Code na Mesa',
                      description:
                        'Escaneie o código QR na mesa e tenha acesso instantâneo à sua comanda digital.',
                    },
                    {
                      icon: <Clock size={24} />,
                      title: 'Comanda em Tempo Real',
                      description:
                        'Acompanhe seus pedidos e valores em tempo real, sem surpresas no final.',
                    },
                    {
                      icon: <CreditCard size={24} />,
                      title: 'Divisão Automática',
                      description:
                        'Divida a conta de forma automática e personalizada entre os amigos.',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className='bg-white dark:bg-neutral-800 p-6 rounded-xl'
                    >
                      <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-brand-yellow/10 text-brand-yellow'>
                        {feature.icon}
                      </div>
                      <h3 className='text-xl font-semibold mb-2 dark:text-white'>
                        {feature.title}
                      </h3>
                      <p className='text-neutral-600 dark:text-neutral-300'>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Establishment Features */}
              <div>
                <div className='mb-10'>
                  <span className='inline-block px-4 py-1 bg-white dark:bg-neutral-800 rounded-full text-sm font-medium text-brand-dark dark:text-white mb-4'>
                    Para Estabelecimentos
                  </span>
                  <h3 className='text-2xl font-bold mb-2 dark:text-white'>
                    Mais eficiência e lucro
                  </h3>
                  <p className='text-neutral-600 dark:text-neutral-300'>
                    Gerencie seu negócio com automação e relatórios detalhados
                  </p>
                </div>

                <div className='space-y-6'>
                  {[
                    {
                      icon: <BarChart4 size={24} />,
                      title: 'Painel de Controle',
                      description:
                        'Gerencie pedidos, mesas e finanças através de um painel completo e intuitivo.',
                    },
                    {
                      icon: <Users size={24} />,
                      title: 'Gestão de Funcionários',
                      description:
                        'Controle de acesso e desempenho dos garçons, cozinheiros e administradores.',
                    },
                    {
                      icon: <Shield size={24} />,
                      title: 'Segurança de Pagamento',
                      description:
                        'Garanta que seu estabelecimento receba por todos os pedidos realizados.',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className='glass-card dark:bg-neutral-800/50 p-6 rounded-xl'
                    >
                      <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-black/5 dark:bg-white/5 text-black dark:text-white'>
                        {feature.icon}
                      </div>
                      <h3 className='text-xl font-semibold mb-2 dark:text-white'>
                        {feature.title}
                      </h3>
                      <p className='text-neutral-600 dark:text-neutral-300'>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          className='py-24 bg-white dark:bg-neutral-800'
          id='como-funciona'
        >
          <div className='container max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='text-center mb-16'>
              <span className='text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3'>
                Processo
              </span>
              <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-6 dark:text-white'>
                Como Funciona
              </h3>
              <p className='text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto'>
                Um sistema completo que simplifica desde o pedido até o
                pagamento
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-10 mb-12'>
              {[
                {
                  icon: QrCode,
                  title: 'Escaneie e Comece',
                  description: 'Nada de baixar app. É instantâneo.',
                },
                {
                  icon: BarChart4,
                  title: 'Acompanhe em Tempo Real',
                  description: 'Mais transparência e controle.',
                },
                {
                  icon: CreditCard,
                  title: 'Pague sem Complicação',
                  description: 'Divida e pague direto pelo celular.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      duration: 1,
                      delay: index * 0.2,
                    },
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  className='text-center'
                >
                  <div className='mb-6 inline-block'>
                    <div
                      className='w-16 h-16 rounded-full 
                      bg-brand-yellow/10 
                      flex items-center justify-center
                      transform transition-all duration-300'
                    >
                      <feature.icon className='w-8 h-8 text-brand-yellow' />
                    </div>
                  </div>
                  <h4 className='text-xl font-bold mb-4 dark:text-white'>
                    {feature.title}
                  </h4>
                  <p className='text-neutral-600 dark:text-neutral-300'>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className='bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/20 dark:from-brand-yellow/5 dark:to-brand-yellow/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between'>
              <div className='mb-6 md:mb-0 md:mr-6'>
                <h3 className='text-2xl md:text-3xl font-bold mb-3 dark:text-white'>
                  Pronto para simplificar seu negócio?
                </h3>
                <p className='text-neutral-600 dark:text-neutral-300 text-lg'>
                  Junte-se a centenas de estabelecimentos que já estão
                  transformando a experiência dos seus clientes.
                </p>
              </div>
              <Button className='bg-brand-yellow hover:bg-brand-yellow/90 text-black font-medium rounded-full px-8 py-6 whitespace-nowrap'>
                Começar Agora
              </Button>
            </div>
          </div>
        </section>

        {/* Formulário Section */}
        <section className='py-24 bg-brand-gray dark:bg-neutral-900'>
          <div className='container max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='max-w-2xl mx-auto text-center'>
              <h3 className='text-3xl sm:text-4xl font-bold mb-4 dark:text-white'>
                Pronto pra transformar seu atendimento?
              </h3>

              <p className='text-lg mb-8 dark:text-neutral-300'>
                Deixe seus dados e nossa equipe entra em contato com você.
                <br />
                Seja um dos primeiros a pilotar essa revolução.
              </p>

              <form className='space-y-6'>
                <Input
                  placeholder='Nome do restaurante'
                  className='h-12 text-md bg-transparent'
                />
                <Input
                  placeholder='Seu nome'
                  className='h-12 text-md bg-transparent'
                />
                <Input
                  placeholder='WhatsApp'
                  className='h-12 text-md bg-transparent'
                />
                <Input
                  placeholder='E-mail'
                  className='h-12 text-md bg-transparent'
                />
                <Input
                  placeholder='Cidade/Estado'
                  className='h-12 text-md bg-transparent'
                />

                <Button
                  type='submit'
                  className='w-full bg-brand-yellow hover:bg-brand-yellow/90 text-brand-dark font-medium text-lg h-12 mt-8'
                >
                  Quero fazer parte
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className='bg-brand-dark pt-12 text-white dark:bg-black'
          id='contato'
        >
          <div className='container max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
              <div>
                <h1 className='text-2xl text-brand-yellow font-bold mb-6'>
                  DeuQuantas
                </h1>
                <p className='text-neutral-400 dark:text-neutral-500 mb-6'>
                  Sistema inovador de gerenciamento de comandas para bares e
                  restaurantes.
                </p>
                <div className='flex space-x-4'>
                  <a
                    href='#'
                    className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href='#'
                    className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href='#'
                    className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href='#'
                    className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              <div>
                <h3 className='font-semibold text-brand-yellow text-lg mb-6'>
                  Navegação Rápida
                </h3>
                <ul className='space-y-3'>
                  {[
                    'Início',
                    'Funcionalidades',
                    'Como Funciona',
                    'Contato',
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='font-semibold text-brand-yellow text-lg mb-6'>
                  Contato
                </h3>
                <ul className='space-y-4'>
                  <li className='flex items-center'>
                    <Mail
                      size={18}
                      className='text-neutral-400 dark:text-neutral-500 mr-3'
                    />
                    <a
                      href='mailto:suporte@deuquantas.com.br'
                      className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                    >
                      suporte@deuquantas.com.br
                    </a>
                  </li>
                  <li className='flex items-center'>
                    <Phone
                      size={18}
                      className='text-neutral-400 dark:text-neutral-500 mr-3'
                    />
                    <a
                      href='tel:+5511999999999'
                      className='text-neutral-400 dark:text-neutral-500 hover:text-brand-yellow transition-colors'
                    >
                      +55 11 99999-9999
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='font-semibold text-brand-yellow text-lg mb-6'>
                  Newsletter
                </h3>
                <p className='text-neutral-400 dark:text-neutral-500 mb-4'>
                  Inscreva-se para receber novidades e promoções exclusivas.
                </p>
                <form className='flex'>
                  <Input
                    type='email'
                    placeholder='Seu email'
                    className='bg-white/10 mr-2 dark:bg-white/5 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-brand-yellow text-white placeholder-neutral-400 dark:placeholder-neutral-500'
                  />
                  <Button
                    type='submit'
                    className='bg-brand-yellow ml-2 text-black font-medium px-4 rounded-r-lg hover:bg-brand-yellow/90 transition-colors'
                  >
                    Enviar
                  </Button>
                </form>
              </div>
            </div>

            <div className='border-t pb-5 border-white/10 dark:border-white/5 mt-12 pt-8 text-center text-neutral-500 dark:text-neutral-600 text-sm'>
              <p>
                &copy; {new Date().getFullYear()} Deu Quantas? Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
