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
  const yearString = year?.toLocaleString('et-EE', { year: 'numeric' });

  if (type === "start") {
    return (
      <div className="w-full flex flex-col sm:flex-row items-stretch">
        <div className="w-full sm:w-[calc(50%-2rem)]" />
        <div className="w-16 flex flex-col items-center shrink-0">
          <svg width="24" height="48" viewBox="0 0 24 48" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Ajajoone algus">
            <path d="M13.5469 20L23.0939 0H-0.000130653L9.54688 20H13.5469ZM11.5469 18H9.54688V64H11.5469H13.5469V18H11.5469Z" fill="currentColor" />
          </svg>
        </div>
        <div className="w-full sm:w-[calc(50%-2rem)]" />
      </div>
    );
  }

  if (type === "end") {
    return (
      <div className="w-full flex flex-col sm:flex-row items-stretch">
        <div className="w-full sm:w-[calc(50%-2rem)]" />
        <div className="w-16 flex flex-col items-center shrink-0">
          <svg width="24" height="48" viewBox="0 0 24 48" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Ajajoone lõpp">
            <path d="M12 48L23.547 28H0.452995L12 48ZM10 0V30H14V0H10Z" fill="currentColor" />
          </svg>
        </div>
        <div className="w-full sm:w-[calc(50%-2rem)]" />
      </div>
    );
  }

  if (type === "left") {
    return (
      <div className="w-full flex flex-col sm:flex-row items-stretch">
        {/* Card on left */}
        <div className="w-full sm:w-[calc(50%-2rem)] flex justify-center sm:justify-end">
          <div className="max-w-80">
            <Card title={title} image={imagePath} description={description} type="default" />
          </div>
        </div>

        {/* Timeline center */}
        <div className="w-16 flex flex-col items-center shrink-0">
          <div className="w-1 flex-1 bg-white" />
          <div className="w-4 h-4 rounded-full bg-white shrink-0" />
          <div className="w-1 flex-1 bg-white" />
        </div>

        {/* Year on right */}
        <div className="w-full sm:w-[calc(50%-2rem)] flex items-center justify-center sm:justify-start">
          <h3 className="text-2xl font-bold">{yearString}</h3>
        </div>
      </div>
    );
  }

  if (type === "right") {
    return (
      <div className="w-full flex flex-col sm:flex-row items-stretch">
        {/* Year on left */}
        <div className="w-full sm:w-[calc(50%-2rem)] flex items-center justify-center sm:justify-end order-2 sm:order-1">
          <h3 className="text-2xl font-bold">{yearString}</h3>
        </div>

        {/* Timeline center */}
        <div className="w-16 flex flex-col items-center shrink-0 order-1 sm:order-2">
          <div className="w-1 flex-1 bg-white" />
          <div className="w-4 h-4 rounded-full bg-white shrink-0" />
          <div className="w-1 flex-1 bg-white" />
        </div>

        {/* Card on right */}
        <div className="w-full sm:w-[calc(50%-2rem)] flex justify-center sm:justify-start order-3">
          <div className="max-w-80">
            <Card title={title} image={imagePath} description={description} type="default" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}