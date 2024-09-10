-- @param {String} $1:ID of the Directus file

SELECT * FROM "directus"."directus_files" WHERE "id"=$1::uuid
