import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Cabeçalho */}
      <header className='w-full border-b bg-white'>
        <div className='container mx-auto flex items-center justify-between py-4 px-6'>
          <h1 className='text-lg font-bold'>DeuQuantas</h1>
          <nav className='flex gap-4'>
            <Link href='/login'>
              <Button variant='default'>Entrar</Button>
            </Link>
            <Link href='/register'>
              <Button variant='secondary'>Registrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className='bg-gray-50 text-center py-20 px-6'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold'>
            Simplifique suas comandas, maximize sua experiência!
          </h2>
          <p className='mt-4 text-gray-600'>
            O DeuQuantas traz transparência e agilidade para consumidores e
            estabelecimentos.
          </p>
          <div className='mt-6 flex justify-center gap-4'>
            <Link href='/login'>
              <Button variant='default' size='lg'>
                Comece Agora
              </Button>
            </Link>
            <a href='#features'>
              <Button variant='outline' size='lg'>
                Saiba Mais
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-6'>
        <div className='container mx-auto'>
          <h3 className='text-2xl font-bold text-center'>
            Por que escolher o DeuQuantas?
          </h3>
          <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <h4 className='text-lg font-semibold'>Controle Total</h4>
              <p className='mt-2 text-gray-600'>
                Gerencie suas comandas em tempo real com facilidade.
              </p>
            </div>
            <div className='text-center'>
              <h4 className='text-lg font-semibold'>Eficiência</h4>
              <p className='mt-2 text-gray-600'>
                Aumente a eficiência do seu estabelecimento com gestão
                automatizada.
              </p>
            </div>
            <div className='text-center'>
              <h4 className='text-lg font-semibold'>Relatórios</h4>
              <p className='mt-2 text-gray-600'>
                Obtenha insights detalhados sobre vendas e consumo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='bg-gray-50 py-20 px-6'>
        <div className='container mx-auto text-center'>
          <h3 className='text-2xl font-bold'>O que nossos usuários dizem</h3>
          <p className='mt-6 text-gray-600'>
            &quot;O DeuQuantas transformou a experiência no meu bar!&quot; -
            Cliente Satisfeito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-white py-10'>
        <div className='container mx-auto text-center text-gray-600'>
          <p>
            © {new Date().getFullYear()} DeuQuantas. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
