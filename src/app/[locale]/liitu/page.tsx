"use client"

import Card from "@/components/cards/card";
import { useDictionary } from "@/components/dictionary-provider"
import uritused from "@/assets/images/uritused.jpg"
import sobrad from "@/assets/images/sobrad.jpg"
import meened from "@/assets/images/meened.jpg"
import muu from "@/assets/images/muu.jpg"
import koostoo from "@/assets/images/koostoo.jpg"
import Button from "@/components/buttons/button";


interface FormFields {
    firstName: FormDataEntryValue | null;
    lastName: FormDataEntryValue | null;
    studentId: FormDataEntryValue | null;
    personalId: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
}

export default function Home() {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        const fields: FormFields = {
            firstName: formData.get("eesnimi"),
            lastName: formData.get("perekonnanimi"),
            studentId: formData.get("uliopilaskood"),
            personalId: formData.get("isikukood"),
            email: formData.get("email"),
        };

        console.log("Form submitted:", fields);
    };

    const dictionary = useDictionary().join;
    return (
        <div>
            <div className="justify-center items-center bg-[url('/headers/liitu.jpg')] bg-center bg-cover flex-row flex">
                <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
                    <div className="main-padding w-full h-full bg-epic-gradient">
                        <h1 className="text-center big">{dictionary.header}</h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center px-16 py-32 gap-16">
                <h1>{dictionary.text1}</h1>
                <div className="flex flex-row items-top gap-16">
                    <div className="bg-primary rounded-lg w-64 flex-shrink-0">
                        <Card title={dictionary.card1.title} image={uritused.src} description={dictionary.card1.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg w-64 flex-shrink-0">
                        <Card title={dictionary.card2.title} image={meened.src} description={dictionary.card2.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg w-64 flex-shrink-0">
                        <Card title={dictionary.card3.title} image={sobrad.src} description={dictionary.card3.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg w-64 flex-shrink-0">
                        <Card title={dictionary.card4.title} image={muu.src} description={dictionary.card4.description} type="default" />
                    </div>
                    
                    
                    
                </div>
                <h1>{dictionary.text2}</h1>
            </div>

            <div className="flex flex-row justify-center items-top px-16 py-6 gap-16">
                
                <div className="basis-3/5">
                    <img src={koostoo.src} className="rounded-lg shadow-lg mb-8" />     
                </div>



                <form onSubmit={handleSubmit} className="basis-2/5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="eesnimi" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                Eesnimi
                            </label>
                            <input type="text" name="eesnimi" className="shadow-xs-light bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="Juulius" required />
                        </div>
                        <div>
                            <label htmlFor="perekonnanimi" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                Perekonnanimi
                            </label>
                            <input type="text" name="perekonnanimi" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="Tipikas" required />
                        </div>
                        <div>
                            <label htmlFor="uliopilaskood" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                Üliõpilaskood
                            </label>
                            <input type="text" name="uliopilaskood" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="123456ABCD" required />
                        </div>
                        <div>
                            <label htmlFor="isikukood" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                Isikukood
                            </label>
                            <input type="text" name="isikukood" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="50809154200" required />
                        </div>
                    </div>

                    <div>
                            <label htmlFor="email" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                E-mail
                            </label>
                            <input type="email" name="email" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="juulius@tipikas.ee" required />
                        </div>
                    
                    <p className="text-xs text-justify text-gray my-4">
                        Sinu isikuandmeid ei edastata kolmandatele osapooltele. Sinu andmeid kasutatakse ainult selleks, et registreerida sind TalTechi IT-teaduskonna üliõpilaskogu liikmeks.
                    </p>

                    <div className="flex flex-col justify-center items-center">
                        <Button type="submit" className="content-center" variant="primary" big={true} text="Esita avaldus" />
                    </div>
                </form>

            </div>
        </div>
    )
}