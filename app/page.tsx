import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';

const About = dynamic(() => import('@/components/sections/About'));
const Projects = dynamic(() => import('@/components/sections/Projects'));
const Experience = dynamic(() => import('@/components/sections/Experience'));
const Contact = dynamic(() => import('@/components/sections/Contact'));

export default function Home() {
  return (
    <div className="bg-background dark:bg-background min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
