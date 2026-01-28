import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16" id="top">
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  );
}
