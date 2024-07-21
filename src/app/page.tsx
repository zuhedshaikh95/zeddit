import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <section>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>

      <div className="grid grid-cols-1 py-6 gap-y-4 md:grid-cols-3 md:gap-x-4">
        {/* TODO: feed */}

        {/* TODO: subzeddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="-m-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Zeddit homepage. Come here to check in with your favorite communities.
              </p>
            </div>

            <Link className={buttonVariants({ className: 'w-full mt-4 mb-6' })} href="/z/create-community">
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
