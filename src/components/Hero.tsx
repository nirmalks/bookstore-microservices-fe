import { useEffect, useRef } from 'react';
import prob from '../assets/prob.jpg';
import { Link } from 'react-router';
import harry from '/images/harry_potter.jpg?url';
import alchemist from '/images/the_alchemist.jpg?url';

export const Hero = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const carousel = carouselRef.current;
    let interval: ReturnType<typeof setInterval>;

    if (carousel) {
      let scrollPosition = 0;
      const scrollWidth = carousel.scrollWidth;
      const visibleWidth = carousel.offsetWidth;

      interval = setInterval(() => {
        scrollPosition += visibleWidth;
        if (scrollPosition >= scrollWidth) {
          scrollPosition = 0;
        }
        carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 mx-4">
      <div className="place-items-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          We love Books
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore
          repellat explicabo enim soluta temporibus asperiores aut obcaecati
          perferendis porro nobis.
        </p>
        <div className="mt-10">
          <Link to="/books" className="btn btn-primary">
            Visit our Full Collection
          </Link>
        </div>
      </div>
      <div className="md:ml-4 carousel max-w-full h-72">
        <div id="slide1" className="carousel-item relative w-full ">
          <img src={prob} className="w-full rounded-lg " />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src={harry} className="w-full rounded-lg" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img src={alchemist} className="w-full rounded-lg" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            className="w-full rounded-lg"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
