-- @param {String} $1:ID of the Directus file

SELECT "external_identifier" FROM "directus"."directus_users" WHERE "id"=$1::uuid
