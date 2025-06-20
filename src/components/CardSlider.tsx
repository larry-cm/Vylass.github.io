import { IconFullScreen } from "@/assets/Icons";
import type { resSQL } from "@/types/type";
import { dateUserFormat, formatId } from "@/utils/Formats";
import { useState, useEffect } from "react";
interface Card {
  badge?: boolean;
  ruta?: string;
}

export function Card({ title, content, postDate, username, userUrl, postUrl, badge, ruta }: resSQL & Card) {
  return (
    <a
      href={ruta || '#'}
      className="z-20 block h-full overflow-hidden transition-all duration-300 border rounded-md cursor-pointer border-fondo-claro bg-fondo min-h-80 hover:border-orange-500 group hover:shadow-md hover:shadow-orange-900/10">
      {/* Card Image/Illustration */}
      <picture className="relative rounded-t-md block w-full p-4 sm:p-6 h-1/2 aspect-video bg-radial-[at_50%_65%] from-secondary/60 via-secondary/20  to-secondary/10 overflow-hidden z-10">
        {/* tips o aviso */}
        {/* <button type="button" className="absolute p-2 transition duration-300 scale-75 rounded cursor-pointer top-3 right-3 bg-fondo hover:bg-fondo-claro">
          <IconFullScreen className='size-6 min-w-6' />
        </button> */}

        {/* imagen */}
        <img src={postUrl || "/logo.svg"} className="object-contain transition duration-300 rounded size-full group-hover:scale-125 " alt={`publicación del usuario ${username}`} />
      </picture>

      {/* Card Content */}
      <div className="flex flex-col justify-between p-3 rounded-b-md bg-fondo h-1/2 sm:p-4 ">
        <div>
          <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-100 transition-colors group-hover:text-orange-400 sm:text-base">
            <span className="line-clamp-2">{title}</span>
          </h3>
          <p className="mb-3 leading-relaxed text-gray-400 text-break sm:text-sm">
            <span className="line-clamp-2">{content}</span>
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {username && <span className="pr-2 truncate">{username}</span>}
          <span className="flex-shrink-0">{dateUserFormat({ lang: 'es', timeString: postDate })} </span>
        </div>
      </div>
    </a>
  )
}

function NavButton({ prevSlide, canGoPrev, classSite }: { prevSlide: () => void, canGoPrev: boolean, classSite?: string }) {
  return (
    <button
      onClick={prevSlide}
      disabled={canGoPrev}
      className="p-2 transition-all duration-200 border rounded-md cursor-pointer bg-fondo border-fondo-claro hover:bg-fondo-claro disabled:opacity-30 disabled:cursor-not-allowed hover:border-fondo-claro"
      aria-label="Anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`size-6 min-w-6 shadow-md ${classSite || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
    </button>
  )
}

interface CardSliderProps {
  title: string
  cards: (resSQL & Card)[]
  cardsPerView?: number
}
export function CardSlider({ title, cards, cardsPerView = 4 }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responsiveCardsPerView, setResponsiveCardsPerView] = useState(cardsPerView)

  // Responsive cards per view
  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      if (width < 640) return 1 // mobile
      if (width < 768) return 2 // tablet
      if (width < 1024) return 3 // small desktop
      return cardsPerView // large desktop
    }
    return cardsPerView
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = getCardsPerView()
      setResponsiveCardsPerView(newCardsPerView)
      // Adjust current index to ensure we don't go beyond available slides
      const newMaxIndex = Math.max(0, cards.length - newCardsPerView)
      setCurrentIndex((prev) => Math.min(prev, newMaxIndex))
    }

    // Set initial value
    handleResize()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [cards.length, cardsPerView])

  // Calculate max index to ensure last card is fully visible
  const maxIndex = Math.max(0, cards.length - responsiveCardsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  if (!cards || cards.length === 0) {
    return null
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  return (
    <div className="w-full mb-8 sm:mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold text-gray-100 truncate sm:text-xl lg:text-2xl">{title}</h2>

        {/* Navigation Buttons */}
        <div className="flex-shrink-0 hidden gap-2 sm:flex">
          <NavButton prevSlide={prevSlide} canGoPrev={!canGoPrev} />

          <NavButton prevSlide={nextSlide} canGoPrev={!canGoNext} classSite="scale-[-1_1]" />

        </div>
      </div>

      {/* Slider Container */}
      <div className="absolute w-full overflow-auto rounded-lg snap-x sm:overflow-hidden ">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / responsiveCardsPerView)}%)`,
          }}
        >
          {cards.map(({ title, content, postDate, username, postUrl, postId }, index) => (
            <div
              key={index}
              className={`flex-shrink-0 px-1.5 first:pl-0 last:pr-0 snap-center sm:snap-none size-full overflow-hidden`}
              style={{ width: `${100 / responsiveCardsPerView}%` }}
            >
              <Card title={title} content={content} postDate={postDate} username={username} postUrl={postUrl} ruta={formatId({ name: `/comunidad/${username}`, postId })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
