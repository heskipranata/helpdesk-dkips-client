export default function Hero() {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522556/bg-web-sulutprov_baiufi.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 text-center px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          <span className="text-4xl block">Selamat Datang di</span>
          <span className="block">
            Helpdesk Dinas Komunikasi, Informatika, Persandian dan Statistik
          </span>
        </h1>
        <p className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
          Provinsi Sulawesi Utara
        </p>

        <p className="text-lg md:text-lg text-blue-100 mb-8 max-w-4xl leading-relaxed mx-auto">
          Platform layanan terpadu untuk membantu Anda menyelesaikan
          permasalahan teknis dengan cepat dan profesional. Tim support kami
          siap membantu 24/7.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
            Permintaan Layanan
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </section>
  );
}
