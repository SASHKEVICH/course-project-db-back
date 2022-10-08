-- CreateTable
CREATE TABLE "album" (
    "album_id" SERIAL NOT NULL,
    "title" VARCHAR(30),
    "album_cover_path" TEXT,
    "released" DATE,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "history" TEXT,
    "type" INTEGER,

    CONSTRAINT "pkey_album_id" PRIMARY KEY ("album_id")
);

-- CreateTable
CREATE TABLE "album/band" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER,
    "band_id" INTEGER,
    "order" INTEGER,

    CONSTRAINT "album/band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album/song" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER,
    "song_id" INTEGER,
    "order" INTEGER,

    CONSTRAINT "album/song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_type" (
    "album_type_id" SERIAL NOT NULL,
    "type" VARCHAR(30),

    CONSTRAINT "album_type_pkey" PRIMARY KEY ("album_type_id")
);

-- CreateTable
CREATE TABLE "band" (
    "band_id" INTEGER NOT NULL,
    "title" VARCHAR(40) NOT NULL,
    "history" TEXT,
    "origin_city" VARCHAR(30),
    "photo_path" TEXT,
    "founded" VARCHAR(30),
    "ended" VARCHAR(30),
    "country" VARCHAR(40),

    CONSTRAINT "band_pkey" PRIMARY KEY ("band_id")
);

-- CreateTable
CREATE TABLE "genre" (
    "genre_id" SERIAL NOT NULL,
    "name" VARCHAR(20),

    CONSTRAINT "genre_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "genre/album" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER,
    "genre_id" INTEGER,

    CONSTRAINT "pkey_genre/album" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre/band" (
    "id" SERIAL NOT NULL,
    "genre_id" INTEGER,
    "band_id" INTEGER,

    CONSTRAINT "genre/band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre/song" (
    "id" SERIAL NOT NULL,
    "genre_id" INTEGER,
    "song_id" INTEGER,

    CONSTRAINT "genre/song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "member_id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "biography" TEXT,
    "birth_date" DATE,
    "die_date" DATE,
    "origin_city" VARCHAR(40),

    CONSTRAINT "member_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "member/band" (
    "previous" BOOLEAN,
    "id" SERIAL NOT NULL,
    "band_id" INTEGER,
    "member_id" INTEGER,

    CONSTRAINT "member/band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media" (
    "social_media_id" SERIAL NOT NULL,
    "link" TEXT,
    "type" INTEGER,

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("social_media_id")
);

-- CreateTable
CREATE TABLE "social_media/band" (
    "id" SERIAL NOT NULL,
    "social_media_id" INTEGER,
    "band_id" INTEGER,

    CONSTRAINT "social_media/band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media/member" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER,
    "social_media_id" INTEGER,

    CONSTRAINT "social_media/member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_type" (
    "social_media_type_id" SERIAL NOT NULL,
    "type" VARCHAR(30),

    CONSTRAINT "social_media_type_pkey" PRIMARY KEY ("social_media_type_id")
);

-- CreateTable
CREATE TABLE "song" (
    "song_id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "duration" VARCHAR(20),

    CONSTRAINT "song_pkey" PRIMARY KEY ("song_id")
);

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "fk_album_type" FOREIGN KEY ("type") REFERENCES "album_type"("album_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "album/band" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "album/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "album/song" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "album/song" ADD CONSTRAINT "fk_song_id" FOREIGN KEY ("song_id") REFERENCES "song"("song_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/album" ADD CONSTRAINT "fk_album_id" FOREIGN KEY ("album_id") REFERENCES "album"("album_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/album" ADD CONSTRAINT "fk_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/band" ADD CONSTRAINT "fk_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/song" ADD CONSTRAINT "fk_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "genre/song" ADD CONSTRAINT "fk_song_id" FOREIGN KEY ("song_id") REFERENCES "song"("song_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member/band" ADD CONSTRAINT "fk_member_id" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "fk_social_media_type" FOREIGN KEY ("type") REFERENCES "social_media_type"("social_media_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media/band" ADD CONSTRAINT "fk_band_id" FOREIGN KEY ("band_id") REFERENCES "band"("band_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media/band" ADD CONSTRAINT "fk_social_media_id" FOREIGN KEY ("social_media_id") REFERENCES "social_media"("social_media_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media/member" ADD CONSTRAINT "fk_member_id" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media/member" ADD CONSTRAINT "fk_social_media_id" FOREIGN KEY ("social_media_id") REFERENCES "social_media"("social_media_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
