import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

// Define types for user and chat data
export type userData = {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    email: string;
    lastSeen: number;
    username: string;
};

type chatData = {
    userData: userData;
    lastMessage: string;
    messageId: string;
    messageSeen: boolean;
    rid: string;
    updatedAt: number;
};

type chatUser = {
    userData: userData;
    lastMessage: string;
    messageId: string;
    messageSeen: boolean;
    rid: string;
    updatedAt: number;

}
type messages = {
    sid: string,
    text: string,
    createdAt: number
}

// Define props for the context provider
type AppContextProviderProps = {
    children: React.ReactNode;
};

// Define the shape of the context
type AppContextType = {
    userData: userData[];
    chatData: chatData[];
    chatUser: chatUser[];
    messages:messages[];
    messagesId: string;
    setUserData: React.Dispatch<React.SetStateAction<userData[]>>;
    setChatUser: React.Dispatch<React.SetStateAction<chatUser[]>>;
    setChatData: React.Dispatch<React.SetStateAction<chatData[]>>;
    setMessages: React.Dispatch<React.SetStateAction<messages[]>>;
    setMessagesId: React.Dispatch<React.SetStateAction<string>>;
    loadUserData: (uid: string) => Promise<void>;
};

// Initialize the context with an empty object instead of a function that returns an object
export const AppContext = createContext<AppContextType>(
    {
        userData: [], // Start with an empty array
        chatData: [], // Start with an empty array
        chatUser: [],
        messages: [],
        messagesId: "",
        setUserData: () => { }, // Dummy function
        setChatUser: () => { }, // Dummy function
        setChatData: () => { }, // Dummy function
        setMessages: () => { }, // Dummy function
        setMessagesId: () => { }, // Dummy function
        loadUserData: async () => { }, // Dummy function
    }
);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [userData, setUserData] = useState<userData[]>([]);
    const [chatData, setChatData] = useState<chatData[]>([]);
    const [messagesId, setMessagesId] = useState<string>("");
    const [messages, setMessages] = useState<messages[]>([]);
    const [chatUser, setChatUser] = useState<chatUser[]>([])

    const updateChatUser = (newUser: any) => {
        setChatUser(newUser);
    };

    const navigate = useNavigate();

    // Implement the loadUserData function
    const loadUserData = async (uid: string) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() as userData | undefined : undefined;

            if (userData) {
                setUserData([userData]);
                if (userData.avatar && userData.name) {
                    navigate('/chat');
                } else {
                    navigate('/profile');

                }
            } else {
                navigate('/profile')
            }
            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });

            // Update last seen every minute
            setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);


        } catch (error) {
           
            console.error(error as Error);
        }
    };

    useEffect(() => {
        if (userData.length > 0) {
            const chatRef = doc(db, "chats", userData[0].id);
            const unsubscribe = onSnapshot(chatRef, async (res) => {
                if (res.data()) {
                    const chatItems = res.data()?.chatData;
                    const tempData = [];
                    for (const item of chatItems) {
                        if (!item.rid) continue;
                        const userRef = doc(db, "users", item.rid);
                        const userSnap = await getDoc(userRef);
                        const userData = userSnap.data();
                        if (userData) {
                            tempData.push({ ...item, userData });
                        }
                    }
                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } else {
                    console.error("No data available");
                }
            });
            return () => {
                unsubscribe();
            };
        }
    }, [userData]);

    return (
        <AppContext.Provider value={{
            userData,
            setUserData,
            chatData,
            setChatData,
            loadUserData,
            messages,
            setMessages,
            messagesId,
            setMessagesId,
            chatUser,
            setChatUser: updateChatUser

        }}>
            {children}
        </AppContext.Provider>
    );
};