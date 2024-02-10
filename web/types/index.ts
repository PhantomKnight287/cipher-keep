export interface Project {
  id: string;
  name: string;
  publicKey: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Secret {
  id: string;
  name: string;
  value: string;
  environment: Environment;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
}

export enum Environment {
  development = "development",
  staging = "staging",
  production = "production",
}
