import React, { useEffect } from 'react';

interface Photo {
    src: string;
    name: string;
}

interface GalleryOverlayProps {
    photos: Photo[];
    currentIndex: number;
    isOpen: boolean;
    onCloseOverlay: () => void;
    onUpdateIndex: (newIndex: number) => void;
}

const GalleryOverlay: React.FC<GalleryOverlayProps> = ({
    photos,
    currentIndex,
    isOpen,
    onCloseOverlay,
    onUpdateIndex,
}) => {
    // Show the next image, cycling back to the start if at the end
    const showNextImage = () => {
        const nextIndex = (currentIndex + 1) % photos.length; // Use modulo to cycle through images
        onUpdateIndex(nextIndex);
    };

    // Show the previous image, cycling back to the end if at the beginning
    const showPreviousImage = () => {
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length; // Handle negative indices and cycle
        onUpdateIndex(prevIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case "Escape":
                onCloseOverlay();
                break;
            case "ArrowRight":
                showNextImage();
                break;
            case "ArrowLeft":
                showPreviousImage();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, currentIndex]);

    if (!isOpen) return null;

    return (
        <div className="p-0 2xl:py-24 2xl:px-8 fixed inset-0 bg-dark/90 z-20 flex flex-row items-center justify-center">
            {/* Close Button */}
            <button onClick={onCloseOverlay} className="pt-8 pr-8 px-4 absolute top-0 right-0" aria-label="Close overlay">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0585 13.2281L3.33038 0.5L0.501953 3.32843L13.23 16.0565L0.502255 28.7843L3.33068 31.6127L16.0585 18.8849L28.7862 31.6127L31.6147 28.7843L18.8869 16.0565L31.615 3.32846L28.7865 0.500031L16.0585 13.2281Z" fill="#EEEEEE" />
                </svg>
            </button>

            {/* Left Arrow */}
            <button
                onClick={showPreviousImage}
                className="m-4 z-30"
                aria-label="Previous image"
            >
                <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65699 15.9999L18.3848 3.27209L15.5563 0.443665L0 16L15.5567 31.5564L18.3851 28.728L5.65699 15.9999Z" fill="#EEEEEE" />
                </svg>
            </button>

            {/* Image and Description */}
            <div className="w-full items-center justify-center gap-8 flex-col flex">
                <img
                    className="w-full h-auto max-w-[100%] max-h-[80vh] object-contain"
                    src={photos[currentIndex].src}
                    alt={photos[currentIndex].name}
                />
                <h5 className="text-center text-white">{`${currentIndex + 1}/${photos.length}`}</h5>
            </div>

            {/* Right Arrow */}
            <button
                onClick={showNextImage}
                className="m-4 z-30"
                aria-label="Next image"
            >
                <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.82843 0.443665L0 3.27209L12.7281 16.0002L0.000302076 28.728L2.82873 31.5564L18.3851 16L2.82843 0.443665Z" fill="#EEEEEE" />
                </svg>
            </button>
        </div>
    );
};

export default GalleryOverlay;
