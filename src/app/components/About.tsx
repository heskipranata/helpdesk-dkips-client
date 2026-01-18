import Image from "next/image";

export default function About() {
  return (
    <section className="relative bg-blue-600">
      <div className="container mx-auto px-20 py-24 ">
        <h3 className="text-4xl font-normal text-white text-center md:text-left">
          Tentang Layanan Kami
        </h3>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white/90 leading-relaxed">
            <p className="mb-4">
              Kami menyediakan layanan helpdesk yang cepat, ramah, dan dapat
              diandalkan untuk membantu kebutuhan dukungan Anda. Tim kami siap
              menanggapi berbagai pertanyaan, keluhan, dan permintaan dengan
              solusi yang jelas dan praktis.
            </p>
            <p>
              Dukungan tersedia pada jam kerja, dengan target waktu respons yang
              konsisten sehingga Anda dapat fokus pada pekerjaan tanpa hambatan.
            </p>
          </div>

          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <Image
              src="https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522556/bg-web-sulutprov_baiufi.webp"
              alt="Ilustrasi layanan helpdesk"
              fill
              sizes="(min-width: 1024px) 48rem, (min-width: 768px) 32rem, 100vw"
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
