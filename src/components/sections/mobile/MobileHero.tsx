import Image from "next/image";
import phoneimage from "@/assets/phoneimage.svg";
import Link from "next/link";

export default function MobileHero() {
  return (
    <div className="min-h-screen bg-gray-50 block sm:block md:hidden lg:hidden xl:hidden font-openSauce">
      {/* Hero Section */}
      <main className="px-8 py-16">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Your All-in-One GPPQE
            <br />
            Prep: Practice Questions +<br />
            Expert Summaries
          </h1>

          <Link href="/checkoutform">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors ">
              Subscribe
            </button>
          </Link>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center">
          <div className="relative w-80 h-auto">
            <Image
              src={phoneimage}
              alt="RxMate App Preview"
              width={320}
              height={640}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
