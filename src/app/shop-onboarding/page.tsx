'use client';

import { useState } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/ui/PageHeader';
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';
import FormTextarea from '@/components/forms/FormTextarea';

interface ShopFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  category: string;
  contactPerson: string;
  legalForm: string;
  specializations: string[];
}

const categories = [
  {
    value: 'ELECTRONICS',
    label: 'Elektro und Elektronik',
    icon: '📱',
    description: 'Smartphones, Laptops, Tablets, Haushaltsgeräte, Computer',
    examples: [
      'iPhone Display',
      'Laptop Tastatur',
      'Tablet Akku',
      'Kamera Objektiv',
      'Kaffeemaschine',
      'Toaster',
      'Mixer',
    ],
  },
  {
    value: 'CLOTHING',
    label: 'Kleidung',
    icon: '👕',
    description: 'Schneiderei, Änderungen, Reparaturen',
    examples: ['Reissverschluss', 'Saum kürzen', 'Löcher flicken', 'Knöpfe annähen'],
  },
  {
    value: 'SHOES',
    label: 'Schuhe',
    icon: '👟',
    description: 'Schuhreparatur und Pflege',
    examples: ['Sohle erneuern', 'Absatz reparieren', 'Leder flicken', 'Schuhpflege'],
  },
];

const specializationGroups = {
  ELECTRONICS: [
    'Smartphone Reparatur',
    'Laptop Reparatur',
    'Tablet Reparatur',
    'Display Austausch',
    'Akku Austausch',
    'Wasserschaden',
    'Datenrettung',
    'Software Installation',
    'Haushaltsgeräte Wartung',
    'Kaffeemaschine Reparatur',
    'Mixer Reparatur',
    'Toaster Reparatur',
  ],
  CLOTHING: [
    'Schneiderei',
    'Reissverschluss Reparatur',
    'Änderungen',
    'Löcher flicken',
    'Knöpfe annähen',
  ],
  SHOES: ['Schuhreparatur', 'Absatz Reparatur', 'Sohle erneuern', 'Leder flicken', 'Schuhpflege'],
};

const legalFormOptions = [
  { value: 'Einzelunternehmen', label: 'Einzelunternehmen' },
  { value: 'GmbH', label: 'GmbH' },
  { value: 'Einfache Gesellschaft', label: 'Einfache Gesellschaft' },
  { value: 'Aktiengesellschaft', label: 'Aktiengesellschaft (AG)' },
  { value: 'Verein', label: 'Verein' },
  { value: 'Genossenschaft', label: 'Genossenschaft' },
  { value: 'Kollektivgesellschaft', label: 'Kollektivgesellschaft' },
  { value: 'Kommanditgesellschaft', label: 'Kommanditgesellschaft' },
  { value: 'Kommanditaktiengesellschaft', label: 'Kommanditaktiengesellschaft' },
];

// Define mandatory fields for each step - DRY principle
// Must match the required-field check in src/app/api/shop-onboarding/route.ts
const MANDATORY_FIELDS = {
  1: ['name', 'category', 'description', 'contactPerson'],
  2: ['email', 'address', 'postalCode', 'city', 'phone'],
  3: [], // No mandatory fields for specializations
  4: [], // Confirmation step
} as const;

