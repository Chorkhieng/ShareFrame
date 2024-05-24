import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHTTPClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PlaceList from '../components/PlaceList';


const UserPlaces = ()=>{
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHTTPClient();

    const userId = useParams().userId; // userId is from (path="/:userId/places") in App.js
    
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/places/user/${userId}`,

                );
                setLoadedPlaces(responseData.places);
            }
            catch (err) {}
            
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    const deletePlaceHandler = deletedPlaceId => {
        setLoadedPlaces(prePlace => prePlace.filter(place => place !== deletedPlaceId));
    }
    

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDelete={deletePlaceHandler}/>}
    </React.Fragment>;
}

export default UserPlaces;