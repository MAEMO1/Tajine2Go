ALTER TABLE dishes
ADD COLUMN ingredients_nl TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN ingredients_fr TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN ingredients_en TEXT[] NOT NULL DEFAULT '{}';
