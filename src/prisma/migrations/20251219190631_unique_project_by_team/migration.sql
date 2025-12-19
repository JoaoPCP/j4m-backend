/*
  Warnings:

  - A unique constraint covering the columns `[created_by]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_created_by_key" ON "projects"("created_by");
