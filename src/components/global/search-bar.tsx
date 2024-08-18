"use client";

import { useDebouncedCallback } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Search, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import { Command } from "@/components/ui";
import { useOnOutsideClick } from "@/hooks";
import { ExtendedSubZedditI, RouteResponseT } from "@types";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const commandRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState<string>("");

  useOnOutsideClick(commandRef, () => {
    setSearch("");
  });

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery<ExtendedSubZedditI[], AxiosError<RouteResponseT>>({
    initialData: [],
    queryKey: ["search-query"],
    queryFn: async () => {
      if (!search) return [];

      const response = await axios.get<RouteResponseT<ExtendedSubZedditI[]>>(`/api/v1/search?q=${search}`);

      return response.data.data;
    },
    enabled: false,
  });

  const handleSearch = useDebouncedCallback(() => {
    refetch();
  }, 800);

  return (
    <Command.Root ref={commandRef} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <div className="flex items-center border-b px-3">
        {isFetching ? (
          <Loader2 className="mr-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
        ) : (
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        )}
        <input
          className="rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search communities..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            handleSearch();
          }}
        />
      </div>

      {!!search.length && (
        <Command.List className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <Command.Empty>No results found.</Command.Empty>}
          {!!queryResults.length && (
            <Command.Group heading="Communities">
              {queryResults.map((subreddit) => (
                <Command.Item
                  onSelect={(e) => {
                    router.refresh();
                    setSearch("");
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <Link href={`/z/${subreddit.name}`}>z/{subreddit.name}</Link>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      )}
    </Command.Root>
  );
};

export default SearchBar;
