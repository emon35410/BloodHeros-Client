import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase.init';
import Loading from '../../Components/Loading/Loading';
import { AuthContext } from './AuthContext';


const AuthProvider = ({children}) => {
     const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)


    // Sign In with email password
    const registerUser =(email,password)=>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email,password)
    }
    const signInUser =(email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }
 
    // Log Out 
    const logOut =()=>{
        setLoading(true)
        return signOut(auth)
    }
    // update Profile
    const updateUserProfile = (profileInfo) => {
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, profileInfo);
        }
        return Promise.reject("No user is currently logged in");
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unsubscribe()
        }
    }, [])
    const authInfo = {
        user,
        loading,
        setUser,
        setLoading,
        registerUser,
        signInUser,
        logOut,
        updateUserProfile
    }
      if (loading) {
        
        return <Loading></Loading>;
    }
    return (
        <AuthContext.Provider value={authInfo}>
           {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;