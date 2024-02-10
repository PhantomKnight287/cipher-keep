export const Environment = {
    production: "production",
    staging: "staging",
    development: "development"
} as const;
export type Environment = (typeof Environment)[keyof typeof Environment];
