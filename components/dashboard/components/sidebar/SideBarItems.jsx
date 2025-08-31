import Link from "next/link";
import React from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SideBarItems = ({ SideBarList, listNames }) => {
  return (
    <>
      {/* list of inbox, today, scheduled, filter & label */}
      {SideBarList.map(({ name, icon }, id) => {
        const Icon = icon; // instantiate component
        return (
          <Link
            key={id}
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          >
            <Icon className="w-5 h-5" /> {/* render JSX */}
            {name}
            {name === "Today" || name === "Scheduled" ? (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                10
              </Badge>
            ) : null}
          </Link>
        );
      })}

      <Separator />

      {/* List: Default Section */}
      {(() => {
        const Icon = listNames[0].icon;
        return (
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary border my-2"
          >
            <Icon className="w-5 h-5" />
            {listNames[0].name}
          </Link>
        );
      })()}

      <Separator />

      {/* Custom List Section */}
      <h2 className="px-2 pt-2 text-xl">Custom List</h2>
      {listNames
        .filter((_, id) => id !== 0)
        .map(({ name, icon }, id) => {
          const Icon = icon;
          return (
            <Link
              key={id}
              href="#"
              className="capitalize flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          );
        })}

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-2 py-2" variant={"outline"}>
            Create Custom list <PlusCircle className="mx-1 w-5 h-5" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Separator />

      {/* Tags Section */}
      {/* <TagsAccordian /> */}
    </>
  );
};