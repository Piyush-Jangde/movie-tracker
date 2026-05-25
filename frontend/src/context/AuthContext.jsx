import { createContext, useState } from "react";

export const AuthContext=createContext();

function AuthProvider ({children}) {
    const [user,setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    function login(userData,token) {
        //When user login, save the token and user in chrome local storage for later auth
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(userData));

        //set user state
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    }

    return (
        <AuthContext.Provider
        value={
            {
                user,
                login,
                logout,
            }
        }
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;