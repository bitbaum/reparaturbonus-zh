import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getAllowedUploadExtension, MAX_UPLOAD_SIZE_BYTES } from '@/lib/uploads'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params
    const formData = await request.formData()
    const residenceProof = formData.get('residenceProof') as File

    if (!residenceProof) {
      return NextResponse.json(
        { error: 'Residence proof is required' },
        { status: 400 }
      )
    }

    const extension = getAllowedUploadExtension(residenceProof.type)
    if (!extension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF, JPEG, or PNG.' },
        { status: 400 }
      )
    }

    if (residenceProof.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 10 MB.' },
        { status: 400 }
      )
    }

    // Verify bonus code exists and is valid
    const bonusCode = await prisma.bonusCode.findUnique({
      where: {
        code: resolvedParams.code.toUpperCase(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!bonusCode) {
      return NextResponse.json(
        { error: 'Bonus code not found' },
        { status: 404 }
      )
    }

    if (bonusCode.isUsed) {
      return NextResponse.json(
        { error: 'Bonus code already used' },
        { status: 400 }
      )
    }

    if (new Date() > bonusCode.expiresAt) {
      return NextResponse.json(
        { error: 'Bonus code expired' },
        { status: 400 }
      )
    }

    // Save residence proof file
    const bytes = await residenceProof.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'residence-proofs')
    await mkdir(uploadsDir, { recursive: true })

    // The stored name is built entirely from server-controlled values (the
    // already-validated bonus code and a timestamp) plus the extension
    // resolved above — the client-supplied `residenceProof.name` is never
    // used, so it cannot be used for path traversal / arbitrary file write.
    const filename = `${bonusCode.code}_${Date.now()}${extension}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    // Mark bonus code as used and store file path
    const updatedBonusCode = await prisma.bonusCode.update({
      where: {
        code: resolvedParams.code.toUpperCase(),
      },
      data: {
        isUsed: true,
        usedAt: new Date(),
        residenceProofPath: filename,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        shop: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Bonus code used successfully',
      bonusCode: updatedBonusCode,
      residenceProofPath: filename,
    })
  } catch (error) {
    console.error('Error using bonus code:', error)
    return NextResponse.json(
      { error: 'Failed to use bonus code' },
      { status: 500 }
    )
  }
}