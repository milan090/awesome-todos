/*
  Warnings:

  - A unique constraint covering the columns `[nextTodoId]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "nextTodoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_nextTodoId_key" ON "Todo"("nextTodoId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_nextTodoId_fkey" FOREIGN KEY ("nextTodoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
