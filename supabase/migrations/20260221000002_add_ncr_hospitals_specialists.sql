-- ============================================================================
-- ADD TOP NCR HOSPITALS AND SPECIALISTS
-- ============================================================================
-- This script adds 10 premier hospitals in Delhi NCR with their specialists
-- Run this in Supabase SQL Editor after running COMPLETE_DATABASE_SETUP.sql
-- ============================================================================

-- Clean up existing test data if needed (optional)
-- DELETE FROM specialists;
-- DELETE FROM hospitals;

-- ============================================================================
-- 1. MEDANTA - THE MEDICITY (GURUGRAM)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'medanta-the-medicity-gurugram',
  'Medanta - The Medicity',
  'Gurugram',
  'Haryana',
  4.8,
  5200,
  ARRAY['Cardiac Surgery', 'Liver Transplant', 'Oncology', 'Orthopaedics', 'Neurosciences', 'Gastroenterology', 'Urology', 'Endocrinology', 'Thoracic Surgery', 'Critical Care'],
  ARRAY['JCI Accredited', 'NABH Accredited', 'NABL Accredited'],
  'Flagship 1,300+ bed "Global Health" city consistently ranking as one of the best private hospitals in India. Known for excellence in cardiac surgery, liver transplants, and comprehensive cancer care.',
  2009,
  1300,
  800,
  'Sector 38, Gurugram, Haryana 122001',
  '+91-124-4141414',
  'info@medanta.org',
  'https://www.medanta.org',
  ARRAY['24/7 Emergency', 'International Patient Services', 'Advanced Diagnostics', 'Medical Tourism', 'Telemedicine', 'Airport Pickup', 'Visa Assistance'],
  50000,
  96.5,
  60,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specialties = EXCLUDED.specialties;

-- Add Medanta Specialists
INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Naresh Trehan',
  'Cardiac Surgery',
  'MBBS, MS, FRCS (Chairman & Managing Director)',
  50,
  'Renowned cardiovascular and cardiothoracic surgeon. Pioneer of coronary artery bypass surgery in India. Performed over 48,000 open-heart surgeries.',
  98.5,
  48000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'medanta-the-medicity-gurugram'
