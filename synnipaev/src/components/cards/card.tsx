import Image from "next/image";
import Email from "@/assets/icons/email.svg";

interface CardProps {
  title: string;
  image: string;
  description?: string;
  type: "default" | "board" | "list";
  email?: string;
  listItems?: string[];
}

export default function Card({
  title,
  image,
  description,
  type,
  email = "",
  listItems = [],
}: CardProps) {
  if (type === "board") {
    return (
      <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
        <img className="min-h-[284px] object-cover rounded-t-lg" src={image} alt={title} />
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
          <h5>{title}</h5>
          <p className="h-[50px]">{description}</p>
          <div className="justify-start items-center gap-2 flex-row flex">
            <Image className="flex w-[20px] h-[20px]" src={Email} alt="Email" />
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    );
  } else if (type === "list") {
    return (
      <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
        <img className="object-cover rounded-t-lg" src={image} alt={title} />
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex">
          <h5 className="uppercase">{title}</h5>
          <ul>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
        <img className="object-cover rounded-t-lg" src={image} alt={title} />
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex">
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}