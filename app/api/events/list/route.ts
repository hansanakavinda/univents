import { asyncCatcher } from '@/lib/api/api-utils'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = asyncCatcher(async (request: Request) => {
    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') ?? '4')
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const uniId = searchParams.get('uniId') || undefined
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'happening') || undefined

    const session = await auth()
    const userId = session?.user?.id

    const events = await getApprovedEventsPaginated({ take, skip, userId, uniId, sortBy })

    return NextResponse.json({ events })
}, 'List events')
