'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import {
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import { CATEGORY_LABELS, SHOP_CATEGORIES } from '@/lib/constants/categories';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  categoryButtons?: boolean;
}

export default function RepairChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hallo! Was möchten Sie reparieren lassen? Wählen Sie eine Kategorie aus:',
      sender: 'assistant',
      timestamp: new Date(),
      categoryButtons: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCategorySelect = (category: string, categoryLabel: string) => {
    // Add user message showing selected category
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Ich möchte etwas aus der Kategorie "${categoryLabel}" reparieren lassen.`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Handle categories differently
    setTimeout(() => {
      if (category === 'OTHER') {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Das ist toll, dass Sie etwas reparieren möchten! 🔧 Auch wenn die Stadt Zürich für diese Kategorie aktuell keinen Reparaturbonus anbietet, gibt es bestimmt Werkstätten in Ihrer Nähe, die Ihnen helfen können. Reparieren ist immer besser als wegwerfen - Sie schonen damit die Umwelt und sparen Geld! Beschreiben Sie mir gerne, was kaputt ist, und ich kann Ihnen Tipps geben.',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // For bonus-eligible categories, redirect to shops page
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Perfekt! Für ${categoryLabel} gibt es den Reparaturbonus von CHF 100. Ich leite Sie jetzt zu unseren qualifizierten Werkstätten weiter, wo Sie direkt Kontakt aufnehmen können.`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Redirect to shops page with category filter after a short delay
        setTimeout(() => {
          window.location.href = `/shops?category=${category.toUpperCase()}`;
        }, 1500);
      }
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Simple response generation
    setTimeout(() => {
      const lowerMessage = currentInput.toLowerCase();
      let responseText = '';

      // Electronics repair
      if (
        lowerMessage.includes('handy') ||
        lowerMessage.includes('smartphone') ||
        lowerMessage.includes('display') ||
        lowerMessage.includes('bildschirm') ||
        lowerMessage.includes('laptop') ||
        lowerMessage.includes('computer')
      ) {
        responseText =
          'Das klingt nach einem Elektronik-Problem! Für Elektronik-Reparaturen gibt es den CHF 100 Reparaturbonus. Ich empfehle Ihnen, direkt unsere spezialisierten Elektronik-Werkstätten zu kontaktieren.';
      }
      // Clothing repair
      else if (
        lowerMessage.includes('kleidung') ||
        lowerMessage.includes('jacke') ||
        lowerMessage.includes('hose') ||
        lowerMessage.includes('reissverschluss') ||
        lowerMessage.includes('nähen')
      ) {
        responseText =
          'Das ist ein Kleidungsreparatur! Auch dafür gibt es den CHF 100 Reparaturbonus. Unsere Schneidereibetriebe können Ihnen sicher weiterhelfen.';
      }
      // Shoe repair
      else if (
        lowerMessage.includes('schuhe') ||
        lowerMessage.includes('absatz') ||
        lowerMessage.includes('sohle')
      ) {
        responseText =
          'Schuhreparaturen sind sehr nachhaltig! Dafür gibt es ebenfalls den CHF 100 Reparaturbonus. Ich kann Ihnen gerne unsere Schuhmacher zeigen.';
      }
      // General repair advice
      else if (
        lowerMessage.includes('reparatur') ||
        lowerMessage.includes('kaputt') ||
        lowerMessage.includes('defekt')
      ) {
        responseText =
          'Reparieren ist immer eine gute Idee! 🛠️ Es spart Geld, schont die Umwelt und oft ist der Schaden nicht so schlimm wie gedacht. Können Sie mir mehr Details nennen? Was genau ist kaputt?';
      }
      // Cost questions
      else if (
        lowerMessage.includes('kosten') ||
        lowerMessage.includes('preis') ||
        lowerMessage.includes('günstig')
      ) {
        responseText =
          'Reparaturen kosten meist nur einen Bruchteil eines Neukaufs! Plus für Elektro, Kleidung und Schuhe gibt es CHF 100 Bonus von der Stadt Zürich. Die meisten Werkstätten bieten kostenlose Kostenvoranschläge an.';
      }
      // Environmental questions
      else if (
        lowerMessage.includes('umwelt') ||
        lowerMessage.includes('nachhaltig') ||
        lowerMessage.includes('co2')
      ) {
        responseText =
          'Reparieren ist super für die Umwelt! 🌱 Sie sparen damit durchschnittlich 70% der CO2-Emissionen einer Neuproduktion und vermeiden Abfall. Jede Reparatur ist ein Beitrag zum Umweltschutz!';
      }
      // Default response
      else {
        responseText =
          'Interessant! Können Sie mir mehr Details erzählen? Je besser ich Ihr Problem verstehe, desto gezielter kann ich Ihnen helfen. Was genau ist kaputt oder funktioniert nicht richtig?';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case SHOP_CATEGORIES.ELECTRONICS:
        return <WrenchScrewdriverIcon className="h-5 w-5" />;
      case SHOP_CATEGORIES.CLOTHING:
        return <TagIcon className="h-5 w-5" />;
      case SHOP_CATEGORIES.SHOES:
        return <HomeIcon className="h-5 w-5" />;
      case 'OTHER':
        return <QuestionMarkCircleIcon className="h-5 w-5" />;
      default:
        return <WrenchScrewdriverIcon className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 z-50 group"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Reparatur-Beratung
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] h-[calc(100vh-6rem)] sm:w-96 sm:h-96 max-w-96 max-h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-full">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reparatur-Beratung</h3>
                <p className="text-xs text-green-600">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>

                  {/* Category Selection Buttons */}
                  {message.categoryButtons && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            handleCategorySelect(
                              SHOP_CATEGORIES.ELECTRONICS,
                              CATEGORY_LABELS[SHOP_CATEGORIES.ELECTRONICS],
                            )
                          }
                          className="flex items-center space-x-2 p-2 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left w-full"
                        >
                          {getCategoryIcon(SHOP_CATEGORIES.ELECTRONICS)}
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {CATEGORY_LABELS[SHOP_CATEGORIES.ELECTRONICS]}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            handleCategorySelect(
                              SHOP_CATEGORIES.CLOTHING,
                              CATEGORY_LABELS[SHOP_CATEGORIES.CLOTHING],
                            )
                          }
                          className="flex items-center space-x-2 p-2 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left w-full"
                        >
                          {getCategoryIcon(SHOP_CATEGORIES.CLOTHING)}
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {CATEGORY_LABELS[SHOP_CATEGORIES.CLOTHING]}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            handleCategorySelect(
                              SHOP_CATEGORIES.SHOES,
                              CATEGORY_LABELS[SHOP_CATEGORIES.SHOES],
                            )
                          }
                          className="flex items-center space-x-2 p-2 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left w-full"
                        >
                          {getCategoryIcon(SHOP_CATEGORIES.SHOES)}
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {CATEGORY_LABELS[SHOP_CATEGORIES.SHOES]}
                          </span>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('OTHER', 'Etwas anderes')}
                          className="flex items-center space-x-2 p-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left w-full"
                        >
                          {getCategoryIcon('OTHER')}
                          <span className="text-xs font-medium text-gray-600 truncate">
                            Etwas anderes
                          </span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        💡 Tipp: Für Elektro, Kleidung und Schuhe gibt es Reparaturbonus!
                      </p>
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ihre Frage hier eingeben..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Kostenlose Beratung • Reparaturbonus verfügbar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
