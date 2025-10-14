"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-shadow duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold text-neutral-900 transition-colors hover:text-neutral-700"
        >
          <span className="text-display">Smart Agent Alliance</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-display transition-colors",
                        pathname === link.href
                          ? "text-yellow-600 hover:text-yellow-700"
                          : "text-neutral-700 hover:text-neutral-900"
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <Button
            asChild
            className="bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-600"
          >
            <Link href="/schedule"><span className="text-display">Schedule a Call</span></Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-700 hover:text-neutral-900"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-display">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col space-y-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-display rounded-md px-4 py-3 text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-yellow-50 text-yellow-600"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="mt-4 w-full bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-600"
                >
                  <Link href="/schedule" onClick={() => setIsOpen(false)}>
                    <span className="text-display">Schedule a Call</span>
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
