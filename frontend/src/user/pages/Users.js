import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Chork',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pencil_drawing_of_a_girl_in_ecstasy.jpg/800px-Pencil_drawing_of_a_girl_in_ecstasy.jpg',
      places: 1
    },
    // {
    //   id: 'u2',
    //   name: 'Ny',
    //   image:
    //     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pencil_drawing_of_a_girl_in_ecstasy.jpg/800px-Pencil_drawing_of_a_girl_in_ecstasy.jpg',
    //   places: 1
    // }, 
    // {
    //   id: 'u3',
    //   name: 'Savung',
    //   image:
    //     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pencil_drawing_of_a_girl_in_ecstasy.jpg/800px-Pencil_drawing_of_a_girl_in_ecstasy.jpg',
    //   places: 1
    // },
    // {
    //   id: 'u4',
    //   name: 'Sophal',
    //   image:
    //     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pencil_drawing_of_a_girl_in_ecstasy.jpg/800px-Pencil_drawing_of_a_girl_in_ecstasy.jpg',
    //   places: 1
    // }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
