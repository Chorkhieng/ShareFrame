import React, { useEffect, useState } from 'react';
import { useHTTPClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PlaceList from '../components/PlaceList';


const AllPosts = ()=>{
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHTTPClient();
    
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/places/all`

                );
                setLoadedPlaces(responseData.posts);
            }
            catch (err) {}
            
        };
        fetchPlaces();
    }, [sendRequest]);

    const deletePlaceHandler = deletedPlaceId => {
        setLoadedPlaces(prePlace => prePlace.filter(place => place.id !== deletedPlaceId));
    }
    

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedPlaces && 
            <PlaceList 
                items={loadedPlaces} 
                onDeletePlace={deletePlaceHandler}
                show={false}
            />
        }
    </React.Fragment>;
}

export default AllPosts;