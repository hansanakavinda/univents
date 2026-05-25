import { asyncCatcher } from '@/lib/api/api-utils'
import { getApprovedHustlesPaginated } from '@/data-access/hustles'
import { NextResponse } from 'next/server'
import getSession from '@/lib/getSession'

export const GET = asyncCatcher(async (request: Request) => {
    const session = await getSession()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') ?? '8')
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const categoryId = searchParams.get('categoryId') || undefined
    const hustleType = searchParams.get('hustleType') || undefined
    const workMode = searchParams.get('workMode') || undefined
    const priceType = searchParams.get('priceType') || undefined
    const search = searchParams.get('search') || undefined

    const hustles = await getApprovedHustlesPaginated({
        take,
        skip,
        categoryId,
        hustleType,
        workMode,
        priceType,
        search,
    })

    return NextResponse.json({ hustles })
}, 'List hustles')
