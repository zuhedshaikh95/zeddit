"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import TextaraeAutoSize from "react-textarea-autosize";

import { postValidator } from "@/libs/validations";
import { PostT } from "@types";
import dynamic from "next/dynamic";

interface Props {
  subZedditId: string;
}

const Editor: React.FC<Props> = ({ subZedditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostT>({
    resolver: zodResolver(postValidator),
    defaultValues: {
      content: null,
      subZedditId,
      title: "",
    },
  });

  const initializeEditor = useCallback(async () => {
    const Editor = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
  }, []);

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form className="w-fit" id="subzeddit-post-form" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextaraeAutoSize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};

export default Editor;
