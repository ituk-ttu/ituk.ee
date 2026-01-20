
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
  const contentBg = type === "board"
    ? "bg-primary/50"
    : "bg-white/[0.03]";

  const cardContent = (
    <div className="w-64 h-[416px] rounded-lg overflow-hidden flex flex-col">
      {/* Image - 256x256 */}
      <div className="w-full h-64 shrink-0">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title}
        />
      </div>

      {/* Content - 160px height */}
      {type === "board" && (
        <div className={`w-full h-40 p-3 flex flex-col justify-between ${contentBg}`}>
          <div className="flex flex-col gap-3">
            <h4 className="text-xl">{title}</h4>
            <p className="p-sm">{description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-white text-base">mail</span>
            <a className="font-bold underline hover:decoration-primary" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      )}

      {type === "list" && (
        <div className={`w-full h-40 p-3 flex flex-col gap-3 ${contentBg}`}>
          <h4 className="text-xl">{title}</h4>
          <ul className="p-sm">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {type === "default" && (
        <div className={`w-full h-40 p-3 flex flex-col gap-3 ${contentBg}`}>
          <h4 className="text-xl">{title}</h4>
          <p className="p-sm">{description}</p>
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