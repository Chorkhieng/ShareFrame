import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Angkor Watt", 
        description: "One of the most complex ancient structures in the world.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/20171126_Angkor_Wat_4712_DxO.jpg/1024px-20171126_Angkor_Wat_4712_DxO.jpg",
        address: "Krong Siem Reap, Cambodia",
        location: {
            lat: 13.412474505050575, 
            lng: 103.866808669721
        },
        creator: 'u1'
    },
    {
        id: "p2",
        title: "Great Wall of China",
        description: "An ancient wall in China built to protect against invasions.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/1024px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
        address: "China",
        location: {
            lat: 40.4319,
            lng: 116.5704
        },
        creator: 'u1'
    },
    {
        id: "p3",
        title: "Machu Picchu",
        description: "An ancient Inca city located in the Andes mountains of Peru.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/1024px-Machu_Picchu%2C_Peru.jpg",
        address: "Peru",
        location: {
            lat: -13.1631,
            lng: -72.5450
        },
        creator: 'u1'
    },
    {
        id: "p4",
        title: "Taj Mahal",
        description: "A white marble mausoleum in India, built by Mughal Emperor Shah Jahan in memory of his wife.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1024px-Taj_Mahal_%28Edited%29.jpeg",
        address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
        location: {
            lat: 27.1751,
            lng: 78.0421
        },
        creator: 'u1'
    }
];

const UserPlaces = ()=>{
    const userId = useParams().userId; // userId is from (path="/:userId/places") in App.js
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId); // only render places for current user
    

    return <PlaceList items={loadedPlaces} />
}

export default UserPlaces;