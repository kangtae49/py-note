import React, { useEffect, useState, createContext } from "react";

type PyContextType = {
    ready: boolean;
}

const PyContext = createContext<PyContextType>({ready: false});

interface Prop {
    children: React.ReactNode
}

export function PyProvider({children}: Prop) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        function onReady() {
            setReady(true);
            console.log("pywebview ready")
        }
        window.addEventListener("pywebviewready", onReady);

        return () => window.removeEventListener("pywebviewready", onReady)
    }, []);

    return (
        <PyContext.Provider value={{ready}}>
            {ready ? children : <div>Loading ...</div>}
        </PyContext.Provider>
    )
}


