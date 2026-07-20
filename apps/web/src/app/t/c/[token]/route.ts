import { NextResponse } from "next/server";
import { isOpaqueToken } from "@trackpixl/shared";
import { recordClick } from "@/lib/tracking";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  if (!isOpaqueToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const result = await recordClick(token);
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.redirect(result.originalUrl, 302);
}
