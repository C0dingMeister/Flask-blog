import React, { createContext, useContext, useState } from "react";
export const FlashContext = createContext()
let flashTimer;
export default function FlashProvider({ children }) {
    const [flashMessage, setFlashMessage] = useState({});
    const [visible, setvisible] = useState(false);
    const flash = (message,type, duration = 5)=>{
        if (flashTimer){
            clearTimeout(flashTimer);
            flashTimer= undefined;
        }
        setFlashMessage({message,type});
        setvisible(true)
        if (duration){
            flashTimer = setTimeout(hideFlash,duration*1000);
        }
    }
    const hideFlash = ()=>{
        setvisible(false)
    }
    return(
        <FlashContext.Provider value={{flash, flashMessage, hideFlash,visible}}>
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash() {
    return useContext(FlashContext).flash;
}