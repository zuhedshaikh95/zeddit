import Link from "next/link";

import { Icons, SearchBar, UserAccountNav } from "@/components/global";
import { getAuthSession } from "@/libs/auth";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

const Navbar = async ({}) => {
  const session = await getAuthSession();

  return (
    <nav
      className="
        fixed top-0 inset-x-0
        h-fit
        bg-zinc-100
        border-b border-zinc-300
        z-10
        py-2"
    >
      <div
        className="
            container
            max-w-7xl h-full
            mx-auto
            flex items-center justify-between gap-x-2"
      >
        <Link href="/" className="flex gap-2 items-center" passHref>
          <Image src="/zeddit-logo-only.svg" height="80" width="80" alt="zeddit-logo" />
        </Link>

        {/* TODO: search bar */}
        <SearchBar />

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
