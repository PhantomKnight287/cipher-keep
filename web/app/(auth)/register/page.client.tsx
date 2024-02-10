"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import signUp from "./action";
import { FormEvent, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/state/user";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const { setUser } = useUser();
  const { replace } = useRouter();
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore - the types seem to be wrong with async
    startTransition(async () => {
      const formData = new FormData(event.target as HTMLFormElement);
      const signUpResult = await signUp(formData);

      if (signUpResult?.error) {
        return toast.error(signUpResult.error);
      }
      setUser(signUpResult.user);
      toast.success("Welcome!");
      replace("/login");
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={signUp} onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <div className="group h-10 w-full py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary rounded flex self-center px-3 gap-2">
              <input
                id="username"
                name="username"
                placeholder="Username"
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
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="*******"
              type="password"
              autoComplete="new-password"
              autoCorrect="off"
              className="bg-secondary border-none"
              disabled={isPending}
              required
            />
          </div>

          <Button disabled={isPending} type="submit">
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
