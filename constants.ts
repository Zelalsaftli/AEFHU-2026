import { FeedIngredient } from './types';

// Simplified nutritional values based on standard averages (NRC/Feedipedia approximations)
// Added Starch, Sugar, NDF, ADF values (approximate % DM)
export const FEED_DATABASE: FeedIngredient[] = [
  // Concentrates
  { id: 'c_barley', name: 'شعير', type: 'concentrate', dm: 88, me: 2.9, cp: 11, rdp: 75, rup: 25, lysine: 3.5, methionine: 1.6, ca: 0.05, p: 0.38, na: 0.02, k: 0.5, cl: 0.1, s: 0.15, starch: 55, sugar: 2.5, ndf: 19, peFactor: 0.4, adf: 7, defaultPrice: 3000 },
  { id: 'c_corn', name: 'ذرة صفراء', type: 'concentrate', dm: 88, me: 3.1, cp: 9, rdp: 45, rup: 55, lysine: 2.8, methionine: 2.0, ca: 0.03, p: 0.30, na: 0.01, k: 0.4, cl: 0.05, s: 0.12, starch: 70, sugar: 1.5, ndf: 9, peFactor: 0.3, adf: 3, defaultPrice: 3500 },
  { id: 'c_wheat', name: 'قمح', type: 'concentrate', dm: 88, me: 3.0, cp: 13, rdp: 75, rup: 25, lysine: 3.0, methionine: 1.7, ca: 0.05, p: 0.40, na: 0.01, k: 0.4, cl: 0.07, s: 0.15, starch: 60, sugar: 2.5, ndf: 12, peFactor: 0.3, adf: 4, defaultPrice: 3200 },
  { id: 'c_bran', name: 'نخالة قمح', type: 'concentrate', dm: 88, me: 2.6, cp: 16, rdp: 70, rup: 30, lysine: 4.0, methionine: 1.5, ca: 0.14, p: 1.10, na: 0.02, k: 1.2, cl: 0.07, s: 0.2, starch: 20, sugar: 5, ndf: 40, peFactor: 0.4, adf: 12, defaultPrice: 2200 },
  { id: 'c_soy44', name: 'كسبة صويا 44%', type: 'concentrate', dm: 90, me: 2.8, cp: 44, rdp: 65, rup: 35, lysine: 6.3, methionine: 1.4, ca: 0.30, p: 0.65, na: 0.02, k: 2.0, cl: 0.05, s: 0.35, starch: 4, sugar: 7, ndf: 14, peFactor: 0.3, adf: 9, defaultPrice: 8500 },
  { id: 'c_cotton', name: 'كسبة قطن (غير مقشور)', type: 'concentrate', dm: 90, me: 2.4, cp: 24, rdp: 60, rup: 40, lysine: 4.0, methionine: 1.5, ca: 0.20, p: 0.60, na: 0.02, k: 1.2, cl: 0.05, s: 0.3, starch: 1, sugar: 3, ndf: 45, peFactor: 0.5, adf: 35, defaultPrice: 5500 },
  { id: 'c_beet', name: 'تفل شوندر جاف', type: 'concentrate', dm: 90, me: 2.6, cp: 9, rdp: 70, rup: 30, lysine: 4.5, methionine: 1.0, ca: 0.80, p: 0.10, na: 0.1, k: 0.5, cl: 0.2, s: 0.3, starch: 1, sugar: 6, ndf: 40, peFactor: 0.6, adf: 22, defaultPrice: 2800 },
  { id: 'c_salt', name: 'ملح طعام', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, ca: 0, p: 0, na: 39, k: 0, cl: 60, s: 0, starch: 0, sugar: 0, ndf: 0, peFactor: 0, adf: 0, defaultPrice: 500 },
  { id: 'c_limestone', name: 'حجر جيري', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, ca: 38, p: 0, na: 0.05, k: 0, cl: 0, s: 0, starch: 0, sugar: 0, ndf: 0, peFactor: 0, adf: 0, defaultPrice: 300 },
  { id: 'c_dcp', name: 'ديكالسيوم فوسفات', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, ca: 22, p: 19, na: 0.05, k: 0, cl: 0, s: 0, starch: 0, sugar: 0, ndf: 0, peFactor: 0, adf: 0, defaultPrice: 10000 },
  { id: 'c_vit', name: 'بريمكس فيتامين', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, ca: 0, p: 0, na: 0, k: 0, cl: 0, s: 0, starch: 0, sugar: 0, ndf: 0, peFactor: 0, adf: 0, defaultPrice: 35000 },
  { id: 'c_min', name: 'بريمكس معادن', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, ca: 0, p: 0, na: 0, k: 0, cl: 0, s: 0, starch: 0, sugar: 0, ndf: 0, peFactor: 0, adf: 0, defaultPrice: 25000 },

  // Forages
  { id: 'f_wstraw', name: 'قش قمح', type: 'forage', dm: 90, me: 1.6, cp: 3.5, rdp: 60, rup: 40, lysine: 3.0, methionine: 1.0, ca: 0.20, p: 0.10, na: 0.1, k: 1.0, cl: 0.3, s: 0.15, starch: 1, sugar: 1, ndf: 75, peFactor: 1.0, adf: 50, defaultPrice: 800 },
  { id: 'f_bstraw', name: 'قش شعير', type: 'forage', dm: 90, me: 1.7, cp: 4, rdp: 60, rup: 40, lysine: 3.0, methionine: 1.0, ca: 0.25, p: 0.10, na: 0.1, k: 1.2, cl: 0.4, s: 0.15, starch: 1, sugar: 1, ndf: 72, peFactor: 1.0, adf: 48, defaultPrice: 900 },
  { id: 'f_lstraw', name: 'قش بقولي', type: 'forage', dm: 90, me: 1.9, cp: 7, rdp: 70, rup: 30, lysine: 3.5, methionine: 1.2, ca: 1.0, p: 0.15, na: 0.1, k: 1.5, cl: 0.5, s: 0.2, starch: 1, sugar: 1, ndf: 60, peFactor: 0.95, adf: 45, defaultPrice: 1200 },
  { id: 'f_lhay', name: 'دريس بقولي (فصة)', type: 'forage', dm: 85, me: 2.3, cp: 18, rdp: 75, rup: 25, lysine: 4.5, methionine: 1.5, ca: 1.4, p: 0.25, na: 0.1, k: 2.5, cl: 0.5, s: 0.3, starch: 2, sugar: 4, ndf: 40, peFactor: 0.92, adf: 30, defaultPrice: 4500 },
  { id: 'f_ghay', name: 'دريس نجيلي', type: 'forage', dm: 85, me: 2.1, cp: 10, rdp: 75, rup: 25, lysine: 4.0, methionine: 1.5, ca: 0.5, p: 0.25, na: 0.1, k: 2.0, cl: 0.6, s: 0.2, starch: 2, sugar: 6, ndf: 65, peFactor: 0.95, adf: 35, defaultPrice: 3000 },
  { id: 'f_silage', name: 'سيلاج ذرة', type: 'forage', dm: 35, me: 2.6, cp: 8, rdp: 70, rup: 30, lysine: 3.0, methionine: 1.8, ca: 0.25, p: 0.20, na: 0.02, k: 1.0, cl: 0.2, s: 0.15, starch: 30, sugar: 1, ndf: 45, peFactor: 0.82, adf: 28, defaultPrice: 1200 },
];