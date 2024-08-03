import { notFound } from "next/navigation";

import { Editor } from "@/components/create-post";
import { Button } from "@/components/ui";
import { db } from "@/libs/db";

export default async function CreateSubZeddit({ params }: { params: { community: string } }) {
  const subZeddit = await db.subZeddit.findFirst({
    where: {
      name: params.community,
    },
  });

  if (!subZeddit) notFound();

  return (
    <div className="flex flex-col items-start gap-8">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">Create Post</h3>

          <p className="ml-2 mt-1 truncate text-sm text-gray-500">in z/{params.community}</p>
        </div>
      </div>

      {/* TODO: Create post form */}

      <Editor subZedditId={subZeddit.id} />

      <div className="w-full flex justify-end">
        <Button className="w-full" form="subzeddit-post-form" type="submit">
          Post
        </Button>
      </div>
    </div>
  );
}
