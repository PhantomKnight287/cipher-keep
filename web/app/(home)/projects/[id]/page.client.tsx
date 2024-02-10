"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, use, useMemo, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HTTPSnippet } from "httpsnippet";

import { Label } from "@/components/ui/label";
import { Code, Loader2 } from "lucide-react";
import createNewSecret from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants";
import { Environment } from "@/types";
import { codeToHtml } from "shiki";

function AddSecretForm({ projectId }: { projectId: string }) {
  const [opened, setOpened] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [env, setEnv] = useState<keyof typeof Environment>("development");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore - the types seem to be wrong with async
    startTransition(async () => {
      const formData = new FormData(event.target as HTMLFormElement);
      const createSecretResult = await createNewSecret(formData);
      if (createSecretResult.error) {
        return toast.error(createSecretResult.error);
      } else if (createSecretResult.id) {
        toast.success("New Secret Created!");
        refresh();
        setOpened(false);
      }
    });
  }

  const snippet = useMemo(() => {
    return new HTTPSnippet({
      method: "POST",
      url: `${API_URL}/secrets/${projectId}/${env}/decode`,
      postData: {
        mimeType: "application/json",
        text: JSON.stringify({
          key: "your private key encoded in base64",
        }),
      },
    });
  }, [env]);

  const code = use(
    codeToHtml(
      snippet.convert("javascript", "fetch", {
        indent: "\t",
      }) as string,
      {
        lang: "javascript",
        theme: "github-dark",
        mergeWhitespaces: true,
        transformers: [
          {
            line(node, line) {
              this.addClassToHast(node, ["break-words", ""]);
            },
            pre(hast) {
              this.addClassToHast(hast, "!bg-transparent");
            },
          },
        ],
      }
    )
  );

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant={"secondary"}
          className="flex flex-row gap-2"
          onClick={() => setApiDialogOpen((o) => !o)}
        >
          <Code />
          API
        </Button>
        <Button onClick={() => setOpened((o) => !o)}>Add New Secret</Button>
      </div>

      <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Api Reference</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row items-center justify-between gap-4">
            <Select
              name="environment"
              defaultValue={env}
              onValueChange={(v) => setEnv(v as keyof typeof Environment)}
            >
              <SelectTrigger disabled={isPending}>
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                navigator?.clipboard
                  ?.writeText(
                    snippet.convert("javascript", "fetch", {
                      indent: "\t",
                    }) as string
                  )
                  .then(() => {
                    toast.success("Copied");
                  });
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: code,
            }}
            className="overflow-x-scroll"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Secret</DialogTitle>
            <DialogDescription>
              Add a new secret in your secure vault
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
            <input type="hidden" name="projectId" value={projectId} />
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <div className="group h-10 w-full py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary rounded flex self-center px-3 gap-2">
                  <input
                    id="name"
                    name="name"
                    placeholder="DATABASE_URL"
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
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="value">
                  Value
                </Label>
                <div className="group h-10 w-full py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary rounded flex self-center px-3 gap-2">
                  <input
                    id="value"
                    name="value"
                    placeholder="postgres://..."
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
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="environment">
                  Environment
                </Label>
                <Select name="environment">
                  <SelectTrigger disabled={isPending}>
                    <SelectValue placeholder="Environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button disabled={isPending} type="submit">
                {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSecretForm;
