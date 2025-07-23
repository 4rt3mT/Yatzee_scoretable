import React, { useState, useMemo } from 'react';
import { DiceIcon } from './icons';

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
}

const getPlayerText = (count: number) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['Игрок', 'Игрока', 'Игроков'];
    return `${count} ${titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]]}`;
};

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>(['']);

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
    setPlayerNames(currentNames => {
      const newNames = Array.from({ length: count }, (_, i) => currentNames[i] || '');
      return newNames;
    });
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayerNames(currentNames => {
      const newNames = [...currentNames];
      newNames[index] = name;
      return newNames;
    });
  };
  
  const canStart = useMemo(() => playerNames.every(name => name.trim() !== ''), [playerNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStart) {
      onStartGame(playerNames);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Настройка новой игры</h2>
            <p className="text-slate-400">Укажите игроков для начала.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="numPlayers" className="block text-sm font-medium text-slate-300 mb-2">
                    Сколько игроков?
                </label>
                <select
                    id="numPlayers"
                    value={numPlayers}
                    onChange={handleNumPlayersChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                >
                    {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{getPlayerText(i + 1)}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Имена игроков
                </label>
                <div className="space-y-3">
                    {Array.from({ length: numPlayers }).map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            value={playerNames[i] || ''}
                            onChange={(e) => handleNameChange(i, e.target.value)}
                            placeholder={`Имя игрока ${i + 1}`}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                            required
                        />
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={!canStart}
                className="w-full flex justify-center items-center gap-2 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
            >
                <DiceIcon className="w-5 h-5" />
                Начать игру
            </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;