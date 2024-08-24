
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyB09OopDS3y6LrfdtNAGOdBGB9OTEPJr3k",
    authDomain: "chat-app-2e2e2.firebaseapp.com",
    projectId: "chat-app-2e2e2",
    storageBucket: "chat-app-2e2e2.appspot.com",
    messagingSenderId: "1039950478857",
    appId: "1:1039950478857:web:cb4b84b7de88a472d202d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

//Sign Up Starts here

const signUp = async (username: string, email: string, password: string) => {
    try {
        //create new user
        const res = await createUserWithEmailAndPassword(auth, email, password)
        //after user creation
        const user = res.user
        //store new user and create collection name
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email: email,
            name: "",
            avatar: "",
            bio: "Hey, there i am using chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatData: []
        })
    } catch (error) {
        console.error(error as Error)
        toast.error((error as Error).message.split('/')[1].split('-').join(" "))
    }
}

//SignUp ends here

const login = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {
        console.error(error as Error);
        toast.error((error as Error).message.split('/')[1].split('-').join(" "))
    }
}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error as Error);
        toast.error((error as Error).message.split('/')[1].split('-').join(" "))
    }

}

export { signUp, login, logout, auth, db }