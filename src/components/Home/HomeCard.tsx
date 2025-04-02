// import React from 'react';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination } from 'swiper/modules';

// const cards = [
//   {
//     id: 1,
//     image: '/images/beer-card.jpg',
//     alt: 'Chopp gelado',
//   },
//   {
//     id: 2,
//     image: '/images/beer-card-2.jpg',
//     alt: 'Chopp especial',
//   },
// ];

// const HomeCard: React.FC = () => {
//   return (
//     <div className='relative'>
//       {/* Background Question Mark */}
//       <div className='absolute right-0 bottom-0 text-[200px] font-bold text-white/10 leading-none z-0 pointer-events-none'>
//         ?
//       </div>

//       {/* Swiper Cards */}
//       <Swiper
//         modules={[Pagination]}
//         pagination={{ clickable: true }}
//         spaceBetween={20}
//         className='w-full px-4 pb-12'
//       >
//         {cards.map((card) => (
//           <SwiperSlide key={card.id}>
//             <div className='relative w-full h-[200px] overflow-hidden rounded-3xl'>
//               <Image
//                 src={card.image}
//                 alt={card.alt}
//                 fill
//                 className='object-cover'
//                 priority
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default HomeCard;
