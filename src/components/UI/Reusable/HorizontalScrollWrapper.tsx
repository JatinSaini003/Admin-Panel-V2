import React, { useRef, useState, useCallback } from "react";

interface HorizontalScrollWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const HorizontalScrollWrapper: React.FC<HorizontalScrollWrapperProps> = ({
    children,
    className = "",
}) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Handle mouse down
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.8; // scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    return (
        <div
            ref={scrollRef}
            className={`flex overflow-x-auto gap-4 px-2 py-1 cursor-grab active:cursor-grabbing scroll-smooth no-scrollbar ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

export default HorizontalScrollWrapper;
