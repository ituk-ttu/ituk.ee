import Image, { StaticImageData } from "next/image";
import pathShort from "@/assets/icons/timeline-path-short.svg"
import pathLong from "@/assets/icons/timeline-path-long.svg"
import pathGap from "@/assets/icons/timeline-path-gap.svg"
import pathEnd from "@/assets/icons/timeline-path-end.svg"
import Card from "@/components/card";

interface TimelineProps {
    type: "start" | "left" | "right" | "gap" | "end";
    imagePath?: string;
    title?: string;
    description?: string;
    year?: number;
}

export default function Timeline({ type, imagePath = "", title = "", description = "", year }: TimelineProps) {
    if (type === "start") {
        return (
            <div >
                <Image src={pathShort} alt="Path" />
            </div>
        );
    } else if (type === "left") {
        return (
            <div>
                <Card title={title} image={imagePath} description={description} board={false} width={900} height={384} />
                <Image src={pathLong} alt="Path" />
                <div><h5>{year}</h5></div>
            </div>
        );
    } else if (type === "right") {
        return (
            <div>
                <div><h5>{year}</h5></div>
                <Image src={pathLong} alt="Path" />
                <Card title={title} image={imagePath} description={description} board={false} width={900} height={384} />
            </div>
        );
    } else if (type === "gap") {
        return (
            <div>
                <Image src={pathGap} alt="Gap" />
            </div>
        );
    } else if (type === "end") {
        return (
            <div >
                <Image src={pathEnd} alt="End" />
            </div>
        );
    }
}