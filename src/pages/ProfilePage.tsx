import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import useTimeTracker from '../hooks/useTimeTracker';

export function ProfilePage() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const rawElapsedTime = useTimeTracker();

    useEffect(() => {
        setElapsedTime(rawElapsedTime);
    }, [rawElapsedTime]);

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));

    return (
        <>
            <Header />
            <Navigation activeTab="profile" onTabChange={() => {}} />
            <div>
                <h1>Profile Page</h1>
                <h2>Hours Played</h2>
                <p>{`${hours} hours and ${minutes} minutes`}</p>
            </div>
        </>
    );
}
