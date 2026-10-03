import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function LegacyProductRoute({ params }: PageProps) {
  const { productId } = await params
  redirect(`/products/${productId}`)
}