ON CONFLICT DO NOTHING;

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Arvinder Singh Soin',
  'Liver Transplant',
  'MBBS, MS, FRCS, FRCS (Ed)',
  30,
  'Leading liver transplant surgeon with one of the highest success rates in Asia. Performed over 4,000 liver transplants.',
  97.8,
  4000,
  ARRAY['English', 'Hindi', 'Punjabi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'medanta-the-medicity-gurugram';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Ashok Rajgopal',
  'Orthopaedics',
  'MBBS, MS (Ortho), FICS',
  35,
  'Pioneer in knee and hip replacement surgeries. Expert in joint reconstruction and sports medicine.',
  96.5,
  25000,
  ARRAY['English', 'Hindi'],
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  true
FROM hospitals h WHERE h.slug = 'medanta-the-medicity-gurugram';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Ashok Vaid',
  'Medical Oncology',
  'MBBS, MD (Medicine), DM (Medical Oncology)',
  28,
  'Expert in solid tumors and haematological malignancies. Specializes in targeted therapy and immunotherapy.',
  94.2,
  15000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'medanta-the-medicity-gurugram';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Arun Garg',
  'Neurosciences',
  'MBBS, MD, DM (Neurology)',
  25,
  'Specialist in stroke management, epilepsy, and movement disorders. Known for advanced neurological care.',
  95.8,
  18000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Tuesday', 'Thursday'],
  true
FROM hospitals h WHERE h.slug = 'medanta-the-medicity-gurugram';

-- ============================================================================
-- 2. INDRAPRASTHA APOLLO HOSPITAL (SARITA VIHAR, DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'indraprastha-apollo-hospital-delhi',
  'Indraprastha Apollo Hospital',
  'Delhi',
  'Delhi',
  4.7,
  4800,
  ARRAY['Multi-organ Transplants', 'Nephrology', 'Robotic Surgery', 'Gynaecology', 'Cardiology', 'ENT Surgery', 'Neurology', 'Medical Oncology', 'Urology'],
  ARRAY['JCI Accredited - First in India', 'NABH Accredited', 'NABL Accredited'],
  'Spread over 15 acres, first hospital in India to be internationally accredited by JCI. Pioneer in multi-organ transplants and advanced robotic surgery.',
  1996,
  710,
  600,
  'Sarita Vihar, Delhi Mathura Road, New Delhi 110076',
  '+91-11-26925858',
  'contact@apollohospdelhi.com',
  'https://www.apollohospitals.com/delhi',
  ARRAY['24/7 Emergency', 'International Patient Services', 'Robotic Surgery', 'Medical Tourism', 'Telemedicine', 'Airport Pickup'],
  45000,
  95.8,
  55,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add Apollo Specialists
INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Sandeep Guleria',
  'Kidney Transplant',
  'MBBS, MS, MCh (Urology)',
  32,
  'Leading kidney transplant surgeon with expertise in living and cadaveric transplants. Over 3,500 successful transplants.',
  97.5,
  3500,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'indraprastha-apollo-hospital-delhi';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Shakti Bhan Khanna',
  'Gynaecology',
  'MBBS, MD, FICOG',
  28,
  'Expert in high-risk pregnancies, laparoscopic surgery, and gynecological oncology.',
  96.2,
  20000,
  ARRAY['English', 'Hindi'],
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  true
FROM hospitals h WHERE h.slug = 'indraprastha-apollo-hospital-delhi';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Amit Mittal',
  'Cardiology',
  'MBBS, MD, DM (Cardiology)',
  26,
  'Interventional cardiologist specializing in complex angioplasties and heart failure management.',
  95.8,
  16000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Wednesday', 'Thursday'],
  true
FROM hospitals h WHERE h.slug = 'indraprastha-apollo-hospital-delhi';

-- ============================================================================
-- 3. MAX SUPER SPECIALITY HOSPITAL (SAKET, DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'max-super-speciality-hospital-saket',
  'Max Super Speciality Hospital',
  'Delhi',
  'Delhi',
  4.7,
  4500,
  ARRAY['Cardiac Sciences', 'Neurosciences', 'Orthopaedics', 'Pulmonology', 'Surgical Oncology', 'Vascular Surgery', 'Urology', 'Endocrinology', 'Plastic Surgery', 'Bariatric Surgery'],
  ARRAY['NABH Accredited', 'NABL Accredited', 'Green OT Certified'],
  'Flagship of Max network, known for BrainSUITE technology and advanced cancer care. Premier destination for cardiac and neurosciences.',
  2006,
  500,
  450,
  'Press Enclave Road, Saket, New Delhi 110017',
  '+91-11-26515050',
  'info@maxhealthcare.com',
  'https://www.maxhealthcare.in/hospitals/saket',
  ARRAY['24/7 Emergency', 'BrainSUITE', 'Robotic Surgery', 'International Patient Services', 'Medical Tourism'],
  38000,
  96.2,
  58,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add Max Saket Specialists
INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Ramneek Mahajan',
  'Orthopaedics',
  'MBBS, MS (Ortho), DNB',
  24,
  'Expert in joint replacement surgery and arthroscopic procedures. Specialist in knee and hip arthroplasty.',
  96.8,
  12000,
  ARRAY['English', 'Hindi', 'Punjabi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'max-super-speciality-hospital-saket';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Bipin S. Walia',
  'Neurosciences',
  'MBBS, MS, MCh (Neurosurgery)',
  28,
  'Pioneer in minimally invasive spine surgery and complex brain surgeries. Expert in BrainSUITE procedures.',
  97.2,
  15000,
  ARRAY['English', 'Hindi'],
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  true
FROM hospitals h WHERE h.slug = 'max-super-speciality-hospital-saket';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Pradeep Chowbey',
  'Bariatric Surgery',
  'MBBS, MS, FACS, FICS, FAIS',
  35,
  'Pioneer of laparoscopic and bariatric surgery in India. Performed over 20,000 laparoscopic procedures.',
  98.2,
  20000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'max-super-speciality-hospital-saket';

-- ============================================================================
-- 4. FORTIS MEMORIAL RESEARCH INSTITUTE (GURUGRAM)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'fortis-memorial-research-institute-gurugram',
  'Fortis Memorial Research Institute',
  'Gurugram',
  'Haryana',
  4.8,
  5000,
  ARRAY['Oncology', 'Haematology', 'BMT', 'Pediatric Care', 'Neurosciences', 'Gastroenterology', 'Surgical Oncology', 'Infertility/IVF', 'Pediatric Cardiac Surgery', 'Urology'],
  ARRAY['NABH Accredited', 'NABL Accredited', 'JCI Accredited'],
  'Known as the "Mecca of Healthcare" for the region. Premier research and referral center for Fortis with advanced bone marrow transplant unit.',
  2014,
  1000,
  650,
  'Sector 44, Gurugram, Haryana 122002',
  '+91-124-4962200',
  'info@fortishealthcare.com',
  'https://www.fortishealthcare.com/fmri-gurgaon',
  ARRAY['24/7 Emergency', 'BMT Center', 'International Patient Services', 'Medical Tourism', 'Telemedicine'],
  42000,
  96.8,
  62,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add FMRI Specialists
INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Rahul Bhargava',
  'Haematology/BMT',
  'MBBS, MD, DM (Clinical Haematology)',
  22,
  'Leading haematologist and BMT specialist. Expert in treating blood cancers and disorders.',
  96.5,
  8000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Tuesday', 'Thursday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'fortis-memorial-research-institute-gurugram';

INSERT INTO specialists (hospital_id, name, specialty, qualification, experience_years, bio, success_rate, patients_treated, languages, available_days, is_active)
SELECT 
  h.id,
  'Dr. Sandeep Vaishya',
  'Neurosciences',
  'MBBS, MS, MCh (Neurosurgery)',
  26,
  'Expert in minimally invasive neurosurgery and complex brain and spine procedures.',
  97.0,
  14000,
  ARRAY['English', 'Hindi'],
  ARRAY['Monday', 'Wednesday', 'Friday'],
  true
FROM hospitals h WHERE h.slug = 'fortis-memorial-research-institute-gurugram';

-- ============================================================================
-- 5. BLK-MAX SUPER SPECIALITY HOSPITAL (DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'blk-max-super-speciality-hospital-delhi',
  'BLK-Max Super Speciality Hospital',
  'Delhi',
  'Delhi',
  4.6,
  4200,
  ARRAY['Bone Marrow Transplants', 'Digestive Diseases', 'Cardiology', 'Oncology', 'Orthopaedics', 'Neurosciences'],
  ARRAY['NABH Accredited', 'NABL Accredited'],
  'One of the largest standalone private hospitals in Delhi, now part of Max Healthcare family. Excellence in BMT and digestive diseases.',
  1959,
  650,
  500,
  'Pusa Road, Rajinder Nagar, New Delhi 110005',
  '+91-11-30403040',
  'info@blkmax.com',
  'https://www.blkhospital.com',
  ARRAY['24/7 Emergency', 'BMT Center', 'Advanced Endoscopy', 'International Patient Services'],
  35000,
  95.5,
  52,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- 6. FORTIS ESCORTS HEART INSTITUTE (DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'fortis-escorts-heart-institute-delhi',
  'Fortis Escorts Heart Institute',
  'Delhi',
  'Delhi',
  4.7,
  3800,
  ARRAY['Cardiac Surgery', 'Heart Transplants', 'Interventional Cardiology', 'Electrophysiology', 'Pediatric Cardiology'],
  ARRAY['NABH Accredited', 'NABL Accredited', 'ISO Certified'],
  'Historically recognized as one of the world''s leading specialized heart institutes. Pioneer in cardiac care with over 200,000 surgeries performed.',
  1988,
  310,
  200,
  'Okhla Road, New Delhi 110025',
  '+91-11-47135000',
  'contact@fortisescorts.in',
  'https://www.fortisescorts.in',
  ARRAY['24/7 Cardiac Emergency', 'Heart Transplant Program', 'Pediatric Cardiac Care', 'International Patients'],
  28000,
  97.5,
  58,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- 7. MAX SUPER SPECIALITY HOSPITAL (SHALIMAR BAGH, DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'max-super-speciality-hospital-shalimar-bagh',
  'Max Super Speciality Hospital',
  'Delhi',
  'Delhi',
  4.6,
  3500,
  ARRAY['Cancer Care', 'Minimal Access Surgery', 'Cardiology', 'Neurosciences', 'Orthopaedics'],
  ARRAY['NABH Accredited', 'NABL Accredited'],
  'Massive facility serving North Delhi with comprehensive cancer care and high-end diagnostic technologies.',
  2009,
  400,
  350,
  'FC-50, C & D Block, Shalimar Bagh, Delhi 110088',
  '+91-11-65009900',
  'info.shalimarbagh@maxhealthcare.com',
  'https://www.maxhealthcare.in/hospitals/shalimar-bagh',
  ARRAY['24/7 Emergency', 'Cancer Center', 'Minimal Access Surgery', 'International Patients'],
  25000,
  95.8,
  50,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- 8. MEDANTA (NOIDA)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'medanta-hospital-noida',
  'Medanta Hospital',
  'Noida',
  'Uttar Pradesh',
  4.5,
  2800,
  ARRAY['Multi-specialty Daycare', 'Outpatient Services', 'Diagnostics', 'Minor Surgeries'],
  ARRAY['NABH Accredited', 'NABL Accredited'],
  'High-tech extension of Gurugram flagship, providing easier access for Noida and Greater Noida residents.',
  2018,
  200,
  180,
  'Sector 18, Noida, Uttar Pradesh 201301',
  '+91-120-4777777',
  'noida@medanta.org',
  'https://www.medanta.org/hospitals/noida',
  ARRAY['Advanced Diagnostics', 'Daycare Services', 'Outpatient Care', '24/7 Emergency'],
  15000,
  94.5,
  45,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- 9. FORTIS HOSPITAL (NOIDA)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'fortis-hospital-noida',
  'Fortis Hospital',
  'Noida',
  'Uttar Pradesh',
  4.6,
  3200,
  ARRAY['Orthopaedics', 'Neurosciences', 'Emergency Trauma', 'Critical Care', 'Cardiology'],
  ARRAY['NABH Accredited', 'NABL Accredited'],
  'Major tertiary care hub for UP-side NCR, highly rated for critical care department and emergency trauma management.',
  2012,
  400,
  320,
  'B-22, Sector 62, Noida, Uttar Pradesh 201301',
  '+91-120-5001222',
  'info.noida@fortishealthcare.com',
  'https://www.fortishealthcare.com/hospitals/fortis-hospital-noida',
  ARRAY['24/7 Trauma Center', 'Critical Care Unit', 'Advanced Orthopaedics', 'Neuro ICU'],
  22000,
  95.2,
  48,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- 10. MAX SUPER SPECIALITY HOSPITAL (PATPARGANJ, DELHI)
-- ============================================================================

INSERT INTO hospitals (
  slug, name, city, state, rating, review_count,
  specialties, accreditations, description,
  established, beds, doctors_count,
  address, phone, email, website,
  features, international_patients, success_rate, avg_cost_savings,
  is_active
) VALUES (
  'max-super-speciality-hospital-patparganj',
  'Max Super Speciality Hospital',
  'Delhi',
  'Delhi',
  4.5,
  3000,
  ARRAY['Urology', 'Gastrosciences', 'Mother & Child Care', 'Cardiology', 'Orthopaedics'],
  ARRAY['NABH Accredited', 'NABL Accredited'],
  'Primary super-specialty destination for East Delhi and Vaishali residents. Excellence in urology and maternity care.',
  2010,
  350,
  280,
  '108A, I.P. Extension, Patparganj, Delhi 110092',
  '+91-11-45454545',
  'info.patparganj@maxhealthcare.com',
  'https://www.maxhealthcare.in/hospitals/patparganj',
  ARRAY['24/7 Emergency', 'Maternity Care', 'NICU', 'Advanced Urology'],
  20000,
  94.8,
  46,
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
  hospital_count INT;
  specialist_count INT;
BEGIN
  SELECT COUNT(*) INTO hospital_count FROM hospitals WHERE is_active = true;
  SELECT COUNT(*) INTO specialist_count FROM specialists WHERE is_active = true;
  
  RAISE NOTICE '✅ Database Update Complete!';
  RAISE NOTICE '📊 Total Active Hospitals: %', hospital_count;
  RAISE NOTICE '👨‍⚕️ Total Active Specialists: %', specialist_count;
  RAISE NOTICE '';
  RAISE NOTICE '🏥 Top 10 NCR Hospitals Added:';
  RAISE NOTICE '1. Medanta - The Medicity (Gurugram)';
  RAISE NOTICE '2. Indraprastha Apollo Hospital (Delhi)';
  RAISE NOTICE '3. Max Super Speciality Hospital (Saket)';
  RAISE NOTICE '4. Fortis Memorial Research Institute (Gurugram)';
  RAISE NOTICE '5. BLK-Max Super Speciality Hospital (Delhi)';
  RAISE NOTICE '6. Fortis Escorts Heart Institute (Delhi)';
  RAISE NOTICE '7. Max Super Speciality Hospital (Shalimar Bagh)';
  RAISE NOTICE '8. Medanta Hospital (Noida)';
  RAISE NOTICE '9. Fortis Hospital (Noida)';
  RAISE NOTICE '10. Max Super Speciality Hospital (Patparganj)';
END $$;
