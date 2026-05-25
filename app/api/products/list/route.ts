import { asyncCatcher } from '@/lib/api/api-utils'
import { getApprovedProductsPaginated } from '@/data-access/products'
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
    const uniId = searchParams.get('uniId') || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const priceType = searchParams.get('priceType') || undefined
    const search = searchParams.get('search') || undefined

    const products = await getApprovedProductsPaginated({ take, skip, uniId, categoryId, priceType, search })

    return NextResponse.json({ products })
}, 'List products')
