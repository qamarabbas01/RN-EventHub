import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyV-tdFRkjcsCXy1RzDyNFP41ffAuJlbo",
  authDomain: "eventhub-8892e.firebaseapp.com",
  projectId: "eventhub-8892e",
  storageBucket: "eventhub-8892e.firebasestorage.app",
  messagingSenderId: "905705943783",
  appId: "1:905705943783:web:67b805878d8d04bfb2a842",
  measurementId: "G-VN08X8Z1M0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const attendees = [
  {
    name: "Ali Khan",
    email: "ali@example.com",
    eventsAttended: ["event1", "event2"],
    feedback: "Great!",
    satisfaction: 5,
    createdAt: serverTimestamp(),
  },
  {
    name: "Sara Ahmed",
    email: "sara@example.com",
    eventsAttended: ["event2"],
    feedback: "Good",
    satisfaction: 4,
    createdAt: serverTimestamp(),
  },
  {
    name: "John Doe",
    email: "john@example.com",
    eventsAttended: ["event1"],
    feedback: "Average",
    satisfaction: 3,
    createdAt: serverTimestamp(),
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    eventsAttended: ["event3", "event2"],
    feedback: "Excellent",
    satisfaction: 5,
    createdAt: serverTimestamp(),
  },
  {
    name: "Bilal Qureshi",
    email: "bilal@example.com",
    eventsAttended: ["event1", "event3", "event2"],
    feedback: "Good",
    satisfaction: 4,
    createdAt: serverTimestamp(),
  },
];

async function seedAttendees() {
  for (const attendee of attendees) {
    await addDoc(collection(db, "attendees"), attendee);
  }
  console.log("Sample attendees added.");
}

seedAttendees();
