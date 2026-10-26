// components/AppDownloadBanner.tsx
"use client";

export default function AppDownloadBanner() {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="w-full bg-[#1b1c1e] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[220px]">
          {/* Text Info */}
          <div className="z-10 max-w-md space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 bg-[#fc8019] rounded-lg flex items-center justify-center font-black text-xs text-white">
                S
              </div>
              <span className="font-bold text-sm tracking-wide text-gray-300">
                Swiggy
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get the Swiggy App now!
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-medium">
              For best offers and discounts curated specially for you.
            </p>
          </div>

          {/* QR Code Phone Container */}
          <div className="relative mt-8 md:mt-0 flex items-center justify-center">
            <div className="relative bg-white text-black p-4 rounded-3xl shadow-2xl border-4 border-gray-800 flex flex-col items-center w-48 sm:w-56">
              <div className="w-12 h-1 bg-gray-800 rounded-full mb-3" />
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://swiggy.com"
                alt="Scan to download"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
              />
              <span className="mt-3 text-xs font-bold text-[#fc8019]">
                Scan to download
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}