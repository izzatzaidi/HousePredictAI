-- HousePredict AI — Supabase seed data
-- Regional average house prices 2019–2024 (source: ONS UK House Price Index patterns)
-- Run AFTER schema.sql

INSERT INTO regional_prices (region, year, property_type, avg_price, transaction_count) VALUES
-- London
('London', 2019, 'All', 469000, 108000),
('London', 2020, 'All', 484000,  95000),
('London', 2021, 'All', 516000, 120000),
('London', 2022, 'All', 545000, 110000),
('London', 2023, 'All', 527000,  85000),
('London', 2024, 'All', 532000,  88000),

-- South East
('South East', 2019, 'All', 352000, 145000),
('South East', 2020, 'All', 362000, 132000),
('South East', 2021, 'All', 388000, 165000),
('South East', 2022, 'All', 406000, 152000),
('South East', 2023, 'All', 393000, 118000),
('South East', 2024, 'All', 397000, 122000),

-- East of England
('East of England', 2019, 'All', 298000, 98000),
('East of England', 2020, 'All', 308000, 90000),
('East of England', 2021, 'All', 330000, 112000),
('East of England', 2022, 'All', 352000, 104000),
('East of England', 2023, 'All', 341000,  80000),
('East of England', 2024, 'All', 344000,  83000),

-- South West
('South West', 2019, 'All', 289000, 112000),
('South West', 2020, 'All', 303000, 102000),
('South West', 2021, 'All', 325000, 130000),
('South West', 2022, 'All', 347000, 120000),
('South West', 2023, 'All', 334000,  93000),
('South West', 2024, 'All', 337000,  97000),

-- West Midlands
('West Midlands', 2019, 'All', 232000, 95000),
('West Midlands', 2020, 'All', 242000, 88000),
('West Midlands', 2021, 'All', 261000, 108000),
('West Midlands', 2022, 'All', 278000, 100000),
('West Midlands', 2023, 'All', 266000,  78000),
('West Midlands', 2024, 'All', 268000,  81000),

-- East Midlands
('East Midlands', 2019, 'All', 218000, 88000),
('East Midlands', 2020, 'All', 227000, 81000),
('East Midlands', 2021, 'All', 244000, 100000),
('East Midlands', 2022, 'All', 260000,  93000),
('East Midlands', 2023, 'All', 249000,  72000),
('East Midlands', 2024, 'All', 251000,  75000),

-- Yorkshire
('Yorkshire', 2019, 'All', 191000, 82000),
('Yorkshire', 2020, 'All', 199000, 76000),
('Yorkshire', 2021, 'All', 213000, 95000),
('Yorkshire', 2022, 'All', 226000, 88000),
('Yorkshire', 2023, 'All', 218000, 68000),
('Yorkshire', 2024, 'All', 220000, 71000),

-- North West
('North West', 2019, 'All', 200000, 110000),
('North West', 2020, 'All', 208000, 101000),
('North West', 2021, 'All', 225000, 126000),
('North West', 2022, 'All', 239000, 116000),
('North West', 2023, 'All', 231000,  90000),
('North West', 2024, 'All', 233000,  93000),

-- North East
('North East', 2019, 'All', 150000, 48000),
('North East', 2020, 'All', 155000, 44000),
('North East', 2021, 'All', 167000, 56000),
('North East', 2022, 'All', 178000, 52000),
('North East', 2023, 'All', 170000, 40000),
('North East', 2024, 'All', 171000, 42000),

-- Wales
('Wales', 2019, 'All', 194000, 60000),
('Wales', 2020, 'All', 201000, 55000),
('Wales', 2021, 'All', 218000, 70000),
('Wales', 2022, 'All', 232000, 65000),
('Wales', 2023, 'All', 221000, 50000),
('Wales', 2024, 'All', 223000, 52000),

-- Scotland
('Scotland', 2019, 'All', 178000, 90000),
('Scotland', 2020, 'All', 185000, 83000),
('Scotland', 2021, 'All', 199000, 104000),
('Scotland', 2022, 'All', 211000, 96000),
('Scotland', 2023, 'All', 202000, 74000),
('Scotland', 2024, 'All', 204000, 77000)

ON CONFLICT (region, year, property_type) DO NOTHING;
