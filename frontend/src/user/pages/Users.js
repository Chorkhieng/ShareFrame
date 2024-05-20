import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [{id: 'u001', name: 'Chork', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png', places: 2}];

    return <UsersList items={USERS} />;
};

export default Users;