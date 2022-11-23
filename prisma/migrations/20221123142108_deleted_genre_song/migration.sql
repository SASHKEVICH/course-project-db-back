/*
  Warnings:

  - You are about to drop the `genre/song` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "genre/song" DROP CONSTRAINT "fk_genre_id";

-- DropForeignKey
ALTER TABLE "genre/song" DROP CONSTRAINT "fk_song_id";

-- DropTable
DROP TABLE "genre/song";
