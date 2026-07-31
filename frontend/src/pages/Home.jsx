import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Trusted from "../components/Trusted";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div id="hero"><Hero /></div>
      <Trusted />
      <div id="features"><Features /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="faq"><FAQ /></div>
      <Footer />
    </div>
  );
}

export default Home;