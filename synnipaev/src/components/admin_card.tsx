"use client";

import { useState } from "react";
import { strict } from "assert";

interface CardProps {
    id?: string;
    title: string;
    image: string;
    description: string;
    board: "juhatus" | "yritused" | "rent";
    email?: string;
    category?: string;
    handle?: string;
    onClick?: (
        id: string,
        title: string,
        image: string,
        description: string,
        email: string,
        category: string,
        handle: string,
    ) => void;
    onDelete?: (id: string) => void;
}

export default function AdminCard({
    id,
    title,
    image,
    description,
    board,
    email = "",
    category,
    handle,
    onClick,
    onDelete,
}: CardProps) {
    const [_title, setTitle] = useState(title);
    const [_image, setImage] = useState(image);
    const [_description, setDescription] = useState(description);
    const [_email, setEmail] = useState(email);
    const [_category, setCategory] = useState(category);
    const [_handle, setHandle] = useState(handle);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onClick) {
            onClick(id || "", _title || "", _image || "", _description || "", _email || "", _category || "", _handle || "");
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id || "");
        }
    };

    if (board == "juhatus") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full" onSubmit={handleSubmit}>
                    <img
                        className="min-h-[284px] object-cover rounded-t-lg"
                        src={_image}
                        alt={title}
                    />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Ametinimetus</label>
                        <input className="w-full" type="text" name="description" placeholder="Igavene esimees" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Täisnimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Härra ITÜK" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/board/XXXX/X_ametinimetus.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Meiliaadress</label>
                        <input className="w-full" type="text" name="email" placeholder="example@ituk.ee" onChange={(e) => setEmail(e.target.value)} value={_email} />
                        <button className="edit-primary" type="submit">Salvesta</button>
                        {onDelete ?
                            <button className="edit-secondary" onClick={handleDelete}>Kustuta</button>
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board == "yritused") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full" onSubmit={handleSubmit}>
                    <img
                        className="min-h-[284px] object-cover rounded-t-lg"
                        src={_image}
                        alt={title}
                    />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Ürituse nimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Don't Do IT" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>Kirjeldus</label>
                        <textarea className="w-full" name="description" placeholder="Kirjeldus" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Kategooria</label>
                        <input className="w-full" type="text" name="category" placeholder="meelelahutus/haridus/muu" onChange={(e) => setCategory(e.target.value)} value={_category} />
                        <label>Handle (normaliseeritud)</label>
                        <input className="w-full" type="text" name="handle" placeholder="dont-do-it" onChange={(e) => setHandle(e.target.value)} value={_handle} />
                        <button className="edit-primary" type="submit">Salvesta</button>
                        {onDelete ?
                            <button className="edit-secondary" onClick={handleDelete}>Kustuta</button>
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else if (board == "rent") {
        return (
            <div className="w-full rounded-lg shadow-filled justify-end items-start flex-col flex">
                <form className="w-full" onSubmit={handleSubmit}>
                    <img
                        className="min-h-[284px] object-cover rounded-t-lg"
                        src={_image}
                        alt={title}
                    />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <label>Seadme nimi</label>
                        <input className="w-full" type="text" name="title" placeholder="Pikendusjuhe" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <label>hind</label>
                        <input className="w-full" name="description" placeholder="3.5" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <label>Pildi link</label>
                        <input className="w-full" type="text" name="imagePath" placeholder="/events/ddit.jpg" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <label>Hinna ühik</label>
                        <input className="w-full" type="text" name="category" placeholder="€/tk" onChange={(e) => setCategory(e.target.value)} value={_category} />
                        <button className="edit-primary" type="submit">Salvesta</button>
                        {onDelete ?
                            <button className="edit-secondary" onClick={handleDelete}>Kustuta</button>
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    }
}
