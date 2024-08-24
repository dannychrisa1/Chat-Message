type ButtonTypeProps = {
    children: React.ReactNode
}

export const Button = ({children}:ButtonTypeProps) => {
    return(
        <button type="submit" className="p-[10px] bg-[#077eff] text-white
        text-[16px] border-0 rounded-[8px] cursor-pointer">
            {children}
        </button>
    )
}