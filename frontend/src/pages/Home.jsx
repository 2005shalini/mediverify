import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Trusted from "../components/Trusted";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

function Home() {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollTo;
    if (scrollToId) {
      setTimeout(() => {
        if (scrollToId === 'home') {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const element = document.getElementById(scrollToId);
          if (element) {
            const navbarHeight = 80;
            const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div id="hero"><Hero /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="features"><Features /></div>
      <div id="doctors"><Trusted /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="faq"><FAQ /></div>
      <Footer />
    </div>
  );
}

export default Home;