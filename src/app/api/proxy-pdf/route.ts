import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Get cookies to forward auth
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken");

    const headers: HeadersInit = {
      Accept: "application/pdf",
    };

    if (authToken) {
      headers.Cookie = `authToken=${authToken.value}`;
    }

    // Fetch from backend
    const response = await fetch(fileUrl, {
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.statusText}` },
        { status: response.status }
      );
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy PDF error:", error);
    return NextResponse.json({ error: "Failed to proxy PDF" }, { status: 500 });
  }
}
