import { asyncCatcher } from '@/lib/api/api-utils'
import { getAllUniversities } from '@/data-access/universities'
import { NextResponse } from 'next/server'

export const GET = asyncCatcher(async () => {
    const universities = await getAllUniversities()

    return NextResponse.json({ universities })
}, 'List universities')
