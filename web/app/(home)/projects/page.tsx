import { API_URL, defaultHeaders } from "@/constants";
import { Project } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import CreateProjectForm from "./page.client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fromNow } from "@/helpers/time";

async function Projects() {
  const cookiesStore = cookies();
  const token = cookiesStore.get("cipher_token")?.value;
  if (!token) return notFound();
  const req = await fetch(`${API_URL}/projects`, {
    headers: defaultHeaders(token),
  });
  if (!req.ok) return notFound();
  const res = (await req.json()) as Project[];
  return (
    <div className="container">
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="font-heading text-2xl font-medium text-left w-fit">
          Projects
        </h3>
        <CreateProjectForm />
      </div>
      {res.length === 0 ? (
        <>
          <p className="text-xl text-center w-full">No Projects Found</p>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {res.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>

                {/* <CardFooter>
                  <p className="text-muted-foreground">
                    Created {fromNow(new Date(project.createdAt).toLocaleString("en-IN"))}
                  </p>
                </CardFooter> */}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;

export const metadata: Metadata = {
  title: "Projects",
  description: "View projects created on CipherKeep",
};
