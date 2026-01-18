import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16" id="top">
        <Hero />
        <About />
      </main>
    </>
  );
}
