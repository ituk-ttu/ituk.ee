import Image from "next/image";
import pathStart from "@/assets/icons/timeline-path-start.svg";
import pathGap from "@/assets/icons/timeline-path-gap.svg";
import pathEnd from "@/assets/icons/timeline-path-end.svg";
import pathCircle from "@/assets/icons/timeline-path-circle.svg";
import Card from "@/components/card";

interface TimelineProps {
  type: "start" | "left" | "right" | "gap" | "end";
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
        <Image src={pathStart} alt="Path" />
      </div>
    );
  } else if (type === "left") {
    return (
      <div className="justify-center items-center sm:items-stretch flex-col sm:flex-row flex">
        <Card
          title={title}
          image={imagePath}
          description={description}
          board={false}
        />
        <div className="h-16 bg-light w-1 flex sm:hidden" />
        <div className="min-w-32 max-w-32 justify-center items-center flex-col hidden sm:flex">
          <div className="flex-grow bg-light w-1"></div>
          <Image src={pathCircle} alt="Path" />
          <div className="flex-grow bg-light w-1"></div>
        </div>
        <div className="w-full justify-center flex-col hidden sm:flex">
          <h4>{year?.toDateString()}</h4>
        </div>
      </div>
    );
  } else if (type === "right") {
    return (
      <div className="justify-center items-center sm:items-stretch flex-col sm:flex-row-reverse flex">
        <Card
          title={title}
          image={imagePath}
          description={description}
          board={false}
        />
        <div className="h-16 bg-light w-1 flex sm:hidden" />
        <div className="min-w-32 max-w-32 justify-center items-center flex-col hidden sm:flex">
          <div className="flex-grow bg-light w-1"></div>
          <Image src={pathCircle} alt="Path" />
          <div className="flex-grow bg-light w-1"></div>
        </div>
        <div className="w-full justify-center items-end flex-col hidden sm:flex">
          <h4>{year?.toDateString()}</h4>
        </div>
      </div>
    );
  } else if (type === "gap") {
    return (
      <div className="justify-center items-center flex-row flex">
        <Image src={pathGap} alt="Gap" />
      </div>
    );
  } else if (type === "end") {
    return (
      <div className="justify-center items-center flex-row flex">
        <Image src={pathEnd} alt="End" />
      </div>
    );
  }
}
