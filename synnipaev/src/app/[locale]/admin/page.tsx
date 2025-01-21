"use client";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    validatePassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
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
    Timestamp,
    getDoc,
    deleteField
} from "firebase/firestore";
import { db } from "@/firebase";
import Button from "@/components/buttons/button";
import AdminCard from "@/components/cards/admin_card";
import Card from "@/components/cards/card";

interface BoardMember {
    key: string;
    name: string;
    position: string;
    en_position: string;
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

interface EventYear {
    key: string;
    banner: string;
    date: string;
    description: string;
    extraInformation?: string;
    handle: string;
    gallery?: Map<string, string>;
    title: string;
}

interface Rentables {
    key: string;
    name: string;
    price: number;
    unit: string;
    imagePath: string;
}

interface Logs {
    authorUID: string;
    key: string;
    author: string;
    entry: string;
    date: Date;
}

export interface AdminCardResponse {
    id: string;
    title: string;
    en_title: string;
    image: string;
    description: string;
    en_description: string;
    email: string;
    category: string;
    handle: string;
    date: string;
    extraInformation: string;
}

export default function Home() {
    const [page, setPage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [uid, setUid] = useState("");

    //firebase variables
    const [banner, setBanner] = useState("");
    const [category, setCategory] = useState("kõik");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [entry, setEntry] = useState("");
    const [curEvent, setCurEvent] = useState("");
    const [curYear, setCurYear] = useState("");

    //functions to get data from db

    //gets board members

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
                    en_position: data.position_en,
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

    //gets events

    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "events"), orderBy("category", "asc"))
            );
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

    const [eventYears, setEventYears] = useState<EventYear[]>([]);

    const getEventYears = async (id: string) => {
        try {
            const eventRef = doc(db, "events", id)
            const querySnapshot = await getDocs(
                query(collection(eventRef, "years"), orderBy("date", "asc"))
            );
            const eventYears: EventYear[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    key: doc.id,
                    banner: data.banner,
                    date: data.date,
                    description: data.description,
                    extraInformation: data.extraInformation ? data.extraInformation : undefined,
                    gallery: data.gallery ? new Map(Object.entries(data.gallery)) : undefined,
                    handle: data.handle,
                    title: data.title
                };
            });
            setEventYears(eventYears);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    //gets rentables

    const [rentables, setRentables] = useState<Rentables[]>([]);

    const getRentables = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "rent"), orderBy("imagePath", "asc"))
            );
            const rentables: Rentables[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    key: doc.id,
                    name: data.name,
                    price: data.price,
                    unit: data.unit,
                    imagePath: data.imagePath,
                };
            });
            setRentables(rentables);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    //gets logbooks

    const [logbook, setLogs] = useState<Logs[]>([]);

    const getLogs = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "logbook"), orderBy("date", "asc"))
            );
            const logbook: Logs[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    authorUID: data.authorUID,
                    key: doc.id,
                    author: data.author,
                    entry: data.entry,
                    date: data.date.toDate(),
                };
            });
            setLogs(logbook);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    //firebase authentication functions

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

    const onLogin = async (e: ButtonEvent) => {
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

        const status = await validatePassword(auth, password);
        if (!status.isValid) {
            if (!status.containsLowercaseLetter) {
                alert("Password must contain lowercase letter!!!")
            }
            if (!status.containsUppercaseLetter) {
                alert("Password must contain uppercase letter!!!")
            }
            if (!status.containsNonAlphanumericCharacter) {
                alert("Password must contain special character!!!")
            }
            if (!status.containsNumericCharacter) {
                alert("Password must contain number!!!")
            }
            if (!status.meetsMinPasswordLength) {
                alert("Password is not long enough!!!")
            }
        }
    };

    //member functions

    const updateMember = async (
        response: AdminCardResponse
    ) => {
        console.log("Button called")
        try {
            const memberDoc = doc(db, "board", response.id);
            const docRef = await updateDoc(memberDoc, {
                email: response.email,
                imagePath: response.image,
                name: response.title,
                position: response.description,
                position_en: response.en_description,
            });
            console.log("Document written");
            alert("Member changed!");
            window.location.reload();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const createMember = async (response: AdminCardResponse) => {
        try {
            const docRef = await addDoc(collection(db, "board"), {
                email: response.email,
                imagePath: response.image,
                name: response.title,
                position: response.description,
                position_en: response.en_description,
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

    const updateEvent = async (response: AdminCardResponse) => {
        try {
            const eventDoc = doc(db, "events", response.id);
            const docRef = await updateDoc(eventDoc, {
                banner: response.image,
                category: response.category,
                description: response.description,
                handle: response.handle,
                name: response.title,
            });
            console.log("Document written");
            alert("Event updated");
            getEvents();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const createEvent = async (response: AdminCardResponse) => {
        try {
            const docRef = await addDoc(collection(db, "events"), {
                banner: response.image,
                category: response.category,
                description: response.description,
                handle: response.handle,
                name: response.title,
            });
            alert("Document writen with ID: " + docRef.id);
            getEvents();
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteEvent = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this event? This event cannot be restored!!"
            )
        ) {
            try {
                await deleteDoc(doc(db, "events", id));
                getEvents();
            } catch (e) {
                console.error("Error deleting document: ", e);
            }
        }
    };

    // event year functions

    const updateYear = async (response: AdminCardResponse) => {
        try {
            const eventRef = doc(db, "events", curEvent)
            const docRef = await updateDoc(doc(eventRef, "years", response.id), {
                banner: response.image,
                date: response.date,
                description: response.description,
                handle: response.handle,
                title: response.title,
                extraInformation: response.extraInformation
            });
            console.log("Document written");
            alert("Event updated");
            getEventYears(curEvent);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const createYear = async (response: AdminCardResponse) => {
        try {
            const eventRef = doc(db, "events", curEvent)
            const docRef = await addDoc(collection(eventRef, "years"), {
                banner: response.image,
                date: response.date,
                description: response.description,
                handle: response.handle,
                title: response.title,
                extraInformation: response.extraInformation
            });
            alert("Document writen with ID: " + docRef.id);
            getEventYears(curEvent);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteYear = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this year event? This year event cannot be restored!!"
            )
        ) {
            try {
                const eventRef = doc(db, "events", curEvent)
                await deleteDoc(doc(eventRef, "years", id));
                getEventYears(curEvent);
            } catch (e) {
                console.error("Error deleting document: ", e);
            }
        }
    };

    const addImage = async (response: AdminCardResponse) => {
        try {
            const eventRef = doc(db, "events", curEvent);
            const yearRef = doc(eventRef, "years", curYear)
            const docRef = await updateDoc(yearRef, {
                [`gallery.${response.title}`]: response.image,
            });
            console.log("Document written with ID: ", docRef);
            alert("Image added");
            getEventYears(curEvent);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteImage = async (id: string) => {
        try {
            const eventRef = doc(db, "events", curEvent);
            const yearRef = doc(eventRef, "years", curYear)
            const docRef = await updateDoc(yearRef, {
                [`gallery.${id}`]: deleteField(),
            });
            console.log("Document written with ID: ", docRef);
            alert("Image deleted");
            getEventYears(curEvent);
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

    // rent functions

    const updateRent = async (
        response: AdminCardResponse
    ) => {
        try {
            const rentDoc = doc(db, "rent", response.id);
            const docRef = await updateDoc(rentDoc, {
                name: response.title,
                imagePath: response.image,
                price: +response.description,
                unit: response.category,
            });
            console.log("Document written");
            alert("Event updated");
            window.location.reload();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const createRent = async (
        response: AdminCardResponse
    ) => {
        try {
            const docRef = await addDoc(collection(db, "rent"), {
                name: response.title,
                imagePath: response.image,
                price: +response.description,
                unit: response.category,
            });
            alert("Document writen with ID: " + docRef.id);
            window.location.reload();
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteRent = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this member? This member cannot be restored!!"
            )
        ) {
            try {
                await deleteDoc(doc(db, "rent", id));
                window.location.reload();
            } catch (e) {
                console.error("Error deleting document: ", e);
            }
        }
    };

    // logbook functions

    const createLog = async () => {
        try {
            const docRef = await addDoc(collection(db, "logbook"), {
                authorUID: uid,
                author: author,
                entry: entry,
                date: Timestamp.fromDate(new Date())
            });
            alert("Log pushed!");
            window.location.reload();
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleEventSelect = (id: string) => {
        setCurEvent(id);
        getEventYears(id);
    }

    useEffect(() => {
        getBoardMembers();
        getEvents();
        getRentables();
        getLogs();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setUid(uid);
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
            <div className="main-padding main-min justify-center items-center flex-col flex gap-8">
                <h1>Logi sisse</h1>
                <form className="items-start justify-center gap-4 flex flex-col">
                    <label><span className="text-secondary">* </span>Meiliaadress</label>
                    <input id="email-address" name="email" type="email" required placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                    <label><span className="text-secondary">* </span>Parool</label>
                    <input id="password" name="password" type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="primary" onClick={onLogin} text="Logi sisse" />
                </form>
            </div>
        );
    } else {
        return (
            <div className="main-min">
                <div className="bg-derp-bg bg-top bg-cover text-align justify-center items-center flex-row flex">
                    <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
                        <div className="main-padding w-full h-full bg-epic-gradient">
                            <h1 className="text-center big">Dashboard</h1>
                        </div>
                    </div>
                </div>
                <div className="main-padding gap-16 flex-col flex">
                    <div className="w-full justify-center items-center flex-col sm:flex-row flex gap-4">
                        <Button variant="secondary" onClick={() => setPage("juhatus")} text="Juhatus" />
                        <Button variant="secondary" onClick={() => setPage("uritused")} text="Üritused" />
                        <Button variant="secondary" onClick={() => setPage("rent")} text="Rent" />
                        <Button variant="secondary" onClick={() => setPage("logiraamat")} text="Logiraamat" />
                        <Button variant="primary" onClick={handleLogout} text="Logi välja" />
                    </div>

                    {(() => {
                        switch (page) {
                            case 'juhatus':
                                return (
                                    <div className="justify-center items-center text-align gap-16 flex-col flex">
                                        <h2>Juhatuse koosseis</h2>
                                        <ul className="w-full flex-col flex gap-4">
                                            <li>
                                                Pilt croppida ruudukujuliseks, kasutada .jpg failiformaati, et
                                                failisuurus väike oleks
                                            </li>
                                            <li>
                                                Kaust, kuhu pildid repos panna, on "public/board/(vastav aasta
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
                                                <AdminCard key={member.key} id={member.key} title={member.name} image={member.imagePath} description={member.position} en_description={member.en_position} board="juhatus" email={member.email} onClick={updateMember} onDelete={deleteMember}
                                                />
                                            ))}
                                            <AdminCard title="" image="" description="" board="juhatus" email="" onClick={createMember} />
                                        </div>
                                    </div>
                                )
                            case 'uritused':
                                return (
                                    <div className="justify-center items-center text-align gap-16 flex-col flex">
                                        <h2>Üritused</h2>
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
                                        
                                        <h3>Üritused</h3>
                                        <div className="w-full justify-center items-center flex-col sm:flex-row flex gap-4">
                                            <Button variant="secondary" onClick={() => setCategory("kõik")} text="Kõik" />
                                            <Button variant="secondary" onClick={() => setCategory("haridus")} text="Haridus" />
                                            <Button variant="secondary" onClick={() => setCategory("meelelahutus")} text="Meelelahutus" />
                                            <Button variant="secondary" onClick={() => setCategory("muu")} text="Muu" />
                                        </div>
                                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
                                            {events.map((event) => (
                                                (category === "kõik" || category === event.category) && (
                                                    <AdminCard key={event.key} id={event.key} title={event.name} image={event.banner} description={event.description} board="uritused" category={event.category} handle={event.handle} onClick={updateEvent} onDelete={deleteEvent} onSelect={(id) => handleEventSelect(id)} />
                                                )
                                            ))}
                                            <AdminCard title="" image="" description="" board="uritused" category="" handle="" email="" onClick={createEvent} />
                                        </div>

                                        <h2>Hetkel valitud üritus</h2>
                                        {events.map((_event) => (
                                            (_event.key === curEvent) && (
                                                <Card title={_event.name} image={_event.banner} description={_event.description} board={false} />
                                            )
                                        ))}

                                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
                                            {eventYears.map((eventYear) => (
                                                <AdminCard key={eventYear.key} id={eventYear.key} title={eventYear.title} image={eventYear.banner} description={eventYear.description} board="aasta" handle={eventYear.handle} date={eventYear.date} extraInformation={eventYear.extraInformation} onClick={updateYear} onDelete={deleteYear} onSelect={(id) => setCurYear(id)} />
                                            ))}
                                            {curEvent && (
                                                <AdminCard title="" image="" description="" board="aasta" handle="" date="" onClick={createYear} />
                                            )}
                                        </div>

                                        <div>
                                            {curYear && <h3>Ürituse gallerii</h3>}
                                            {curYear && eventYears
                                                .filter(year => year.key === curYear)
                                                .map(year => (
                                                    year.gallery ? (
                                                        Array.from(year.gallery.entries()).map(([title, image]) => (
                                                            <AdminCard key={title} id={title} title={title} image={image} onDelete={deleteImage} board="pilt"/>
                                                        ))
                                                    ) : (
                                                        <p key="no-images">Galleriis puuduvad pildid</p>
                                                    )
                                                ))
                                            }
                                            {curYear && <AdminCard key="" title="" image="" board="pilt" onClick={addImage}/>}
                                        </div>
                                    </div>
                                )
                            case 'rent':
                                return (
                                    <div className="justify-center items-center text-align gap-16 flex-col flex">
                                        <h2>Renditavad seadmed</h2>
                                        <ul className="w-full flex-col flex gap-4">
                                            <li>
                                                Kaust, kuhu pildid repos panna, on "public/rent/"
                                            </li>
                                        </ul>
                                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
                                            {rentables.map((rentable) => (
                                                <AdminCard key={rentable.key} id={rentable.key} title={rentable.name} image={rentable.imagePath} description={rentable.price.toString()} category={rentable.unit} board="rent" onClick={updateRent} onDelete={deleteRent} />
                                            ))}
                                            <AdminCard title="" image="" description="" category="" board="rent" onClick={createRent} />
                                        </div>
                                    </div>
                                )
                            case 'logiraamat':
                                return (
                                    <div className="w-full justify-center items-center text-align gap-16 flex-col flex">
                                        <h2>Logiraamat</h2>
                                        <div className="flex-col md:flex-row flex gap-16">
                                            <div className="w-full justify-start items-center flex-col flex gap-16">
                                                <form
                                                    className="w-full justify-start items-start flex-col flex gap-4"
                                                >
                                                    <label><span className="text-secondary">* </span>Autori nimi</label>
                                                    <input className="w-full" id="author" name="author" type="text" required placeholder="Kes sa oled?" onChange={(e) => setAuthor(e.target.value)} />
                                                    <label><span className="text-secondary">* </span>Sissekanne</label>
                                                    <textarea className="w-full" id="entry" name="entry" required placeholder="Mis sa hingelt puistada tahad?" onChange={(e) => setEntry(e.target.value)} />
                                                    <Button variant="primary" type="submit" text="Salvesta" onClick={createLog} />
                                                </form>
                                            </div>
                                            {/* Kui sa seda näed, siis väga vinge! 
                                            Sõnum siis sulle, tulevane arendaja - palun uuenda iga formi juures regulaarselt, mis on nende andmete nõuded (a la mis failinimi/link peaks olema jne). 
                                            Nii saame veenduda, et kesiganes edasi manageerima peab, saab ise hakkama ja ei pea talveunest äratama iga väiksema probleemi peale ;D */}
                                            <ol className="w-full italic gap-4 flex-col flex">
                                                <li>"Tervist!</li>
                                                <li>
                                                    Siin meie kodulehe hetke versiooni arendajad väikse teadaandega - kui sa veel aru ei ole saanud,
                                                    siis sul on erakordne võimalus olla osa ITÜKi kodulehe administraatoritest! Ehk sa arvatavasti
                                                    oled ainuke, sest me oleme oma töö ära teinud.
                                                </li>
                                                <li>
                                                    Pole viga, midagi rasket ei ole - all on terve hunnik välju - alates juhatuse koosseisust lõpetades
                                                    rendinimekirjani, pea kõiki asju saab siin lihtsasti muuta.
                                                </li>
                                                <li>
                                                    Muidugi pead sa mingi hetk Firebase'i ka avama, sest 100% kõike siit ei tee, nii et, ma loodan,
                                                    et eelmine vend andis sulle selle logini ka. Kui ei, siis küsi. Siinkohal pead siis meilt küsima.
                                                    Kes me oleme? Noh, edu selle otsimisega. Tunne vabalt rantida logiraamatusse, ehk leiad sealt
                                                    lohutust ka. ;D"
                                                </li>
                                                <li>??? - 07.01.2025</li>
                                            </ol>
                                        </div>
                                        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-8">
                                            {logbook.map((log, index) => (
                                                <ol key={log.key} className="h-full w-60">
                                                    <li
                                                        className={`relative min-h-60 w-60 p-4 shadow-filled break-words transform transition-transform duration-150 ease-linear ${(() => {
                                                            if ((index + 1) % 3 === 0) {
                                                                return "rotate-[6deg] top-[-3px] bg-gray text-light";
                                                            } else if ((index + 1) % 4 === 0) {
                                                                return "rotate-[-3deg] top-[8px] bg-light text-dark";
                                                            } else if ((index + 1) % 5 === 0) {
                                                                return "rotate-[2deg] top-[2px] bg-[#4dbed2] text-dark";
                                                            } else if ((index + 1) % 2 === 0) {
                                                                return "rotate-[-2deg] top-[4px] bg-yellow-300 text-dark";
                                                            } else if ((index + 1) % 7 === 0) {
                                                                return "rotate-[-5deg] top-[7px] bg-[#342b60] text-light";
                                                            } else if ((index + 1) % 6 === 0) {
                                                                return "rotate-[-1deg] top-[5px] bg-green-500 text-dark";
                                                            } else {
                                                                return "bg-primary text-light"; // Default case for other list items
                                                            }
                                                        })()} hover:scale-110 hover:rotate-[0deg] z-10`}
                                                    >
                                                        <h5>{log.author}</h5>
                                                        <p className="text-xs">
                                                            {new Date(log.date).toLocaleString('et-EE', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                            })}
                                                        </p>
                                                        <br />
                                                        <p className="text-xs">{log.entry}</p>
                                                    </li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )
                            default:
                                return (
                                    <div className="justify-center items-center flex-row flex">
                                        <h2 className="italic box-border border-b-2 text-green-700">Tervist, &lt;user_id&gt;!</h2>
                                    </div>
                                )
                        }
                    })()}
                </div>
            </div >
        );
    }
}
