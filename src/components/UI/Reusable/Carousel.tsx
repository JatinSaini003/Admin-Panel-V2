import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    type: String;
    exploreLink?: string;
    buttonLabel?: string;
}

const Carousel = <T,>({
    items,
    renderItem,
    className = "",
    type,
    exploreLink,
    buttonLabel = "Explore All",
}: CarouselProps<T>) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.offsetWidth * 0.8;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleExploreClick = () => {
        if (exploreLink) {
            navigate(exploreLink, {
                state: { type },
            });
        }
    };

    return (
        <>
            {/* See All Button */}
            {exploreLink && (
                <div className="flex justify-end px-2">
                    <button
                        onClick={handleExploreClick}
                        className="text-caption text-primary hover:underline"
                    >
                        {buttonLabel}
                    </button>
                </div>
            )}
            <div className={`relative w-full ${className}`}>


                {/* Scrollable Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-2"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 scroll-snap-start"
                            style={{ scrollSnapAlign: "start" }}
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>

                {/* Left Arrow Hover Zone */}
                <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-start z-10">
                    <div className="h-full w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                        <button
                            onClick={() => scroll("left")}
                            className="invisible group-hover:visible absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-default p-2 rounded-full transition-opacity duration-300"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>

                {/* Right Arrow Hover Zone */}
                <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-end z-10">
                    <div className="h-full w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
                        <button
                            onClick={() => scroll("right")}
                            className="invisible group-hover:visible absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-default p-2 rounded-full transition-opacity duration-300"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Carousel;
