import Image from 'next/image';
import loading from '@/assets/logos/ituk_symbol_white.svg';

const Loading = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="relative w-32 h-32 animate-rotate">
                <Image
                    src={loading}
                    alt="Laeb..."
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </div>
    );
};

export default Loading;