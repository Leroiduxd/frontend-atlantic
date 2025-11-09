"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Temps de pause entre chaque compteur
const INTER_STEP_DELAY = 2000; 
// Temps de défilement du compteur lui-même
const SEQUENCE_TIMING = 2000; 

// ====================================================================
// 1. COMPOSANT POUR LE DÉFILEMENT DES NOMBRES (maintenu)
// ====================================================================
interface CountingNumberProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const CountingNumber: React.FC<CountingNumberProps> = ({ 
  end, 
  duration = SEQUENCE_TIMING, // Utilise la constante globale
  decimals = 0,
  prefix = "",
  suffix = "" 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Utilisation d'une fonction de lissage (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3); 
      const current = easedProgress * end;
      setCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
    return () => { /* Cleanup si nécessaire */ };
  }, [end, duration]);

  // Utilisation de toLocaleString pour les séparateurs (ex: 1,400,000)
  const formattedCount = Math.floor(count).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return (
    <span className="text-blue-400 font-extrabold block text-4xl lg:text-6xl font-mono">
      {prefix}{formattedCount}{suffix}
    </span>
  );
};


// ====================================================================
// 2. COMPOSANT PRINCIPAL DE L'OVERLAY (Séquence fluide)
// ====================================================================
interface WelcomeOverlayProps {
  onDismiss: () => void;
}

// Les étapes et leur contenu (duration ici est la durée du compteur)
const STEPS = [
    // L'étape 1 sert de point de départ du texte simple
    { id: 1, text: "Brokex Protocol v2 is deployed on Pharos Atlantic Network.", duration: 3000, type: 'TEXT' },
    // Les étapes STAT utilisent SEQUENCE_TIMING (2000ms) + INTER_STEP_DELAY (550ms)
    { id: 2, text: "Previous Testnet Success:", duration: SEQUENCE_TIMING, endValue: 1400000, suffix: " Users", type: 'STAT' },
    { id: 3, text: "Total Unique Trades:", duration: SEQUENCE_TIMING, endValue: 70000000, suffix: " Trades", type: 'STAT' },
    { id: 4, text: "Total Trading Volume:", duration: SEQUENCE_TIMING, endValue: 35000000000, prefix: "$", suffix: " Volume", type: 'STAT' },
];

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    let cumulativeDelay = 500; // Délai initial avant la première étape (fondu entrant)
    
    setIsVisible(true); 

    // Début de la séquence après le délai initial
    timers.push(setTimeout(() => setCurrentStep(1), cumulativeDelay));

    // Calcul du délai total pour les étapes STAT
    STEPS.forEach((step, index) => {
        let stepDuration = step.duration; // Temps de défilement (TEXTE) ou de comptage (STAT)
        
        // Si c'est une étape STAT, on ajoute le délai de pause après le compteur
        const pauseTime = step.type === 'STAT' ? INTER_STEP_DELAY : 500; // 500ms pour l'étape TEXTE

        cumulativeDelay += stepDuration;
        
        // La prochaine étape commence APRES la durée de l'étape courante PLUS la pause
        timers.push(setTimeout(() => {
            if (index < STEPS.length - 1) {
                 setCurrentStep(STEPS[index + 1].id);
            }
        }, cumulativeDelay));

        cumulativeDelay += pauseTime;
    });

    // Fermeture de l'overlay (après la dernière étape + sa pause)
    timers.push(setTimeout(handleSkip, cumulativeDelay)); 

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []); // [] = Se lance une seule fois au montage

  const handleSkip = () => {
    setIsVisible(false);
    // Attendre la fin de l'animation de fondu avant de détruire le composant
    setTimeout(onDismiss, 500); 
  };

  const renderStepContent = () => {
    const stepData = STEPS.find(s => s.id === currentStep);

    if (!stepData) return null;

    if (stepData.type === 'TEXT') {
        return (
            // J'ai retiré 'animate-pulse' pour éliminer le clignotement
            <h2 className="text-3xl lg:text-5xl font-bold transition-opacity duration-700 text-center">
                {stepData.text}
            </h2>
        );
    }

    if (stepData.type === 'STAT') {
        return (
            <div className="space-y-4 transition-opacity duration-500">
                <h3 className="text-xl font-semibold text-gray-300">
                    {stepData.text}
                </h3>
                <CountingNumber 
                    end={stepData.endValue}
                    duration={stepData.duration} // Utilise 2000ms
                    prefix={stepData.prefix}
                    suffix={stepData.suffix}
                />
            </div>
        );
    }
    
    return null;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Bouton pour fermer/passer */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10"
        onClick={handleSkip}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Contenu principal */}
      <div className="w-full max-w-3xl text-center text-white min-h-[150px] flex items-center justify-center">
        {renderStepContent()}
      </div>
    </div>
  );
};