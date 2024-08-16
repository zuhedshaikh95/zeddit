"use client";

import { useDebouncedCallback } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import { Command, Input } from "@/components/ui";
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
      {/* TODO: style search-bar */}
      <Input
        className="relative rounded-lg border max-w-lg z-50 overflow-visiblec focus-visible:ring-0"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          handleSearch();
        }}
      />

      {search.length > 0 && (
        <Command.List className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <Command.Empty>No results found.</Command.Empty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <Command.Group heading="Communities">
              {queryResults?.map((subreddit) => (
                <Command.Item
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}
        </Command.List>
      )}
    </Command.Root>
  );
};

export default SearchBar;