export default function ShopOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    category: '',
    contactPerson: '',
    legalForm: '',
    specializations: [],
  });

  // Helper function to check Step 1 completion without recursion
  const isStep1Complete = (): boolean => {
    const step1Fields = MANDATORY_FIELDS[1];
    return step1Fields.every((field) => {
      const value = formData[field as keyof ShopFormData];
      return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
    });
  };

  // Improved validation with proper step dependencies
  const isStepCompleted = (stepNumber: number): boolean => {
    const requiredFields = MANDATORY_FIELDS[stepNumber as keyof typeof MANDATORY_FIELDS];

    switch (stepNumber) {
      case 1:
        // Step 1: Independent - check mandatory fields
        return requiredFields.every((field) => {
          const value = formData[field as keyof ShopFormData];
          return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
        });

      case 2:
        // Step 2: Independent - check mandatory fields
        return requiredFields.every((field) => {
          const value = formData[field as keyof ShopFormData];
          return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
        });

      case 3:
        // Step 3: Dependent on Step 1 completion (needs category to be meaningful)
        // Only shows complete if Step 1 is fully completed first
        if (!isStep1Complete()) return false;

        // Step 3 is complete when Step 1 is complete and category is available
        // This step is optional - users don't need to select specializations
        // It's considered complete as long as the category exists (from Step 1)
        return formData.category.trim() !== '';

      case 4:
        // Step 4: Never shows as complete - it's the submission/action step
        // Once you submit successfully, you're redirected away from the form
        return false;

      default:
        return false;
    }
  };

  // Check if all mandatory fields are filled for form submission
  const areAllMandatoryFieldsFilled = (): boolean => {
    const allMandatoryFields = [...MANDATORY_FIELDS[1], ...MANDATORY_FIELDS[2]];
    return allMandatoryFields.every((field) => {
      const value = formData[field as keyof ShopFormData];
      return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
    });
  };

  const handleInputChange = (field: keyof ShopFormData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleSubmit = async () => {
    if (!areAllMandatoryFieldsFilled()) {
      return; // Don't submit if mandatory fields are missing
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/shop-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting shop application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Antrag eingereicht!</h1>
          <p className="text-gray-600 mb-6">
            Vielen Dank für Ihren Antrag! Wir prüfen Ihre Angaben und melden uns innerhalb von 2-3
            Werktagen bei Ihnen.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Nächste Schritte:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sie erhalten eine Bestätigung per E-Mail</li>
              <li>• Unser Team prüft Ihre Unterlagen</li>
              <li>• Bei Fragen kontaktieren wir Sie direkt</li>
              <li>• Nach Freigabe werden Sie kontaktiert</li>
            </ul>
          </div>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-indigo-600 text-white px-4 py-3 sm:px-6 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PageHeader
          title="Werkstatt registrieren"
          subtitle="Werden Sie Teil des Reparatur-Netzwerks und helfen Sie dabei, Ressourcen zu schonen"
        />

        {/* Step Navigation */}
        <div className="mb-8">
          <nav aria-label="Progress">
            {/* Mobile Progress Bar */}
            <div className="block sm:hidden mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Schritt {currentStep} von 4</span>
                <span>{Math.round((currentStep / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm font-medium text-gray-900">
                  {currentStep === 1 && 'Grunddaten'}
                  {currentStep === 2 && 'Kontakt'}
                  {currentStep === 3 && 'Spezialisierung'}
                  {currentStep === 4 && 'Bestätigung'}
                </span>
              </div>
            </div>

            {/* Desktop Step Navigation */}
            <div className="hidden sm:block">
              <div className="flex justify-center">
                <div className="flex space-x-8">
                  {[
                    { number: 1, name: 'Grunddaten', id: 'grunddaten' },
                    { number: 2, name: 'Kontakt', id: 'kontakt' },
                    { number: 3, name: 'Spezialisierung', id: 'spezialisierung' },
                    { number: 4, name: 'Bestätigung', id: 'bestaetigung' },
                  ].map((step) => (
                    <button
                      key={step.name}
                      onClick={() => setCurrentStep(step.number)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        step.number === currentStep
                          ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isStepCompleted(step.number)
                            ? 'bg-green-100 text-green-700'
                            : step.number === currentStep
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isStepCompleted(step.number) ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className="font-medium">{step.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Grundinformationen
              </h2>

              <div className="space-y-6">
                <FormInput
                  label="Werkstatt Name"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  placeholder="z.B. Revamp-IT"
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Hauptkategorie Ihrer Werkstatt *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleInputChange('category', cat.value)}
                        className={`p-4 sm:p-6 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-lg min-h-[120px] sm:min-h-[140px] flex flex-col justify-between ${
                          formData.category === cat.value
                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 flex justify-center">
                          {cat.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 text-center">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-gray-600 leading-tight text-center">
                          {cat.description}
                        </p>
                        {formData.category === cat.value && (
                          <div className="mt-2 flex justify-center">
                            <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {formData.category && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Typische Leistungen in dieser Kategorie:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categories
                          .find((c) => c.value === formData.category)
                          ?.examples.map((example, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {example}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <FormTextarea
                  label="Beschreibung"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Beschreiben Sie Ihre Werkstatt und Ihre Spezialisierung..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Ansprechperson"
                    value={formData.contactPerson}
                    onChange={(value) => handleInputChange('contactPerson', value)}
                    placeholder="Ihr Name"
                    required
                  />

                  <FormSelect
                    label="Rechtsform"
                    value={formData.legalForm}
                    onChange={(value) => handleInputChange('legalForm', value)}
                    options={legalFormOptions}
                    placeholder="Bitte wählen Sie eine Rechtsform"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Kontaktdaten
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Telefon"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  type="tel"
                  placeholder="+41 44 123 45 67"
                  icon={<PhoneIcon className="h-4 w-4" />}
                  required
                />

                <FormInput
                  label="E-Mail"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  type="email"
                  placeholder="info@ihre-werkstatt.ch"
                  icon={<EnvelopeIcon className="h-4 w-4" />}
                  required
                />
              </div>

              <FormInput
                label="Website"
                value={formData.website}
                onChange={(value) => handleInputChange('website', value)}
                type="url"
                placeholder="https://ihre-werkstatt.ch"
                icon={<GlobeAltIcon className="h-4 w-4" />}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label="Adresse"
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    placeholder="Bahnhofstrasse 45"
                    icon={<MapPinIcon className="h-4 w-4" />}
                    required
                  />
                </div>

                <FormInput
                  label="PLZ"
                  value={formData.postalCode}
                  onChange={(value) => handleInputChange('postalCode', value)}
                  placeholder="8001"
                  required
                />
              </div>

              <FormInput
                label="Stadt"
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                placeholder="Zürich"
                required
              />
            </div>
          )}

          {/* Step 3: Leistungen & Specializations */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Leistungen & Spezialisierungen
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Ihre Spezialisierungen (mehrere möglich)
                </label>
                {formData.category &&
                specializationGroups[formData.category as keyof typeof specializationGroups] ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h4 className="font-medium text-indigo-900 mb-3">
                        Passende Leistungen für{' '}
                        {categories.find((c) => c.value === formData.category)?.label}:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {specializationGroups[
                          formData.category as keyof typeof specializationGroups
                        ].map((spec: string) => (
                          <label
                            key={spec}
                            className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-indigo-100 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.specializations.includes(spec)}
                              onChange={() => handleSpecializationToggle(spec)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Weitere Leistungen hinzufügen:
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="custom-service"
                          placeholder="z.B. Spezialleistung, die Sie anbieten..."
                          className="flex-1 px-3 py-3 bg-white border-2 border-gray-400 md:border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-sm placeholder-gray-500 sm:placeholder-gray-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value.trim();
                              if (value && !formData.specializations.includes(value)) {
                                handleSpecializationToggle(value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(
                              'custom-service',
                            ) as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && !formData.specializations.includes(value)) {
                              handleSpecializationToggle(value);
                              input.value = '';
                            }
                          }}
                          className="px-3 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Hinzufügen
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 sm:text-gray-500 mt-1">
                        Fügen Sie spezielle Leistungen hinzu, die Sie anbieten
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-500">
                    <span className="text-4xl mb-4 block">🔧</span>
                    <p>
                      Wählen Sie zuerst eine Kategorie aus, um passende Spezialisierungen zu sehen
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Bestätigung & Übersicht
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name}</h3>
                  <p className="text-sm text-gray-600">{formData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Kategorie:</span>{' '}
                    {categories.find((c) => c.value === formData.category)?.label}
                  </div>
                  <div>
                    <span className="font-medium">Ansprechperson:</span> {formData.contactPerson}
                  </div>
                  <div>
                    <span className="font-medium">Rechtsform:</span> {formData.legalForm}
                  </div>
                  <div>
                    <span className="font-medium">E-Mail:</span> {formData.email}
                  </div>
                  <div>
                    <span className="font-medium">Telefon:</span> {formData.phone}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Adresse:</span> {formData.address},{' '}
                    {formData.postalCode} {formData.city}
                  </div>
                </div>

                {formData.specializations.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Spezialisierungen:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Was passiert nach der Anmeldung?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ihr Antrag wird innerhalb von 2-3 Werktagen geprüft</li>
                  <li>• Sie erhalten eine E-Mail mit dem Status Ihrer Bewerbung</li>
                  <li>• Nach erfolgreicher Prüfung wird Ihr Profil freigeschaltet</li>
                  <li>• Sie erhalten Zugang zu unserem Partner-Dashboard</li>
                  <li>• Ihre Werkstatt wird in der Suche angezeigt</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Wichtiger Hinweis</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Mit der Anmeldung bestätigen Sie, dass alle Angaben korrekt sind und Sie die
                      Nutzungsbedingungen akzeptieren.
                    </p>
                  </div>
                </div>
              </div>

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Anmeldung fehlgeschlagen</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Beim Einreichen Ihres Antrags ist ein Fehler aufgetreten. Bitte überprüfen
                        Sie Ihre Angaben und versuchen Sie es erneut.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zurück
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Weiter
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !areAllMandatoryFieldsFilled()}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wird gesendet...' : 'Antrag einreichen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
