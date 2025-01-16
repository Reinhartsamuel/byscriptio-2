import moment from 'moment';
import React from 'react';

const page = async () => {
  const res = await fetch(
    `https://byscript.io/api/announcements?_=${new Date().getTime()}`,
    {
      method: 'GET',
      cache: 'no-cache', // Disable caching
      
      headers: {
        'Cache-Control': 'no-cache', // Disable caching
        Pragma: 'no-cache', // For HTTP/1.0 compatibility
        Expires: '0', // Proxies
      },
    }
  );
  const { data, error } = await res.json();
  return (
    <>
      <div className='w-full min-h-screen lg:px-20 lg:pt-10'>
        <h1 className='text-2xl font-bold text-slate-100'>Announcements</h1>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {error ? (
          <p>{error.message}</p>
        ) : (
          <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10'>
            {data?.map((x, i) => (
              <a
                href={`announcement/${x?.id}?t=${x?.title}`}
                key={i}
                className='h-[15rem]'
              >
                <img
                  src={x?.thumbnail}
                  className='w-full object-cover h-[13rem]'
                />
                <h1 className='text-base/7 text-slate-100 text-xl font-bold mt-3'>
                  {x?.title}
                </h1>
                <p className='text-sm text-slate-400'>
                  {moment.unix(x?.createdAt?._seconds).fromNow()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
      {/* <div>test</div> */}
    </>
  );
};

export default page;
