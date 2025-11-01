-- Expanded Lincoln County, North Carolina data - Multiple offices
-- Provides comprehensive ballot coverage for all local/state races

-- ============================================================
-- ADDITIONAL CANDIDATES - Multiple Offices for Lincoln County, NC
-- ============================================================

-- SCHOOL BOARD (Lincoln County Schools)
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440030',
    'Mary Ellen Foster',
    'Lincoln County Board of Education - District 1',
    'Non-partisan',
    'Parent and community volunteer advocating for teacher support, school safety, and parental involvement.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440031',
    'Charles Mitchell',
    'Lincoln County Board of Education - District 1',
    'Non-partisan',
    'Retired educator focused on reading proficiency, career and technical education, and fiscal responsibility.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440032',
    'Angela Brown',
    'Lincoln County Board of Education - At Large',
    'Non-partisan',
    'Business leader advocating for workforce development, technology integration, and academic accountability.',
    ARRAY['28092', '28090']
  );

-- STATE HOUSE
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440033',
    'William Jackson',
    'North Carolina House - District 109',
    'Republican',
    'Manufacturing executive focused on job creation, workforce development, and reducing business regulations.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440034',
    'Laura Henderson',
    'North Carolina House - District 109',
    'Democrat',
    'Public school teacher advocating for education funding, healthcare access, and rural broadband expansion.',
    ARRAY['28092', '28090']
  );

-- STATE SENATE
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440035',
    'Steven Carter',
    'North Carolina Senate - District 42',
    'Republican',
    'Incumbent senator with focus on economic development, agriculture support, and conservative values.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440036',
    'Michelle Roberts',
    'North Carolina Senate - District 42',
    'Democrat',
    'Nurse practitioner advocating for Medicaid expansion, rural healthcare access, and public education.',
    ARRAY['28092', '28090']
  );

-- ADDITIONAL COUNTY COMMISSIONERS
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440037',
    'George Patterson',
    'Lincoln County Commissioner - District 2',
    'Republican',
    'Farmer and small business owner focused on agriculture, property rights, and limited government.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440038',
    'Susan Taylor',
    'Lincoln County Commissioner - District 2',
    'Democrat',
    'Social worker advocating for community services, affordable housing, and public health initiatives.',
    ARRAY['28092', '28090']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440039',
    'Michael Harrison',
    'Lincoln County Commissioner - At Large',
    'Republican',
    'Business owner focused on economic development, infrastructure improvements, and fiscal conservatism.',
    ARRAY['28092', '28090']
  );

-- ============================================================
-- CANDIDATE POSITIONS - All new candidates
-- ============================================================

-- Mary Ellen Foster (School Board - District 1) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 4, 'Supports education funding for teacher pay and school safety', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440006', 5, 'Strongly supports school safety and security measures', '660e8400-e29b-41d4-a716-446655440002');

-- Charles Mitchell (School Board - District 1) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 4, 'Supports education funding with focus on core academics', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440002', 3, 'Supports maintaining current tax levels with efficiency', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440007', 4, 'Supports career and technical education partnerships with businesses', '660e8400-e29b-41d4-a716-446655440002');

-- Angela Brown (School Board - At Large) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440001', 4, 'Supports education funding for technology and workforce prep', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports business partnerships in education', '660e8400-e29b-41d4-a716-446655440002');

-- William Jackson (State House 109) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440002', 1, 'Strongly opposes tax increases', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports business incentives and deregulation', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440008', 2, 'Opposes Medicaid expansion', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440009', 4, 'Supports infrastructure investment for economic development', '660e8400-e29b-41d4-a716-446655440002');

-- Laura Henderson (State House 109) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports increased education funding', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440008', 5, 'Strongly supports Medicaid expansion', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440004', 4, 'Supports rural broadband and infrastructure investment', '660e8400-e29b-41d4-a716-446655440002');

-- Steven Carter (State Senate 42) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440002', 2, 'Opposes tax increases', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports agriculture and small business support', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440008', 2, 'Opposes Medicaid expansion', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440009', 4, 'Supports rural infrastructure and broadband', '660e8400-e29b-41d4-a716-446655440002');

-- Michelle Roberts (State Senate 42) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports public education investment', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440008', 5, 'Strongly supports healthcare access and Medicaid', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440006', 4, 'Supports public safety and rural healthcare', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440009', 4, 'Supports rural infrastructure investment', '660e8400-e29b-41d4-a716-446655440002');

-- George Patterson (Commissioner - District 2) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440002', 1, 'Strongly opposes property tax increases', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports agriculture and small business', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440003', 3, 'Supports balanced development protecting property rights', '660e8400-e29b-41d4-a716-446655440004');

-- Susan Taylor (Commissioner - District 2) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports education funding', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440008', 5, 'Strongly supports healthcare access', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440003', 4, 'Supports affordable housing development', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440006', 4, 'Supports public health and safety initiatives', '660e8400-e29b-41d4-a716-446655440004');

-- Michael Harrison (Commissioner - At Large) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports economic development and business growth', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440009', 5, 'Strongly supports infrastructure investment', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440002', 2, 'Opposes tax increases, prefers economic growth', '660e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440003', 4, 'Supports development with proper planning', '660e8400-e29b-41d4-a716-446655440004');
