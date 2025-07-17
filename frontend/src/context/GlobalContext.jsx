import React, { useState, createContext } from "react";

export const GlobalDataContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [data, setData] = useState({
        _id: '',
        regNo: '',
        name: '',
        department: '',
        year: '',
        last_login: 0,
        apti: 0,
        coding: 0,
        chat_durtion: 0
    });

    return (
        <GlobalDataContext.Provider value={{ data, setData }}>
            {children}
        </GlobalDataContext.Provider>
    );
};
