import { cookies } from "next/headers";

/**
 * Mengambil cookie header string untuk digunakan dalam fetch request
 * @returns Cookie header string yang siap digunakan
 */
export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

/**
 * Membuat fetch headers dengan cookie yang sudah disertakan
 * @param additionalHeaders - Header tambahan yang ingin ditambahkan
 * @returns Headers object yang siap digunakan untuk fetch
 */
export async function createAuthHeaders(
  additionalHeaders?: HeadersInit
): Promise<HeadersInit> {
  const cookieHeader = await getCookieHeader();
  return {
    Cookie: cookieHeader,
    ...additionalHeaders,
  };
}

/**
 * Fetch helper dengan cookie authentication
 * @param url - URL endpoint
 * @param options - Fetch options
 * @returns Response dari fetch
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const headers = await createAuthHeaders(options?.headers);

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: options?.cache ?? "no-store",
  });
}
