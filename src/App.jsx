import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InfoCards from "./components/InfoCards";
import Footer from "./components/Footer";
import Mimic_survey from "./components/Mimic_survey";
import "./App.css"; // 全站通用樣式（非必要可略）

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Mimic_survey />
      <InfoCards />
      <Footer />
    </div>
  );
}

export default App;
