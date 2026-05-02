// Mount the GoldenHour merchant-agent at /.well-known/merchant-agent/*.
// This makes merchant-agent.dev itself a working merchant-agent — useful
// for HN visitors who want to point a buyer-agent at the demo site directly.

import { goldenhourAgent } from '@merchant-agent/example-goldenhour'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function handle(request: Request): Promise<Response> {
  return goldenhourAgent.fetch(request)
}

export const GET = handle
export const POST = handle
