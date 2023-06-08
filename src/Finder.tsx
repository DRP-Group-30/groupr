import {
  DocumentReference,
  DocumentData,
  getDoc,
  updateDoc,
  Timestamp,
  GeoPoint,
  getDocs,
  collection,
  deleteDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import "./App.css";
import Card from "./Card";
import { Link } from "react-router-dom";
import { DEFAULT_USER, USER_CARD_CATEGORIES } from "./Card";
import { db, storage } from "./Firebase";
import { makeArr, range, safeHead } from "./Util";
import { FirebaseApp } from "firebase/app";
import { updateFields } from "./FirebaseUtil";

const Finder = () => {
  async function resetLists() {
    updateFields(
      DEFAULT_USER,
      USER_CARD_CATEGORIES.map((c) => [c, () => []])
    ).then(() => window.location.reload());
  }

  return (
    <div className="App">
      <Link to="/dashboard">Dashboard</Link>
      <Card></Card>
      <button onClick={resetLists}>Reset</button>
    </div>
  );
};

export default Finder;
