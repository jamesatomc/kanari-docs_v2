import { getDocPages, getLLMText } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scanned = getDocPages().map(getLLMText);

  return new Response(scanned.join("\n\n"));
}
