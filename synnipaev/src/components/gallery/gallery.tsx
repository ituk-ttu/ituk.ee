import React, { useState } from "react";
import GalleryCard from "@/components/gallery/gallery_card";
import GalleryOverlay from "@/components/gallery/gallery_overlay";

interface Photo {
    src: string;
    name: string;
}

interface GalleryProps {
    photos: Photo[] | undefined;
}

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    if (!photos) {
        return <div>
            <h5>Laeb...</h5>
        </div>;
    }

    const openOverlay = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeOverlay = () => {
        setIsOpen(false);
    };

    const updateIndex = (newIndex: number) => {
        setCurrentIndex(newIndex);
    };

    return (
        <div>
            <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] items-start gap-12">
                {photos.map((photo, index) => (
                    <GalleryCard
                        key={index}
                        index={index}
                        imageSrc={photo.src}
                        cardName={photo.name}
                        onOpenOverlay={openOverlay}
                    />
                ))}
            </div>

            {/* Gallery Overlay */}
            <GalleryOverlay
                photos={photos}
                currentIndex={currentIndex}
                isOpen={isOpen}
                onCloseOverlay={closeOverlay}
                onUpdateIndex={updateIndex}
            />
        </div>
    );
};

export default Gallery;