import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/libs/auth";
import { UsernameForm } from "@/components/settings";

export default async function Settings() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <section className="max-w-4xl mx-auto py-12">
      <div className="grid items-center gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <UsernameForm
            user={{
              id: session.user.id,
              username: session.user.username!,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "",
};
