/*
  Warnings:

  - Added the required column `name` to the `Sender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sender" ADD COLUMN     "name" TEXT NOT NULL;
