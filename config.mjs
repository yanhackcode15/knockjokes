import * as dotenv from 'dotenv' ;
dotenv.config();
import { initializeApp } from "firebase/app";
import {getFirestore, collection, query, getDocs, where, limit, getCountFromServer} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default async function getJoke() {
    const jokesCollection = collection(db, "jokes");
    const snapshot = await getCountFromServer(jokesCollection);
    const count = snapshot.data().count;
    const jokeId = randomizer(count)
    const q = query(jokesCollection, where("id", "==",jokeId ), limit(1))
    const querySnapshot = await getDocs(q);
    var id;
    var subject;
    var punchline;
    querySnapshot.forEach((doc) => {
       id = doc.data().id;
       subject = doc.data().subject;
       punchline = doc.data().punchline;
    });

    return {id, subject, punchline}
}


function randomizer(totalCount){
    return Math.ceil(Math.random()*totalCount);//an integer number from 1 to 10
}   





