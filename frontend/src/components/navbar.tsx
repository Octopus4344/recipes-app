"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/user-context";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, logout } = useUser();
  const currentPath = usePathname();
  const router = useRouter();

  const isActive = (path: string) => currentPath === path ? 'text-primary' : 'hover:text-gray-600';

  if (!user || currentPath === "/login" || currentPath === "/register") {
    return (
      <div />
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login")
  }

  return (
    <div>
      <nav className="navbar fixed top-0 left-0 w-full navbar-expand-lg navbar-dark bg-white px-16 xl:px-24 py-4 z-10">
        <div className="flex justify-between items-center text-l text-black w-full">
          <Link href="/">
            <Image alt="CookKing app logo" src="/logo.svg" width={60} height={60} />
          </Link>
          <div className="flex flex-wrap items-center space-x-10 xl:space-x-24 left-3">
            <Link className={isActive("/")} href="/">Home</Link>
            {user.role === "amator" && (
              <Link className={isActive("/favourites")} href="/favourites">Favourites</Link>
            )}
            {user?.role === "amator" ? (
                <Link className={isActive("/chat")} href="/chat">Chat with the chef</Link>
              )
              : user?.role === "restaurant" ? (
                  <Link className={isActive("/my-recipes")} href="/my-recipes">My recipes</Link>
                )
                : user?.role === "cook" ? (
                    <Link className={isActive("/chat")} href="/chat">Chat with an amateur</Link>
                  )
                  : user?.role === "foodProducer" ? (
                    <Link className={isActive("/my-products")} href="/my-products">My products</Link>
                  ) : <Link className={isActive("/chat")} href="/chat">Chat with the chef</Link>
            }
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image src="/profile-pic.svg" alt="Profile picture" className="cursor-pointer" width={50} height={50} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <Button variant="ghost" onClick={handleLogout}>Log out</Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}

