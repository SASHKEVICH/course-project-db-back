/*
  Warnings:

  - The primary key for the `album/band` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `album/band` table. All the data in the column will be lost.
  - The primary key for the `album/song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `album/song` table. All the data in the column will be lost.
  - The `founded` column on the `band` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ended` column on the `band` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `genre/album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `genre/album` table. All the data in the column will be lost.
  - The primary key for the `genre/band` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `genre/band` table. All the data in the column will be lost.
  - The primary key for the `member/band` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `member/band` table. All the data in the column will be lost.
  - The primary key for the `social_media/band` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `social_media/band` table. All the data in the column will be lost.
  - The primary key for the `social_media/member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `social_media/member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[band_id]` on the table `band` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `album_id` on table `album/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `band_id` on table `album/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `album_id` on table `album/song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `song_id` on table `album/song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `album_id` on table `genre/album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre_id` on table `genre/album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre_id` on table `genre/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `band_id` on table `genre/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `band_id` on table `member/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `member_id` on table `member/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `social_media_id` on table `social_media/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `band_id` on table `social_media/band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `member_id` on table `social_media/member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `social_media_id` on table `social_media/member` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "album" DROP CONSTRAINT "fk_album_type";

-- DropForeignKey
ALTER TABLE "album/band" DROP CONSTRAINT "fk_album_id";

-- DropForeignKey
ALTER TABLE "album/band" DROP CONSTRAINT "fk_band_id";

-- DropForeignKey
ALTER TABLE "genre/album" DROP CONSTRAINT "fk_album_id";

-- DropForeignKey
ALTER TABLE "genre/album" DROP CONSTRAINT "fk_genre_id";

-- DropForeignKey
ALTER TABLE "genre/band" DROP CONSTRAINT "fk_band_id";

-- DropForeignKey
ALTER TABLE "genre/band" DROP CONSTRAINT "fk_genre_id";

-- DropForeignKey
ALTER TABLE "member/band" DROP CONSTRAINT "fk_band_id";

-- DropForeignKey
ALTER TABLE "member/band" DROP CONSTRAINT "fk_member_id";

-- DropForeignKey
ALTER TABLE "social_media" DROP CONSTRAINT "fk_social_media_type";

-- DropForeignKey
ALTER TABLE "social_media/band" DROP CONSTRAINT "fk_band_id";

-- DropForeignKey
ALTER TABLE "social_media/band" DROP CONSTRAINT "fk_social_media_id";

-- DropForeignKey
ALTER TABLE "social_media/member" DROP CONSTRAINT "fk_member_id";

-- DropForeignKey
ALTER TABLE "social_media/member" DROP CONSTRAINT "fk_social_media_id";

-- AlterTable
ALTER TABLE "album/band" DROP CONSTRAINT "album/band_pkey",
DROP COLUMN "id",
ALTER COLUMN "album_id" SET NOT NULL,
ALTER COLUMN "band_id" SET NOT NULL,
ADD CONSTRAINT "album/band_pkey" PRIMARY KEY ("album_id", "band_id");

-- AlterTable
ALTER TABLE "album/song" DROP CONSTRAINT "album/song_pkey",
DROP COLUMN "id",
ALTER COLUMN "album_id" SET NOT NULL,
ALTER COLUMN "song_id" SET NOT NULL,
ADD CONSTRAINT "album/song_pkey" PRIMARY KEY ("album_id", "song_id");

-- AlterTable
CREATE SEQUENCE band_band_id_seq;
ALTER TABLE "band" ALTER COLUMN "band_id" SET DEFAULT nextval('band_band_id_seq'),
DROP COLUMN "founded",
ADD COLUMN     "founded" DATE,
DROP COLUMN "ended",
ADD COLUMN     "ended" DATE;
ALTER SEQUENCE band_band_id_seq OWNED BY "band"."band_id";

-- AlterTable
ALTER TABLE "genre/album" DROP CONSTRAINT "pkey_genre/album",
RENAME CONSTRAINT "pkey_genre/album" TO "genre/album_pkey",
DROP COLUMN "id",
ALTER COLUMN "album_id" SET NOT NULL,
ALTER COLUMN "genre_id" SET NOT NULL,
ADD CONSTRAINT "genre/album_pkey" PRIMARY KEY ("album_id", "genre_id");

-- AlterTable
ALTER TABLE "genre/band" DROP CONSTRAINT "genre/band_pkey",
DROP COLUMN "id",
ALTER COLUMN "genre_id" SET NOT NULL,
ALTER COLUMN "band_id" SET NOT NULL,
ADD CONSTRAINT "genre/band_pkey" PRIMARY KEY ("genre_id", "band_id");

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "photo_path" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "member/band" DROP CONSTRAINT "member/band_pkey",
DROP COLUMN "id",
ALTER COLUMN "band_id" SET NOT NULL,
ALTER COLUMN "member_id" SET NOT NULL,
ADD CONSTRAINT "member/band_pkey" PRIMARY KEY ("band_id", "member_id");

-- AlterTable
ALTER TABLE "social_media/band" DROP CONSTRAINT "social_media/band_pkey",
DROP COLUMN "id",
ALTER COLUMN "social_media_id" SET NOT NULL,
ALTER COLUMN "band_id" SET NOT NULL,
ADD CONSTRAINT "social_media/band_pkey" PRIMARY KEY ("social_media_id", "band_id");

-- AlterTable
ALTER TABLE "social_media/member" DROP CONSTRAINT "social_media/member_pkey",
DROP COLUMN "id",
ALTER COLUMN "member_id" SET NOT NULL,
ALTER COLUMN "social_media_id" SET NOT NULL,
ADD CONSTRAINT "social_media/member_pkey" PRIMARY KEY ("member_id", "social_media_id");

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "token" TEXT,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "password" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "band_band_id_key" ON "band"("band_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "fk_album_type" FOREIGN KEY ("type") REFERENCES "album_type"("album_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album/band" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genre/album" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genre/album" ADD CONSTRAINT "fk_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genre/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genre/band" ADD CONSTRAINT "fk_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member/band" ADD CONSTRAINT "fk_member_id" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "fk_social_media_type" FOREIGN KEY ("type") REFERENCES "social_media_type"("social_media_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media/band" ADD CONSTRAINT "fk_social_media_id" FOREIGN KEY ("social_media_id") REFERENCES "social_media"("social_media_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media/member" ADD CONSTRAINT "fk_member_id" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media/member" ADD CONSTRAINT "fk_social_media_id" FOREIGN KEY ("social_media_id") REFERENCES "social_media"("social_media_id") ON DELETE CASCADE ON UPDATE CASCADE;
