/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "secrets" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
