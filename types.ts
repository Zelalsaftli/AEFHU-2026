export interface CowParameters {
  weight: number; // kg
  milkProduction: number; // kg/day
  fatPercentage: number; // %
  proteinPercentage: number; // % (New: Required for AEFHU 2026 ECM)
  daysInMilk: number; // DIM (New: Required for AEFHU 2026 DMI)
  pregnancyMonth: number; // 0-9
  growthRate: number; // kg/day (heifers)
  bcsChange: number; // -1 to +1 (loss/gain)
  currentBcs: number; // 1-5 scale
  lactationStage: 'early' | 'mid' | 'late';
  environment: 'neutral' | 'heat_mild' | 'heat_severe' | 'cold';
  grazing: 'none' | 'flat' | 'hilly';
  // New Factors
  lactationNumber: number; // 1 (First calf), 2, or 3+ (Mature)
  breed: 'holstein' | 'jersey' | 'other';
  groupSize: number; // Number of cows in the group
}

export interface Nutrients {
  me: number; // Metabolizable Energy (Mcal)
  cp: number; // Crude Protein (g)
  ca: number; // Calcium (g)
  p: number; // Phosphorus (g)
  starch: number; // % DM (displayed) or g (calculated)
  sugar: number; // % DM or g
  ndf: number; // Neutral Detergent Fiber (g)
  adf: number; // Acid Detergent Fiber (g)
  predictedDmi?: number; // AEFHU 2026 Predicted Dry Matter Intake (kg)
}

export interface FeedIngredient {
  id: string;
  name: string;
  type: 'concentrate' | 'forage';
  dm: number; // Dry Matter %
  me: number; // Mcal/kg DM
  cp: number; // % DM
  ca: number; // % DM
  p: number; // % DM
  starch: number; // % DM
  sugar: number; // % DM
  ndf: number; // % DM
  adf: number; // % DM
  defaultPrice: number; // Price per kg
}

export interface RationItem {
  ingredientId: string;
  amount: number; // kg as fed
  isPercentage?: boolean; // For concentrate mix definition
}

export interface ConcentrateMix {
  ingredients: RationItem[];
  totalMixAmountFed: number; // kg fed to cow
}

export interface ForageRation {
  ingredients: RationItem[];
}

export enum Page {
  HOME = 'HOME',
  NEEDS = 'NEEDS',
  FEED = 'FEED',
  COMPARE = 'COMPARE',
  HEALTH = 'HEALTH'
}