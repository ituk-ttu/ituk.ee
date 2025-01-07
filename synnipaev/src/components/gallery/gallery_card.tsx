import React from 'react';

interface GalleryCardProps {
    index: number;
    imageSrc: string;
    cardName: string;
    onOpenOverlay: (index: number) => void; // Explicitly defining the type
}

const GalleryCard: React.FC<GalleryCardProps> = ({ index, imageSrc, cardName, onOpenOverlay }) => {
    return (
        <button
            className="w-full h-full max-h-56 flex-col justify-center items-center flex relative shadow-filled"
            onClick={() => onOpenOverlay(index)}
            aria-label={`Open ${cardName}`}
        >
            <img className="w-full h-full aspect-video object-cover" src={imageSrc} alt={cardName} />
        </button>
    );
};

export default GalleryCard;
