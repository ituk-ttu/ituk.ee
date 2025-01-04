import Image, { StaticImageData } from "next/image";
import Email from "@/assets/icons/email.svg"

interface CardProps {
    title: string;
    image: StaticImageData;
    description: string;
    board: boolean;
    email: string;
    width?: number;
    height?: number;
}

export default function Card({ title, image, description, board , email, width, height}: CardProps) {
    if (board) {
        return (
            <div className="card shadow-filled" style={{width: width, height: height}}>
                <div className="card-image">
                    <Image style={{objectFit: "cover", translate: " 0 -30%"}} src={image} alt="Image" />
                </div>
                <div className="card-content board-member">
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
            <div className="card shadow-filled" style={{width: width, height: height}}>
                <div className="card-image">
                    <Image style={{objectFit: "cover"}} src={image} alt="Image" />
                </div>
                <div className="card-content">
                    <h5>{title}</h5>
                    <p>{description}</p>
                </div>
            </div>
        );
    }
}