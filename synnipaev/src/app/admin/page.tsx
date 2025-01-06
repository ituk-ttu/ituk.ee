"use client";

import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect, useReducer } from "react";
import { auth } from "@/firebase"
import { addDoc, collection, where, query, getDocs, doc, updateDoc, arrayUnion, DocumentData, orderBy } from "firebase/firestore";
import { db } from '@/firebase';
import Button from "@/components/buttons/button";
import Card from "@/components/card";

interface BoardMember {
    key: string,
    name: string;
    position: string;
    email: string;
    imagePath: string;
};

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

    const getBoardMembers = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "board"), orderBy("imagePath", "asc"))
            );
            const members: BoardMember[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    key: doc.id,
                    name: data.name,
                    position: data.position,
                    email: data.email,
                    imagePath: data.imagePath,
                };
            });
            setBoardMembers(members);
        } catch (error) {
            console.error('Error getting members: ', error);
            throw error;
        }
    };

    //firebase variables
    const [banner, setBanner] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");

    interface ButtonEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
        preventDefault: () => void;
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    const onLogin = (e: ButtonEvent) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    const createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "events"), {
                banner: banner,
                category: category,
                description: description,
                name: name,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const addImageToGallery = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const eventRef = query(collection(db, "events"), where("name", "==", name));
            const findEvent = await getDocs(eventRef);
            findEvent.forEach(async (event) => {
                const getEvent = doc(db, 'events', event.id);
                const docRef = await updateDoc(getEvent, {
                    gallery: arrayUnion(banner),
                })
                console.log("Document written with ID: ", docRef);
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const addLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const eventRef = query(collection(db, "events"), where("name", "==", name));
            const findEvent = await getDocs(eventRef);
            findEvent.forEach(async (event) => {
                const getEvent = doc(db, 'events', event.id);
                const docRef = await updateDoc(getEvent, {
                    [`links.${description}`]: banner,
                })
                console.log("Document written with ID: ", docRef);
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    useEffect(() => {
        getBoardMembers();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setLoggedIn(true);
                console.log("uid", uid)
            } else {
                // User is signed out
                setLoggedIn(false);
                console.log("user is logged out")
            }
        });

    }, [])

    if (!loggedIn) {
        return (
            <form className="flex flex-col items-center justify-center h-screen gap-8">
                <input
                    className="bg-light shadow-filled text-black"
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="bg-light shadow-filled text-black"
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={onLogin}>
                    Login
                </button>
            </form>
        )
    } else {
        return (
            <div className="flex flex-col gap-8 p-16">
                <div className="flex flex-col justify-center items-center px-16 py-32 gap-16">
                    <h2>Juhatus</h2>
                    <div className="flex flex-row justify-center align-center gap-8 flex-wrap">
                        {boardMembers.map((member) => (
                            <Card
                                key={member.key}
                                title={member.name}
                                image={member.imagePath}
                                description={member.position}
                                board={true}
                                width={400}
                                height={500}
                                email={member.email}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-8 justify-center items-center">
                    <form className="flex flex-col gap-8 justify-center items-center" onSubmit={createEvent}>
                        <label>
                            Create event
                        </label>
                        <input
                            className="bg-light shadow-filled text-black"
                            id="banner"
                            name="banner"
                            type="text"
                            required
                            placeholder="Banner"
                            onChange={(e) => setBanner(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="category"
                            name="category"
                            type="text"
                            required
                            placeholder="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="description"
                            name="description"
                            type="text"
                            required
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button type="submit">Create event</button>
                    </form>

                    <form className="flex flex-col gap-8 justify-center items-center" onSubmit={addImageToGallery}>
                        <label>
                            Add image to event gallery
                        </label>
                        <input
                            className="bg-light shadow-filled text-black"
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="banner"
                            name="banner"
                            type="text"
                            required
                            placeholder="Image path"
                            onChange={(e) => setBanner(e.target.value)}
                        />

                        <button type="submit">Add image</button>
                    </form>

                    <form className="flex flex-col gap-8 justify-center items-center" onSubmit={addLink}>
                        <label>
                            Add link to event
                        </label>
                        <input
                            className="bg-light shadow-filled text-black"
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="banner"
                            name="banner"
                            type="text"
                            required
                            placeholder="Link"
                            onChange={(e) => setBanner(e.target.value)}
                        />

                        <input
                            className="bg-light shadow-filled text-black"
                            id="year"
                            name="year"
                            type="text"
                            required
                            placeholder="Year"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button type="submit">Add image</button>
                    </form>
                </div>
                <Button type="primary" onClick={handleLogout} text="Log out" />
            </div>
        )
    }

}