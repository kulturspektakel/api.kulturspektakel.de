ALTER TABLE "public"."BandPlaying" DROP CONSTRAINT "bandplaying_photo_foreign";
ALTER TABLE "public"."Event" DROP CONSTRAINT "event_poster_foreign";

ALTER TABLE "public"."BandPlaying" ADD CONSTRAINT "bandplaying_photo_foreign" FOREIGN KEY ("photo") REFERENCES "directus"."directus_files"("id") ON DELETE SET NULL;
ALTER TABLE "public"."Event" ADD CONSTRAINT "event_poster_foreign" FOREIGN KEY ("poster") REFERENCES "directus"."directus_files"("id") ON DELETE SET NULL;
