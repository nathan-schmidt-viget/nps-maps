import Map from "./components/Map";

export default function Home() {
  return (
    <>
      <div className='px-4 py-8 mx-auto max-w-4xl'>
        <h1 className='text-6xl text-center'>
          National Park Service Locations
        </h1>
        <p className='mt-8 text-md'>
          The National Park Service manages and preserves over 400 stunning
          locations across the United States, ranging from iconic natural
          wonders like the Grand Canyon to historic sites such as Independence
          Hall.
        </p>
        <p className='mt-4 text-md'>
          This exploration looks into building a better location search tool
          using{" "}
          <a
            className='underline hover:no-underline'
            href='https://www.mapbox.com/'
          >
            Mapbox
          </a>
          . Search a city, state, or zip to find the nearest park location.
        </p>
      </div>

      <Map />

      <footer className='flex flex-wrap gap-6 justify-center pt-8 pb-3'>
        <p className='w-full text-xs text-center'>
          <a href='https://github.com/nathan-schmidt-viget/map-box-react-vite'>
            View on GitHub
          </a>
        </p>
      </footer>
    </>
  );
}
