import React, { useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import PostItem from './PostItem';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth_context';

import './PostList.css';
import Profile from '../../shared/components/UIElements/Profile';

const PostList = props => {
    const auth = useContext(AuthContext);
    if (!props.items || props.items.length === 0) {
        
        return (<div className="place-list center">
            <Card>
                <h2> No post found, but you can create one.</h2>
                {auth.userId && <Button to="/posts/new">Create a Post</Button>}
            </Card>
        </div>);
    }

    const { authorImage, authorName} = props.items[0];

    // console.log("author img and name: ", authorImage, authorName);

    return (
        <React.Fragment>
            <Profile 
                image={authorImage}
                name={authorName}
                show={props.showProfile}
            />
            <ul className="place-list">
                {props.items.map(post => 
                    (<PostItem 
                        key={post.id} 
                        id={post.id} 
                        image={post.image} 
                        title={post.title} 
                        description={post.description} 
                        creatorId={post.creator} 
                        authorImage={post.authorImage}
                        authorName={post.authorName}
                        likeCount={post.likes.length}
                        likes={post.likes}
                        createdAt={post.createdAt}
                        onDelete={props.onDeletePost}
                    />))
                }
            </ul>
        </React.Fragment>);
};

export default PostList;