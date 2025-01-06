"use client";

import Image from "next/image";
import Email from "@/assets/icons/email.svg";
import { useState } from "react";
import { strict } from "assert";

interface CardProps {
  id?: string;
  title: string;
  image: string;
  description: string;
  board: boolean;
  email?: string;
  onClick?: (
    id: string,
    title: string,
    image: string,
    description: string,
    email: string
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
  onClick,
  onDelete,
}: CardProps) {
    const [_title, setTitle] = useState(title);
    const [_image, setImage] = useState(image);
    const [_description, setDescription] = useState(description);
    const [_email, setEmail] = useState(email);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(id || "", _title, _image, _description, _email);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id || "");
    }
  };

    if (board) {
        return (
            <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
                <form onSubmit={handleSubmit}>
                    <img
                        className="min-h-[284px] object-cover rounded-t-lg"
                        src={_image}
                        alt={title}
                    />
                    <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-epic-gradient">
                        <input className="bg-transparent text-light" type="text" name="title" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={_title} />
                        <input className="bg-transparent text-light" type="text" name="description" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={_description} />
                        <input className="bg-transparent text-light" type="text" name="imagePath" placeholder="Image Path" onChange={(e) => setImage(e.target.value)} value={_image} />
                        <div className="justify-start items-center gap-2 flex-row flex">
                            <Image className="flex w-[20px] h-[20px]" src={Email} alt="Email" />
                            <input className="bg-transparent text-light" type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={_email} />
                        </div>
                        <button type="submit">Submit</button>
                        {onDelete ?
                            <button onClick={handleDelete}>Delete</button>
                            : <></>
                        }
                    </div>
                </form>
            </div>
        );
    } else {
        return (
            <div className="w-full rounded-lg shadow-filled justify-start items-start flex-col flex">
                <img
                    className="h-full object-cover rounded-t-lg"
                    src={image}
                    alt={title}
                />
                <div className="w-full p-4 rounded-b-lg justify-between items-start gap-4 flex-col flex bg-primary">
                    <h5>{title}</h5>
                    <p>{description}</p>
                </div>
            </div>
        );
    }
}
