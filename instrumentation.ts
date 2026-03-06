export async function register() {
    // Only run cron jobs on the server (not during build or in Edge runtime)
    // Dynamic import prevents Edge runtime from resolving Node.js-only modules
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initCronJobs } = await import('@/lib/cron')
        initCronJobs()
    }
}
