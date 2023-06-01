import './App.css';
import Card from './Card';
import { Link } from "react-router-dom";

const Finder = () => {
    return <div className="App">
        <Link to='/dashboard'>Dashboard</Link>
        <Card></Card>
    </div >
}

export default Finder;
