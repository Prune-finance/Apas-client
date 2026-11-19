import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const name = req.nextUrl.searchParams.get("name") || "document";

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "File not found" }, { status: res.status });
  }

  const contentType = res.headers.get("Content-Type") || "application/octet-stream";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(name)}"`,
      "Content-Length": String(body.byteLength),
    },
  });
}
