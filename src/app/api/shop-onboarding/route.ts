import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      address,
      city,
      postalCode,
      phone,
      email,
      category,
      contactPerson,
      legalForm,
      specializations
    } = body

    // Validate required fields
    if (!name || !description || !address || !city || !postalCode || !phone || !email || !category || !contactPerson) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll just log the application and return success
    // In production, this would save to a separate applications table
    console.log('New shop application received:', {
      name,
      category,
      contactPerson,
      email,
      phone,
      city,
      legalForm,
      specializations: specializations?.length || 0
    })

    // Simulate saving the application
    // In production, you would save to a shop_applications table
    // await prisma.shopApplication.create({
    //   data: {
    //     name,
    //     description,
    //     address,
    //     city,
    //     postalCode,
    //     phone,
    //     email,
    //     website,
    //     category,
    //     contactPerson,
    //     legalForm,
    //     insurance,
    //     specializations: specializations?.join(',') || '',
    //     status: 'PENDING'
    //   }
    // })

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        applicationId: `APP-${Date.now()}`
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing shop application:', error)
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
} 