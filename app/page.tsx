import { Header, Footer, Hero, About, Experience, Projects, Contact } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
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
