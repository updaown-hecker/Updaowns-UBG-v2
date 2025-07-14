import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import useTimeTracker from '../hooks/useTimeTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useFetchGameData } from '../hooks/useFetchGameData';

export function ProfilePage() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const rawElapsedTime = useTimeTracker();
    const { totalGamesPlayed } = useFetchGameData();
    
    useEffect(() => {
        setElapsedTime(rawElapsedTime);
    }, [rawElapsedTime]);
    
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor(((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)));

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };
    
    return (
        <>
            <Header />
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            <div className="container mx-auto px-4 py-8">
 <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
 
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Hours Played</h2>
                    <p className="text-lg">{`${hours} hours and ${minutes} minutes`}</p>
                </section>
                <hr className="my-8 border-gray-700" />

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Games Played</h2>
                    <p className="text-lg">{totalGamesPlayed}</p>
                </section>
            </div>
        </>
    );
}
