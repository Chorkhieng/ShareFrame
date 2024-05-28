import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null); // Add name state
    const [image, setImage] = useState(null); // Add image state

    const login = useCallback((uid, token, expirationDate, name, image) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 30 * 60 * 1000); // logout after 30 minutes
        setTokenExpirationDate(tokenExpirationDate);
        setName(name); // Set name
        setImage(image); // Set image
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString(),
                name: name,
                image: image
            })
        );
    }, []);
    

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        setName(null);
        setImage(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            const { userId, token, expiration, name, image } = storedData;
            login(userId, token, new Date(expiration), name, image);
        }
    }, [login]);

    return { token, login, logout, userId, name, image }; // Return name and image along with other properties
};
