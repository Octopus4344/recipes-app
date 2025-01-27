"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/user-context";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";

export function Navbar() {
  const { user, logout } = useUser();
  const currentPath = usePathname();
  const router = useRouter();
  const { isPending, data: userNotifications } = useQuery<
    { id: string; content: string }[]
  >({
    queryKey: ["userNotifications"],
    queryFn: async () => {
      return await fetchData("user/notifications", "GET");
    },
  });

  const isActive = (path: string) =>
    currentPath === path ? "text-primary" : "hover:text-gray-600";

  if (!user || currentPath === "/login" || currentPath === "/register") {
    return <div />;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed left-0 top-0 z-10 w-full bg-white px-16 py-4 xl:px-24">
        <div className="text-l flex w-full items-center justify-between text-black">
          <Link href="/">
            <Image
              alt="CookKing app logo"
              src="/logo.svg"
              width={60}
              height={60}
            />
          </Link>
          <div className="left-3 flex flex-wrap items-center space-x-10 xl:space-x-14">
            <Link className={isActive("/")} href="/">
              Home
            </Link>
            {user.role === "amator" && (
              <Link className={isActive("/favourites")} href="/favourites">
                Favourites
              </Link>
            )}
            {user?.role === "amator" ? (
              <Link className={isActive("/chat")} href="/chat">
                Chat with the chef
              </Link>
            ) : user?.role === "restaurant" ? (
              <Link className={isActive("/my-recipes")} href="/my-recipes">
                My recipes
              </Link>
            ) : user?.role === "cook" ? (
              <Link className={isActive("/chat")} href="/chat">
                Chat with an amateur
              </Link>
            ) : user?.role === "food_producer" ? (
              <Link className={isActive("/my-products")} href="/my-products">
                My products
              </Link>
            ) : (
              <Link className={isActive("/chat")} href="/chat">
                Chat with the chef
              </Link>
            )}
            {user?.role === "food_producer" && (
              <Link
                className={isActive("/food-packages")}
                href="/food-packages"
              >
                Food packages
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  src="/profile-pic.svg"
                  alt="Profile picture"
                  className="cursor-pointer"
                  width={50}
                  height={50}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "amator" && (
                  <DropdownMenuItem>
                    <Link
                      className={isActive("/my-recipes")}
                      href="/my-recipes"
                    >
                      My recipes
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "amator" && (
                  <DropdownMenuItem>
                    <Link
                      className={isActive("/my-profile")}
                      href="/my-profile"
                    >
                      My profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Bell size={24} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isPending
                  ? "Loading"
                  : userNotifications?.map((notification) => {
                      return (
                        <DropdownMenuItem key={notification.id}>
                          {notification.content}
                        </DropdownMenuItem>
                      );
                    })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}
