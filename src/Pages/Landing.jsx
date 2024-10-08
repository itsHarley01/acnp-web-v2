import About from "../Components/About";
import Book from "../Components/Book";
import ContactBanner from "../Components/ContactBanner";
import Hero from "../Components/Hero";
import Products from "../Components/Products";
import Projects from "../Components/Projects";
import Services from "../Components/Services";

const Landing = () => {
  return (
    <div>
      <div id="/">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <ContactBanner />
      <div id="services">
        <Services />
      </div>
      <Products />
      <Book />
      <div id="projectgallery">
        <Projects />
      </div>
    </div>
  );
};

export default Landing;
