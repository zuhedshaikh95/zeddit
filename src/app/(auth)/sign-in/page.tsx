import Link from "next/link";

import { SignInForm } from "@/components/sign-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/libs/utils";

export default async function SignIn() {
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
          Home
        </Link>

        <SignInForm />
      </div>
    </section>
  );
}
