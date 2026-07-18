import { NextResponse } from "next/server";
import { isOpaqueToken } from "@mail-tracking/shared";
import { PIXEL_GIF, recordOpen } from "@/lib/tracking";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  if (!isOpaqueToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ua = req.headers.get("user-agent");
  const event = await recordOpen(token, ua);
  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
    },
  });
}
