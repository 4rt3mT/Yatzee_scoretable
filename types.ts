
export interface Scores {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
}

export interface Player {
  id: number;
  name: string;
  scores: Scores;
}

export type ScoreCategory = keyof Scores;

export interface CategoryDetails {
    id: ScoreCategory;
    label: string;
    description?: string;
    type: 'variable' | 'fixed';
    fixedValue?: number;
    section: 'upper' | 'lower';
}

export interface PlayerCalculations {
    playerId: number;
    upperSum: number;
    bonus: number;
    upperTotal: number;
    lowerSum: number;
    total: number;
    isComplete: boolean;
}
