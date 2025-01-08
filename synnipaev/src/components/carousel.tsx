import React, { useState } from "react";

type CarouselProps = React.PropsWithChildren<{}>;

const Carousel: React.FC<CarouselProps> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? React.Children.count(children) - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) =>
            prev === React.Children.count(children) - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="relative w-full flex items-center">
            <button
                onClick={goToPrevious}
                className="absolute -left-10 z-10 p-2"
                aria-label="Previous card"
            >
                <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65699 15.9999L18.3848 3.27209L15.5563 0.443665L0 16L15.5567 31.5564L18.3851 28.728L5.65699 15.9999Z" fill="#EEEEEE" />
                </svg>
            </button>

            <div className="overflow-hidden w-full">
                <div
                    className="flex transition-transform duration-500"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {React.Children.map(children, (child, index) => (
                        <div className="w-full flex-shrink-0">{child}</div>
                    ))}
                </div>
            </div>

            <button
                onClick={goToNext}
                className="absolute -right-10 z-10 p-2"
                aria-label="Next card"
            >
                <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.82843 0.443665L0 3.27209L12.7281 16.0002L0.000302076 28.728L2.82873 31.5564L18.3851 16L2.82843 0.443665Z" fill="#EEEEEE" />
                </svg>
            </button>
        </div>
    );
};

export default Carousel;