"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className?: string }) {
  const { back } = useRouter();
  return (
    <Button variant={"ghost"} onClick={back} className={cn(className)}>
      <ChevronLeft className="me-2 h-4 w-4" />
      Home
    </Button>
  );
}
