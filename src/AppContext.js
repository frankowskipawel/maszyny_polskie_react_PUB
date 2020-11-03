import React, {createContext, useState} from 'react';

export const AppContext = createContext();

const AppProvider = ({children}) => {
    const [userName, setUserName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [hostname] = useState('http://46.41.151.55:8000');

    const toggleUserNameState = (value) => setUserName(value);
    const toggleLoginState= (value) => setLogin(value);
    const togglePasswordState = (value) => setPassword(value);
    const toggleAdminState = (value) => setIsAdmin(value);
    const toggleLoggedState = (value) => setIsUserLogged(value);
    const toggleFirstNameState = (value) => setFirstName(value);
    const toggleLastNameState = (value) => setLastName(value);

    return (
        <AppContext.Provider value={{
            userName, toggleUserNameState,
            login, toggleLoginState,
            password, togglePasswordState,
            isUserLogged, toggleLoggedState,
            isAdmin, toggleAdminState,
            firstName, toggleFirstNameState,
            lastName, toggleLastNameState,
            hostname

        }}>
            {children}
        </AppContext.Provider>
    )

};

export default AppProvider;

