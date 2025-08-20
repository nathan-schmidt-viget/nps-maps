import Map from "./components/Map";

export default function Home() {
  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Header Section */}
      <header className='bg-white border-b border-stone-100'>
        <div className='px-4 py-8 mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 font-serif text-3xl font-bold lg:text-6xl text-stone-800'>
            Find a Park Near You
          </h1>
          <div className='mx-auto space-y-4 max-w-3xl'>
            <p className='font-sans text-lg leading-relaxed text-stone-600'>
              The National Park Service manages and preserves over 400 stunning
              locations across the United States, ranging from iconic natural
              wonders like the Grand Canyon to historic sites such as
              Independence Hall.
            </p>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <Map />

      {/* Footer */}
      <footer className='py-8 bg-white border-t border-stone-100'>
        <div className='px-4 mx-auto max-w-4xl text-center'>
          <p className='text-sm text-stone-600'>
            <a
              href='https://github.com/nathan-schmidt-viget/map-box-react-vite'
              className='text-amber-700 underline transition-colors duration-200 hover:text-amber-800'
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
