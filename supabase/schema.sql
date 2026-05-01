-- HousePredict AI — Supabase schema
-- Run this in your Supabase SQL editor to set up the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Prediction history ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
    id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    postcode         TEXT,
    region           TEXT         NOT NULL,
    property_type    TEXT         NOT NULL,
    bedrooms         INTEGER      NOT NULL,
    bathrooms        INTEGER,
    floor_area_sqft  INTEGER,
    condition        TEXT,
    tenure           TEXT,
    predicted_price  NUMERIC(12,2) NOT NULL,
    price_low        NUMERIC(12,2) NOT NULL,
    price_high       NUMERIC(12,2) NOT NULL,
    confidence_score INTEGER      NOT NULL,
    created_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Historical regional price data ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regional_prices (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    region            TEXT         NOT NULL,
    year              INTEGER      NOT NULL,
    property_type     TEXT         DEFAULT 'All',
    avg_price         NUMERIC(12,2) NOT NULL,
    transaction_count INTEGER,
    created_at        TIMESTAMPTZ  DEFAULT NOW(),
    UNIQUE (region, year, property_type)
);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE predictions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_regional"    ON regional_prices;
DROP POLICY IF EXISTS "public_insert_predictions" ON predictions;
DROP POLICY IF EXISTS "public_select_predictions" ON predictions;

CREATE POLICY "public_select_regional" ON regional_prices FOR SELECT USING (true);
CREATE POLICY "public_insert_predictions" ON predictions   FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select_predictions" ON predictions   FOR SELECT USING (true);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_regional_region_year ON regional_prices (region, year);
CREATE INDEX IF NOT EXISTS idx_predictions_created  ON predictions     (created_at DESC);

-- ── User profiles (buyer / seller) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role                TEXT        NOT NULL CHECK (role IN ('buyer', 'seller')),
    full_name           TEXT,
    phone               TEXT,
    preferred_region    TEXT,
    property_type_pref  TEXT,
    budget_min          INTEGER,
    budget_max          INTEGER,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_profile" ON profiles;
CREATE POLICY "users_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- ── Trigger: auto-create profile on sign up ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
