import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import useTimeTracker from '../hooks/useTimeTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Trophy, Star, User, TrendingUp } from 'lucide-react';
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
            
            {/* Hero Section with Background */}
            <div className="relative">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl" />
                
                {/* Back Button */}
                <div className="relative container mx-auto px-4 pt-6">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBackClick}
                        className="glass-card border-primary/20 hover:bg-primary/10 smooth-transition mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Games
                    </Button>
                </div>

                {/* Profile Hero */}
                <div className="relative container mx-auto px-4 pb-12">
                    <div className="text-center mb-12 slide-up">
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center glow-primary bounce-in">
                                <User className="w-12 h-12 text-primary-foreground" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-4 border-background">
                                <Star className="w-4 h-4 text-accent-foreground" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gradient mb-4">Player Profile</h1>
                        <p className="text-xl text-muted-foreground">Your gaming journey at a glance</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Time Played Card */}
                        <div className="game-card glass-card p-8 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 smooth-transition">
                                    <Clock className="w-8 h-8 text-secondary-foreground" />
                                </div>
                                <TrendingUp className="w-6 h-6 text-accent opacity-60" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-foreground mb-2">Time Played</h2>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-gradient">
                                    {hours}h {minutes}m
                                </div>
                                <p className="text-muted-foreground">Total gaming time</p>
                            </div>
                            
                            {/* Progress Visual */}
                            <div className="mt-6 pt-6 border-t border-border/50">
                                <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                    <span>This week</span>
                                    <span>{Math.round(hours * 0.2)}h</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                        className="bg-gradient-secondary h-2 rounded-full smooth-transition"
                                        style={{ width: `${Math.min(hours * 2, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Games Played Card */}
                        <div className="game-card glass-card p-8 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center group-hover:scale-110 smooth-transition">
                                    <Trophy className="w-8 h-8 text-accent-foreground" />
                                </div>
                                <Star className="w-6 h-6 text-primary opacity-60" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-foreground mb-2">Games Played</h2>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-gradient">
                                    {totalGamesPlayed}
                                </div>
                                <p className="text-muted-foreground">Total games experienced</p>
                            </div>
                            
                            {/* Achievement Visual */}
                            <div className="mt-6 pt-6 border-t border-border/50">
                                <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                    <span>Collection</span>
                                    <span>{Math.round(totalGamesPlayed * 0.8)} played</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                        className="bg-gradient-accent h-2 rounded-full smooth-transition"
                                        style={{ width: `${Math.min(totalGamesPlayed * 10, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Section */}
                    <div className="mt-12 max-w-4xl mx-auto fade-in">
                        <h3 className="text-2xl font-bold text-center mb-8">Recent Achievements</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Star, name: "First Game", achieved: totalGamesPlayed > 0 },
                                { icon: Clock, name: "Hour Player", achieved: hours >= 1 },
                                { icon: Trophy, name: "Explorer", achieved: totalGamesPlayed >= 3 },
                                { icon: TrendingUp, name: "Dedicated", achieved: hours >= 5 }
                            ].map((achievement, index) => (
                                <div 
                                    key={achievement.name}
                                    className={`glass-card p-4 text-center smooth-transition hover:scale-105 ${
                                        achievement.achieved 
                                            ? 'border-accent/50 bg-accent/5' 
                                            : 'border-muted/30 opacity-50'
                                    }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                                        achievement.achieved 
                                            ? 'bg-gradient-accent' 
                                            : 'bg-muted'
                                    }`}>
                                        <achievement.icon className={`w-6 h-6 ${
                                            achievement.achieved 
                                                ? 'text-accent-foreground' 
                                                : 'text-muted-foreground'
                                        }`} />
                                    </div>
                                    <p className="text-sm font-medium">{achievement.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
