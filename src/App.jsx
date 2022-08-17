import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Kontakt from "./components/Kontakt";
import Footer from "./components/Footer";
import Yritused from "./components/Yritused";
import Juhatus from "./components/Juhatus";
import About from "./components/Meist";

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Yritused />
      <Juhatus />
      <Kontakt />
      <Footer />
    </div>
  );
}

export default App;
