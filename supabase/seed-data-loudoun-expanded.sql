-- Expanded Loudoun County, Virginia data - Multiple offices
-- Provides comprehensive ballot coverage for all local/state races

-- ============================================================
-- ADDITIONAL CANDIDATES - Multiple Offices for Loudoun County, VA
-- ============================================================

-- SCHOOL BOARD (Loudoun County Public Schools)
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440020',
    'Patricia Anderson',
    'Loudoun County School Board - Ashburn District',
    'Non-partisan',
    'Parent and education advocate focused on curriculum transparency, parental rights, and academic excellence.',
    ARRAY['20147', '20148']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440021',
    'David Thompson',
    'Loudoun County School Board - Ashburn District',
    'Non-partisan',
    'Former principal advocating for teacher support, mental health resources, and inclusive education.',
    ARRAY['20147', '20148']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440022',
    'Rebecca Martinez',
    'Loudoun County School Board - Sterling District',
    'Non-partisan',
    'Technology executive focused on STEM education, digital literacy, and closing the achievement gap.',
    ARRAY['20164', '20165']
  );

-- STATE HOUSE OF DELEGATES
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440023',
    'James Morrison',
    'Virginia House of Delegates - District 86',
    'Republican',
    'Small business owner advocating for lower taxes, education choice, and limited government regulation.',
    ARRAY['20147', '20148']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440024',
    'Amanda Rodriguez',
    'Virginia House of Delegates - District 86',
    'Democrat',
    'Civil rights attorney focused on education funding, healthcare access, and criminal justice reform.',
    ARRAY['20147', '20148']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440025',
    'Thomas Park',
    'Virginia House of Delegates - District 87',
    'Republican',
    'Veteran and cybersecurity professional focused on public safety, national security, and veterans affairs.',
    ARRAY['20164', '20165']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440026',
    'Elizabeth Green',
    'Virginia House of Delegates - District 87',
    'Democrat',
    'Environmental scientist advocating for clean energy, climate action, and sustainable development.',
    ARRAY['20164', '20165']
  );

-- STATE SENATE
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440027',
    'Richard Bennett',
    'Virginia Senate - District 32',
    'Republican',
    'Incumbent senator with focus on economic development, transportation infrastructure, and fiscal conservatism.',
    ARRAY['20147', '20148', '20164', '20165']
  ),
  (
    '770e8400-e29b-41d4-a716-446655440028',
    'Katherine Wilson',
    'Virginia Senate - District 32',
    'Democrat',
    'Healthcare administrator advocating for Medicaid expansion, public education investment, and affordable housing.',
    ARRAY['20147', '20148', '20164', '20165']
  );

-- ADDITIONAL BOARD OF SUPERVISORS
INSERT INTO candidates (id, name, office, party, bio, zip_codes) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440029',
    'Daniel Cooper',
    'Loudoun County Board of Supervisors - Sterling District',
    'Republican',
    'Real estate developer focused on economic growth, infrastructure investment, and business-friendly policies.',
    ARRAY['20164', '20165']
  );

-- ============================================================
-- CANDIDATE POSITIONS - All new candidates
-- ============================================================

-- Patricia Anderson (School Board - Ashburn) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 4, 'Supports education funding with accountability and transparency', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 3, 'Supports maintaining current tax levels with efficient spending', '660e8400-e29b-41d4-a716-446655440005');

-- David Thompson (School Board - Ashburn) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports increased education funding for teacher pay and mental health', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 4, 'Supports tax increases specifically for education priorities', '660e8400-e29b-41d4-a716-446655440005');

-- Rebecca Martinez (School Board - Sterling) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports education funding for STEM and technology programs', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440007', 4, 'Supports public-private partnerships for education technology', '660e8400-e29b-41d4-a716-446655440005');

-- James Morrison (House 86) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440001', 3, 'Supports school choice and charter school expansion', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 1, 'Strongly opposes tax increases', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports tax cuts for small businesses', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440008', 2, 'Opposes Medicaid expansion', '660e8400-e29b-41d4-a716-446655440005');

-- Amanda Rodriguez (House 86) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports increased education funding', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440005', 5, 'Strongly supports environmental protection', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440008', 5, 'Strongly supports Medicaid expansion', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440006', 4, 'Supports public safety with criminal justice reform', '660e8400-e29b-41d4-a716-446655440005');

-- Thomas Park (House 87) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440006', 5, 'Strongly supports public safety funding', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440002', 2, 'Opposes tax increases', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440009', 4, 'Supports infrastructure investment for transportation', '660e8400-e29b-41d4-a716-446655440005');

-- Elizabeth Green (House 87) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440005', 5, 'Strongly supports environmental protection and clean energy', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440004', 5, 'Strongly supports public transportation expansion', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440003', 3, 'Supports sustainable development with environmental standards', '660e8400-e29b-41d4-a716-446655440005');

-- Richard Bennett (Senate 32) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440009', 5, 'Strongly supports transportation infrastructure investment', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440002', 2, 'Opposes broad tax increases', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports business-friendly policies', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440008', 2, 'Opposes Medicaid expansion', '660e8400-e29b-41d4-a716-446655440005');

-- Katherine Wilson (Senate 32) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440001', 5, 'Strongly supports public education investment', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440008', 5, 'Strongly supports healthcare access and Medicaid', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440003', 4, 'Supports affordable housing development', '660e8400-e29b-41d4-a716-446655440005'),
  ('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440004', 5, 'Strongly supports public transit investment', '660e8400-e29b-41d4-a716-446655440005');

-- Daniel Cooper (Board of Supervisors - Sterling) positions
INSERT INTO candidate_positions (candidate_id, issue_id, position, position_text, source_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440003', 5, 'Strongly supports development and economic growth', '660e8400-e29b-41d4-a716-446655440003'),
  ('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440009', 5, 'Strongly supports infrastructure investment', '660e8400-e29b-41d4-a716-446655440003'),
  ('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440007', 5, 'Strongly supports business incentives', '660e8400-e29b-41d4-a716-446655440003'),
  ('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440002', 2, 'Opposes tax increases, prefers growth-driven revenue', '660e8400-e29b-41d4-a716-446655440003');
