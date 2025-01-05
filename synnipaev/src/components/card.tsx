import Image, { StaticImageData } from "next/image";
import Email from "@/assets/icons/email.svg"

interface CardProps {
    title: string;
    image: string;
    description: string;
    board: boolean;
    email?: string;
    width?: number;
    height?: number;
}

export default function Card({ title, image, description, board , email = "", width, height}: CardProps) {
    if (board) {
        return (
            <div className="flex flex-col items-center overflow-hidden rounded-lg w-72 h-96 p-0 shadow-filled" style={{width: width, height: height}}>
                <div className="overflow-hidden">
                    <Image className="object-cover -translate-y-1/4" src={image} width={width} height={height} alt="Image" />
                </div>
                <div className="flex flex-col items-start p-4 gap-4 w-full board-member">
                    <h5>{title}</h5>
                    <p>{description}</p>
                    <div>
                        <Image src={Email} alt="Email" width={20} height={16} />
                        <p>{email}</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center overflow-hidden rounded-lg w-72 h-96 shadow-filled" style={{width: width, height: height}}>
                <div className="overflow-hidden">
                    <Image className="object-cover" src={image} width={width} height={height} alt="Image" />
                </div>
                <div className="flex flex-col items-start p-4 gap-4 w-full bg-primary">
                    <h5>{title}</h5>
                    <p>{description}</p>
                </div>
            </div>
        );
    }
}