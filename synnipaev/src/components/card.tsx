import Image, { StaticImageData } from "next/image";
import Email from "@/assets/icons/email.svg";

interface CardProps {
  title: string;
  image: string;
  description: string;
  board: boolean;
  email?: string;
  width?: number;
  height?: number;
}

export default function Card({
  title,
  image,
  description,
  board,
  email = "",
  width,
  height,
}: CardProps) {
  if (board) {
    return (
      <div
        className="card shadow-filled"
        style={{ width: width, height: height }}
      >
        <div className="card-image">
          <Image
            className="bg-cover bg-center"
            src={image}
            width={width}
            height={height}
            alt="Image"
          />
        </div>
        <div className="w-full p-4 justify-between items-start gap-4 flex-col flex bg-epic-gradient">
          <h5>{title}</h5>
          <p>{description}</p>
          <div className="justify-start items-center gap-2 flex-row flex">
            <Image 
              className="flex w-[20px] h-[20px]"
              src={Email}
              alt="Email" />
            <p>{email}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="card shadow-filled"
        style={{ width: width, height: height }}
      >
        <div className="flex">
          <Image src={image} alt="Image" width={width} height={height}/>
        </div>
        <div className="card-content">
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}
