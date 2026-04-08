import { CowParameters, Nutrients, RationItem, FeedIngredient } from '../types';

export const calculateRequirements = (params: CowParameters): Nutrients => {
  let me = 0;
  let cp = 0;
  let rdp = 0;
  let rup = 0;
  let lysine = 0;
  let methionine = 0;
  let na = 0;
  let k = 0;
  let cl = 0;
  let s = 0;
  let dcad = 0;
  let peNDF = 0;
  let ca = 0;
  let p = 0;

  const w075 = Math.pow(params.weight, 0.75);

  // --- NASEM 2021 Dry Matter Intake (DMI) Calculation ---
  // Formula: DMI (kg/d) = (3.7 + 5.7 * (Parity - 1) + 0.305 * NEmilk + 0.022 * BW + (-0.689 - 1.87 * (Parity - 1)) * BCS) * LagFactor
  // First, calculate Energy Corrected Milk (ECM) - NASEM 2021
  // ECM = (0.3246 * Milk) + (12.86 * Fat_kg) + (7.04 * Protein_kg)
  const milkKg = params.milkProduction;
  const fatKg = milkKg * (params.fatPercentage / 100);
  const proteinKg = milkKg * (params.proteinPercentage / 100);
  const ecm = (0.3246 * milkKg) + (12.86 * fatKg) + (7.04 * proteinKg);

  // NEmilk_Milk (Mcal/kg) = 9.29 * Fat% + 5.85 * Protein% + 3.95 * Lactose% (assuming 4.85%)
  const neMilkPerKg = (9.29 * (params.fatPercentage / 100)) + (5.85 * (params.proteinPercentage / 100)) + (3.95 * 0.0485);
  const totalNEmilk = milkKg * neMilkPerKg;

  // Parity (1 for primiparous, 2 for multiparous)
  const parity = params.lactationNumber === 1 ? 1 : 2;
  
  // Base DMI (NASEM 2021 Eq 2-1)
  let predictedDmi = (3.7 + 5.7 * (parity - 1) + 0.305 * totalNEmilk + 0.022 * params.weight + (-0.689 - 1.87 * (parity - 1)) * params.currentBcs);
  
  // Early Lactation Lag Adjustment (NASEM 2021)
  const lagFactor = 1 - (0.212 + 0.136 * (parity - 1)) * Math.exp(-0.053 * params.daysInMilk);
  predictedDmi = predictedDmi * lagFactor;

  // Dry Period Adjustment for DMI
  if (params.lactationStage === 'dry') {
      predictedDmi = params.weight * 0.02; // Approx 2% of BW for dry cows
  }

  // Environmental Adjustment for DMI (Heat stress)
  if (params.environment === 'heat_mild') predictedDmi *= 0.92;
  if (params.environment === 'heat_severe') predictedDmi *= 0.85;

  const estimatedDMI = Math.max(predictedDmi, 5); // Floor at 5kg

  // 1. Maintenance Energy (NASEM 2021)
  // Base NEl maintenance is 0.10 Mcal/kg BW^0.75
  let neMaint = 0.10 * w075; 

  // Breed Adjustment: Jersey cows have significantly higher basal metabolism
  if (params.breed === 'jersey') {
    neMaint *= 1.15; // +15% for Jerseys
  }

  // Environment adjustment for Maintenance
  if (params.environment === 'heat_mild') {
    neMaint *= 1.10; 
  } else if (params.environment === 'heat_severe') {
    neMaint *= 1.25; 
  } else if (params.environment === 'cold') {
    neMaint *= 1.15; 
  }

  let activityFactor = 1.0;
  if (params.grazing === 'flat') {
    activityFactor = 1.15; 
  } else if (params.grazing === 'hilly') {
    activityFactor = 1.30; 
  }
  
  const neMaintTotal = neMaint * activityFactor;
  // Converting NE to ME (Efficiency km approx 0.66 for maintenance)
  const meMaint = neMaintTotal / 0.66;

  // 2. Milk Production Energy
  // Efficiency kl approx 0.66
  const meMilk = totalNEmilk / 0.66;

  me += meMaint + meMilk;

  // 3. Pregnancy Energy (NASEM 2021)
  if (params.pregnancyMonth > 6) {
    // Simplified Gestation REgain based on month
    const pregFactor = (params.pregnancyMonth - 6);
    const gestRE = 0.5 * pregFactor; // Mcal/d RE
    const meGestation = gestRE / 0.14; // Efficiency ky = 0.14 for gain
    me += meGestation;
  }

  // 4. Growth Energy
  let growthRateToUse = params.growthRate;
  if (growthRateToUse === 0) {
      if (params.lactationNumber === 1) growthRateToUse = 0.5; 
      if (params.lactationNumber === 2) growthRateToUse = 0.2; 
  }

  if (growthRateToUse > 0) {
     // Efficiency kg approx 0.40
     const growthRE = 3.5 * growthRateToUse; // Mcal/d RE
     me += growthRE / 0.40;
  }

  // 5. Body Condition Change
  if (params.bcsChange > 0) {
      me += 5.5 * params.bcsChange; // Mcal ME per unit change
  } else if (params.bcsChange < 0) {
      me += 4.5 * params.bcsChange; 
  }

  // --- Protein Requirements (NASEM 2021) ---
  // Maintenance MP: ~1.0 g MP / kg BW
  const mpMaint = 1.0 * params.weight;
  
  // Milk MP: NP / 0.69 (Efficiency kl = 0.69)
  const milkNP = milkKg * (params.proteinPercentage * 10); // g NP
  const mpMilk = milkNP / 0.69;

  // Total MP Requirement
  const totalMPReq = mpMaint + mpMilk;
  
  // Convert MP to CP (Efficiency approx 0.67)
  cp = totalMPReq / 0.67;

  // --- Amino Acid Requirements (NASEM 2021) ---
  // Profiles (g/100g TP): Lys=8.82, Met=3.03
  const milkLysNP = milkNP * 0.0882;
  const milkMetNP = milkNP * 0.0303;
  
  // Maintenance AA (Simplified as % of mpMaint)
  const maintLysNP = mpMaint * 0.07; // Approx
  const maintMetNP = mpMaint * 0.02; 

  // Efficiencies: Lys=0.72, Met=0.73
  lysine = (milkLysNP + maintLysNP) / 0.72;
  methionine = (milkMetNP + maintMetNP) / 0.73;

  // --- Mineral Requirements (NASEM 2021) ---
  // Calcium: Maint (0.9g/kg DMI) + Milk (1.22g/kg) + Growth
  ca = (0.9 * estimatedDMI) + (milkKg * 1.22) + (growthRateToUse * 20);
  // Phosphorus: Maint (1.0g/kg DMI) + Milk (0.9g/kg) + Growth
  p = (1.0 * estimatedDMI) + (milkKg * 0.9) + (growthRateToUse * 10);

  // Guidelines (approximate):
  const ndfReq = estimatedDMI * 1000 * 0.30; // in grams
  const adfReq = estimatedDMI * 1000 * 0.21; // in grams
  const starchMax = estimatedDMI * 1000 * 0.26; // in grams (Max limit)
  const sugarReq = estimatedDMI * 1000 * 0.05; // in grams (Rough target)

  // 6. Protein Fractions (RDP/RUP)
  // Standard: RDP is ~65% of CP, RUP is ~35%
  let rdpPercent = 0.65;
  let rupPercent = 0.35;

  if (params.lactationStage === 'early') {
      rupPercent = 0.42; 
      rdpPercent = 0.58;
  } else if (params.lactationStage === 'dry') {
      rupPercent = 0.30; 
      rdpPercent = 0.70;
  }

  rdp = cp * rdpPercent;
  rup = cp * rupPercent;

  // 7. Metabolizable Protein (MP) and Amino Acids
  // MP = (Microbial Protein) + (Digestible RUP)
  // Microbial CP (g) approx = 10.1 * ME (Mcal)
  const microbialCP = 10.1 * me;
  const mp = (microbialCP * 0.8) + (rup * 0.8);
  
  // Targets (NASEM 2021): Lysine ~7.0% of MP, Methionine ~2.6% of MP
  lysine = mp * 0.07;
  methionine = mp * 0.026;

  // 8. DCAD Requirements (mEq/kg DM)
  if (params.lactationStage === 'dry') {
    dcad = params.pregnancyMonth >= 8 ? -100 : 100; 
  } else {
    dcad = 300; 
  }

  // 9. peNDF Requirements (g)
  peNDF = estimatedDMI * 1000 * 0.20;

  return {
    me: parseFloat(me.toFixed(2)),
    cp: Math.round(cp),
    rdp: Math.round(rdp),
    rup: Math.round(rup),
    lysine: Math.round(lysine),
    methionine: Math.round(methionine),
    na: Math.round(estimatedDMI * 2.5), 
    k: Math.round(estimatedDMI * 10), 
    cl: Math.round(estimatedDMI * 2.5), 
    s: Math.round(estimatedDMI * 2.0),
    dcad: dcad,
    peNDF: Math.round(peNDF),
    ca: Math.round(ca),
    p: Math.round(p),
    ndf: Math.round(ndfReq),
    adf: Math.round(adfReq),
    starch: Math.round(starchMax), 
    sugar: Math.round(sugarReq),
    predictedDmi: parseFloat(estimatedDMI.toFixed(1)),
    // Trace Minerals (NASEM 2021)
    co: parseFloat((estimatedDMI * 0.15).toFixed(2)), // 0.15 mg/kg DMI
    cu: parseFloat((estimatedDMI * 15).toFixed(1)), // 15 mg/kg DMI
    i: parseFloat((estimatedDMI * 0.8).toFixed(2)), // 0.8 mg/kg DMI
    fe: parseFloat((estimatedDMI * 25).toFixed(1)), // 25 mg/kg DMI
    mn: parseFloat((estimatedDMI * 40).toFixed(1)), // 40 mg/kg DMI
    se: parseFloat((estimatedDMI * 0.3).toFixed(2)), // 0.3 mg/kg DMI
    zn: parseFloat((estimatedDMI * 60).toFixed(1)), // 60 mg/kg DMI
    // Vitamins (NASEM 2021)
    vitA: Math.round(milkKg > 35 ? (110 * params.weight + 1000 * (milkKg - 35)) / 1000 : (110 * params.weight) / 1000), // kIU
    vitD: Math.round((milkKg > 0 ? 40 * params.weight : 32 * params.weight) / 1000), // kIU
    vitE: Math.round(params.lactationStage === 'dry' ? 1000 : 500) // IU (Simplified based on stage)
  };
};

