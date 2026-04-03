import { FeedIngredient } from './types';

// Simplified nutritional values based on standard averages (NRC/Feedipedia approximations)
// Added Starch, Sugar, NDF, ADF values (approximate % DM)
export const FEED_DATABASE: FeedIngredient[] = [
  // Concentrates
  { id: 'c_barley', name: 'شعير', type: 'concentrate', dm: 88, me: 2.9, cp: 11, rdp: 75, rup: 25, ca: 0.05, p: 0.38, starch: 55, sugar: 2.5, ndf: 19, adf: 7, defaultPrice: 1.2 },
  { id: 'c_corn', name: 'ذرة صفراء', type: 'concentrate', dm: 88, me: 3.1, cp: 9, rdp: 45, rup: 55, ca: 0.03, p: 0.30, starch: 70, sugar: 1.5, ndf: 9, adf: 3, defaultPrice: 1.5 },
  { id: 'c_wheat', name: 'قمح', type: 'concentrate', dm: 88, me: 3.0, cp: 13, rdp: 75, rup: 25, ca: 0.05, p: 0.40, starch: 60, sugar: 2.5, ndf: 12, adf: 4, defaultPrice: 1.4 },
  { id: 'c_bran', name: 'نخالة قمح', type: 'concentrate', dm: 88, me: 2.6, cp: 16, rdp: 70, rup: 30, ca: 0.14, p: 1.10, starch: 20, sugar: 5, ndf: 40, adf: 12, defaultPrice: 0.9 },
  { id: 'c_soy44', name: 'كسبة صويا 44%', type: 'concentrate', dm: 90, me: 2.8, cp: 44, rdp: 65, rup: 35, ca: 0.30, p: 0.65, starch: 4, sugar: 7, ndf: 14, adf: 9, defaultPrice: 3.5 },
  { id: 'c_cotton', name: 'كسبة قطن (غير مقشور)', type: 'concentrate', dm: 90, me: 2.4, cp: 24, rdp: 60, rup: 40, ca: 0.20, p: 0.60, starch: 1, sugar: 3, ndf: 45, adf: 35, defaultPrice: 2.2 },
  { id: 'c_beet', name: 'تفل شوندر جاف', type: 'concentrate', dm: 90, me: 2.6, cp: 9, rdp: 70, rup: 30, ca: 0.80, p: 0.10, starch: 1, sugar: 6, ndf: 40, adf: 22, defaultPrice: 1.1 },
  { id: 'c_salt', name: 'ملح طعام', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 0.2 },
  { id: 'c_limestone', name: 'حجر جيري', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, ca: 38, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 0.1 },
  { id: 'c_dcp', name: 'ديكالسيوم فوسفات', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, ca: 22, p: 19, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 4.0 },
  { id: 'c_vit', name: 'بريمكس فيتامين', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 15.0 },
  { id: 'c_min', name: 'بريمكس معادن', type: 'concentrate', dm: 100, me: 0, cp: 0, rdp: 0, rup: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 10.0 },

  // Forages
  { id: 'f_wstraw', name: 'قش قمح', type: 'forage', dm: 90, me: 1.6, cp: 3.5, rdp: 60, rup: 40, ca: 0.20, p: 0.10, starch: 1, sugar: 1, ndf: 75, adf: 50, defaultPrice: 0.3 },
  { id: 'f_bstraw', name: 'قش شعير', type: 'forage', dm: 90, me: 1.7, cp: 4, rdp: 60, rup: 40, ca: 0.25, p: 0.10, starch: 1, sugar: 1, ndf: 72, adf: 48, defaultPrice: 0.35 },
  { id: 'f_lstraw', name: 'قش بقولي', type: 'forage', dm: 90, me: 1.9, cp: 7, rdp: 70, rup: 30, ca: 1.0, p: 0.15, starch: 1, sugar: 1, ndf: 60, adf: 45, defaultPrice: 0.5 },
  { id: 'f_lhay', name: 'دريس بقولي (فصة)', type: 'forage', dm: 85, me: 2.3, cp: 18, rdp: 75, rup: 25, ca: 1.4, p: 0.25, starch: 2, sugar: 4, ndf: 40, adf: 30, defaultPrice: 1.8 },
  { id: 'f_ghay', name: 'دريس نجيلي', type: 'forage', dm: 85, me: 2.1, cp: 10, rdp: 75, rup: 25, ca: 0.5, p: 0.25, starch: 2, sugar: 6, ndf: 65, adf: 35, defaultPrice: 1.2 },
  { id: 'f_silage', name: 'سيلاج ذرة', type: 'forage', dm: 35, me: 2.6, cp: 8, rdp: 70, rup: 30, ca: 0.25, p: 0.20, starch: 30, sugar: 1, ndf: 45, adf: 28, defaultPrice: 0.45 },
];