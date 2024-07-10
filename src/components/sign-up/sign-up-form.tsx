import Link from "next/link";

import { Icons } from "@/components/global";
import { UserAuthForm } from "@/components/sign-in";

const SignUpForm = () => {
  return (
    <div
      className="
        container
        mx-auto
        w-[400px] sm:w-full
        flex flex-col justify-center
        space-y-6"
    >
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Zeddit account and agree to out
          User Agreement and Privacy Policy
        </p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already a Zedditor?{" "}
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
