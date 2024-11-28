import moment from 'moment';
import React from 'react';

const page = async ({ params }) => {
  const res = await fetch(
    `https://byscript.io/api/announcements/${
      params.id
    }?_=${new Date().getTime()}`
  );
  const { data, error } = await res.json();
  return (
    <>
      <div className='w-full min-h-screen lg:px-20 lg:pt-10'>
        <h1 className='text-2xl font-bold text-slate-100'>{}</h1>
        {error ? (
          <p>{error}</p>
        ) : (
          <div className=''>
            <h1 className='text-slate-100 text-3xl lg:text-5xl font-bold mt-3'>
              {data?.title}
            </h1>
            <p className='text-sm text-slate-400'>
              {data?.author?.name},{' '}
              {moment.unix(data?.createdAt?._seconds).fromNow()}
            </p>
            <img src={data?.thumbnail} className='w-full object-cover' />

            <p>{data?.content}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
