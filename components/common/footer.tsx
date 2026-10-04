
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 text-muted-foreground">
      <div className="container mx-auto px-4 py-10 sm:px-6">
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs">
          © {new Date().getFullYear()} FakeStore Direct. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
