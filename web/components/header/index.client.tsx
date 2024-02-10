"use client";

import { useUser } from "@/state/user";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eraseCookie } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

function HeaderLinks() {
  const { user, setUser } = useUser();
  const { replace } = useRouter();
  return (
    <div className="ml-auto flex flex-row gap-2 items-center">
      {user?.id ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={"/projects"}>Projects</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-white focus:bg-red-500 cursor-pointed"
                onClick={() => {
                  eraseCookie("cipher_token");
                  setUser({});
                  replace("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link
            className={buttonVariants({
              variant: "default",
            })}
            href={"/login"}
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}

export default HeaderLinks;
