'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import Hero from '@/components/landing/Hero'
import CategoryStep from '@/components/landing/CategoryStep'
import DetailsStep from '@/components/landing/DetailsStep'
import HowItWorks from '@/components/landing/HowItWorks'
import ImpactSection from '@/components/landing/ImpactSection'
import WorkshopRecruitment from '@/components/landing/WorkshopRecruitment'
import BrowseWorkshops from '@/components/landing/BrowseWorkshops'

type WizardStep = 0 | 1 | 2

/**
 * Landing orchestrator. Owns the 3-step "find a repair" wizard state; the
 * visual sections live in dedicated components under components/landing.
 */
export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [problemDescription, setProblemDescription] = useState('')

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep(2)
  }

  const handleSubmitRepair = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      search: itemDescription,
      ...(problemDescription && { problem: problemDescription }),
    })
    router.push(`${ROUTES.SHOPS}?${params.toString()}`)
  }

  const handleSkipToShops = () => {
    router.push(ROUTES.SHOPS)
  }

  return (
    <div className="min-h-screen bg-bg">
      {step === 0 && (
        <>
          <Hero onStart={() => setStep(1)} />
          <HowItWorks />
          <ImpactSection />
          <WorkshopRecruitment />
          <BrowseWorkshops />
        </>
      )}

      {step === 1 && (
        <CategoryStep onSelect={handleCategorySelect} onBack={() => setStep(0)} />
      )}

      {step === 2 && selectedCategory && (
        <DetailsStep
          categoryId={selectedCategory}
          itemDescription={itemDescription}
          problemDescription={problemDescription}
          onItemChange={setItemDescription}
          onProblemChange={setProblemDescription}
          onSubmit={handleSubmitRepair}
          onBack={() => setStep(1)}
          onSkip={handleSkipToShops}
        />
      )}
    </div>
  )
}
