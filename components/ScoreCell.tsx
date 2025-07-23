import React, { useState, useEffect, useRef } from 'react';
import { CategoryDetails } from '../types';

interface ScoreCellProps {
    score: number | null;
    onUpdateScore: (value: number | null) => void;
    category: CategoryDetails;
    isFinished: boolean;
}

const ScoreCell: React.FC<ScoreCellProps> = ({ score, onUpdateScore, category, isFinished }) => {
    // --- Логика для категорий с 'фиксированным' счетом ---
    if (category.type === 'fixed' && category.fixedValue !== undefined) {
        const fixedValue = category.fixedValue;
        const isFixedValueSelected = score === fixedValue;
        const isZeroSelected = score === 0 && score !== null;

        const handleFixedClick = (value: number) => {
            if (isFinished) return;
            // Если нажать на ту же кнопку снова, выбор отменяется (устанавливается null). Иначе, устанавливается новое значение.
            onUpdateScore(score === value ? null : value);
        };

        const baseButtonClass = "w-1/2 sm:w-auto flex-grow sm:flex-grow-0 text-xs font-bold py-1 px-2 rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

        const fixedValueButtonClass = `${baseButtonClass} ${
            isFixedValueSelected
            ? 'bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-400'
            : 'bg-cyan-700 hover:bg-cyan-600 text-cyan-100'
        }`;

        const zeroButtonClass = `${baseButtonClass} ${
            isZeroSelected
            ? 'bg-slate-500 text-slate-100 ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-400'
            : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
        }`;

        return (
            <div className="flex items-center justify-center gap-2 p-1 h-12 w-full">
                <button
                    onClick={() => handleFixedClick(fixedValue)}
                    disabled={isFinished}
                    className={fixedValueButtonClass}
                    aria-pressed={isFixedValueSelected}
                    aria-label={`Установить ${fixedValue} очков для ${category.label}`}
                >
                    {fixedValue}
                </button>
                <button
                    onClick={() => handleFixedClick(0)}
                    disabled={isFinished}
                    className={zeroButtonClass}
                    aria-pressed={isZeroSelected}
                    aria-label={`Установить 0 очков для ${category.label}`}
                >
                    0
                </button>
            </div>
        );
    }

    // --- Логика для 'изменяемых' категорий ---
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            setInputValue(score !== null ? String(score) : '');
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing, score]);

    const handleUpdate = (value: number | null) => {
        onUpdateScore(value);
        setIsEditing(false);
        setInputValue('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setInputValue('');
    };
    
    const handleVariableInputBlur = () => {
        const trimmedValue = inputValue.trim();
        
        if (trimmedValue === '') {
            // Пользователь очистил поле. Если был счет, устанавливаем null. Если нет, просто отменяем редактирование.
            if (score !== null) {
                handleUpdate(null);
            } else {
                handleCancel();
            }
            return;
        }

        const value = parseInt(trimmedValue, 10);
        if (!isNaN(value) && value >= 0) {
            handleUpdate(value);
        } else {
            // Неверный ввод (например, "abc"), отменяем.
            handleCancel();
        }
    };
    
    const handleVariableInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
         return (
            <div className="p-1 h-12 flex items-center justify-center">
                <input
                    ref={inputRef}
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleVariableInputBlur}
                    onKeyDown={handleVariableInputKeyDown}
                    className="w-full h-full text-center bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder={score !== null ? String(score) : "-"}
                    min="0"
                    aria-label={`Редактировать счет для ${category.label}`}
                />
            </div>
        );
    }
    
    // Отображение по умолчанию для изменяемых ячеек (не в режиме редактирования)
    const canEdit = !isFinished;
    const displayValue = score !== null ? score : '—';
    const className = `p-3 h-12 w-full flex items-center justify-center rounded-md ${score !== null ? 'font-semibold text-slate-200' : 'text-slate-500'} ${canEdit ? 'cursor-pointer hover:bg-slate-700/50' : 'cursor-default'}`;

    return (
        <div
            className={className}
            onClick={canEdit ? () => setIsEditing(true) : undefined}
            onKeyDown={canEdit ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsEditing(true) } : undefined}
            role={canEdit ? 'button' : undefined}
            tabIndex={canEdit ? 0 : -1}
            aria-label={score !== null ? `Текущий счет: ${score}. Нажмите, чтобы изменить.` : `Введите счет для категории ${category.label}.`}
        >
            {displayValue}
        </div>
    );
};

export default ScoreCell;