'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

// Centralized form configuration
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

export default function ShopOnboardingRefactored() {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    legalForm: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    postalCode: '',
    city: '',
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Grundinformationen
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Werkstatt Name"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="z.B. Revamp-IT"
          required
        />

        <FormInput
          label="Ansprechperson"
          value={formData.contactPerson}
          onChange={handleChange('contactPerson')}
          placeholder="Ihr Name"
          required
        />

        <FormSelect
          label="Rechtsform"
          value={formData.legalForm}
          onChange={handleChange('legalForm')}
          options={legalFormOptions}
          placeholder="Bitte wählen Sie eine Rechtsform"
          icon={<InformationCircleIcon className="h-4 w-4 text-gray-400" />}
          helpText="Die häufigsten Formen sind Einzelunternehmen (für Einzelpersonen) und GmbH (für Gesellschaften)"
        />

        <FormInput
          label="Telefon"
          value={formData.phone}
          onChange={handleChange('phone')}
          type="tel"
          placeholder="+41 44 123 45 67"
          required
        />

        <FormInput
          label="E-Mail"
          value={formData.email}
          onChange={handleChange('email')}
          type="email"
          placeholder="info@ihre-werkstatt.ch"
          required
        />

        <FormInput
          label="Website"
          value={formData.website}
          onChange={handleChange('website')}
          type="url"
          placeholder="https://ihre-werkstatt.ch"
        />
      </div>
    </div>
  );
}
