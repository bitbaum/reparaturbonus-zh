import { NextRequest, NextResponse } from 'next/server';

// Mock AI suggestion service - in production, you'd integrate with OpenAI or similar
interface RepairSuggestion {
  likelyIssues: string[];
  possibleSolutions: string[];
  estimatedRepairCost: { min: number; max: number };
  estimatedNewCost: { min: number; max: number };
  savingsPercentage: number;
  environmentalImpact: {
    co2Saved: string;
    wasteAvoided: string;
  };
}

const generateSuggestions = (category: string): RepairSuggestion => {
  // Mock data based on category - in production, this would use AI
  const suggestions: Record<string, RepairSuggestion> = {
    electronics: {
      likelyIssues: [
        'Akku defekt oder schwach',
        'Display-Schaden (Risse, schwarze Bereiche)',
        'Ladeanschluss verschmutzt oder defekt',
        'Software-Probleme oder Updates erforderlich',
      ],
      possibleSolutions: [
        'Akku-Austausch (dauert meist 1-2 Stunden)',
        'Display-Reparatur oder -Austausch',
        'Reinigung und Reparatur des Ladeanschlusses',
        'Software-Update oder Reset',
      ],
      estimatedRepairCost: { min: 50, max: 300 },
      estimatedNewCost: { min: 400, max: 1200 },
      savingsPercentage: 70,
      environmentalImpact: {
        co2Saved: '85 kg CO2',
        wasteAvoided: '2.5 kg Elektroschrott',
      },
    },
    clothing: {
      likelyIssues: [
        'Reißverschluss klemmt oder ist kaputt',
        'Knöpfe fehlen oder sind lose',
        'Nähte sind aufgegangen',
        'Flecken oder Verfärbungen',
      ],
      possibleSolutions: [
        'Reißverschluss reparieren oder ersetzen',
        'Knöpfe annähen oder austauschen',
        'Nähte verstärken oder neu nähen',
        'Professionelle Reinigung oder Färbung',
      ],
      estimatedRepairCost: { min: 15, max: 80 },
      estimatedNewCost: { min: 60, max: 300 },
      savingsPercentage: 75,
      environmentalImpact: {
        co2Saved: '12 kg CO2',
        wasteAvoided: '0.8 kg Textilabfall',
      },
    },
    shoes: {
      likelyIssues: [
        'Sohle löst sich ab oder ist durchgelaufen',
        'Absatz ist gebrochen oder abgelaufen',
        'Reißverschluss oder Schnürsenkel defekt',
        'Leder ist rissig oder verfärbt',
      ],
      possibleSolutions: [
        'Sohle neu kleben oder ersetzen',
        'Absatz reparieren oder erneuern',
        'Reißverschluss austauschen',
        'Leder pflegen und auffrischen',
      ],
      estimatedRepairCost: { min: 25, max: 120 },
      estimatedNewCost: { min: 80, max: 400 },
      savingsPercentage: 70,
      environmentalImpact: {
        co2Saved: '8 kg CO2',
        wasteAvoided: '0.6 kg Lederabfall',
      },
    },
    cars: {
      likelyIssues: [
        'Verschleißteile (Bremsen, Reifen) müssen gewechselt werden',
        'Motor-Probleme (Ölwechsel, Filter)',
        'Elektrische Probleme (Batterie, Lichtanlage)',
        'Karosserie-Schäden (Rost, Dellen)',
      ],
      possibleSolutions: [
        'Austausch von Verschleißteilen',
        'Motor-Service und Wartung',
        'Elektrik-Diagnose und Reparatur',
        'Karosserie-Arbeiten und Lackierung',
      ],
      estimatedRepairCost: { min: 200, max: 2000 },
      estimatedNewCost: { min: 15000, max: 50000 },
      savingsPercentage: 85,
      environmentalImpact: {
        co2Saved: '6.8 Tonnen CO2',
        wasteAvoided: '1.2 Tonnen Metallschrott',
      },
    },
    appliances: {
      likelyIssues: [
        'Verstopfung oder Verkalkung',
        'Defekte Heizung oder Temperaturregelung',
        'Motor-Probleme oder Verschleiß',
        'Elektronik-Defekt oder Sensoren',
      ],
      possibleSolutions: [
        'Reinigung und Entkalkung',
        'Austausch von Heizelementen',
        'Motor-Reparatur oder -Austausch',
        'Elektronik-Diagnose und Reparatur',
      ],
      estimatedRepairCost: { min: 80, max: 250 },
      estimatedNewCost: { min: 300, max: 800 },
      savingsPercentage: 65,
      environmentalImpact: {
        co2Saved: '45 kg CO2',
        wasteAvoided: '15 kg Elektroschrott',
      },
    },
  };

  return suggestions[category] || suggestions.electronics;
};

export async function POST(request: NextRequest) {
  try {
    const { category, item, problem } = await request.json();

    if (!category || !item) {
      return NextResponse.json({ error: 'Category and item are required' }, { status: 400 });
    }

    const suggestion = generateSuggestions(category);

    return NextResponse.json({
      success: true,
      suggestion,
      message: problem
        ? 'Basierend auf Ihrer Beschreibung haben wir folgende Analyse erstellt:'
        : 'Basierend auf Ihrem Gegenstand sind dies die häufigsten Probleme:',
    });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
