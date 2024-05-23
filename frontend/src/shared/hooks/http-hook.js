import { useState, useCallback, useEffect, useRef } from "react";


export const useHTTPClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHTTPRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);

        const HTTPAbortControl = new AbortController();
        activeHTTPRequests.current.push(HTTPAbortControl);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: HTTPAbortControl.signal
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            return responseData;
        }
        catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHTTPRequests.current.forEach(abortControl => abortControl.abort());
        }
    })
    
    return {isLoading, error, sendRequest, clearError};

};