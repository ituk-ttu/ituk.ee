"use client"

import { useState } from "react";
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
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        const fields: FormFields = {
            firstName: formData.get("firstname"),
            lastName: formData.get("lastname"),
            studentId: formData.get("studentId"),
            personalId: formData.get("personalId"),
            email: formData.get("email"),
        };

        console.log("Form submitted:", fields);
        setSubmitted(true);
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

            <div className="flex flex-col justify-center items-center px-16 py-16 gap-16">
                <h1>{dictionary.text1}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="bg-primary rounded-lg max-w-64 w-auto">
                        <Card title={dictionary.card1.title} image={uritused.src} description={dictionary.card1.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg max-w-64 w-auto">
                        <Card title={dictionary.card2.title} image={meened.src} description={dictionary.card2.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg max-w-64 w-auto">
                        <Card title={dictionary.card3.title} image={sobrad.src} description={dictionary.card3.description} type="default" />
                    </div>

                    <div className="bg-primary rounded-lg max-w-64 w-auto">
                        <Card title={dictionary.card4.title} image={muu.src} description={dictionary.card4.description} type="default" />
                    </div>
                </div>
                <h1>{dictionary.text2}</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-top px-16 py-6 gap-16">
                
                <div className="basis-3/5">
                    <img src={koostoo.src} className="rounded-lg shadow-lg mb-4" />     
                </div>



                <form onSubmit={handleSubmit} className="basis-2/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="firstname" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                {dictionary.form.firstname}
                            </label>
                            <input type="text" name="firstname" className="shadow-xs-light bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="Juulius" required />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                {dictionary.form.lastname}
                            </label>
                            <input type="text" name="lastname" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="Tipikas" required />
                        </div>
                        <div>
                            <label htmlFor="studentId" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                {dictionary.form.studentId}
                            </label>
                            <input type="text" name="studentId" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="123456ABCD" required />
                        </div>
                        <div>
                            <label htmlFor="personalId" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                               {dictionary.form.personalId}
                            </label>
                            <input type="text" name="personalId" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="50809154200" required />
                        </div>
                    </div>

                    <div>
                            <label htmlFor="email" className="block mb-2 text-base font-medium text-white">
                                <span className="text-primary">*</span>
                                {dictionary.form.email}
                            </label>
                            <input type="email" name="email" className="shadow-xs bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary block w-full p-2.5" placeholder="juulius@tipikas.ee" required />
                        </div>
                    
                    <p className="text-xs text-justify text-gray my-4">
                        {dictionary.form.notice}
                    </p>

                    <div className="flex flex-col justify-center items-center">
                        <Button 
                        type="submit" 
                        disabled={submitted} 
                        className="content-center" 
                        variant="primary" 
                        big={true} 
                        text={submitted ? dictionary.form.submitted : dictionary.form.submit} />
                    </div>
                </form>

            </div>
        </div>
    )
}