import { API_URL, defaultHeaders } from "@/constants";
import { Project, Secret } from "@/types";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AddSecretForm from "./page.client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import BackButton from "@/components/shared/back";

async function ProjectPage({ params }: { params: { id: string } }) {
  const cookiesStore = cookies();
  const tokenCookie = cookiesStore.get("cipher_token");
  if (!tokenCookie?.value) redirect(`/login`);
  const req = await fetch(`${API_URL}/projects/${params.id}`, {
    headers: defaultHeaders(tokenCookie.value),
    next: {
      tags: [`projectInfo::${params.id}`],
    },
    cache: "force-cache",
  });
  if (!req.ok) {
    if (req.status === 404)
      return redirect(
        `/404?message=${encodeURIComponent("Project Not Found")}`
      );
    return notFound();
  }
  const res = (await req.json()) as {
    project: Pick<Project, "name">;
    secrets: Secret[];
  };
  return (
    <div className="container">
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="font-heading text-2xl font-medium text-left w-fit">
          {res.project.name}
        </h3>
        <AddSecretForm projectId={params.id} />
      </div>
      {res.secrets?.length === 0 ? (
        <p className="w-full text-lg font-medium text-center">
          No Secrets Found
        </p>
      ) : (
        <Table>
          <TableCaption>A list of secrets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res.secrets.map((secret) => (
              <TableRow key={secret.id}>
                <TableCell>{secret.name}</TableCell>
                <TableCell className="max-w-[200px] overflow-hidden">
                  {secret.value.substring(0, 20)}...
                </TableCell>
                <TableCell>{secret.environment}</TableCell>
                <TableCell className="flex flex-row gap-4 items-center justify-end">
                  <Button
                    variant={"ghost"}
                    className="hover:bg-transparent p-0"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="hover:bg-transparent p-0"
                  >
                    <Trash className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ProjectPage;
