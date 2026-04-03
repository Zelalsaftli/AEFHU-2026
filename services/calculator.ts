import { CowParameters, Nutrients, RationItem, FeedIngredient } from '../types';

export const calculateRequirements = (params: CowParameters): Nutrients => {
  let me = 0;
  let cp = 0;
  let rdp = 0;
  let rup = 0;
  let ca = 0;
  let p = 0;

  const w075 = Math.pow(params.weight, 0.75);

  // 1. Maintenance (Feed 2026)
  // Base NEl maintenance is 0.10 Mcal/kg BW^0.75
  // Converting to ME: ME = NEl / 0.64 = 0.156
  let meMaintCoeff = 0.156; 

  // Breed Adjustment: Jersey cows have significantly higher basal metabolism
  if (params.breed === 'jersey') {
    meMaintCoeff *= 1.15; // +15% for Jerseys
  }

  // Environment adjustment for Maintenance (Feed 2026 Table 3-1)
  // Heat stress (THI > 68) increases maintenance by 7-25%
  if (params.environment === 'heat_mild') {
    meMaintCoeff *= 1.10; 
  } else if (params.environment === 'heat_severe') {
    meMaintCoeff *= 1.25; 
  } else if (params.environment === 'cold') {
    meMaintCoeff *= 1.15; 
  }

  let activityFactor = 1.0;
  if (params.grazing === 'flat') {
    activityFactor = 1.15; // +15% for grazing
  } else if (params.grazing === 'hilly') {
    activityFactor = 1.30; // +30% for hilly grazing
  }
  
  const meMaint = (meMaintCoeff * w075) * activityFactor;
  // CP Maintenance: ~4.8 g MP/kg BW^0.75. Converting MP to CP (approx / 0.67)
  const cpMaint = (7.2 * w075) * activityFactor; 
  
  const caMaint = 0.0154 * params.weight;
  const pMaint = 0.0125 * params.weight;

  me += meMaint;
  cp += cpMaint;
  ca += caMaint;
  p += pMaint;

  // 2. Milk Production (Feed 2026)
  // NEl (Mcal/kg) = 0.0929 * Fat% + 0.0547 * Protein% + 0.192 (assuming 4.85% lactose)
  const nelPerKgMilk = (0.0929 * params.fatPercentage) + (0.0547 * params.proteinPercentage) + 0.192;
  const mePerKgMilk = nelPerKgMilk / 0.64; 
  me += params.milkProduction * mePerKgMilk;
  
  // CP for Milk: ~95g CP per kg milk (assuming 3.2% protein and 67% efficiency)
  const cpPerKgMilk = (params.proteinPercentage * 10) / 0.33; // Approx 30g protein / 0.33 efficiency = 90g
  cp += params.milkProduction * cpPerKgMilk; 
  ca += params.milkProduction * 1.22;
  p += params.milkProduction * 0.9;

  // 3. Pregnancy (Feed 2026)
  // Requirements start increasing significantly after month 6
  if (params.pregnancyMonth > 6) {
    const daysPreg = (params.pregnancyMonth * 30);
    // Simplified Feed 2026 Pregnancy NEl: (0.00318 * days - 0.0352) * (birth_weight/45)
    // At 270 days: ~2.5 Mcal NEl/d = 3.9 Mcal ME/d
    const pregFactor = (params.pregnancyMonth - 6);
    me += 2.0 * pregFactor; 
    cp += 150 * pregFactor;
    ca += 12 * pregFactor;
    p += 8 * pregFactor;
  }

  // 4. Growth
  // Feed 2026 encourages adding growth requirements for Parity 1 & 2 even if user didn't specify rate
  let growthRateToUse = params.growthRate;
  if (growthRateToUse === 0) {
      if (params.lactationNumber === 1) growthRateToUse = 0.5; // Auto-add growth for 1st lactation
      if (params.lactationNumber === 2) growthRateToUse = 0.2; // Auto-add growth for 2nd lactation
  }

  if (growthRateToUse > 0) {
     me += 5 * growthRateToUse; 
     cp += 300 * growthRateToUse;
     ca += 25 * growthRateToUse;
     p += 15 * growthRateToUse;
  }

  // 5. Body Condition Change
  if (params.bcsChange > 0) {
      me += 6.0 * params.bcsChange; 
      cp += 60 * params.bcsChange; 
  } else if (params.bcsChange < 0) {
      me += 4.9 * params.bcsChange; 
  }

  // --- NASEM 2021 Dry Matter Intake (DMI) Calculation ---
  // Formula: DMI (kg/d) = (0.0115 * BW + 0.384 * ECM) * (1 - exp(-0.192 * (WIM + 3.67)))
  // First, calculate Energy Corrected Milk (ECM) - NASEM 2021
  // ECM = (0.3246 * Milk) + (12.86 * Fat_kg) + (7.04 * Protein_kg)
  
  const milkKg = params.milkProduction;
  const fatKg = milkKg * (params.fatPercentage / 100);
  const proteinKg = milkKg * (params.proteinPercentage / 100);
  
  const ecm = (0.3246 * milkKg) + (12.86 * fatKg) + (7.04 * proteinKg);
  
  // Weeks In Milk (WIM)
  const wim = params.daysInMilk / 7;

  // Base DMI (NASEM 2021)
  let predictedDmi = (0.0115 * params.weight) + (0.384 * ecm);
  
  // Dry Period Adjustment for DMI
  if (params.lactationStage === 'dry') {
      predictedDmi = params.weight * 0.02; // Approx 2% of BW for dry cows
  }

  // Parity Adjustment for DMI (NASEM 2021 often applies a factor for primiparous)
  if (params.lactationNumber === 1 && params.lactationStage !== 'dry') {
      predictedDmi = predictedDmi * 0.95; // 5% reduction for 1st lactation in some NASEM contexts
  }

  // Early Lactation Lag Adjustment (NASEM 2021)
  const lagFactor = 1 - Math.exp(-0.192 * (wim + 3.67));
  predictedDmi = predictedDmi * lagFactor;

  // Environmental Adjustment for DMI (Heat stress)
  if (params.environment === 'heat_mild') predictedDmi *= 0.92;
  if (params.environment === 'heat_severe') predictedDmi *= 0.85;

  const estimatedDMI = predictedDmi;

  // Guidelines (approximate):
  // Min NDF: 30% of DM
  // Min ADF: 21% of DM
  // Max Starch: 25-28% of DM
  // Sugar: ~5% (Guideline)
  
  const ndfReq = estimatedDMI * 1000 * 0.30; // in grams
  const adfReq = estimatedDMI * 1000 * 0.21; // in grams
  const starchMax = estimatedDMI * 1000 * 0.26; // in grams (Max limit)
  const sugarReq = estimatedDMI * 1000 * 0.05; // in grams (Rough target)

  // 6. Protein Fractions (RDP/RUP)
  // Standard: RDP is ~65% of CP, RUP is ~35%
  let rdpPercent = 0.65;
  let rupPercent = 0.35;

  if (params.lactationStage === 'early') {
      rupPercent = 0.42; // Higher RUP needed for peak
      rdpPercent = 0.58;
  } else if (params.lactationStage === 'dry') {
      rupPercent = 0.30; // Lower RUP needed
      rdpPercent = 0.70;
  }

  rdp = cp * rdpPercent;
  rup = cp * rupPercent;

  return {
    me: parseFloat(me.toFixed(2)),
    cp: Math.round(cp),
    rdp: Math.round(rdp),
    rup: Math.round(rup),
    ca: Math.round(ca),
    p: Math.round(p),
    ndf: Math.round(ndfReq),
    adf: Math.round(adfReq),
    starch: Math.round(starchMax), 
    sugar: Math.round(sugarReq),
    predictedDmi: parseFloat(estimatedDMI.toFixed(1))
  };
};

