import { Connection, Client } from '@temporalio/client';
import { OneClickBuy } from 'temporal/lib/workflows.js';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const { itemId, transactionId } = await req.json();
  if (!itemId) {
    return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "no item id"
        }),
        { status: 500 }
    );
  }
  // Connect to localhost with default ConnectionOptions,
  // pass options to the Connection constructor to configure TLS and other settings.
  const connection = await Connection.connect();
  // Workflows will be started in the "default" namespace unless specified otherwise
  // via options passed the Client constructor.
  const client = new Client({ connection });
  // kick off the purchase async
  await client.workflow.start(OneClickBuy, {
    taskQueue: 'ecommerce-oneclick',
    workflowId: transactionId,
    args: [itemId],
  });

  return NextResponse.json({
    data: { ok: true },
    status: 200
  });
}
