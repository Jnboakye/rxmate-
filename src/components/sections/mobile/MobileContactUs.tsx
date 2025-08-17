"use client";

export default function MobileContactUs() {
  return (
    <main className="min-h-screen bg-white px-4 py-20 sm:block md:hidden lg:hidden xl:hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="rounded-2xl border border-[#0000001A] p-8 space-y-6 shadow-sm">
          <p className="text-sm text-gray-400">
            Rxmate /{" "}
            <span className=" text-black">Contact Info</span>
          </p>
          <h2 className="text-2xl font-semibold">Contact Info</h2>
          <p className="text-gray-500">
            We’re here to help! Whether you have questions about our services,
            delivery, or just want more information about how to be a rider,
            feel free to reach out.
          </p>

          <div>
            <h4 className="font-medium">Email Support</h4>
            <p className="text-sm text-gray-500">
              Email us and we’ll get to you within 24 hours
            </p>
            <p className="text-sm mt-1 font-medium text-black">
              akowuahnimoh@gmail.com
            </p>
          </div>

          <div>
            <h4 className="font-medium">Phone</h4>
            <p className="text-sm text-gray-500">
              Our phone number is always active
            </p>
            <p className="text-sm mt-1 font-medium text-black">
              +233543512502 / 0505658672
            </p>
          </div>

          <div>
            <h4 className="font-medium">Address</h4>
            <p className="text-sm text-gray-500">Locate Us At:</p>
            <p className="text-sm mt-1 font-medium text-black">KNUST, Ghana</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-[#0000001A] p-8 space-y-6 shadow-sm">
          <p className="text-sm text-gray-400">
            Rxmate / <span className=" text-black">Contact Us</span>
          </p>
          <h2 className="text-2xl font-semibold mb-2">Contact Us Today</h2>
          <p className="text-gray-500 mb-6">Enter your details</p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#00000099]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your First Name"
                  className="mt-1 w-full rounded-xl border border-[#0000001A] p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#00000099]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Last Name"
                  className="mt-1 w-full rounded-xl border border-[#0000001A] p-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00000099]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="mt-1 w-full rounded-xl border border-[#0000001A] p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00000099]">
                Message
              </label>
              <textarea
                placeholder="Enter Message here"
                rows={5}
                className="mt-1 w-full rounded-xl border border-[#0000001A] p-3 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-[#1C76FD] text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition ml-auto block"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
