import Image from "next/image";
import Header from '../components/layouts/headers';
import Hero from '../components/sections/desktop/hero';
import Features from "@/components/sections/desktop/features";
import FaqSection from '@/components/sections/desktop/FaqSection'
import ContactUs from "@/components/sections/desktop/contactUs";
import MobileHeader from "@/components/layouts/MobileHeader";
import MobileHero from "@/components/sections/mobile/MobileHero";
import MobileFeatures from '@/components/sections/mobile/MobileFeatures'
import MobileContactUs from "@/components/sections/mobile/MobileContactUs";


export default function Home() {
  return (
    <main>
      <div className="bg-[#FAFAFA]">
        <Header />
        <MobileHeader />

      </div>
      <Hero />
      <MobileHero />

      <Features />
      <MobileFeatures />


      <FaqSection />
      <ContactUs />
      <MobileContactUs/>

       


    </main>
  );
}
