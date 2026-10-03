import React from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 text-muted-foreground">
      <div className="container mx-auto px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 text-base font-bold text-foreground">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="size-4" />
              </div>
              <span>FakeStore Direct</span>
            </div>
            <p className="max-w-sm text-sm">
              Server-Side Rendered e-commerce catalog featuring real-time client
              filtering, dynamic routing, and accessible UI.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=asc"
                  className="transition-colors hover:text-foreground"
                >
                  Sort Ascending
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=desc"
                  className="transition-colors hover:text-foreground"
                >
                  Sort Descending
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              API Reference
            </h4>
            <p className="text-sm">
              Powered by{" "}
              <a
                href="https://fakestoreapi.com"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                FakeStore API
              </a>
              .
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Built with Next.js App Router, Tailwind CSS, & TypeScript.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs">
          © {new Date().getFullYear()} FakeStore Direct. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
