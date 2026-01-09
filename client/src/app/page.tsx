import Hero from "@/components/home/Hero";
import Nav from "../components/navbar/Nav";
import bgImage from '@/assets/BG/Web-Site-BG-black.jpg';
import Mission from "@/components/home/Mission";
import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import Content from "@/components/content/Content";
import Reviews from "@/components/reviews/Reviews";
import Contact from "@/components/contact/Contact";
import Blog from "@/components/blog/Blog";
import Faq from "@/components/faq/Faq";
import Promotion from "@/components/Promotion";

export default function Home() {
  return (
    <>
      <Promotion />
      <Nav />
      <div
        style={{ backgroundImage: `url(${bgImage.src})` }}
        className="-mt-[160px] w-full bg-cover bg-center bg-no-repeat pb-20"
        role="img"
        aria-label="Arrière-plan de la section héro"
      >
        <Hero />
        <Mission className='mx-auto py-16 px-4 sm:px-10 w-[90%] m-auto text-white' />
      </div>
      <Services />
      <Projects />
      <Content />
      <Reviews />
      <Contact />
      <Blog />
      <Faq />
    </>
  );
}