export const calculateSupplied = (
  concentrateMix: RationItem[], 
  concentrateAmountFed: number, 
  forages: RationItem[],
  feedDatabase: FeedIngredient[] 
): Nutrients & { 
    totalDM: number;
    concentrateAnalysis: Nutrients;
    rationStructure: { concentrateDM: number; forageDM: number; concentratePercent: number; foragePercent: number }
} => {
  
  let totalME = 0;
  let totalCP = 0;
  let totalRDP = 0;
  let totalRUP = 0;
  let totalCa = 0;
  let totalP = 0;
  let totalStarch = 0;
  let totalSugar = 0;
  let totalNDF = 0;
  let totalADF = 0;
  let totalDM = 0;

  let concentrateDM = 0;
  let forageDM = 0;

  // 1. Calculate Concentrate Mix Analysis (per 1kg of mix)
  const totalParts = concentrateMix.reduce((acc, item) => acc + item.amount, 0);
  
  let mixME = 0, mixCP = 0, mixRDP = 0, mixRUP = 0, mixCa = 0, mixP = 0, mixStarch = 0, mixSugar = 0, mixNDF = 0, mixADF = 0;

  if (totalParts > 0) {
    concentrateMix.forEach(item => {
        const feed = feedDatabase.find(f => f.id === item.ingredientId);
        if (feed) {
            const ratio = item.amount / totalParts; 
            const dmFactor = feed.dm / 100;
            const cpInMix = (feed.cp * 10 * dmFactor) * ratio;
            
            mixME += (feed.me * dmFactor) * ratio;
            mixCP += cpInMix;
            mixRDP += (cpInMix * (feed.rdp / 100));
            mixRUP += (cpInMix * (feed.rup / 100));
            mixCa += (feed.ca * 10 * dmFactor) * ratio;
            mixP += (feed.p * 10 * dmFactor) * ratio;
            mixStarch += (feed.starch * 10 * dmFactor) * ratio;
            mixSugar += (feed.sugar * 10 * dmFactor) * ratio;
            mixNDF += (feed.ndf * 10 * dmFactor) * ratio;
            mixADF += (feed.adf * 10 * dmFactor) * ratio;
        }
    });
  }

  const concAnalysis = { me: mixME, cp: mixCP, rdp: mixRDP, rup: mixRUP, ca: mixCa, p: mixP, starch: mixStarch, sugar: mixSugar, ndf: mixNDF, adf: mixADF };

  // 2. Add Concentrate Supplied to Total
  totalME += mixME * concentrateAmountFed;
  totalCP += mixCP * concentrateAmountFed;
  totalRDP += mixRDP * concentrateAmountFed;
  totalRUP += mixRUP * concentrateAmountFed;
  totalCa += mixCa * concentrateAmountFed;
  totalP += mixP * concentrateAmountFed;
  totalStarch += mixStarch * concentrateAmountFed;
  totalSugar += mixSugar * concentrateAmountFed;
  totalNDF += mixNDF * concentrateAmountFed;
  totalADF += mixADF * concentrateAmountFed;
  
  const mixDMRatio = concentrateMix.reduce((acc, item) => {
      const feed = feedDatabase.find(f => f.id === item.ingredientId);
      return acc + (feed ? (feed.dm / 100) * (item.amount/totalParts) : 0);
  }, 0);
  
  const concDMTotal = mixDMRatio * concentrateAmountFed;
  concentrateDM += concDMTotal;
  totalDM += concDMTotal;

  // 3. Add Forages
  forages.forEach(item => {
      const feed = feedDatabase.find(f => f.id === item.ingredientId);
      if (feed && item.amount > 0) {
          const dmFactor = feed.dm / 100;
          const kgDM = item.amount * dmFactor;
          const cpSupplied = feed.cp * 10 * kgDM;
          
          totalME += feed.me * kgDM;
          totalCP += cpSupplied;
          totalRDP += (cpSupplied * (feed.rdp / 100));
          totalRUP += (cpSupplied * (feed.rup / 100));
          totalCa += feed.ca * 10 * kgDM;
          totalP += feed.p * 10 * kgDM;
          
          // Add new nutrients
          totalStarch += feed.starch * 10 * kgDM;
          totalSugar += feed.sugar * 10 * kgDM;
          totalNDF += feed.ndf * 10 * kgDM;
          totalADF += feed.adf * 10 * kgDM;

          forageDM += kgDM;
          totalDM += kgDM;
      }
  });

  const concentratePercent = totalDM > 0 ? (concentrateDM / totalDM) * 100 : 0;
  const foragePercent = totalDM > 0 ? (forageDM / totalDM) * 100 : 0;

  return {
    me: parseFloat(totalME.toFixed(2)),
    cp: Math.round(totalCP),
    rdp: Math.round(totalRDP),
    rup: Math.round(totalRUP),
    ca: Math.round(totalCa),
    p: Math.round(totalP),
    starch: Math.round(totalStarch),
    sugar: Math.round(totalSugar),
    ndf: Math.round(totalNDF),
    adf: Math.round(totalADF),
    totalDM: parseFloat(totalDM.toFixed(2)),
    concentrateAnalysis: {
        me: parseFloat(mixME.toFixed(2)),
        cp: Math.round(mixCP),
        rdp: Math.round(mixRDP),
        rup: Math.round(mixRUP),
        ca: Math.round(mixCa),
        p: Math.round(mixP),
        starch: Math.round(mixStarch),
        sugar: Math.round(mixSugar),
        ndf: Math.round(mixNDF),
        adf: Math.round(mixADF)
    },
    rationStructure: {
        concentrateDM: parseFloat(concentrateDM.toFixed(2)),
        forageDM: parseFloat(forageDM.toFixed(2)),
        concentratePercent: parseFloat(concentratePercent.toFixed(1)),
        foragePercent: parseFloat(foragePercent.toFixed(1))
    }
  };
};