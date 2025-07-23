import { Scores, CategoryDetails, ScoreCategory } from './types';

export const initialScores: Scores = {
  ones: null,
  twos: null,
  threes: null,
  fours: null,
  fives: null,
  sixes: null,
  threeOfAKind: null,
  fourOfAKind: null,
  fullHouse: null,
  smallStraight: null,
  largeStraight: null,
  yahtzee: null,
  chance: null,
};

export const UPPER_SECTION_BONUS_THRESHOLD = 63;
export const UPPER_SECTION_BONUS_VALUE = 35;

export const SCORE_CATEGORIES: CategoryDetails[] = [
    { id: 'ones', label: 'Единицы', description: 'Сумма всех 1', type: 'variable', section: 'upper' },
    { id: 'twos', label: 'Двойки', description: 'Сумма всех 2', type: 'variable', section: 'upper' },
    { id: 'threes', label: 'Тройки', description: 'Сумма всех 3', type: 'variable', section: 'upper' },
    { id: 'fours', label: 'Четверки', description: 'Сумма всех 4', type: 'variable', section: 'upper' },
    { id: 'fives', label: 'Пятерки', description: 'Сумма всех 5', type: 'variable', section: 'upper' },
    { id: 'sixes', label: 'Шестерки', description: 'Сумма всех 6', type: 'variable', section: 'upper' },
    { id: 'threeOfAKind', label: 'Сет', description: 'Сумма всех 5 костей', type: 'variable', section: 'lower' },
    { id: 'fourOfAKind', label: 'Каре', description: 'Сумма всех 5 костей', type: 'variable', section: 'lower' },
    { id: 'fullHouse', label: 'Фулл-хаус', description: '25 очков', type: 'fixed', fixedValue: 25, section: 'lower' },
    { id: 'smallStraight', label: 'Малый стрит', description: '30 очков', type: 'fixed', fixedValue: 30, section: 'lower' },
    { id: 'largeStraight', label: 'Большой стрит', description: '40 очков', type: 'fixed', fixedValue: 40, section: 'lower' },
    { id: 'yahtzee', label: 'Яцзы', description: '50 очков', type: 'fixed', fixedValue: 50, section: 'lower' },
    { id: 'chance', label: 'Шанс', description: 'Сумма всех 5 костей', type: 'variable', section: 'lower' },
];

export const UPPER_SECTION_CATEGORIES: ScoreCategory[] = SCORE_CATEGORIES
  .filter(c => c.section === 'upper').map(c => c.id);
  
export const LOWER_SECTION_CATEGORIES: ScoreCategory[] = SCORE_CATEGORIES
  .filter(c => c.section === 'lower').map(c => c.id);