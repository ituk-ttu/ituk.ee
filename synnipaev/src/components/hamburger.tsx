import Image from "next/image";
import hamburger from "@/assets/icons/hamburger.svg";
import close from "@/assets/icons/close.svg";


export default function Hamburger({active = false}) {
    if (active) {
        return (
            <div className="hamburger">
                <Image src={hamburger} alt="Hamburger" width={32} height={32} />
            </div>
        );
    } else {
        return (
            <div className="hamburger">
                <Image src={close} alt="Close" width={32} height={32} />
            </div>
        );
    }
};