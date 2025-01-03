"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user } = useUser();
  const currentPath = usePathname();

  const isActive = (path: string) => currentPath === path ? 'text-primary' : 'hover:text-gray-600';

  // if (!user) {
  //   return (
  //     <div>Zaloguj się</div>
  // )
  // }

  return (
    <div>
      <nav className="navbar fixed top-0 left-0 w-full navbar-expand-lg navbar-dark bg-white px-16 py-4 z-10">
        <div className="flex justify-between items-center text-l text-black w-full">
          <Link href="/">
            <Image alt="CookKing app logo" src="/logo.svg" width={60} height={60} />
          </Link>
          <div className="flex flex-wrap items-center space-x-10 left-3">
            <Link className={isActive("/")} href="/">Home</Link>
            <Link className={isActive("/favourites")} href="/favourites">Favourites</Link>
            {user?.role === "amateur" ? (
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
            <Image src={"/profile-pic.svg"} alt={"Profile picture"} width={50} height={50} />
          </div>
        </div>
      </nav>
    </div>
  );
}
