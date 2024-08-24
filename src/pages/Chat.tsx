import { useContext, useEffect, useState } from "react"
import { ChatBox } from "../components/ChatBox"
import { LeftSideBar } from "../components/LeftSideBar"
import { RightSideBar } from "../components/RightSideBar"
import { AppContext } from "../context/AppContext"

export const Chat = () => {

    const { chatData, userData } = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=> {
        if(chatData && userData){
            setLoading(false)
        }
    },[chatData, userData])
    return (
        <div className="chat min-h-[100vh] bg-gradient-to-r from-custom-blue via-dark-blue to-custom-blue
        grid place-items-center">
            {
                loading ?
                    <p className="text-white text-[50px]">loading...</p> :
                    <div className="chat-container w-[95%] h-[75vh] bg-[aliceblue] max-w-[1000px]
                     grid grid-cols-[1fr_2fr_1fr]">
                        <LeftSideBar />
                        <ChatBox />
                        <RightSideBar />
                    </div>

            }

        </div>
    )
}