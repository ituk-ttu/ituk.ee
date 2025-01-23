"use client"

import Button from "@/components/buttons/button"
import Image from "next/image"
import logoLong from "@/assets/logos/ituk_long_logo.svg"
import long from "@/assets/logos/ituk_long.svg"
import { usePathname } from "next/navigation";

export default function Home() {
    const pathname = usePathname();
    const currentLocale = pathname?.split("/")[1];

    if (currentLocale === "en") {
        return (
            <div className="flex flex-col items-start px-16 py-32 gap-16">
                <div className="flex flex-col items-start gap-8">
                    <h1>
                        TalTechi IT-teaduskonna üliõpilaskogu stiiliraamat en
                    </h1>
                    <h1 className="small">
                        viimati uuendatud 23. jaanuar 2025
                    </h1>
                    <p>ITÜK on Tallinna Tehnikaülikooli infotehnoloogia teaduskonna üliõpilaskogu.
                        Seetõttu järgime väga suures osas TalTechi stiiliraamatut.</p>
                </div>

                <div className="flex flex-col items-start gap-8">
                    <h2>
                        Nimi ja lühendamine
                    </h2>
                    <p>
                        Kui ITÜKi nime kasutatakse kontekstis, kus arvestatav osa lugejatest ei tea, mida ITÜK tähendab, siis palume kirjutada nimi välja (nt. TalTechi IT-teaduskonna üliõpilaskogu).<br /><br />

                        Nime võib kirjutada järgmiselt:<br />
                        Tallinna Tehnikaülikooli IT-teaduskonna üliõpilaskogu<br />
                        TalTechi IT-teaduskonna üliõpilaskogu<br />
                        IT-teaduskonna üliõpilaskogu<br />
                        ITÜK<br /><br />

                        Lubatud, kuid mitte eelistatud viisid:<br />
                        Tallinna Tehnikaülikooli infotehnoloogia teaduskonna üliõpilaskogu<br />
                        TalTechi infotehnoloogia teaduskonna üliõpilaskogu<br /><br />

                        <b>Oluline!</b> Jälgi suure- ja väikese algustähe reegleid. ITÜKi nime valesti kirjutamine ei ole lubatud! ITÜK lühendi käänamisel sidekriipsu ei lisata (nt ITÜKi, ITÜKile).<br />
                    </p>
                </div>

                <div className="flex flex-col items-start gap-8">
                    <h2>Logo</h2>
                    <p>
                        Siit saad alla laadida kõik logo versioonid. Palun väldi rastergraafika kasutamist.
                        Veebis kasutamiseks on SVG-failid ja trükiks PDF-failid. Palun väldi SVG kasutamist
                        trükis ja PDF kasutamist veebis, sest need on vastavalt RGB ja CMYK värvimudelites,
                        mis ei ole otseselt ümberarvestatavad.
                    </p>

                    <Button variant="primary" text="LAADI ALLA LOGOPAKK" />

                    <div className="flex flex-col items-start gap-8">
                        <h3>
                            Logo kasutamine koos TalTechi logoga või ilma TalTechi logota
                        </h3>
                        <p>
                            TalTechi siseselt kasutatakse ITÜKi logot ilma TalTechi logota,
                            et vältida sama logo kordumist ürituste, postrite, reklaamide jms puhul.
                            Väljaspool TalTechi kasutatakse logoversiooni, kus on lisatud ka TalTechi logo.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-8">
                        <h3>
                            Logo variandid
                        </h3>
                        <p>
                            Logo ikoone võib kasutada:<br />
                            Kujunduselementidena.<br />
                            Kui pikk logo ei oleks loetav.<br />
                            Juhul, kui on lihtne ITÜK ühendada ikooniga.<br /><br />

                            Ikooni võib kasutada nii kastiga kui ilma.
                        </p>
                    </div>

                    <div className="flex flex-row items-start gap-8">
                        <div className="flex flex-col items-start gap-8">
                            <h4>
                                Pikk variant TalTechi logoga
                            </h4>
                            <Image src={logoLong} alt="Logo" width={640} height={100} />
                        </div>

                        <div className="flex flex-col items-start gap-8">
                            <h4>
                                Pikk variant ilma TalTechi logota
                            </h4>
                            <Image src={long} alt="Logo" width={400} height={100} />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-start px-16 py-32 gap-16">
                <div className="flex flex-col items-start gap-8">
                    <h1>
                        TalTechi IT-teaduskonna üliõpilaskogu stiiliraamat
                    </h1>
                    <h1 className="small">
                        viimati uuendatud xx. jaanuar 2025
                    </h1>
                    <p>ITÜK on Tallinna Tehnikaülikooli infotehnoloogia teaduskonna üliõpilaskogu.
                        Seetõttu järgime väga suures osas TalTechi stiiliraamatut.</p>
                </div>

                <div className="flex flex-col items-start gap-8">
                    <h2>
                        Nimi ja lühendamine
                    </h2>
                    <p>
                        Kui ITÜKi nime kasutatakse kontekstis, kus arvestatav osa lugejatest ei tea, mida ITÜK tähendab, siis palume kirjutada nimi välja (nt. TalTechi IT-teaduskonna üliõpilaskogu).<br /><br />

                        Nime võib kirjutada järgmiselt:<br />
                        Tallinna Tehnikaülikooli IT-teaduskonna üliõpilaskogu<br />
                        TalTechi IT-teaduskonna üliõpilaskogu<br />
                        IT-teaduskonna üliõpilaskogu<br />
                        ITÜK<br /><br />

                        Lubatud, kuid mitte eelistatud viisid:<br />
                        Tallinna Tehnikaülikooli infotehnoloogia teaduskonna üliõpilaskogu<br />
                        TalTechi infotehnoloogia teaduskonna üliõpilaskogu<br /><br />

                        <b>Oluline!</b> Jälgi suure- ja väikese algustähe reegleid. ITÜKi nime valesti kirjutamine ei ole lubatud! ITÜK lühendi käänamisel sidekriipsu ei lisata (nt ITÜKi, ITÜKile).<br />
                    </p>
                </div>

                <div className="flex flex-col items-start gap-8">
                    <h2>Logo</h2>
                    <p>
                        Siit saad alla laadida kõik logo versioonid. Palun väldi rastergraafika kasutamist.
                        Veebis kasutamiseks on SVG-failid ja trükiks PDF-failid. Palun väldi SVG kasutamist
                        trükis ja PDF kasutamist veebis, sest need on vastavalt RGB ja CMYK värvimudelites,
                        mis ei ole otseselt ümberarvestatavad.
                    </p>

                    <Button variant="primary" text="LAADI ALLA LOGOPAKK" />

                    <div className="flex flex-col items-start gap-8">
                        <h3>
                            Logo kasutamine koos TalTechi logoga või ilma TalTechi logota
                        </h3>
                        <p>
                            TalTechi siseselt kasutatakse ITÜKi logot ilma TalTechi logota,
                            et vältida sama logo kordumist ürituste, postrite, reklaamide jms puhul.
                            Väljaspool TalTechi kasutatakse logoversiooni, kus on lisatud ka TalTechi logo.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-8">
                        <h3>
                            Logo variandid
                        </h3>
                        <p>
                            Logo ikoone võib kasutada:<br />
                            Kujunduselementidena.<br />
                            Kui pikk logo ei oleks loetav.<br />
                            Juhul, kui on lihtne ITÜK ühendada ikooniga.<br /><br />

                            Ikooni võib kasutada nii kastiga kui ilma.
                        </p>
                    </div>

                    <div className="flex flex-row items-start gap-8">
                        <div className="flex flex-col items-start gap-8">
                            <h4>
                                Pikk variant TalTechi logoga
                            </h4>
                            <Image src={logoLong} alt="Logo" width={640} height={100} />
                        </div>

                        <div className="flex flex-col items-start gap-8">
                            <h4>
                                Pikk variant ilma TalTechi logota
                            </h4>
                            <Image src={long} alt="Logo" width={400} height={100} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}