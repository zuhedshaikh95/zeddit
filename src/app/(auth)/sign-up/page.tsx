import Link from "next/link";

import { SignUpForm } from "@/components/sign-up";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { ChevronLeft } from "lucide-react";

export default async function SignUp() {
  return (
    <section className="absolute inset-0">
      <div
        className="
            h-full max-w-2xl
            mx-auto
            flex flex-col items-center justify-center gap-20"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>

        <SignUpForm />
      </div>
    </section>
  );
}
