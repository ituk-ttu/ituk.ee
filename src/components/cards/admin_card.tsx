"use client";

import { useState } from "react";
import Button from '@/components/buttons/button';

import { AdminCardResponse } from "@/app/[locale]/admin/page";

interface CardProps {
    id?: string;
    title: string;
    en_title?: string;
    image: string;
    description?: string;
    en_description?: string;
    board: "juhatus" | "uritused" | "rent" | "aasta" | "pilt";
    email?: string;
    category?: string;
    handle?: string;
    date?: string;
    extraInformation?: string;
    en_extraInformation?: string;
    onClick?: ( response: AdminCardResponse) => void;
    onDelete?: (id: string) => void;
    onSelect? : (id: string) => void;
}

export default function AdminCard({
    id,
    title,
    en_title,
    image,
    description,
    en_description,
    board,
    email = "",
    category,
    handle,
    date,
    extraInformation,
    en_extraInformation,
    onClick,
    onDelete,
    onSelect,
}: CardProps) {
    const [_title, setTitle] = useState(title);
    const [_en_title, setEnTitle] = useState(en_title);
    const [_image, setImage] = useState(image);
    const [_description, setDescription] = useState(description);
    const [_en_description, setEnDescription] = useState(en_description || "");
    const [_email, setEmail] = useState(email);
    const [_category, setCategory] = useState(category);
    const [_handle, setHandle] = useState(handle);
    const [_date, setDate] = useState(date);
    const [_extraInformation, setExtraInformation] = useState(extraInformation);
    const [_en_extraInformation, setEnExtraInformation] = useState(en_extraInformation);

    const handleSubmit = () => {
        if (onClick) {
            const response: AdminCardResponse = {
                id: id || "",
                title: _title || "",
                en_title: _en_title || "",
                image: _image || "",
                description: _description || "",
                en_description: _en_description || "",
                email: _email || "",
                category: _category || "",
                handle: _handle || "",
                date: _date || "",
                extraInformation: _extraInformation ||"",
                en_extraInformation: _en_extraInformation ||""
            }
            onClick(response);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id || "");
        }
    };

    const handleSelect = () => {
        if (onSelect) {
            onSelect(id || "")
        }
    }

    /**TODO: panna /add_new.jpg image default pildina, kui on kaart, kust saab uut lisada */
    if (board === "juhatus") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full">
                    <img onClick={handleSelect} className="min-h-[284px] object-cover rounded-t-lg" src={_image} alt={title} />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Ametinimetus</label>
                        <input className="w-full" type="text" name="description" placeholder="Igavene esimees" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Ametinimetus eng</label>
                        <input className="w-full" type="text" name="description" placeholder="King" onChange={(e) => setEnDescription(e.target.value)} value={_en_description} />
                        <label>Täisnimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Härra ITÜK" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/board/XXXX/X_ametinimetus.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Meiliaadress</label>
                        <input className="w-full" type="text" name="email" placeholder="example@ituk.ee" onChange={(e) => setEmail(e.target.value)} value={_email} />
                        <Button variant="primary" type="submit" text="Salvesta" onClick={handleSubmit}/>
                        {onDelete ?
                            <Button variant="secondary" onClick={handleDelete} text="Kustuta" />
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board === "uritused") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full">
                    <img onClick={handleSelect} className="min-h-[284px] object-cover rounded-t-lg cursor-pointer" src={_image} alt={title} />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Ürituse nimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Ürituse nimi en</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT" onChange={(e) => setEnTitle(e.target.value)} value={_en_title} />
                        <label>Kirjeldus</label>
                        <textarea className="w-full" name="description" placeholder="Kirjeldus" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Kirjeldus en</label>
                        <textarea className="w-full" name="description" placeholder="Description" onChange={(e) => setEnDescription(e.target.value)} value={_en_description} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Kategooria</label>
                        <input className="w-full" type="text" name="category" placeholder="meelelahutus/haridus/muu" onChange={(e) => setCategory(e.target.value)} value={_category} />
                        <label>Handle (normaliseeritud)</label>
                        <input className="w-full" type="text" name="handle" placeholder="dont-do-it" onChange={(e) => setHandle(e.target.value)} value={_handle} />
                        <Button variant="primary" type="submit" text="Salvesta" onClick={handleSubmit}/>
                        {onDelete ?
                            <Button variant="secondary" onClick={handleDelete} text="Kustuta" />
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board === "aasta") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full">
                    <img onClick={handleSelect}  className="min-h-[284px] object-cover rounded-t-lg cursor-pointer" src={_image} alt={title} />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Ürituse nimi koos aastaga</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT 2024" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Ürituse nimi koos aastaga en</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT 2024" onChange={(e) => setEnTitle(e.target.value)} value={_en_title} />
                        <label>Kirjeldus</label>
                        <textarea className="w-full" name="description" placeholder="Kirjeldus" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Kirjeldus en</label>
                        <textarea className="w-full" name="description" placeholder="Description" onChange={(e) => setEnDescription(e.target.value)} value={_en_description} />
                        <label>Lisainfo</label>
                        <textarea className="w-full" name="extraInformation" placeholder="Lisainfo" onChange={(e) => setExtraInformation(e.target.value)} value={_extraInformation} />
                        <label>Lisainfo en</label>
                        <textarea className="w-full" name="extraInformation" placeholder="Extra information" onChange={(e) => setEnExtraInformation(e.target.value)} value={_en_extraInformation} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Kuupäev</label>
                        <input className="w-full" type="text" name="date" placeholder="2024" onChange={(e) => setDate(e.target.value)} value={_date} />
                        <label>Handle (normaliseeritud)</label>
                        <input className="w-full" type="text" name="handle" placeholder="dont-do-it" onChange={(e) => setHandle(e.target.value)} value={_handle} />
                        <Button variant="primary" type="submit" text="Salvesta" onClick={handleSubmit}/>
                        {onDelete ?
                            <Button variant="secondary" onClick={handleDelete} text="Kustuta" />
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board === "pilt") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full">
                    <img onClick={handleSelect}  className="min-h-[284px] object-cover rounded-t-lg" src={_image} alt={title} />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Pildi nimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT 2024" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <Button variant="primary" type="submit" text="Salvesta" onClick={handleSubmit}/>
                        {onDelete ?
                            <Button variant="secondary" onClick={handleDelete} text="Kustuta" />
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board === "rent") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full">
                    <img onClick={handleSelect} className="min-h-[284px] object-cover rounded-t-lg" src={_image} alt={title} />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Seadme nimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Pikendusjuhtmed" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Seadme nimi en</label>
                        <input className="w-full" type="text" name="title" placeholder="Extension cords" onChange={(e) => setEnTitle(e.target.value)} value={_en_title} />
                        <label>hind</label>
                        <input className="w-full" name="description" placeholder="5" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Hinna ühik</label>
                        <input className="w-full" type="text" name="category" placeholder="€/päev" onChange={(e) => setCategory(e.target.value)} value={_category} />
                        <Button variant="primary" type="submit" text="Salvesta" onClick={handleSubmit}/>
                        {onDelete ?
                            <Button variant="secondary" onClick={handleDelete} text="Kustuta" />
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    }
}
