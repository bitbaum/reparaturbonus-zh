'use client';

import { useState } from 'react';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { 
  CurrencyEuroIcon, 
  GlobeEuropeAfricaIcon, 
  BuildingStorefrontIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  example: string;
  delay?: number;
}

interface StepProps {
  number: number;
  title: string;
  description: string;
  highlight?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  delay?: number;
}

interface FAQItemProps {
  question: string;
  answer: string;
  sources?: string[];
}


const BenefitCard: React.FC<BenefitCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  example,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  });

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-500 border border-gray-100 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">Beispiel:</p>
        <p className="text-sm text-blue-700">{example}</p>
      </div>
    </div>
  );
};

const Step: React.FC<StepProps> = ({ number, title, description, highlight = false, clickable = false, onClick, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  });

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const Component = clickable ? 'button' : 'div';
  
  return (
    <Component 
      onClick={handleClick}
      className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-500 transform w-full text-left ${
        highlight ? 'bg-blue-50 border border-blue-200' : ''
      } ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'} ${
        clickable ? 'hover:bg-blue-100 hover:border-blue-300 cursor-pointer hover:scale-[1.02] hover:shadow-md' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
        highlight ? 'bg-blue-500 text-white scale-110' : 'bg-gray-200 text-gray-600'
      }`}>
        {number}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold mb-1 ${clickable ? 'text-blue-900' : 'text-gray-900'}`}>
          {title}
          {clickable && <span className="ml-2 text-blue-500">→</span>}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        {clickable && (
          <p className="text-xs text-blue-600 mt-2 font-medium">Klicken Sie hier, um zu starten</p>
        )}
      </div>
    </Component>
  );
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, sources = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h4 className="font-medium text-gray-900 pr-4">{question}</h4>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed mb-4">{answer}</p>
          {sources.length > 0 && (
            <div className="text-xs text-gray-500 border-t pt-3">
              <strong>Quellen:</strong> {sources.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function WarumReparierenPage() {
  const router = useRouter();

  const handleStartRepair = () => {
    router.push('/#repair');
  };

  const handleFindShops = () => {
    router.push('/shops');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
              Warum reparieren statt wegwerfen?
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Reparieren spart Geld, schützt die Umwelt und stärkt die lokale Wirtschaft. 
              Entdecken Sie, warum Reparatur die klügere Wahl ist.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm animate-fade-in-delay-2">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Bis zu 70% Kostenersparnis
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Weniger CO₂-Emissionen
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Lokale Arbeitsplätze
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Die drei grossen Vorteile des Reparierens
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reparieren ist nicht nur umweltfreundlich – es macht auch wirtschaftlich Sinn 
            und stärkt unsere Gemeinschaft.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <BenefitCard
            icon={CurrencyEuroIcon}
            title="Geld sparen"
            description="Eine Reparatur kostet meist nur einen Bruchteil eines Neukaufs. Bei vielen Geräten sparen Sie 50-80% der Kosten."
            example="Smartphone-Display reparieren: CHF 150 statt CHF 800 für ein neues Gerät"
            delay={100}
          />
          
          <BenefitCard
            icon={GlobeEuropeAfricaIcon}
            title="Umwelt schützen"
            description="Jede Reparatur verhindert die Produktion eines neuen Geräts und reduziert damit Ressourcenverbrauch und CO₂-Emissionen erheblich."
            example="Ein repariertes Smartphone spart etwa 70 kg CO₂ gegenüber einem Neukauf"
            delay={200}
          />
          
          <BenefitCard
            icon={BuildingStorefrontIcon}
            title="Lokale Wirtschaft stärken"
            description="Reparaturbetriebe schaffen lokale Arbeitsplätze und halten das Geld in der Region, statt es an grosse Konzerne zu überweisen."
            example="In Zürich gibt es über 200 Reparaturbetriebe, die lokale Arbeitsplätze schaffen"
            delay={300}
          />
        </div>

        {/* Interactive How It Works Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-16 relative overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Reparieren ist einfach
          </h3>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <Step
              number={1}
              title="Problem beschreiben"
              description="Beschreiben Sie Ihr Problem detailliert in unserem System. Sie erhalten sofort Hinweise zu möglichen Ursachen, Kosten und passenden Reparaturbetrieben."
              highlight={true}
              clickable={true}
              onClick={handleStartRepair}
              delay={0}
            />
            <Step
              number={2}
              title="Reparaturbetrieb finden"
              description="Nutzen Sie unsere Suchfunktion, um qualifizierte Betriebe in Ihrer Nähe zu finden, die auf Ihr Problem spezialisiert sind."
              clickable={true}
              onClick={handleFindShops}
              delay={0}
            />
            <Step
              number={3}
              title="Kostenvoranschlag einholen"
              description="Kontaktieren Sie den Betrieb direkt mit der Problembeschreibung. Sie erhalten einen präzisen Kostenvoranschlag basierend auf Ihrer detaillierten Beschreibung."
              delay={0}
            />
            <Step
              number={4}
              title="Reparatur durchführen lassen"
              description="Die meisten Reparaturen sind in wenigen Tagen erledigt. Sie erhalten Garantie auf die Arbeit und können den Reparaturbonus nutzen."
              delay={0}
            />
            <Step
              number={5}
              title="Längere Nutzung geniessen"
              description="Ihr repariertes Gerät funktioniert oft jahrelang weiter – und Sie haben Geld und Umwelt geschont."
              delay={0}
            />
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleStartRepair}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Jetzt ausprobieren
            </button>
          </div>
        </div>

        {/* Environmental Impact Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Die Umwelt-Bilanz: Reparieren vs. Neukaufen
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-red-800 mb-4">❌ Neukauf</h4>
              <ul className="text-left space-y-2 text-red-700">
                <li>• Rohstoffabbau und Transport</li>
                <li>• Energieintensive Produktion</li>
                <li>• Verpackung und Versand</li>
                <li>• Entsorgung des alten Geräts</li>
                <li>• Hohe CO₂-Emissionen</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-green-800 mb-4">✅ Reparatur</h4>
              <ul className="text-left space-y-2 text-green-700">
                <li>• Nur kleine Ersatzteile nötig</li>
                <li>• Minimaler Energieverbrauch</li>
                <li>• Lokale Wertschöpfung</li>
                <li>• Verlängerte Produktnutzung</li>
                <li>• Bis zu 90% weniger CO₂</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Erfolgsgeschichten aus Zürich
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Familie Müller</h4>
                  <p className="text-gray-600 text-sm">Waschmaschine repariert</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                &quot;Unsere 8 Jahre alte Waschmaschine war defekt. Statt CHF 1&apos;200 für eine neue
                auszugeben, liessen wir sie für CHF 180 reparieren. Sie läuft jetzt seit
                2 Jahren einwandfrei weiter.&quot;
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Student Marco</h4>
                  <p className="text-gray-600 text-sm">Laptop-Bildschirm repariert</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                &quot;Als Student konnte ich mir keinen neuen Laptop leisten. Die Reparatur
                kostete nur CHF 220 statt CHF 1&apos;500 für einen neuen. Perfekte Lösung!&quot;
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Häufige Fragen zur Reparatur
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
              question="Lohnt sich eine Reparatur immer?"
              answer="Als Faustregel gilt: Wenn die Reparatur weniger als 50% des Neukaufpreises kostet und das Gerät noch nicht sehr alt ist, lohnt sich meist eine Reparatur. Bei hochwertigen Geräten kann sich auch eine teurere Reparatur lohnen."
              sources={["Konsumentenschutz Schweiz", "Stiftung für Konsumentenschutz"]}
            />
            
            <FAQItem
              question="Wie finde ich einen seriösen Reparaturbetrieb?"
              answer="Achten Sie auf Zertifizierungen, lesen Sie Bewertungen, fragen Sie nach Garantie auf die Reparatur und lassen Sie sich einen schriftlichen Kostenvoranschlag geben. Unsere Plattform listet nur geprüfte Betriebe auf."
              sources={["Reparaturführer Schweiz", "Berufsverbände"]}
            />
            
            <FAQItem
              question="Was passiert, wenn die Reparatur nicht gelingt?"
              answer="Seriöse Betriebe bieten meist eine 'Kein Erfolg, keine Kosten'-Garantie für die Diagnose. Für durchgeführte Arbeiten gibt es normalerweise Gewährleistung. Klären Sie dies vor der Reparatur ab."
              sources={["Konsumentenrecht Schweiz"]}
            />
            
            <FAQItem
              question="Wie umweltfreundlich ist Reparieren wirklich?"
              answer="Studien zeigen, dass Reparaturen den CO₂-Fussabdruck um 70-90% reduzieren können im Vergleich zum Neukauf. Auch der Ressourcenverbrauch sinkt dramatisch, da keine neuen Rohstoffe abgebaut werden müssen."
              sources={["Bundesamt für Umwelt BAFU", "Europäische Umweltagentur"]}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 animate-pulse"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4">
              Bereit für Ihre erste Reparatur?
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Beschreiben Sie Ihr Problem und finden Sie sofort passende Werkstätten mit Kosteneinschätzung. 
              Finden Sie dann qualifizierte Reparaturbetriebe und senden Sie direkte Anfragen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartRepair}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Reparaturhilfe starten
              </button>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors border border-blue-400"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                So funktioniert der Bonus
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          0%, 30% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay-2 {
          0%, 60% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 1.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 