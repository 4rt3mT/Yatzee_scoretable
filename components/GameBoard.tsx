import React from 'react';
import { Player, PlayerCalculations, ScoreCategory, CategoryDetails } from '../types';
import { SCORE_CATEGORIES, UPPER_SECTION_BONUS_VALUE } from '../constants';
import { TrophyIcon } from './icons';
import ScoreCell from './ScoreCell';

interface GameBoardProps {
    players: Player[];
    playerCalculations: PlayerCalculations[];
    onUpdateScore: (playerId: number, category: ScoreCategory, value: number | null) => void;
    winnerIds: number[];
    isFinished: boolean;
}

const CategoryRow: React.FC<{ category: CategoryDetails; players: Player[]; onUpdateScore: GameBoardProps['onUpdateScore']; isFinished: boolean }> = ({ category, players, onUpdateScore, isFinished }) => (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors duration-200">
        <td className="p-3 font-semibold text-slate-300 sticky left-0 bg-slate-800 z-10 w-40 min-w-[160px] max-w-[160px]">
            <div className="flex flex-col">
                <span>{category.label}</span>
                {category.description && <span className="text-xs font-normal text-slate-400">{category.description}</span>}
            </div>
        </td>
        {players.map(player => (
            <td key={player.id} className="p-1 sm:p-2 text-center align-middle">
                <ScoreCell
                    score={player.scores[category.id]}
                    onUpdateScore={(value) => onUpdateScore(player.id, category.id, value)}
                    category={category}
                    isFinished={isFinished}
                />
            </td>
        ))}
    </tr>
);

const CalculationRow: React.FC<{ label: string; values: (number | string)[]; isBold?: boolean; highlight?: boolean }> = ({ label, values, isBold, highlight }) => (
    <tr className={`border-b border-slate-700 ${highlight ? 'bg-cyan-900/30' : 'bg-slate-800'}`}>
        <td className={`p-3 sticky left-0 z-10 w-40 min-w-[160px] max-w-[160px] ${isBold ? 'font-bold' : 'font-semibold'} ${highlight ? 'bg-cyan-900/30 text-cyan-300' : 'bg-slate-800 text-slate-300'}`}>
            {label}
        </td>
        {values.map((value, index) => (
            <td key={index} className={`p-3 text-center ${isBold ? 'font-bold' : ''} ${highlight ? 'text-cyan-200' : ''}`}>
                {value}
            </td>
        ))}
    </tr>
);

const GameBoard: React.FC<GameBoardProps> = ({ players, playerCalculations, onUpdateScore, winnerIds, isFinished }) => {
    const upperSectionCategories = SCORE_CATEGORIES.filter(c => c.section === 'upper');
    const lowerSectionCategories = SCORE_CATEGORIES.filter(c => c.section === 'lower');

    return (
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm sm:text-base">
                    <thead className="bg-slate-900/70">
                        <tr className="border-b-2 border-slate-600">
                            <th className="p-3 text-left font-bold text-white sticky left-0 z-20 bg-slate-900/70 w-40 min-w-[160px] max-w-[160px]">Категория</th>
                            {players.map(player => (
                                <th key={player.id} className={`p-3 font-bold text-white transition-all duration-300 whitespace-nowrap ${winnerIds.includes(player.id) ? 'text-cyan-300' : ''}`}>
                                    <div className="flex items-center justify-center gap-2">
                                        {player.name}
                                        {winnerIds.includes(player.id) && <TrophyIcon className="w-5 h-5 text-yellow-400" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Upper Section */}
                        {upperSectionCategories.map(cat => <CategoryRow key={cat.id} category={cat} players={players} onUpdateScore={onUpdateScore} isFinished={isFinished} />)}
                        <CalculationRow label="Сумма верха" values={playerCalculations.map(p => p.upperSum)} />
                        <CalculationRow label={`Бонус (+${UPPER_SECTION_BONUS_VALUE})`} values={playerCalculations.map(p => p.bonus > 0 ? p.bonus : '—')} />
                        <CalculationRow label="Итог верха" values={playerCalculations.map(p => p.upperTotal)} isBold={true} />
                        
                        {/* Spacer Row */}
                        <tr className="h-4 bg-slate-900/50"><td colSpan={players.length + 1}></td></tr>

                        {/* Lower Section */}
                        {lowerSectionCategories.map(cat => <CategoryRow key={cat.id} category={cat} players={players} onUpdateScore={onUpdateScore} isFinished={isFinished} />)}
                        <CalculationRow label="Итог низа" values={playerCalculations.map(p => p.lowerSum)} isBold={true} />

                        {/* Grand Total */}
                         <CalculationRow label="ОБЩИЙ ИТОГ" values={playerCalculations.map(p => p.total)} isBold={true} highlight={true} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameBoard;