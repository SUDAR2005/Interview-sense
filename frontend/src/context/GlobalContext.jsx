import React, { useState, createContext } from "react";

export const GlobalDataContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [data, setData] = useState({
        _id: '',
        regno: '',
        name: '',
        department: '',
        year: '',
        last_logged_in: '',
        apti: '',
        coding: '',
        chat_durtion: ''
    });

    return (
        <GlobalDataContext.Provider value={{ data, setData }}>
            {children}
        </GlobalDataContext.Provider>
    );
};
