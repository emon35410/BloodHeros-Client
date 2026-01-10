import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedSection from '../FeaturedSection/FeaturedSection';
import ContactUs from '../ContactUs/ContactUs';
import Collaborators from '../Collaborators.jsx/Collaborators';
import StatisticsSection from '../StatisticsSection/StatisticsSection';
import SuccessStories from '../SuccessStories/SuccessStories';
import HowItWorks from '../HowItWorks/HowItWorks';
import Newsletter from '../Newsletter/Newsletter';
import Benefits from '../Benefits/Benefits';
import FAQ from '../FAQ/FAQ';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedSection></FeaturedSection>
            <StatisticsSection></StatisticsSection>
            <Benefits></Benefits>
            <SuccessStories></SuccessStories>
            <HowItWorks></HowItWorks>
            <FAQ></FAQ>
            <Newsletter></Newsletter>
            <ContactUs></ContactUs>
            <Collaborators></Collaborators>
        </div>
    );
};

export default Home;