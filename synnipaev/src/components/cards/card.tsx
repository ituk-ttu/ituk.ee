import Image from "next/image";
import Email from "@/assets/icons/email.svg";

interface CardProps {
  title: string;
  image: string;
  description?: string;
  type: "default" | "board" | "list";
  email?: string;
  listItems?: string[];
  link?: string;
}

export default function Card({
  title,
  image,
  description,
  type,
  email = "",
  listItems = [],
  link,
}: CardProps) {
  const cardContent = (
    <div className="h-full w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
      <img className="object-fill object-center rounded-t-lg" src={image} alt={title} />
      {type === "board" && (
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
      )}
      {type === "list" && (
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex">
          <h5 className="uppercase">{title}</h5>
          <ul>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {type === "default" && (
        <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex">
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
      )}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {cardContent}
    </a>
  ) : (
    cardContent
  );
}