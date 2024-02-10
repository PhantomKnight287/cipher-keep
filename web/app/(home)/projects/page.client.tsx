"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import createNewProject from "./action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
  const [isPending, startTransition] = useTransition();
  const [opened, setOpened] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [href, setHref] = useState<string | undefined>(undefined);
  const { refresh } = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore - the types seem to be wrong with async
    startTransition(async () => {
      const formData = new FormData(event.target as HTMLFormElement);
      const createProjectResult = await createNewProject(formData);
      setProjectName(formData.get("name") as string);
      if (createProjectResult?.error) {
        return toast.error(createProjectResult.error);
      }
      const textBlob = new Blob([createProjectResult.keys], {
        type: "text/plain",
      });
      const href = window.URL.createObjectURL(textBlob);
      setHref(href);
      const e = document.createElement("a");
      e.href = href;
      e.download = `${(formData.get("name") as string).replaceAll(
        " ",
        "-"
      )}.pem`;
      e.click();
      refresh();
    });
  }

  return (
    <>
      <Button
        variant={"default"}
        onClick={() => (isPending ? undefined : setOpened((o) => !o))}
      >
        Create New Project
      </Button>

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new project?</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col w-full space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <div className="group h-10 w-full py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary rounded flex self-center px-3 gap-2">
                  <input
                    id="name"
                    name="name"
                    placeholder="Super Secret Project"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    className="w-full focus-visible:outline-none bg-transparent"
                    disabled={isPending}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              disabled={isPending || href != undefined}
              className={cn({
                "bg-green-500": href != undefined,
              })}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : href !== undefined ? (
                "Created"
              ) : (
                "Create"
              )}
            </Button>
            <a
              download={`${projectName.replaceAll(" ", "-") || "project"}.pem`}
              href={href}
              className={buttonVariants({
                variant: "default",
                className: cn({
                  hidden: !href,
                }),
              })}
            >
              Download Key
            </a>
            <p
              className={cn("text-center text-red-500", {
                hidden: !href,
              })}
            >
              Key can&apos;t be downloaded after this modal is closed
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
