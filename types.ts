export interface CowParameters {
  weight: number; // kg
  milkProduction: number; // kg/day
  fatPercentage: number; // %
  proteinPercentage: number; // % (New: Required for Feed 2026 ECM)
  daysInMilk: number; // DIM (New: Required for Feed 2026 DMI)
  pregnancyMonth: number; // 0-9
  growthRate: number; // kg/day (heifers)
  bcsChange: number; // -1 to +1 (loss/gain)
  currentBcs: number; // 1-5 scale
  lactationStage: 'early' | 'mid' | 'late' | 'dry';
  environment: 'neutral' | 'heat_mild' | 'heat_severe' | 'cold';
  grazing: 'none' | 'flat' | 'hilly';
  lactationNumber: number; // 1 (First calf), 2, or 3+ (Mature)
  breed: 'holstein' | 'jersey' | 'other';
  groupSize: number; // Number of cows in the group
  // Advanced NASEM 2021 Factors
  lactosePercentage?: number; // Default 4.85%
  ambientTemperature?: number; // Celsius
  relativeHumidity?: number; // %
  walkingDistance?: number; // km/day
  ageAtFirstCalving?: number; // months
}

export interface Nutrients {
  me: number; // Metabolizable Energy (Mcal)
  cp: number; // Crude Protein (g)
  ca: number; // Calcium (g)
  p: number; // Phosphorus (g)
  mg: number; // Magnesium (g)
  rdp: number; // Rumen Degradable Protein (g)
  rup: number; // Rumen Undegradable Protein (g)
  lysine: number; // Metabolizable Lysine (g)
  methionine: number; // Metabolizable Methionine (g)
  na: number; // Sodium (g)
  k: number; // Potassium (g)
  cl: number; // Chlorine (g)
  s: number; // Sulfur (g)
  dcad: number; // mEq/kg DM
  starch: number; // % DM (displayed) or g (calculated)
  sugar: number; // % DM or g
  ndf: number; // Neutral Detergent Fiber (g)
  peNDF: number; // Physically Effective NDF (g)
  uNDF240: number; // Undigested NDF at 240h (g)
  adf: number; // Acid Detergent Fiber (g)
  predictedDmi?: number; // Feed 2026 Predicted Dry Matter Intake (kg)
  // Environmental Metrics (NASEM 2021)
  manureProduction?: number; // kg wet manure/day
  methaneProduction?: number; // g CH4/day
  nitrogenExcretion?: number; // g N/day
  phosphorusExcretion?: number; // g P/day
  // Trace Minerals (NASEM 2021)
  co?: number; // Cobalt (mg)
  cu?: number; // Copper (mg)
  i?: number; // Iodine (mg)
  fe?: number; // Iron (mg)
  mn?: number; // Manganese (mg)
  se?: number; // Selenium (mg)
  zn?: number; // Zinc (mg)
  // Vitamins (NASEM 2021)
  vitA?: number; // Vitamin A (kIU)
  vitD?: number; // Vitamin D (kIU)
  vitE?: number; // Vitamin E (IU)
}

export interface FeedIngredient {
  id: string;
  name: string;
  type: 'concentrate' | 'forage';
  dm: number; // Dry Matter %
  me: number; // Mcal/kg DM
  cp: number; // % DM
  rdp: number; // % of CP (Rumen Degradable Protein)
  rup: number; // % of CP (Rumen Undegradable Protein)
  lysine: number; // % of CP (Lysine content)
  methionine: number; // % of CP (Methionine content)
  ca: number; // % DM
  p: number; // % DM
  mg: number; // % DM
  na: number; // % DM
  k: number; // % DM
  cl: number; // % DM
  s: number; // % DM
  starch: number; // % DM
  sugar: number; // % DM
  ndf: number; // % DM
  peFactor: number; // Physical Effectiveness Factor (0-1)
  uNDF240: number; // % DM (Undigested NDF at 240h)
  adf: number; // % DM
  // Trace Minerals (mg/kg DM)
  co?: number;
  cu?: number;
  i?: number;
  fe?: number;
  mn?: number;
  se?: number;
  zn?: number;
  // Vitamins (kIU/kg DM or IU/kg DM for VitE)
  vitA?: number;
  vitD?: number;
  vitE?: number;
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
  HEALTH = 'HEALTH',
  ECONOMICS = 'ECONOMICS',
  ENVIRONMENT = 'ENVIRONMENT',
  MICRONUTRIENTS = 'MICRONUTRIENTS'
}
