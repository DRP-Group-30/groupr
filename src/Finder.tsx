import {
  DocumentReference,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import "./App.css";
// import Card from './Card';
import { Link } from "react-router-dom";
import { DEFAULT_USER, USER_CARD_CATEGORIES } from "./Card";
import { MdDone, MdClose } from "react-icons/md";
import SwipeCard from "./SwipeCard";
import { Button, Center, Flex, Spacer } from "@chakra-ui/react";

const Finder = () => {
  async function resetLists() {
    updateFields(
      DEFAULT_USER,
      USER_CARD_CATEGORIES.map((c) => [c, () => []])
    ).then(() => window.location.reload());
  }

  return (
    <Center>
      <Flex>
        <Center>
          <Button leftIcon={<MdClose />}> Reject </Button>
        </Center>
        <SwipeCard></SwipeCard>
        <Center>
          <Button rightIcon={<MdDone />}> Accept</Button>
        </Center>
      </Flex>
    </Center>

    // <div className="App">
    //   {/* <Card></Card> */}
    //   <SwipeCard></SwipeCard>
    //   <button onClick={resetLists}>Reset</button>
    // </div>
  );
};

export default Finder;

const updateFields = (
  d: DocumentReference<DocumentData>,
  fs: [string, (x: any) => any][]
): Promise<void> =>
  getDoc(d)
    .then((snapshot) => fs.map(([f, _]) => snapshot.get(f)))
    .then((n) =>
      updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])))
    );
