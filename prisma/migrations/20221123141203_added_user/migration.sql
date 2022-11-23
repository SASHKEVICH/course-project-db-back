-- DropForeignKey
ALTER TABLE "album/song" DROP CONSTRAINT "fk_album_id";

-- DropForeignKey
ALTER TABLE "album/song" DROP CONSTRAINT "fk_song_id";

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "nickname" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "password" VARCHAR(60) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "album/song" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album/song" ADD CONSTRAINT "fk_song_id" FOREIGN KEY ("song_id") REFERENCES "song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;
