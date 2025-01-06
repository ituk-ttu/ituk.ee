"use client";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { useState, useEffect, useReducer } from "react";
import { auth } from "@/firebase";
import {
    addDoc,
    collection,
    where,
    query,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    DocumentData,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import Button from "@/components/buttons/button";
import Card from "@/components/card";
import AdminCard from "@/components/admin_card";
import { posix } from "path";

interface BoardMember {
    key: string;
    name: string;
    position: string;
    email: string;
    imagePath: string;
}

interface Event {
    key: string;
    category: string;
    banner: string;
    name: string;
    description: string;
    handle: string;
    gallery?: string[];
    links?: Map<string, string>;
}

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const events: Event[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    key: doc.id,
                    handle: data.handle,
                    category: data.category,
                    banner: data.banner,
                    name: data.name,
                    description: data.description,
                    gallery: data.gallery ? data.gallery : undefined,
                    links: data.links ? new Map(Object.entries(data.links)) : undefined,
                };
            });
            setEvents(events);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    //firebase variables
    const [banner, setBanner] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");

    interface ButtonEvent
        extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
        preventDefault: () => void;
    }

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                console.log("Signed out successfully");
            })
            .catch((error) => {
                // An error happened.
            });
    };

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
                console.log(errorCode, errorMessage);
            });
    };

    const _createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "events"), {
                banner: banner,
                category: category,
                description: description,
                name: name,
                handle: handle,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const addImageToGallery = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const eventRef = query(
                collection(db, "events"),
                where("name", "==", name)
            );
            const findEvent = await getDocs(eventRef);
            findEvent.forEach(async (event) => {
                const getEvent = doc(db, "events", event.id);
                const docRef = await updateDoc(getEvent, {
                    gallery: arrayUnion(banner),
                });
                console.log("Document written with ID: ", docRef);
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const addLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const eventRef = query(
                collection(db, "events"),
                where("name", "==", name)
            );
            const findEvent = await getDocs(eventRef);
            findEvent.forEach(async (event) => {
                const getEvent = doc(db, "events", event.id);
                const docRef = await updateDoc(getEvent, {
                    [`links.${description}`]: banner,
                });
                console.log("Document written with ID: ", docRef);
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    //member functions

    const updateMember = async (
        id: string,
        title: string,
        image: string,
        description: string,
        email: string
    ) => {
        try {
            const memberDoc = doc(db, "board", id);
            const docRef = await updateDoc(memberDoc, {
                email: email,
                imagePath: image,
                name: title,
                position: description,
            });
            console.log("Document written");
            alert("Member changed!");
            window.location.reload();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const createMember = async (
        id: string,
        title: string,
        image: string,
        description: string,
        email: string
    ) => {
        try {
            const docRef = await addDoc(collection(db, "board"), {
                email: email,
                imagePath: image,
                name: title,
                position: description,
            });
            alert("Document writen with ID: " + docRef.id);
            window.location.reload();
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteMember = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this member? This member cannot be restored!!"
            )
        ) {
            try {
                await deleteDoc(doc(db, "board", id));
                window.location.reload();
            } catch (e) {
                console.error("Error deleting document: ", e);
            }
        }
    };

    // event functions

    const updateEvent = async (
        id: string,
        title: string,
        image: string,
        description: string,
        email: string,
        category: string,
        handle: string,
    ) => {
        try {
            const memberDoc = doc(db, "events", id);
            const docRef = await updateDoc(memberDoc, {
                banner: image,
                category: category,
                description: description,
                handle: handle,
                name: title,
            });
            console.log("Document written");
            alert("Event updated");
            window.location.reload();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const createEvent = async (
        id: string,
        title: string,
        image: string,
        description: string,
        email: string,
        category: string,
        handle: string,
    ) => {
        try {
            const docRef = await addDoc(collection(db, "events"), {
                banner: image,
                category: category,
                description: description,
                handle: handle,
                name: title,
            });
            alert("Document writen with ID: " + docRef.id);
            window.location.reload();
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteEvent = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this member? This member cannot be restored!!"
            )
        ) {
            try {
                await deleteDoc(doc(db, "events", id));
                window.location.reload();
            } catch (e) {
                console.error("Error deleting document: ", e);
            }
        }
    };

    useEffect(() => {
        getBoardMembers();
        getEvents();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setLoggedIn(true);
                console.log("uid", uid);
            } else {
                // User is signed out
                setLoggedIn(false);
                console.log("user is logged out");
            }
        });
    }, []);

    if (!loggedIn) {
        return (
            <form className="flex flex-col items-center justify-center h-screen gap-8">
                <input
                    className="bg-light shadow-filled text-dark"
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="bg-light shadow-filled text-dark"
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={onLogin}>Login</button>
            </form>
        );
    } else {
        return (
            <div>
                <div className="bg-derp-bg bg-top bg-cover text-align justify-center items-center flex-row flex">
                    <div className="main-padding w-full h-full bg-epic-gradient justify-center items-center flex-col flex gap-8">
                        <h1 className="big">Dashboard</h1>
                        <p>
                            <i>Sisse logitud, tere tulemast!</i>
                        </p>
                        <Button type="primary" onClick={handleLogout} text="Logi välja" />
                    </div>
                </div>
                <div className="main-padding gap-16 flex-col flex">
                    {/* Kui sa seda näed, siis väga vinge! 
        Sõnum siis sulle, tulevane arendaja - palun uuenda iga formi juures regulaarselt, mis on nende andmete nõuded (a la mis failinimi/link peaks olema jne). 
        Nii saame veenduda, et kesiganes edasi manageerima peab, saab ise hakkama ja ei pea talveunest äratama väiksema probleemi peale ;D */}
                    <p>
                        Tervist! Siin selle lehe versiooni arendaja väikse teadaandega - kui
                        sa veel aru ei saa, siis sul on erakordne õigus olla osa ITÜKi
                        kodulehe administraatoritest!
                        <br />
                        Suuresti midagi erilist ei ole, all on terve hunnik välju, kus sa
                        saad meie andmebaasi muuta. Alates juhatuse koosseisust lõpetades
                        rendinimekirjani, kõiki asju saab siin lihtsasti muuta. Muidugi
                        nende samade asjade kustutamiseks sa pead Firestore'i avama, nii et
                        ma loodan, et eelmine vend andis sulle selle logini ka. Kui ei, siis
                        küsi. Siinkohal pead siis meilt küsima. Kes me oleme? Noh, edu selle
                        otsimisega ;D
                    </p>
                    <p>
                        <i>??? - 06.01.2025</i>
                    </p>
                    <div className="justify-center items-center text-align gap-16 flex-col flex">
                        <h2>Muuda juhatuse koosseisu</h2>
                        <ul className="w-full flex-col flex gap-4">
                            <li>
                                Pilt croppida ruudukujuliseks, kasutada .jpg failiformaati, et
                                failisuurus väike oleks
                            </li>
                            <li>
                                Kaust, kuhu pildid repos panna on "public/board/(vastav aasta
                                number)"
                            </li>
                            <li>
                                Koosseisu järjekord on sorteeritud failinime järgi, seega väikse
                                nipina lisa algusesse number (nt "/board/2024/1_esimees.jpg",
                                "/board/2024/2_finants.jpg" jne)
                            </li>
                        </ul>
                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
                            {boardMembers.map((member) => (
                                <AdminCard
                                    key={member.key}
                                    id={member.key}
                                    title={member.name}
                                    image={member.imagePath}
                                    description={member.position}
                                    board={true}
                                    email={member.email}
                                    onClick={updateMember}
                                    onDelete={deleteMember}
                                />
                            ))}
                            <AdminCard
                                title=""
                                image=""
                                description=""
                                board={true}
                                email=""
                                onClick={createMember}
                            />
                        </div>
                        <h2>Lisa/muuda üritusi</h2>
                        <ul className="flex-col flex gap-4">
                            <li>
                                Pildid/bannerid asuvad repos kaustas public/events (nt:
                                "/events/(ürituse nimi)/(failinimi).jpg")
                            </li>
                            <li>Kategooriad on kas "haridus", "meelelahutus" või "muu"</li>
                            <li>
                                Nimi on ürituse nimi, handle on ürituse nimi "normaliseeritud"
                                ehk kõik tähemärgid, mis ei ole ladinakeelsed tähed või
                                sidekriips (-), eemaldatakse. Vahed asendatakse sidekriipsuga.
                                (nt: "Don't Do IT" -&gt; "dont-do-it")
                            </li>
                            <li>
                                Igale üritusele saab varasema ürituse lingi (nt: FB event või
                                muu leht, kus üritust hostitakse) vastavalt aastaarvule.
                            </li>
                            <li>
                                Lisaks on ka olemas galerii, kuhu saab pilte juurde lisada.
                            </li>
                        </ul>
                        <div className="w-full justify-center items-start flex-col md:flex-row flex gap-16">
                            <form
                                className="w-full flex flex-col gap-8 justify-center items-center"
                                onSubmit={addLink}
                            >
                                <label className="text-center">Lisa ürituse link</label>
                                <input
                                    className="w-full bg-light shadow-filled text-dark"
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Nimi (nt: Don't Do IT)"
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <input
                                    className="w-full bg-light shadow-filled text-dark"
                                    id="banner"
                                    name="banner"
                                    type="text"
                                    required
                                    placeholder="Ürituse link (nt: https://facebook.com/)"
                                    onChange={(e) => setBanner(e.target.value)}
                                />

                                <input
                                    className="w-full bg-light shadow-filled text-dark"
                                    id="year"
                                    name="year"
                                    type="text"
                                    required
                                    placeholder="Aasta (nt: 2024)"
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                                <button className="underline" type="submit">
                                    Add link
                                </button>
                            </form>
                            <form
                                className="w-full flex flex-col gap-8 justify-center items-center"
                                onSubmit={addImageToGallery}
                            >
                                <label className="text-center">Lisa pilt galeriisse</label>
                                <input
                                    className="w-full bg-light shadow-filled text-dark"
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Nimi (nt: Don't Do IT)"
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <input
                                    className="w-full bg-light shadow-filled text-dark"
                                    id="banner"
                                    name="banner"
                                    type="text"
                                    required
                                    placeholder="Pildi link (nt: /events/ddit.jpg)"
                                    onChange={(e) => setBanner(e.target.value)}
                                />

                                <button className="underline" type="submit">
                                    Add image
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <h1>Muuda üritusi</h1>
                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
                            {events.map((event) => (
                                <AdminCard
                                    key={event.key}
                                    id={event.key}
                                    title={event.name}
                                    image={event.banner}
                                    description={event.description}
                                    board={false}
                                    category={event.category}
                                    handle={event.handle}
                                    onClick={updateEvent}
                                    onDelete={deleteEvent}
                                />
                            ))}
                            <AdminCard
                                title=""
                                image=""
                                description=""
                                board={false}
                                category=""
                                handle=""
                                email=""
                                onClick={createEvent}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
