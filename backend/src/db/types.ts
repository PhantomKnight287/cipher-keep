import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Environment } from "./enums";

export type Projects = {
    id: string;
    name: string;
    publicKey: string;
    ownerId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type Secret = {
    id: string;
    name: string;
    value: string;
    environment: Environment;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    projectId: string | null;
};
export type User = {
    id: string;
    username: string;
    password: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type DB = {
    projects: Projects;
    secrets: Secret;
    user: User;
};
