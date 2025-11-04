interface DataSkeletonProps {
  title: string;
  itemCount?: number;
  variant?: "list" | "grid" | "cards";
}

export default function DataSkeleton({
  title,
  itemCount = 3,
  variant = "list",
}: DataSkeletonProps) {
  const renderSkeletonItems = () => {
    switch (variant) {
      case "grid":
        return (
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
            {Array.from({ length: itemCount }).map((_, index) => (
              <div
                key={index}
                className='flex flex-col gap-2 items-start mb-2 rounded-lg bg-stone-100'
              >
                <div className='overflow-hidden w-full rounded-t-lg aspect-video bg-stone-200 animate-pulse'></div>
                <div className='flex flex-col gap-1 p-4 w-full'>
                  <div className='h-4 bg-stone-200 rounded animate-pulse w-3/4'></div>
                  <div className='h-3 bg-stone-200 rounded animate-pulse w-full'></div>
                  <div className='h-3 bg-stone-200 rounded animate-pulse w-1/2'></div>
                  <div className='h-3 bg-amber-200 rounded animate-pulse w-1/4 mt-auto'></div>
                </div>
              </div>
            ))}
          </div>
        );

      case "cards":
        return (
          <div className='space-y-4'>
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className='space-y-3'>
                <div className='h-5 bg-stone-200 rounded animate-pulse w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-stone-200 rounded animate-pulse w-full'></div>
                  <div className='h-3 bg-stone-200 rounded animate-pulse w-5/6'></div>
                  <div className='h-3 bg-stone-200 rounded animate-pulse w-4/6'></div>
                </div>
              </div>
            ))}
          </div>
        );

      default: // list
        return (
          <div className='space-y-4'>
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className='space-y-3'>
                <div className='flex flex-col gap-3 items-start mb-2'>
                  <div className='flex flex-col items-start mt-0.5 gap-1 w-full'>
                    <div className='h-4 bg-stone-200 rounded animate-pulse w-3/4'></div>
                    <div className='h-5 bg-stone-200 rounded animate-pulse w-1/4'></div>
                  </div>
                  <div className='space-y-2 w-full'>
                    <div className='h-3 bg-stone-200 rounded animate-pulse w-full'></div>
                    <div className='h-3 bg-stone-200 rounded animate-pulse w-5/6'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg border border-stone-100'>
      <h2 className='mb-6 font-serif text-2xl text-stone-800'>{title}</h2>
      {renderSkeletonItems()}
    </div>
  );
}
