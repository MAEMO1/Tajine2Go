-- Nieuwe event types voor catering: feesten, evenementen, recepties, andere.
-- Oude waarden (wedding, aqiqa, corporate, funeral, iftar) blijven in de enum
-- staan voor bestaande rijen; ze worden niet meer aangeboden in de UI.
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'party';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'event';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'reception';
