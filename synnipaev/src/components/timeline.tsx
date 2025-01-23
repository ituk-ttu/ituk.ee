import Card from "@/components/cards/card";

interface TimelineProps {
  type: "start" | "left" | "right" | "end";
  imagePath?: string;
  title?: string;
  description?: string;
  year?: Date;
}

export default function Timeline({
  type,
  imagePath = "",
  title = "",
  description = "",
  year,
}: TimelineProps) {
  if (type === "start") {
    return (
      <div className="justify-center items-center flex-row flex">
        <svg width="24" height="64" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 20L23.547 0H0.452995L10 20H14ZM10 18V64H14V18H10Z" fill="#EEEEEE" />
        </svg>
      </div>
    );
  } else if (type === "left") {
    return (
      <div className="w-full justify-center items-center sm:items-stretch flex-col sm:flex-row flex">
        <Card title={title} image={imagePath} description={description} type="default" />
        <div className="h-16 bg-light w-1 flex sm:hidden" />
        <div className="min-w-32 max-w-32 justify-center items-center flex-col hidden sm:flex">
          <div className="flex-grow bg-light w-1"></div>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0001 21.6667C16.8911 21.6667 21.6668 16.891 21.6668 11C21.6668 5.10896 16.8911 0.333333 11.0001 0.333333C5.10906 0.333333 0.333433 5.10896 0.333433 11C0.333433 16.891 5.10906 21.6667 11.0001 21.6667ZM11 13H11.0001V9H11V13Z" fill="#EEEEEE" />
          </svg>
          <div className="flex-grow bg-light w-1"></div>
        </div>
        <div className="w-full justify-center flex-col hidden sm:flex">
          <h4>{year?.toLocaleString('et-EE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</h4>
        </div>
      </div>
    );
  } else if (type === "right") {
    return (
      <div className="w-full justify-center items-center sm:items-stretch flex-col sm:flex-row-reverse flex">
        <Card title={title} image={imagePath} description={description} type="default" />
        <div className="h-16 bg-light w-1 flex sm:hidden" />
        <div className="min-w-32 max-w-32 justify-center items-center flex-col hidden sm:flex">
          <div className="flex-grow bg-light w-1"></div>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0001 21.6667C16.8911 21.6667 21.6668 16.891 21.6668 11C21.6668 5.10896 16.8911 0.333333 11.0001 0.333333C5.10906 0.333333 0.333433 5.10896 0.333433 11C0.333433 16.891 5.10906 21.6667 11.0001 21.6667ZM11 13H11.0001V9H11V13Z" fill="#EEEEEE" />
          </svg>
          <div className="flex-grow bg-light w-1"></div>
        </div>
        <div className="w-full justify-center items-end flex-col hidden sm:flex">
          <h4>{year?.toLocaleString('et-EE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</h4>
        </div>
      </div>
    );
  } else if (type === "end") {
    return (
      <div className="justify-center items-center flex-row flex">
        <svg width="24" height="64" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 64L23.547 44H0.452995L12 64ZM10 0V46H14V0H10Z" fill="#EEEEEE" />
        </svg>
      </div>
    );
  }
}