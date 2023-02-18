CREATE OR REPLACE FUNCTION slugify("value" TEXT) RETURNS TEXT AS $$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- replaces anything that's not a letter, number or hyphen('-') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\-]+', '-', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-+', '') AS "value"
    FROM "hyphenated"
  )
  SELECT "value" FROM "trimmed";
$$ LANGUAGE SQL STRICT IMMUTABLE;


--- Band slug
CREATE OR REPLACE FUNCTION public.set_slug_from_name() RETURNS trigger
  LANGUAGE plpgsql AS $$
    BEGIN
      NEW.slug := slugify(NEW.name);
    RETURN NEW;
  END
$$;

DROP TRIGGER IF EXISTS "bandplaying_generate_slug" on "BandPlaying";

CREATE TRIGGER "bandplaying_generate_slug"
  BEFORE INSERT ON "BandPlaying" FOR EACH ROW
    WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
    EXECUTE PROCEDURE set_slug_from_name();


-- News slug
CREATE OR REPLACE FUNCTION public.set_slug_from_title() RETURNS trigger
  LANGUAGE plpgsql AS $$
    BEGIN
      NEW.slug := slugify(NEW.title);
    RETURN NEW;
  END
$$;

DROP TRIGGER IF EXISTS "news_generate_slug" on "News";

CREATE TRIGGER "news_generate_slug"
  BEFORE INSERT ON "News" FOR EACH ROW
    WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
    EXECUTE PROCEDURE set_slug_from_title();