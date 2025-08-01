import Image from "next/image";
import Header from '../components/layouts/headers';
import Hero from '../components/sections/hero';


export default function Home() {
  return (
    <main>
      <div className="bg-[#FAFAFA]">
        <Header />
      </div>
      <Hero />
       


    </main>
  );
}
