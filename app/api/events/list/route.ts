import { asyncCatcher } from '@/lib/api/api-utils'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = asyncCatcher(async (request: Request) => {
    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') ?? '4')
    const skip = parseInt(searchParams.get('skip') ?? '0')

    const session = await auth()
    const userId = session?.user?.id

    const events = await getApprovedEventsPaginated({ take, skip, userId })

    return NextResponse.json({ events })
}, 'List events')
