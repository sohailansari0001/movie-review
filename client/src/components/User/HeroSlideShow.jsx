import { forwardRef, useEffect, useRef, useState } from "react";
import { getLatestUploads } from "../../api/movie";
import { toast } from "react-hot-toast";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;

let newTime = 0;
let lastTime = 0;

const HeroSlideShow = () => {
  const [currentSlide, setCurrentSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [upNext, setUpNext] = useState([]);

  const [visible, setVisible] = useState(true);

  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const fetchLatestUploads = async () => {
    const { success, message, movies } = await getLatestUploads();

    if (!success) {
      return toast.error(message);
    }

    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  const startSlideShow = () => {
    intervalId = setInterval(() => {
      handleOnNextClick();
    }, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) {
      return;
    }

    const upNextCount = currentIndex + 1;

    const end = upNextCount + 3;

    let newSlides = [...slides];

    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    setClonedSlide(slides[count]);
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    setClonedSlide(slides[count]);
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);
    setClonedSlide({});
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };

  useEffect(() => {
    fetchLatestUploads();
    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    return () => {
      pauseSlideShow();
      document.removeEventListener(
        "visibilitychange",
        handleOnVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else pauseSlideShow();
  }, [slides.length, visible]);

  return (
    <div className="w-full flex">
      {/* Slide show section */}
      <div className="md:w-4/5 w-full  aspect-video relative overflow-hidden">
        <Slide
          ref={slideRef}
          title={currentSlide.title}
          src={currentSlide.poster}
          id={currentSlide.id}
        />

        {/* cloned slide */}
        <Slide
          ref={clonedSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={currentSlide.id}
        />

        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>

      {/* Up Next Section */}
      <div className="w-1/5  md:block hidden space-y-3 px-3 ">
        <h2 className=" font-semibold text-2xl text-primary dark:text-white ">
          Up Next
        </h2>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              src={poster}
              key={id}
              alt=""
              className=" aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
};

const SlideShowController = ({ onPrevClick, onNextClick }) => {
  const btnClass =
    "bg-primary rounded-full p-2  aspect-square text-white border-2 outline-none transition-all duration-200 hover:bg-secondary";

  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  const { title, id, src, className = "", ...rest } = props;
  return (
    <Link
      to={`/movie/${id}`}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      {src ? (
        <img className="aspect-video object-cover -z-10" src={src} alt="" />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:via-transparent dark:from-primary">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});

export default HeroSlideShow;
