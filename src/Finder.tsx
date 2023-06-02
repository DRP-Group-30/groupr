import { DocumentReference, DocumentData, getDoc, updateDoc } from 'firebase/firestore';
import './App.css';
import Card from './Card';
import { Link } from "react-router-dom";
import { DEFAULT_USER, USER_CARD_CATEGORIES } from './Card';

const Finder = () => {
    async function resetLists() {
        updateFields(
            DEFAULT_USER,
            USER_CARD_CATEGORIES.map((c) => [c, () => []])
        );
    }

    return <div className="App">
        <Link to='/dashboard'>Dashboard</Link>
        <Card></Card>
        <button onClick={resetLists}>Reset</button>
    </div >
}

const updateFields = (
    d: DocumentReference<DocumentData>,
    fs: [string, (x: any) => any][]
): Promise<void> =>
    getDoc(d)
        .then((snapshot) => fs.map(([f, _]) => snapshot.get(f)))
        .then((n) =>
            updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])))
        );

export default Finder;
