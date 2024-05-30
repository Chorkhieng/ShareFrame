import React, { useEffect, useState } from 'react';
import { useHTTPClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PostList from '../components/PostList';


const AllPosts = () =>{
    const [loadedPosts, setLoadedPosts] = useState();
    const {isLoading, error, sendRequest, clearError} = useHTTPClient();
    const [hasRefreshed, setHasRefreshed] = useState(false); // Flag to track if data has been refreshed
    
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/posts/all`

                );
                setLoadedPosts(responseData.posts);
                setHasRefreshed(true);
            }
            catch (err) {}
            
        };
        fetchAllPosts();

        // Fetch data only if it hasn't been refreshed yet
        if (!hasRefreshed) {
            fetchAllPosts();
        }
    }, [sendRequest, hasRefreshed]);
    

    const deletePostHandler = deletedPostId => {
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
                onDeletePost={deletePostHandler}
                show={false}
            />
        }
    </React.Fragment>;
}

export default AllPosts;