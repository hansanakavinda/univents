import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { moderateGigSchema } from '@/lib/validators/gigs'
import { moderateGig } from '@/data-access/gigs'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: DB freshness check for high-risk admin actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { gigId, action } = await validateRequest(request, moderateGigSchema)

    const result = await moderateGig({ gigId, action })

    return NextResponse.json({ success: result.success })
}, 'Moderate gig')
