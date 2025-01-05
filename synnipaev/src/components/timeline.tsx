import Image from "next/image";
import pathStart from "@/assets/icons/timeline-path-start.svg";
import pathDate from "@/assets/icons/timeline-path-date.svg";
import pathGap from "@/assets/icons/timeline-path-gap.svg";
import pathEnd from "@/assets/icons/timeline-path-end.svg";
import pathMini from "@/assets/icons/timeline-path-mini.svg";
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
      <div className="justify-center items-center flex-col sm:flex-row flex">
        <Card
          title={title}
          image={imagePath}
          description={description}
          board={false}
        />
        <Image className="flex sm:hidden" src={pathMini} alt="Path" />
        <div className="h-full min-w-32 max-w-32 justify-center items-center flex-col hidden sm:flex">
          <div className="h-full bg-light w-1 flex"></div>
          <Image src={pathCircle} alt="Path" />
          <div className="h-full bg-light w-1 flex"></div>
        </div>
        <div className="w-full justify-center flex-col hidden sm:flex">
          <h5>{year?.toDateString()}</h5>
        </div>
      </div>
    );
  } else if (type === "right") {
    return (
      <div className="justify-center items-center flex-row flex">
        <div className="w-full justify-center text-right flex-col hidden sm:flex">
          <h5>{year?.toDateString()}</h5>
        </div>
        <Image className="hidden sm:flex" src={pathDate} alt="Path" />
        <Card
          title={title}
          image={imagePath}
          description={description}
          board={false}
        />
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
