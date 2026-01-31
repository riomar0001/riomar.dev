import { Header, Footer, Hero, About, Experience, Projects, Contact } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
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
