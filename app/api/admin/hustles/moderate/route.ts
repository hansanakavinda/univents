import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { moderateHustleSchema } from '@/lib/validators/hustles'
import { moderateHustle } from '@/data-access/hustles'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: DB freshness check for high-risk admin actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { hustleId, action } = await validateRequest(request, moderateHustleSchema)

    const result = await moderateHustle({ hustleId, action })

    return NextResponse.json({ success: result.success })
}, 'Moderate hustle')
