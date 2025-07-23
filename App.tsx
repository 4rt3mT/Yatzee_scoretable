import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Player, Scores, ScoreCategory } from './types';
import { initialScores, UPPER_SECTION_BONUS_THRESHOLD, UPPER_SECTION_BONUS_VALUE, UPPER_SECTION_CATEGORIES, LOWER_SECTION_CATEGORIES, SCORE_CATEGORIES } from './constants';
import SetupScreen from './components/SetupScreen';
import GameBoard from './components/GameBoard';
import { DiceIcon, TrophyIcon } from './components/icons';

type GameState = 'setup' | 'playing' | 'finished';

const calculateUpperSum = (scores: Scores): number => {
    return UPPER_SECTION_CATEGORIES.reduce((acc, cat) => acc + (scores[cat] ?? 0), 0);
};

const calculateLowerSum = (scores: Scores): number => {
    return LOWER_SECTION_CATEGORIES.reduce((acc, cat) => acc + (scores[cat] ?? 0), 0);
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('setup');
    const [players, setPlayers] = useState<Player[]>([]);

    const playerCalculations = useMemo(() => {
        return players.map(player => {
            const upperSum = calculateUpperSum(player.scores);
            const bonus = upperSum >= UPPER_SECTION_BONUS_THRESHOLD ? UPPER_SECTION_BONUS_VALUE : 0;
            const upperTotal = upperSum + bonus;
            const lowerSum = calculateLowerSum(player.scores);
            const total = upperTotal + lowerSum;
            const isComplete = SCORE_CATEGORIES.every(cat => player.scores[cat.id] !== null);
            return { playerId: player.id, upperSum, bonus, upperTotal, lowerSum, total, isComplete };
        });
    }, [players]);

    const winnerInfo = useMemo(() => {
        if (gameState !== 'finished') return null;

        const completedPlayers = playerCalculations.filter(p => p.isComplete);
        if(completedPlayers.length === 0) return null;

        const maxScore = Math.max(...completedPlayers.map(p => p.total));
        const winners = players.filter(p => {
            const calcs = playerCalculations.find(pc => pc.playerId === p.id);
            return calcs?.total === maxScore;
        });

        return { winners, maxScore };
    }, [gameState, players, playerCalculations]);

    const handleStartGame = useCallback((playerNames: string[]) => {
        setPlayers(playerNames.map((name, index) => ({
            id: index,
            name: name.trim() || `Игрок ${index + 1}`,
            scores: { ...initialScores }
        })));
        setGameState('playing');
    }, []);

    const handleUpdateScore = useCallback((playerId: number, category: ScoreCategory, value: number | null) => {
        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.id === playerId) {
                const newScores = { ...player.scores, [category]: value };
                return { ...player, scores: newScores };
            }
            return player;
        }));
    }, []);

    const handleNewGame = useCallback(() => {
        setGameState('setup');
        setPlayers([]);
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && players.length > 0 && playerCalculations.every(p => p.isComplete)) {
            setGameState('finished');
        }
    }, [playerCalculations, players, gameState]);


    const renderContent = () => {
        switch (gameState) {
            case 'setup':
                return <SetupScreen onStartGame={handleStartGame} />;
            case 'playing':
            case 'finished':
                return (
                    <GameBoard
                        players={players}
                        playerCalculations={playerCalculations}
                        onUpdateScore={handleUpdateScore}
                        winnerIds={winnerInfo?.winners.map(w => w.id) ?? []}
                        isFinished={gameState === 'finished'}
                    />
                );
            default:
                return <SetupScreen onStartGame={handleStartGame} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <header className="w-full max-w-7xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <DiceIcon className="w-10 h-10 text-cyan-400" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Яцзы: Таблица очков
                    </h1>
                </div>
                {gameState !== 'setup' && (
                     <button
                        onClick={handleNewGame}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        Новая игра
                    </button>
                )}
            </header>
            
            <main className="w-full max-w-7xl flex-grow">
                 {winnerInfo && (
                    <div className="bg-slate-800/50 border border-cyan-400 backdrop-blur-sm rounded-xl p-4 mb-6 text-center shadow-lg">
                        <h2 className="text-2xl font-bold text-cyan-400 flex items-center justify-center gap-2">
                           <TrophyIcon className="w-8 h-8"/> Игра окончена!
                        </h2>
                        <p className="mt-2 text-lg">
                            {winnerInfo.winners.length > 1 ? 'Победители' : 'Победитель'}: <span className="font-bold text-white">{winnerInfo.winners.map(w => w.name).join(', ')}</span> с результатом <span className="font-bold text-white">{winnerInfo.maxScore}</span>!
                        </p>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default App;