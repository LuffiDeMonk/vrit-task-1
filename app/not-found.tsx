import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { buttonVariants } from "@/components/shared/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        404 - Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Sorry, we couldn&apos;t find the product or page you are looking for. It
        may have been moved or removed.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "gap-2"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Link>
      </div>
    </div>
  )
}