export const calculateSupplied = (
  concentrateMix: RationItem[], 
  concentrateAmountFed: number, 
  forages: RationItem[],
  feedDatabase: FeedIngredient[] 
): Nutrients & { 
    totalDM: number;
    totalAsFed: number;
    concentrateAnalysis: Nutrients;
    rationStructure: { concentrateDM: number; forageDM: number; concentratePercent: number; foragePercent: number }
} => {
  
  let totalME = 0;
  let totalCP = 0;
  let totalRDP = 0;
  let totalRUP = 0;
  let totalLys = 0;
  let totalMet = 0;
  let totalNa = 0;
  let totalK = 0;
  let totalCl = 0;
  let totalS = 0;
  let totalCa = 0;
  let totalP = 0;
  let totalStarch = 0;
  let totalSugar = 0;
  let totalNDF = 0;
  let totalPeNDF = 0;
  let totalADF = 0;
  let totalDM = 0;

  let concentrateDM = 0;
  let forageDM = 0;

  // 1. Calculate Concentrate Mix Analysis (per 1kg of mix)
  const totalParts = concentrateMix.reduce((acc, item) => acc + item.amount, 0);
  
  let mixME = 0, mixCP = 0, mixRDP = 0, mixRUP = 0, mixLys = 0, mixMet = 0, mixNa = 0, mixK = 0, mixCl = 0, mixS = 0, mixCa = 0, mixP = 0, mixStarch = 0, mixSugar = 0, mixNDF = 0, mixPeNDF = 0, mixADF = 0;

  if (totalParts > 0) {
    concentrateMix.forEach(item => {
        const feed = feedDatabase.find(f => f.id === item.ingredientId);
        if (feed) {
            const ratio = item.amount / totalParts; 
            const dmFactor = feed.dm / 100;
            const cpInMix = (feed.cp * 10 * dmFactor) * ratio;
            const rupInMix = cpInMix * (feed.rup / 100);
            const ndfInMix = (feed.ndf * 10 * dmFactor) * ratio;
            
            mixME += (feed.me * dmFactor) * ratio;
            mixCP += cpInMix;
            mixRDP += (cpInMix * (feed.rdp / 100));
            mixRUP += rupInMix;
            // Lys/Met from RUP (Digestible part ~80%)
            mixLys += (rupInMix * 0.8 * (feed.lysine / 100));
            mixMet += (rupInMix * 0.8 * (feed.methionine / 100));
            mixNa += (feed.na * 10 * dmFactor) * ratio;
            mixK += (feed.k * 10 * dmFactor) * ratio;
            mixCl += (feed.cl * 10 * dmFactor) * ratio;
            mixS += (feed.s * 10 * dmFactor) * ratio;
            mixCa += (feed.ca * 10 * dmFactor) * ratio;
            mixP += (feed.p * 10 * dmFactor) * ratio;
            mixStarch += (feed.starch * 10 * dmFactor) * ratio;
            mixSugar += (feed.sugar * 10 * dmFactor) * ratio;
            mixNDF += ndfInMix;
            mixPeNDF += ndfInMix * feed.peFactor;
            mixADF += (feed.adf * 10 * dmFactor) * ratio;
        }
    });
  }

    const concAnalysis = { 
        me: mixME, cp: mixCP, rdp: mixRDP, rup: mixRUP, 
        lysine: mixLys, methionine: mixMet, 
        na: mixNa, k: mixK, cl: mixCl, s: mixS, 
        dcad: (mixNa / 0.023 + mixK / 0.039) - (mixCl / 0.0355 + mixS / 0.016),
        ca: mixCa, p: mixP, starch: mixStarch, sugar: mixSugar, ndf: mixNDF, 
        peNDF: mixPeNDF, adf: mixADF 
    };

  // 2. Add Concentrate Supplied to Total
  totalME += mixME * concentrateAmountFed;
  totalCP += mixCP * concentrateAmountFed;
  totalRDP += mixRDP * concentrateAmountFed;
  totalRUP += mixRUP * concentrateAmountFed;
  totalLys += mixLys * concentrateAmountFed;
  totalMet += mixMet * concentrateAmountFed;
  totalNa += mixNa * concentrateAmountFed;
  totalK += mixK * concentrateAmountFed;
  totalCl += mixCl * concentrateAmountFed;
  totalS += mixS * concentrateAmountFed;
  totalCa += mixCa * concentrateAmountFed;
  totalP += mixP * concentrateAmountFed;
  totalStarch += mixStarch * concentrateAmountFed;
  totalSugar += mixSugar * concentrateAmountFed;
  totalNDF += mixNDF * concentrateAmountFed;
  totalPeNDF += mixPeNDF * concentrateAmountFed;
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
          const rupSupplied = cpSupplied * (feed.rup / 100);
          
          totalME += feed.me * kgDM;
          totalCP += cpSupplied;
          totalRDP += (cpSupplied * (feed.rdp / 100));
          totalRUP += rupSupplied;
          // Lys/Met from RUP (Digestible part ~80%)
          totalLys += (rupSupplied * 0.8 * (feed.lysine / 100));
          totalMet += (rupSupplied * 0.8 * (feed.methionine / 100));
          totalNa += feed.na * 10 * kgDM;
          totalK += feed.k * 10 * kgDM;
          totalCl += feed.cl * 10 * kgDM;
          totalS += feed.s * 10 * kgDM;
          totalCa += feed.ca * 10 * kgDM;
          totalP += feed.p * 10 * kgDM;
          
          // Add new nutrients
          totalStarch += feed.starch * 10 * kgDM;
          totalSugar += feed.sugar * 10 * kgDM;
          totalNDF += feed.ndf * 10 * kgDM;
          totalPeNDF += (feed.ndf * 10 * kgDM) * feed.peFactor;
          totalADF += feed.adf * 10 * kgDM;

          forageDM += kgDM;
          totalDM += kgDM;
      }
  });

  const concentratePercent = totalDM > 0 ? (concentrateDM / totalDM) * 100 : 0;
  const foragePercent = totalDM > 0 ? (forageDM / totalDM) * 100 : 0;

  // 4. Add Microbial Amino Acid Contribution
  // Microbial CP (g) = 10.1 * totalME
  const totalMicrobialCP = 10.1 * totalME;
  totalLys += (totalMicrobialCP * 0.8 * 0.16); // Microbial Lysine ~16% of microbial protein
  totalMet += (totalMicrobialCP * 0.8 * 0.05); // Microbial Methionine ~5% of microbial protein

  // 5. Calculate DCAD (mEq/kg DM)
  // DCAD = [(Na/0.023) + (K/0.039)] - [(Cl/0.0355) + (S/0.016)] where minerals are in g/kg DM
  // Our totalNa is in g. We need g/kg DM.
  const na_g_kg = totalDM > 0 ? totalNa / totalDM : 0;
  const k_g_kg = totalDM > 0 ? totalK / totalDM : 0;
  const cl_g_kg = totalDM > 0 ? totalCl / totalDM : 0;
  const s_g_kg = totalDM > 0 ? totalS / totalDM : 0;

  const totalDCAD = (na_g_kg / 0.023 + k_g_kg / 0.039) - (cl_g_kg / 0.0355 + s_g_kg / 0.016);

  const totalAsFed = concentrateAmountFed + forages.reduce((acc, curr) => acc + curr.amount, 0);

  // --- Environmental Impact Calculations (NASEM 2021) ---
  // 1. Manure Production (kg wet/d)
  // Man_out = -28.3 + 3.6 * DMI + 12.4 * Potassium%
  const potassiumPercent = totalDM > 0 ? (totalK / totalDM) / 10 : 0; // totalK is in g, need %
  const manureProduction = totalDM > 0 ? (-28.3 + 3.6 * totalDM + 12.4 * (potassiumPercent * 10)) : 0;

  // 2. Methane Production (g CH4/d)
  // GasEOut = 0.294 * DMI - 0.347 * FA% + 0.0409 * DigNDF%
  const faPercent = totalDM > 0 ? (totalDM * 0.03) : 0; // Simplified FA estimate if not fully tracked
  const digNDFPercent = totalDM > 0 ? (totalNDF * 0.5 / totalDM) / 10 : 0; // Assuming 50% digestibility for rough estimate
  const gasEOut = totalDM > 0 ? (0.294 * totalDM - 0.347 * 3 + 0.0409 * 45) : 0; // Using typical values for missing parts
  const methaneProduction = gasEOut / 0.01326; // En_CH4 approx 13.26 Mcal/kg

  // 3. Nitrogen Excretion (g N/d)
  // N_excretion = N_intake - N_milk - N_scurf - N_growth
  const nitrogenIntake = totalCP / 6.25;
  const nitrogenExcretion = nitrogenIntake * 0.70; // Rough estimate: 70% of N is excreted

  // 4. Phosphorus Excretion (g P/d)
  const phosphorusExcretion = totalP * 0.65; // Rough estimate: 65% of P is excreted

  return {
    me: parseFloat(totalME.toFixed(2)),
    cp: Math.round(totalCP),
    rdp: Math.round(totalRDP),
    rup: Math.round(totalRUP),
    lysine: Math.round(totalLys),
    methionine: Math.round(totalMet),
    na: Math.round(totalNa),
    k: Math.round(totalK),
    cl: Math.round(totalCl),
    s: Math.round(totalS),
    dcad: Math.round(totalDCAD),
    peNDF: Math.round(totalPeNDF),
    ca: Math.round(totalCa),
    p: Math.round(totalP),
    starch: Math.round(totalStarch),
    sugar: Math.round(totalSugar),
    ndf: Math.round(totalNDF),
    adf: Math.round(totalADF),
    totalDM: parseFloat(totalDM.toFixed(2)),
    totalAsFed: parseFloat(totalAsFed.toFixed(2)),
    manureProduction: Math.round(Math.max(0, manureProduction)),
    methaneProduction: Math.round(Math.max(0, methaneProduction)),
    nitrogenExcretion: Math.round(nitrogenExcretion),
    phosphorusExcretion: Math.round(phosphorusExcretion),
    concentrateAnalysis: {
        me: parseFloat(mixME.toFixed(2)),
        cp: Math.round(mixCP),
        rdp: Math.round(mixRDP),
        rup: Math.round(mixRUP),
        lysine: Math.round(mixLys),
        methionine: Math.round(mixMet),
        na: Math.round(mixNa),
        k: Math.round(mixK),
        cl: Math.round(mixCl),
        s: Math.round(mixS),
        dcad: Math.round((mixNa / 0.023 + mixK / 0.039) - (mixCl / 0.0355 + mixS / 0.016)),
        peNDF: Math.round(mixPeNDF),
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