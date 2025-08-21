import Image from "next/image";
import Map from "./components/Map";

export default function Home() {
  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Header Section */}
      <header className='relative mx-auto max-w-[1600px] bg-zinc-800'>
        <div className='overflow-hidden relative h-[50dvh] max-h-[800px]'>
          <div className='absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-b from-transparent to-zinc-800' />
          <Image
            src='/hero-banner.jpg'
            alt='National Park Service Logo'
            fill
            className='object-cover animate-zoom'
          />
        </div>
        <div className='absolute inset-x-0 bottom-0 z-10 px-4 py-8 mx-auto text-center'>
          <h1 className='mb-1 font-serif text-3xl font-bold sm:text-4xl md:text-6xl text-stone-50'>
            Find Your Next Adventure
          </h1>
          <div className='mx-auto max-w-3xl'>
            <p className='font-sans text-lg leading-relaxed text-stone-50'>
              Search your zip code and explore stunning locations across the
              United States.
            </p>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <Map />

      {/* Footer */}
      <footer className='py-2 bg-zinc-800'>
        <div className='px-4 mx-auto max-w-4xl text-center'>
          <p className='text-xs text-stone-600'>
            <a
              href='https://github.com/nathan-schmidt-viget/map-box-react-vite'
              className='underline transition-colors duration-200 text-stone-50'
              target='_blank'
              rel='noopener noreferrer'
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
