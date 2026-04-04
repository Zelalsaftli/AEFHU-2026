import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import NeedsForm from './components/NeedsForm';
import FeedForm from './components/FeedForm';
import Comparison from './components/Comparison';
import HealthAdvisor from './components/HealthAdvisor';
import Home from './components/Home';
import { CowParameters, Nutrients, RationItem, Page, FeedIngredient } from './types';
import { calculateRequirements, calculateSupplied } from './services/calculator';
import { FEED_DATABASE } from './constants';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);

  // State: Cow Parameters
  const initialCowParams: CowParameters = {
    weight: 600,
    milkProduction: 25,
    fatPercentage: 3.8,
    proteinPercentage: 3.2,
    daysInMilk: 150, 
    pregnancyMonth: 0,
    growthRate: 0,
    bcsChange: 0,
    currentBcs: 3.0,
    lactationStage: 'mid',
    environment: 'neutral',
    grazing: 'none',
    // New Defaults
    lactationNumber: 3, // Mature by default
    breed: 'holstein',
    groupSize: 1
  };
  const [cowParams, setCowParams] = useState<CowParameters>(initialCowParams);

  // State: Requirements (Calculated)
  // Initialized with all properties to avoid runtime/type errors
  const [needs, setNeeds] = useState<Nutrients>({ 
    me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, 
    na: 0, k: 0, cl: 0, s: 0, dcad: 0,
    ca: 0, p: 0, 
    starch: 0, sugar: 0, ndf: 0, adf: 0,
    predictedDmi: 0
  });

  // State: Ingredients (Initialized from constant, but mutable)
  const [ingredients, setIngredients] = useState<FeedIngredient[]>(FEED_DATABASE);

  // State: Feed
  const [concentrateMix, setConcentrateMix] = useState<RationItem[]>([]);
  const [concentrateFedAmount, setConcentrateFedAmount] = useState<number>(0);
  const [forages, setForages] = useState<RationItem[]>([]);
  
  // State: Supplied (Calculated)
  const [supplied, setSupplied] = useState<Nutrients>({ 
    me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, 
    na: 0, k: 0, cl: 0, s: 0, dcad: 0,
    ca: 0, p: 0,
    starch: 0, sugar: 0, ndf: 0, adf: 0
  });
  const [totalDM, setTotalDM] = useState<number>(0);
  const [mixAnalysis, setMixAnalysis] = useState<Nutrients>({ 
    me: 0, cp: 0, rdp: 0, rup: 0, lysine: 0, methionine: 0, 
    na: 0, k: 0, cl: 0, s: 0, dcad: 0,
    ca: 0, p: 0,
    starch: 0, sugar: 0, ndf: 0, adf: 0
  });
  const [rationStructure, setRationStructure] = useState<{ 
      concentrateDM: number; forageDM: number; concentratePercent: number; foragePercent: number; 
  }>({ concentrateDM: 0, forageDM: 0, concentratePercent: 0, foragePercent: 0 });

  // State: Cost
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleReset = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في بدء جلسة جديدة؟ سيتم مسح جميع المدخلات.")) {
        setCowParams(initialCowParams);
        setConcentrateMix([]);
        setConcentrateFedAmount(0);
        setForages([]);
        setIngredients(FEED_DATABASE);
        setActivePage(Page.NEEDS);
        window.scrollTo(0, 0);
    }
  };

  const handleSave = () => {
    const dataToSave = {
        cowParams,
        concentrateMix,
        concentrateFedAmount,
        forages,
        ingredients,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ration-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Effects to trigger calculations
  useEffect(() => {
    const calculated = calculateRequirements(cowParams);
    setNeeds(calculated);
  }, [cowParams]);

  useEffect(() => {
    const result = calculateSupplied(concentrateMix, concentrateFedAmount, forages, ingredients);
    setSupplied(result);
    setTotalDM(result.totalDM);
    setMixAnalysis(result.concentrateAnalysis);
    setRationStructure(result.rationStructure);

    // Calculate Costs
    // 1. Concentrate Mix Cost per kg
    const totalMixWeight = concentrateMix.reduce((sum, item) => sum + item.amount, 0);
    let mixPricePerKg = 0;
    if (totalMixWeight > 0) {
        const totalMixCost = concentrateMix.reduce((sum, item) => {
            const ing = ingredients.find(i => i.id === item.ingredientId);
            return sum + (item.amount * (ing?.defaultPrice || 0));
        }, 0);
        mixPricePerKg = totalMixCost / totalMixWeight;
    }

    // 2. Total Daily Cost
    let dailyCost = 0;
    // Cost of concentrate fed
    dailyCost += mixPricePerKg * concentrateFedAmount;
    // Cost of forages
    forages.forEach(f => {
        const ing = ingredients.find(i => i.id === f.ingredientId);
        dailyCost += f.amount * (ing?.defaultPrice || 0);
    });

    setTotalCost(dailyCost);

  }, [concentrateMix, concentrateFedAmount, forages, ingredients]);

  // Rough estimation of total forage amount for AI context
  const totalForageAmount = forages.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout activePage={activePage} setPage={setActivePage} onReset={handleReset} onSave={handleSave}>
      {activePage === Page.HOME && (
        <Home setPage={setActivePage} />
      )}
      
      {activePage === Page.NEEDS && (
        <NeedsForm 
            params={cowParams} 
            setParams={setCowParams} 
            calculatedNeeds={needs} 
        />
      )}
      
      {activePage === Page.FEED && (
        <FeedForm 
            concentrateMix={concentrateMix}
            setConcentrateMix={setConcentrateMix}
            concentrateFedAmount={concentrateFedAmount}
            setConcentrateFedAmount={setConcentrateFedAmount}
            forages={forages}
            setForages={setForages}
            mixAnalysis={mixAnalysis}
            ingredients={ingredients}
            setIngredients={setIngredients}
        />
      )}

      {activePage === Page.COMPARE && (
        <Comparison 
            needs={needs}
            supplied={supplied}
            totalDM={totalDM}
            totalCost={totalCost}
            milkProduction={cowParams.milkProduction}
            groupSize={cowParams.groupSize}
            rationStructure={rationStructure}
            concentrateMix={concentrateMix}
            concentrateFedAmount={concentrateFedAmount}
            forages={forages}
            ingredients={ingredients}
        />
      )}

      {activePage === Page.HEALTH && (
        <HealthAdvisor 
            params={cowParams}
            needs={needs}
            supplied={supplied}
            concentrateAmount={concentrateFedAmount}
            forageAmount={totalForageAmount}
        />
      )}
    </Layout>
  );
};

export default App;