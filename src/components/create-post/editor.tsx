"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextaraeAutoSize from "react-textarea-autosize";
import type EditorJS from "@editorjs/editorjs";

import { postValidator } from "@/libs/validations";
import { PostT, RouteResponseT } from "@types";
import { uploadFiles } from "@/libs/uploadthing";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks";

interface Props {
  subZedditId: string;
}

const Editor: React.FC<Props> = ({ subZedditId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const editorRef = useRef<EditorJS | null>(null);
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEditorMounted, setIsEditorMounted] = useState<boolean>(false);
  const { toast } = useToast();

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

  const { error, mutate: createPost } = useMutation({
    async mutationFn(values: PostT) {
      const response = await axios.post<RouteResponseT<string>>("/api/v1/subzeddit/post/create", values);

      toast({
        title: "Published!",
        description: response.data.message,
      });

      return response.data.data;
    },
    onSuccess(data) {
      const newPath = pathName.split("/").slice(0, -1).join("/");
      router.push(newPath);
      router.refresh();
    },
    onError(error: AxiosError<RouteResponseT<null>>) {
      return { data: null, message: error.response?.data.message || error.message, error: true };
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") setIsEditorMounted(true);
  }, []);

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

    if (!editorRef.current) {
      const editor: EditorJS = new Editor({
        holder: "editor",
        onReady() {
          editorRef.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles("imageUploader", { files: [file] });

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  const onSubmit: SubmitHandler<PostT> = async ({ subZedditId, title }) => {
    const blocks = await editorRef.current?.save();

    createPost({ subZedditId, title, content: blocks });
  };

  useEffect(() => {
    if (isEditorMounted) {
      (async () => {
        await initializeEditor();

        setTimeout(() => {
          _titleRef.current?.focus();
        }, 0);
      })();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = null;
      };
    }
  }, [isEditorMounted, initializeEditor]);

  const { ref: titleRef, ...titleRegister } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 ">
      <form className="w-fit" id="subzeddit-post-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="prose prose-stone dark:prose-invert">
          <TextaraeAutoSize
            ref={(event) => {
              titleRef(event);
              _titleRef.current = event;
            }}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...titleRegister}
          />

          <div className="min-h-[300px]" id="editor" />
        </div>
      </form>

      {!!Object.keys(errors).length && (
        <p className="text-xs text-red-500">{Object.entries(errors)[0][1]?.message as string} 😢</p>
      )}

      {error && <p className="absolute text-xs text-red-500 p-2">{error?.response?.data.message}</p>}
    </div>
  );
};

export default Editor;
