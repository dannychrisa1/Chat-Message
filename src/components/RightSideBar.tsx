import { useContext } from "react"
import assets from "../assets/assets"
import { logout } from "../config/firebase"
import { AppContext } from "../context/AppContext"

export const RightSideBar = () => {
    const { userData } = useContext(AppContext)
    return(
        <div className="RightSideBar text-white bg-[#001030] relative h-[75vh]
        overflow-y-scroll">
            <div className="rsprofile pt-[60px] text-center max-w-[70%] flex flex-col items-center m-[auto]">
                <img src={userData[0]?.avatar} className="w-[110px] aspect-square rounded-[50%]" alt="profImg" />
                <h3 className="font-[400] text-[18px] flex items-center justify-center gap-[5px]
                my-[5px] mx-[0px]">{userData[0]?.name} <img src={assets.green_dot} alt="greendot" /></h3>
                <p  className="text-[10px] opacity-[80%] font-[300]">Hey! I am  using chat app</p>
            </div>
            <hr className="border-[#ffffff50] my-[15px] mx-[0px]" />
            <div className="rsMedia py-[0px] px-[20px] text-[13px]">
                <p>Media</p>
                <div className="max-h-[180px] overflow-y-scroll grid grid-cols-[1fr_1fr_1fr]
                gap-[5px] mt-[8px]">
                    <img src={assets.pic1} className="w-[60px] cursor-pointer" alt="" />
                    <img src={assets.pic2}  className="w-[60px] cursor-pointer" alt="" />
                    <img src={assets.pic3}  className="w-[60px] cursor-pointer" alt="" />
                    <img src={assets.pic4}  className="w-[60px] cursor-pointer" alt="" />
                    <img src={assets.pic1}  className="w-[60px] cursor-pointer" alt="" />
                    <img src={assets.pic2}  className="w-[60px] cursor-pointer" alt="" />
                </div>
            </div>
            <button
            onClick={() => logout()}
             className="absolute bottom-[20px] left-[50%] -translate-x-[50%]
            bg-[#077eff] text-white border-0 text-[12px] font-[500] py-[10px] px-[65px] rounded-[20px]
            cursor-pointer">Logout</button>
        </div>
    )
}