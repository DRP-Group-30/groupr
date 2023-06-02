import './App.css';
import { Link } from "react-router-dom";
import {
    DocumentReference,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from './Firebase';
import { DEFAULT_USER_ID } from './Card';
import { useState } from 'react';

const Dashboard = () => {
    const [matched, setMatched] = useState<string[] | null>(null);
    const [interested, setInterested] = useState<string[] | null>(null);
    const [rejected, setRejected] = useState<string[] | null>(null);

    if (matched === null) getMatched();
    if (interested === null) getInterested();
    if (rejected === null) getRejected();

    async function getMatched() {
        const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
        const matched: string[] = await Promise.all(defaultUser.get("Matched").map(
            (ref: DocumentReference) => getDoc(ref).then((doc) => doc.get("Name"))
        ));
        setMatched(matched);
    }

    async function getInterested() {
        const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
        const interested: string[] = await Promise.all(defaultUser.get("Interested").map(
            (ref: DocumentReference) => getDoc(ref).then((doc) => doc.get("Name"))
        ));
        setInterested(interested);
    }

    async function getRejected() {
        const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
        const rejected: string[] = await Promise.all(defaultUser.get("Rejected").map(
            (ref: DocumentReference) => getDoc(ref).then((doc) => doc.get("Name"))
        ));
        setRejected(rejected);
    }

    return <div className="Dashboard">
        <Link to='/'>Finder</Link>
        <div className="DashboardInner">
            <div className="CardList">
                <h1>Matched</h1>
                {matched?.map(m => (
                    <div className="NameCard">{m}</div>
                ))}
            </div>
            <div className="CardList">
                <h1>Interested</h1>
                {interested?.map(m => (
                    <div className="NameCard">{m}</div>
                ))}
            </div>
            <div className="CardList">
                <h1>Rejected</h1>
                {rejected?.map(m => (
                    <div className="NameCard">{m}</div>
                ))}
            </div>
        </div>
    </div>
}

export default Dashboard;
