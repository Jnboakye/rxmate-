import Image from "next/image";
import Header from '../components/layouts/headers';
import Hero from '../components/sections/hero';
import Features from "@/components/sections/features";
import FaqSection from '@/components/sections/FaqSection'
import ContactUs from "@/components/sections/contactUs";


export default function Home() {
  return (
    <main>
      <div className="bg-[#FAFAFA]">
        <Header />
      </div>
      <Hero />
      <Features />
      <FaqSection />
      <ContactUs />

       


    </main>
  );
}
