import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedSection from '../FeaturedSection/FeaturedSection';
import ContactUs from '../ContactUs/ContactUs';
import Collaborators from '../Collaborators.jsx/Collaborators';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedSection></FeaturedSection>
            <ContactUs></ContactUs>
            <Collaborators></Collaborators>
        </div>
    );
};

export default Home;