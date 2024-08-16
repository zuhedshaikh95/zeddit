import Link from "next/link";

import { Icons, SearchBar, UserAccountNav } from "@/components/global";
import { getAuthSession } from "@/libs/auth";
import { buttonVariants } from "../ui/button";

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
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden sm:block text-zinc-700 font-bold text-lg">zeddit</p>
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
