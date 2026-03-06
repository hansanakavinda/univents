import { asyncCatcher } from '@/lib/api/api-utils'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = asyncCatcher(async (request: Request) => {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') ?? '4')
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const uniId = searchParams.get('uniId') || undefined
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'happening') || undefined

    const events = await getApprovedEventsPaginated({ take, skip, userId: session.user.id, uniId, sortBy })

    return NextResponse.json({ events })
}, 'List events')
