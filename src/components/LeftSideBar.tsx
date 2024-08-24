import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"
import { arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../config/firebase"
import { useCallback, useContext, useState } from "react"
import { AppContext } from "../context/AppContext"

import { toast } from "react-toastify"

export const LeftSideBar = () => {

    const navigate = useNavigate()
    const { userData, chatData, setChatData, setChatUser, setMessagesId } = useContext(AppContext)
    const [user, setUser] = useState<DocumentData | null>(null)

    const [showSearch, setShowSearch] = useState<boolean>(false)

    // New getUserData method
    const getUserData = async (userId: string): Promise<DocumentData | null> => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.error(`User document not found for ID: ${userId}`);
            return null;
        }
    };


    const inputHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const input = event.target.value
            if (input) {
                setShowSearch(true)
                const userRef = collection(db, "users")
                const q = query(userRef, where("username", "==", input.toLocaleLowerCase()))
                const querySnap = await getDocs(q)
                let foundUser = false
                if (!querySnap.empty && querySnap.docs[0].data().id !== userData[0].id) {
                    chatData.forEach((user) => {
                        if (user.rid === querySnap.docs[0].data().id) {
                            foundUser = true
                        }
                    })
                    if (!foundUser) {
                        setUser(querySnap.docs[0].data())
                    }

                } else {
                    setUser(null)
                }
            } else {
                setShowSearch(false)
            }

        } catch (error) {
            console.error(error as Error)
        }
    }


    const addChat = useCallback(async (userId: string, otherUserId: string) => {
        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");

        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            // Fetch user data for both users involved in the chat
            const user1Data = await getUserData(userId); // Assume this function exists
            const user2Data = await getUserData(otherUserId); // Assume this function exists

            await updateDoc(doc(chatsRef, userId), {
                chatData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rid: otherUserId,
                    updatedAt: Date.now(),
                    messageSeen: true,
                    userData: user2Data, // Include user data here
                }),
            });

            await updateDoc(doc(chatsRef, otherUserId), {
                chatData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rid: userId,
                    updatedAt: Date.now(),
                    messageSeen: true,
                    userData: user1Data, // Include user data here
                }),
            });
            setChatData(chatData);
        } catch (error) {
            toast.error((error as Error).message);
            console.error(error);
        }
        // eslint-disable-next-line
    }, []);





    // useEffect(() => {
    //     if (user) {
    
    //         addChat(userData[0].id, user?.id)

    //     }
    // }, [user, userData, addChat]);


    // useEffect(() => {
    //     // Log chatData whenever it changes to ensure it's updated
    // console.log(chatData);
    // }, [chatData]); // Dependency array ensures this effect runs when chatData changes

    const setChat = async (item: any) => {
        setMessagesId(item.messageId)
        // console.log(item);
        setChatUser([item])
    }
    return (
        <div className="leftSideBar bg-[#001030] text-white h-[75vh]">
            <div className="lsTop p-[20px]">
                <div className="lsNav flex justify-between items-center">
                    <img src={assets.logo2small} className="max-w-[140px] h-{26px}" alt="logo" />
                    <div className="menu  relative py-[10px] px-[0px]">
                        <img src={assets.menu_icon} className="max-h-[20px] opacity-[0.6] cursor-pointer
                        " alt="menu" />
                        <div className="sub-menu hidden bg-white text-black w-[130px] p-[20px] rounded-[5px] absolute 
                        top-[100%] right-[0]">
                            <p
                                onClick={() => navigate('/profile')}
                                className="cursor-pointer text-[14px]">Edit Profile</p>
                            <hr className="border-0 h-[1px] bg-[#a4a4a4] my-[8px] mx-[0px]" />
                            <p className="cursor-pointer text-[14px]">Logout</p>
                        </div>
                    </div>
                </div>
                <div className="lsSearch bg-[#002670] flex items-center gap-[10px]
                py-[10px] px-[12px] mt-[20px]">
                    <img src={assets.search_icon} className="w-[16px]" alt="seRchIcon" />
                    <input
                        onChange={inputHandler}
                        type="text" className="bg-[transparent] border-0 outline-0
                    text-white text-[11px] placeholder:text-[#c8c8c8]" placeholder="Search here.." />
                </div>
            </div>
            <div className="lsList flex flex-col h-[70%] overflow-y-scroll">

                {showSearch && user ?
                    <div
                        onClick={() => addChat(userData[0].id, user.id)}
                        className="friends addUser  hover:bg-[#077eff] flex items-center gap-[10px] py-[10px] px-[20px]
                         cursor-pointer text-[13px]">
                        <img src={user.avatar} className="w-[35px] aspect-square
                             rounded-[50%]" alt="avatar" />
                        <p>{user.name}</p>

                    </div> :

                    chatData.length > 0 && chatData.map((item, index) => (
                        <div onClick={() => setChat(item)} key={index} className="friends hover:bg-[#077eff] flex items-center gap-[10px] py-[10px] px-[20px]
                         cursor-pointer text-[13px]">
                            {item.userData && item.userData.avatar ? (
                                <img src={item.userData.avatar} className="w-[35px] aspect-square
                               rounded-[50%]" alt="profileimg" />
                            ) : (
                                <span>No Avatar Available</span>
                            )}


                            <div className="flex flex-col">
                                <p>{item.userData.name || "unknown user"}</p>
                                <span className="text-[#9F9F9F] text-[11px]">{item.lastMessage || "No message yet"}</span>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}