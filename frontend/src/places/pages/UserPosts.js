import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHTTPClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PostList from '../components/PostList';


const UserPosts = ()=>{
    const [loadedPosts, setLoadedPosts] = useState();
    const {isLoading, error, sendRequest, clearError} = useHTTPClient();

    const userId = useParams().userId; // userId is from (path="/:userId/posts") in App.js
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/posts/user/${userId}`,

                );
                setLoadedPosts(responseData.posts);
            }
            catch (err) {}
            
        };
        fetchPosts();
    }, [sendRequest, userId]);

    const deletePlaceHandler = deletedPostId => {
        setLoadedPosts(prePost => prePost.filter(post => post.id !== deletedPostId));
    }
    

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedPosts && 
            <PostList 
                items={loadedPosts}
                onDeletePlace={deletePlaceHandler}
                showProfile={true}
            />
        }
    </React.Fragment>;
}

export default UserPosts;