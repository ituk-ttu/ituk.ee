import Image from "next/image";
import Email from "@/assets/icons/email.svg";

interface CardProps {
  title: string;
  image: string;
  description: string;
  board: boolean;
  email?: string;
}

export default function Card({
  title,
  image,
  description,
  board,
  email = "",
}: CardProps) {
  if (board) {
    return (
      <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
        <img
          className="min-h-[284px] object-cover rounded-t-lg"
          src={image}
          alt={title}
        />
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
          <h5>{title}</h5>
          <p className="h-[45px]">{description}</p>
          <div className="justify-start items-center gap-2 flex-row flex">
            <Image className="flex w-[20px] h-[20px]" src={Email} alt="Email" />
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
        <img
          className="h-full object-cover rounded-t-lg"
          src={image}
          alt={title}
        />
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-primary">
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}
