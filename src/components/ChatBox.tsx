import { useContext, useEffect, useState } from "react"
import assets from "../assets/assets"
import { AppContext } from "../context/AppContext"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { toast } from "react-toastify"

export const ChatBox = () => {

    const { chatUser, messagesId, setMessages, userData, messages } = useContext(AppContext)
    
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")

    const sendMessage = async () => {
        try {
            if (input && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sid: userData[0].id,
                        text: input,
                        createdAt: new Date()
                    })
                })
                const userIDs = [chatUser[0].rid, userData[0].id]
                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id)
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data()
                        const chatIndex = userChatData?.chatData.findIndex((c: any) => c.messageId === messagesId)
                        if (chatIndex !== undefined) {
                            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
                            userChatData.chatData[chatIndex].updatedAt = Date.now();
                            if (userChatData.chatData[chatIndex].rid === userData[0].id) {
                                userChatData.chatData[chatIndex].messageSeen = false;
                            }
                        }
                        await updateDoc(userChatsRef, {
                            chatData: userChatData.chatData
                        })
                    }
                })
            }

        } catch (error) {
            toast.error((error as Error).message)

        }
        setInput("")
      
    }

    useEffect(() => {
        // Assuming you want to do something when chatUser changes, like opening the chat box
        if (chatUser.length > 0) {
            setIsChatOpen(true);

        } else {
            setIsChatOpen(false);
        }
        // eslint-disable-next-line
    }, [chatUser]);

    useEffect(() => {
        if (Array.isArray(messagesId) && messagesId.length > 0) {
            const unsubscribe = messagesId.map(messageId =>
                onSnapshot(doc(db, 'messages', messageId), (res) => {
                    console.log('Snapshot received:', res); // Log the entire snapshot
                    if (res.exists()) {
                        const messageData = res.data();
                        if (messageData.messages) {
                            setMessages(prevMessages => [...prevMessages, ...messageData.messages]);
                            // setMessages(prevMessages => [...prevMessages, messageData.messages[messageData.messages.length - 1]]);
                        }else{
                            console.log('no data found in snapshot')
                        }
                    }
                })
            );

            // Cleanup function to unsubscribe from all snapshots
            return () => unsubscribe.forEach(unsub => unsub());
        }

    }, [messagesId, setMessages])

    if (!isChatOpen) {
        return (
            <div className="chatWelcome w-[100%] flex flex-col items-center justify-center
        gap-[5px] text-[#adadad]">
                <img src={assets.logo_icon} className="w-[60px]" alt='logoIcon' />
                <p className="text-[20px]">Chat Anytime, anywhere</p>
            </div>
        )
    }
    if (!chatUser || chatUser.length === 0) {
        return (
            <div className="chatWelcome w-[100%] flex flex-col items-center justify-center
        gap-[5px] text-[#adadad]">
                <img src={assets.logo_icon} className="w-[60px]" alt='logoIcon' />
                <p className="text-[20px]">Chat Anytime, anywhere</p>
            </div>
        )
    }
    return (
        <div className="ChatBox h-[75vh] relative bg-[#f1f5ff]">
            <div className="chatUser py-[10px] px-[15px] flex items-center gap-[10px] border-b border-[#c6c6c6]">
                <img src={chatUser[0].userData.avatar} className="w-[38px] aspect-square rounded-[50%]" alt="pro-img" />
                <p className="flex flex-[1] items-center gap-[5px] font-[500] text-[20px] text-[#393939]">{chatUser[0].userData.name}<img src={assets.green_dot} className="w-[15px]" alt="grendot" /></p>
                <img src={assets.help_icon} className="w-[25px]" alt="help" />
            </div>

            <div className="chatMessage h-chat-height pb-[50px] overflow-y-scroll
            flex flex-col-reverse">
                {messages.length > 0 && messages.map((msg, index) =>(
                    <div key={index} className="s-msg flex items-end justify-end gap-[5px] py-[0] px-[15px]">
                        <p className="msg rounded-SmsgBorderRadius text-white bg-[#077eff] p-[8px] max-w-[200px]
                     text-[11px] font-[300] mb-[30px]}">
                           {msg.text}
                        </p>
                        <div className="text-center text-[9px]">
                            <img src={msg.sid === userData[0].id ? userData[0].avatar : chatUser[0].userData.avatar} className="w-[27px] aspect-square rounded-[50px]" alt="proImg" />
                            <p>{msg.createdAt}</p>
                        </div>
                    </div>
                )) }


            </div>



            <div className="chatInput flex items-center gap-[12px] py-[10px] px-[15px]
            bg-white absolute bottom-0 left-0 right-0">
                <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="flex-[1] border-0 outline-0" placeholder="Send a message" />
                <input type="file" id="image" accept="image/png, image/jpeg" hidden className="" />
                <label htmlFor="image" className="flex">
                    <img src={assets.gallery_icon} className="w-[22px] cursor-pointer" alt="galleryIcon" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} className="w-[30px] cursor-pointer" alt="sendButton" />
            </div>
        </div>

    )
}