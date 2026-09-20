import { BankQuestion } from '../types/exam';

export const SEED_BANK_QUESTIONS: BankQuestion[] = [
  // ==========================================
  // 1. RRB NTPC - CBT 1
  // ==========================================
  {
    id: 'rrb_ntpc_q1',
    examSlug: 'rrb_ntpc',
    stageSlug: 'cbt_1',
    subjectSlug: 'general_awareness',
    topicSlug: 'Current Affairs',
    questionText: 'Where is the headquarters of the Indian Space Research Organisation (ISRO) located?',
    options: ['New Delhi', 'Bengaluru', 'Sriharikota', 'Thiruvananthapuram'],
    correctAnswer: 1, // Bengaluru
    explanation: 'The headquarters of ISRO is located in Bengaluru, Karnataka. Satish Dhawan Space Centre is in Sriharikota.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceYear: 2024,
    sourceReference: 'RRB NTPC GA Sample Practice Set',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_ntpc_q2',
    examSlug: 'rrb_ntpc',
    stageSlug: 'cbt_1',
    subjectSlug: 'general_awareness',
    topicSlug: 'General Science (Physics, Chemistry, Biology)',
    questionText: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctAnswer: 1, // Au
    explanation: 'The chemical symbol for Gold is Au (from Latin Aurum). Ag is Silver, Fe is Iron, and Cu is Copper.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB NTPC General Science',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_ntpc_q3',
    examSlug: 'rrb_ntpc',
    stageSlug: 'cbt_1',
    subjectSlug: 'mathematics',
    topicSlug: 'Percentages',
    questionText: 'If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so as not to increase expenditure?',
    options: ['15%', '20%', '25%', '33.33%'],
    correctAnswer: 1, // 20%
    explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = 1/5 * 100 = 20%.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'RRB NTPC Mathematics Standard Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_ntpc_q4',
    examSlug: 'rrb_ntpc',
    stageSlug: 'cbt_1',
    subjectSlug: 'mathematics',
    topicSlug: 'LCM & HCF',
    questionText: 'Find the HCF of 36, 54, and 90.',
    options: ['9', '12', '18', '24'],
    correctAnswer: 2, // 18
    explanation: '36 = 18 * 2, 54 = 18 * 3, 90 = 18 * 5. Highest common factor is 18.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB NTPC Arithmetic',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_ntpc_q5',
    examSlug: 'rrb_ntpc',
    stageSlug: 'cbt_1',
    subjectSlug: 'general_intelligence_reasoning',
    topicSlug: 'Coding & Decoding',
    questionText: 'In a certain code, "TRAIN" is coded as "WUDLQ". How is "BUS" coded in that language?',
    options: ['EXV', 'EYV', 'DWV', 'EWV'],
    correctAnswer: 0, // EXV
    explanation: 'Each letter is shifted forward by +3. B+3=E, U+3=X, S+3=V. Hence "EXV".',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB NTPC Reasoning',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 2. IBPS PO - Prelims
  // ==========================================
  {
    id: 'ibps_po_q1',
    examSlug: 'ibps_po',
    stageSlug: 'prelims',
    subjectSlug: 'english_language',
    topicSlug: 'Error Detection',
    questionText: 'Read the sentence to find if there is any grammatical error in it: "Neither the supervisor (A) / nor the employees (B) / was present (C) / at the annual conference (D)."',
    options: ['(A)', '(B)', '(C)', '(D)'],
    correctAnswer: 2, // (C)
    explanation: 'When subjects are connected with "neither... nor", the verb agrees with the closer subject ("employees", plural), so it should be "were present" instead of "was present".',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'IBPS PO English Prep',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_po_q2',
    examSlug: 'ibps_po',
    stageSlug: 'prelims',
    subjectSlug: 'quantitative_aptitude',
    topicSlug: 'Quadratic Equations',
    questionText: 'In each question, two equations (I) and (II) are given. Solve both equations and establish the relationship: I: x^2 - 7x + 12 = 0, II: y^2 - 9y + 20 = 0.',
    options: ['x > y', 'x < y', 'x >= y', 'x <= y or no relation'],
    correctAnswer: 3, // x <= y
    explanation: 'Roots of I: (x-3)(x-4)=0 => x = 3, 4. Roots of II: (y-4)(y-5)=0 => y = 4, 5. Comparing: 3 < 4, 3 < 5, 4 = 4, 4 < 5. Therefore, x <= y.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'IBPS PO Quantitative Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_po_q3',
    examSlug: 'ibps_po',
    stageSlug: 'prelims',
    subjectSlug: 'reasoning_ability',
    topicSlug: 'Inequalities',
    questionText: 'Statements: A >= B > C = D <= E. Conclusions: I. A > D, II. B <= E.',
    options: ['Only Conclusion I is true', 'Only Conclusion II is true', 'Both I and II are true', 'Neither I nor II is true'],
    correctAnswer: 0, // Only I
    explanation: 'From statements: A >= B > C = D => A > D (True). For II: B > C = D <= E gives no definite relation between B and E. Hence only conclusion I is true.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'IBPS PO Reasoning Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 3. IBPS Clerk / CSA - Prelims
  // ==========================================
  {
    id: 'ibps_clerk_q1',
    examSlug: 'ibps_clerk',
    stageSlug: 'prelims',
    subjectSlug: 'english_language',
    topicSlug: 'Cloze Test',
    questionText: 'Select the most appropriate word to fill in the blank: "The manager was pleased with the team\'s _______ performance during the audit."',
    options: ['exemplary', 'negligent', 'futile', 'fragile'],
    correctAnswer: 0, // exemplary
    explanation: '"Exemplary" means representing the best of its kind, commendable, which fits the positive tone of "pleased".',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'IBPS Clerk English Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_clerk_q2',
    examSlug: 'ibps_clerk',
    stageSlug: 'prelims',
    subjectSlug: 'numerical_ability',
    topicSlug: 'Simplification & Approximation',
    questionText: 'What value should come in place of question mark (?) in the equation: 15 * 18 - 120 / 4 = ?',
    options: ['210', '240', '250', '270'],
    correctAnswer: 1, // 240
    explanation: 'According to BODMAS: 120 / 4 = 30. 15 * 18 = 270. 270 - 30 = 240.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'IBPS Clerk Numerical Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_clerk_q3',
    examSlug: 'ibps_clerk',
    stageSlug: 'prelims',
    subjectSlug: 'reasoning_ability',
    topicSlug: 'Syllogism',
    questionText: 'Statements: All pens are books. Some books are scales. Conclusions: I. Some pens are scales. II. Some books are pens.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 1, // Only conclusion II follows
    explanation: 'All pens are books implies "Some books are pens" (Conversion is true). We cannot definitively infer "Some pens are scales". Thus only II follows.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'IBPS Clerk Reasoning Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 4. IBPS RRB Office Assistant - Prelims
  // ==========================================
  {
    id: 'ibps_rrb_oa_q1',
    examSlug: 'ibps_rrb_oa',
    stageSlug: 'prelims',
    subjectSlug: 'reasoning',
    topicSlug: 'Direction & Distance',
    questionText: 'Rohan walks 10 meters North, turns right and walks 6 meters, then turns right again and walks 10 meters. In which direction is he now from his starting point?',
    options: ['North', 'East', 'South', 'West'],
    correctAnswer: 1, // East
    explanation: 'Moving North 10m, Right (East) 6m, Right (South) 10m brings him to 6m East of the starting point.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'IBPS RRB OA Reasoning',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_rrb_oa_q2',
    examSlug: 'ibps_rrb_oa',
    stageSlug: 'prelims',
    subjectSlug: 'numerical_ability',
    topicSlug: 'Arithmetic Word Problems',
    questionText: 'A train 180 meters long crosses a pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'],
    correctAnswer: 1, // 72 km/h
    explanation: 'Speed = Distance / Time = 180 / 9 = 20 m/s. Speed in km/h = 20 * (18 / 5) = 72 km/h.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'IBPS RRB OA Numerical Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 5. IBPS RRB Officer Scale I - Prelims
  // ==========================================
  {
    id: 'ibps_rrb_os1_q1',
    examSlug: 'ibps_rrb_os1',
    stageSlug: 'prelims',
    subjectSlug: 'reasoning',
    topicSlug: 'Blood Relations',
    questionText: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?',
    options: ['Father', 'Grandfather', 'Uncle', 'Brother'],
    correctAnswer: 2, // Uncle
    explanation: '"My daughter\'s father" is Deepak himself. The gentleman\'s only brother is Deepak\'s father. Therefore, the gentleman is Deepak\'s paternal uncle.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'IBPS RRB OS-1 Reasoning',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ibps_rrb_os1_q2',
    examSlug: 'ibps_rrb_os1',
    stageSlug: 'prelims',
    subjectSlug: 'quantitative_aptitude',
    topicSlug: 'Missing/Wrong Number Series',
    questionText: 'Find the missing number in the series: 6, 13, 28, 59, ?',
    options: ['112', '120', '122', '128'],
    correctAnswer: 2, // 122
    explanation: 'Pattern: * 2 + 1, * 2 + 2, * 2 + 3... (6*2+1=13; 13*2+2=28; 28*2+3=59; 59*2+4=122).',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'IBPS RRB OS-1 Quant',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 6. SSC CGL - Tier 1
  // ==========================================
  {
    id: 'ssc_cgl_q1',
    examSlug: 'ssc_cgl',
    stageSlug: 'tier_1',
    subjectSlug: 'general_awareness',
    topicSlug: 'General Policy',
    questionText: 'Which Article of the Indian Constitution guarantees the "Right to Constitutional Remedies"?',
    options: ['Article 19', 'Article 21', 'Article 32', 'Article 44'],
    correctAnswer: 2, // Article 32
    explanation: 'Article 32 confers the right to move the Supreme Court for enforcement of Fundamental Rights, described by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution".',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'SSC CGL Polity Question Bank',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_cgl_q2',
    examSlug: 'ssc_cgl',
    stageSlug: 'tier_1',
    subjectSlug: 'quantitative_aptitude',
    topicSlug: 'Triangles & Circles (Geometry)',
    questionText: 'In a right-angled triangle ABC right-angled at B, if AB = 8 cm and BC = 6 cm, what is the length of the circumradius of triangle ABC?',
    options: ['5 cm', '10 cm', '4 cm', '7 cm'],
    correctAnswer: 0, // 5 cm
    explanation: 'For a right-angled triangle, the hypotenuse AC = sqrt(8^2 + 6^2) = 10 cm. The circumradius R = Hypotenuse / 2 = 10 / 2 = 5 cm.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'SSC CGL Geometry Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_cgl_q3',
    examSlug: 'ssc_cgl',
    stageSlug: 'tier_1',
    subjectSlug: 'general_intelligence_and_reasoning',
    topicSlug: 'Analogies',
    questionText: 'Select the option that is related to the third term in the same way as the second term is related to the first term: Ornithology : Birds :: Paleontology : ?',
    options: ['Fossils', 'Insects', 'Plants', 'Minerals'],
    correctAnswer: 0, // Fossils
    explanation: 'Ornithology is the scientific study of birds; Paleontology is the scientific study of fossils.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'SSC CGL Reasoning Analogies',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_cgl_q4',
    examSlug: 'ssc_cgl',
    stageSlug: 'tier_1',
    subjectSlug: 'english_comprehension',
    topicSlug: 'Idioms & Phrases',
    questionText: 'Select the most appropriate meaning of the given idiom: "Bite the bullet"',
    options: ['To accept something unpleasant with courage', 'To get injured in war', 'To commit a serious mistake', 'To shoot at an enemy'],
    correctAnswer: 0, // To accept something unpleasant
    explanation: '"Bite the bullet" means to face a grim situation with bravery and fortitude.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'SSC CGL Vocabulary Series',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 7. WBPSC WBCS (Exe.) - Preliminary
  // ==========================================
  {
    id: 'wbcs_q1',
    examSlug: 'wbpsc_wbcs',
    stageSlug: 'prelims',
    subjectSlug: 'history_of_india',
    topicSlug: 'Ancient Indian History',
    questionText: 'Who was the court poet of Harsha-Vardhana?',
    options: ['Banabhatta', 'Harisena', 'Kalidasa', 'Ravikirti'],
    correctAnswer: 0, // Banabhatta
    explanation: 'Banabhatta was the Asthana Kavi (court poet) of King Harsha and wrote Harshacharita and Kadambari.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC WBCS History Question Bank',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbcs_q2',
    examSlug: 'wbpsc_wbcs',
    stageSlug: 'prelims',
    subjectSlug: 'geography_of_india_wb',
    topicSlug: 'Geography of West Bengal (Districts, Rivers, Climate, Agriculture, Industry)',
    questionText: 'Which is the highest peak of West Bengal?',
    options: ['Tiger Hill', 'Sandakphu', 'Tonglu', 'Phalut'],
    correctAnswer: 1, // Sandakphu
    explanation: 'Sandakphu (3,636 meters) is the highest peak in the state of West Bengal, located on the Singalila Ridge.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Geography Question Bank',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbcs_q3',
    examSlug: 'wbpsc_wbcs',
    stageSlug: 'prelims',
    subjectSlug: 'indian_polity_and_economy',
    topicSlug: 'Constitution of India (Preamble, Fundamental Rights, DPSP, Parliament, Judiciary)',
    questionText: 'Which Constitutional Amendment Act added the words "Socialist, Secular, and Integrity" to the Preamble of the Constitution of India?',
    options: ['42nd Amendment Act, 1976', '44th Amendment Act, 1978', '52nd Amendment Act, 1985', '73rd Amendment Act, 1992'],
    correctAnswer: 0, // 42nd Amendment
    explanation: 'The 42nd Constitutional Amendment Act of 1976 amended the Preamble to include "Socialist", "Secular", and "Integrity".',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC WBCS Polity Syllabus',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbcs_q4',
    examSlug: 'wbpsc_wbcs',
    stageSlug: 'prelims',
    subjectSlug: 'indian_national_movement',
    topicSlug: 'Role of Bengal in Freedom Struggle',
    questionText: 'Who founded the "Anushilan Samiti" in Calcutta in 1902?',
    options: ['Pramathanath Mitra', 'Rashbehari Bose', 'Aurobindo Ghosh', 'Bagha Jatin'],
    correctAnswer: 0, // Pramathanath Mitra
    explanation: 'Anushilan Samiti was established by Pramathanath Mitra (P. Mitra) along with Jatindranath Banerjee and Barindra Kumar Ghosh in 1902 in Calcutta.',
    difficulty: 'HARD',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Freedom Movement Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 8. WBPSC Clerkship - Part I
  // ==========================================
  {
    id: 'wbpsc_clerk_q1',
    examSlug: 'wbpsc_clerkship',
    stageSlug: 'part_1',
    subjectSlug: 'english',
    topicSlug: 'Fundamentals of English language (Vocabulary, Grammar, Sentence Structure, Synonyms, Antonyms and its correct usage)',
    questionText: 'Choose the antonym of the word "Diligent":',
    options: ['Industrious', 'Lazy', 'Attentive', 'Conscientious'],
    correctAnswer: 1, // Lazy
    explanation: '"Diligent" means hardworking and persevering. Its antonym is "Lazy".',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Clerkship English Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbpsc_clerk_q2',
    examSlug: 'wbpsc_clerkship',
    stageSlug: 'part_1',
    subjectSlug: 'arithmetic',
    topicSlug: 'Simple Interest',
    questionText: 'A sum of ₹5,000 is lent at a simple interest rate of 8% per annum for 3 years. What is the total interest accrued?',
    options: ['₹1,000', '₹1,200', '₹1,400', '₹1,500'],
    correctAnswer: 1, // 1200
    explanation: 'Simple Interest = (P * R * T) / 100 = (5000 * 8 * 3) / 100 = ₹1,200.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Clerkship Arithmetic Madhyamik Standard',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbpsc_clerk_q3',
    examSlug: 'wbpsc_clerkship',
    stageSlug: 'part_1',
    subjectSlug: 'general_studies',
    topicSlug: 'Problems with special reference to India and elementary knowledge of Indian History and Indian Geography',
    questionText: 'Which river flows between the Vindhya and Satpura mountain ranges?',
    options: ['Narmada', 'Godavari', 'Mahanadi', 'Krishna'],
    correctAnswer: 0, // Narmada
    explanation: 'The Narmada River flows through a rift valley between the Vindhya Range on the north and the Satpura Range on the south.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Clerkship GS Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 9. WBPSC Miscellaneous - Preliminary
  // ==========================================
  {
    id: 'wbpsc_misc_q1',
    examSlug: 'wbpsc_misc',
    stageSlug: 'prelims',
    subjectSlug: 'general_studies',
    topicSlug: 'Everyday Science',
    questionText: 'Which gas is predominantly responsible for the greenhouse effect on Earth?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
    correctAnswer: 1, // Carbon Dioxide
    explanation: 'Carbon dioxide (CO2), along with water vapor and methane, is one of the primary greenhouse gases absorbing infrared radiation.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Miscellaneous GS Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbpsc_misc_q2',
    examSlug: 'wbpsc_misc',
    stageSlug: 'prelims',
    subjectSlug: 'arithmetic',
    topicSlug: 'Madhyamik Examination Standard Arithmetic (Simplification, Percentage, Ratio & Proportion, Profit & Loss, Simple Interest, Time & Work, Speed & Distance, Mensuration)',
    questionText: 'If A and B can finish a work in 12 days and 15 days respectively, in how many days can both working together complete the work?',
    options: ['6 days', '6.67 days', '7.5 days', '8 days'],
    correctAnswer: 1, // 6.67 days (20/3)
    explanation: '1/12 + 1/15 = (5 + 4) / 60 = 9/60 = 3/20. Total days = 20/3 = 6.67 days (or 6 2/3 days).',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Miscellaneous Arithmetic Module',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 10. RRB Group D / Level-1
  // ==========================================
  {
    id: 'rrb_group_d_q1',
    examSlug: 'rrb_group_d',
    stageSlug: 'cbt',
    subjectSlug: 'general_science',
    topicSlug: 'Physics (10th Standard CBSE)',
    questionText: 'What is the SI unit of electric current?',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correctAnswer: 0,
    explanation: 'The SI unit of electric current is Ampere (A). Volt is the unit of potential difference, Ohm is resistance, and Watt is power.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB Group D General Science Practice Set',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_group_d_q2',
    examSlug: 'rrb_group_d',
    stageSlug: 'cbt',
    subjectSlug: 'mathematics',
    topicSlug: 'BODMAS',
    questionText: 'Evaluate the expression: $72 \\div 8 \\times 3 + 12 - 5$.',
    options: ['34', '30', '42', '28'],
    correctAnswer: 0,
    explanation: 'Applying BODMAS: 72 / 8 = 9. Then 9 * 3 = 27. Then 27 + 12 = 39. Finally 39 - 5 = 34.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB Level-1 Arithmetic Series',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rrb_group_d_q3',
    examSlug: 'rrb_group_d',
    stageSlug: 'cbt',
    subjectSlug: 'general_intelligence_reasoning',
    topicSlug: 'Classification',
    questionText: 'Find the odd one out from the given alternatives: Iron, Copper, Zinc, Oxygen.',
    options: ['Iron', 'Copper', 'Zinc', 'Oxygen'],
    correctAnswer: 3,
    explanation: 'Oxygen is a non-metal gas at room temperature, while Iron, Copper, and Zinc are solid transition metals.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'RRB Group D Reasoning Set',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 11. SSC CHSL - Tier 1
  // ==========================================
  {
    id: 'ssc_chsl_q1',
    examSlug: 'ssc_chsl',
    stageSlug: 'tier_1',
    subjectSlug: 'general_intelligence',
    topicSlug: 'Coding & Decoding',
    questionText: 'If "PEN" is coded as 35, how is "BOOK" coded in that code language?',
    options: ['40', '43', '45', '47'],
    correctAnswer: 1,
    explanation: 'Sum of alphabetical positions: P(16) + E(5) + N(14) = 35. For "BOOK": B(2) + O(15) + O(15) + K(11) = 43.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'SSC CHSL Reasoning Standard Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_chsl_q2',
    examSlug: 'ssc_chsl',
    stageSlug: 'tier_1',
    subjectSlug: 'quantitative_aptitude',
    topicSlug: 'Fundamental Arithmetical Operations',
    questionText: 'A merchant marks an article 30% above its cost price and offers a discount of 10% on the marked price. What is his net gain percentage?',
    options: ['15%', '17%', '20%', '22%'],
    correctAnswer: 1,
    explanation: 'Let CP = 100. Marked Price MP = 130. Selling Price SP = 130 * (1 - 0.10) = 117. Profit = 117 - 100 = 17%.',
    difficulty: 'MEDIUM',
    sourceType: 'DEMO',
    sourceReference: 'SSC CHSL Quantitative Aptitude Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 12. SSC MTS - CBE
  // ==========================================
  {
    id: 'ssc_mts_q1',
    examSlug: 'ssc_mts',
    stageSlug: 'cbe',
    subjectSlug: 'numerical_and_mathematical_ability',
    topicSlug: 'LCM and HCF',
    questionText: 'The ratio of two positive numbers is 3 : 5 and their HCF is 8. What is the LCM of the two numbers?',
    options: ['96', '120', '140', '160'],
    correctAnswer: 1,
    explanation: 'The numbers are 3 * 8 = 24 and 5 * 8 = 40. Their LCM = 3 * 5 * 8 = 120.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'SSC MTS Session I Numerical Aptitude',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_mts_q2',
    examSlug: 'ssc_mts',
    stageSlug: 'cbe',
    subjectSlug: 'general_awareness',
    topicSlug: 'Social Studies (History, Geography, Art and Culture, Civics, Economics)',
    questionText: 'Which classical dance form originated in the Indian state of Tamil Nadu?',
    options: ['Kathakali', 'Bharatanatyam', 'Kuchipudi', 'Kathak'],
    correctAnswer: 1,
    explanation: 'Bharatanatyam is an ancient classical dance tradition originating in the temples of Tamil Nadu. Kathakali is from Kerala, Kuchipudi is from Andhra Pradesh, and Kathak is from Northern India.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'SSC MTS General Awareness Paper',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // 13. WBPSC Food SI - Written Exam
  // ==========================================
  {
    id: 'wbpsc_food_si_q1',
    examSlug: 'wbpsc_food_si',
    stageSlug: 'written',
    subjectSlug: 'general_studies',
    topicSlug: 'Matters of common experience including everyday science',
    questionText: 'Which vitamin is synthesized in the human skin upon exposure to solar ultraviolet rays?',
    options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 3,
    explanation: 'Vitamin D is synthesized when the 7-dehydrocholesterol in the human skin absorbs UV-B radiation from sunlight.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Food SI Everyday Science Drill',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'wbpsc_food_si_q2',
    examSlug: 'wbpsc_food_si',
    stageSlug: 'written',
    subjectSlug: 'arithmetic',
    topicSlug: 'Average',
    questionText: 'The average of 5 consecutive odd numbers is 27. What is the smallest of these numbers?',
    options: ['21', '23', '25', '27'],
    correctAnswer: 1,
    explanation: 'For consecutive odd numbers, the average is the middle number. Hence the middle number is 27. The 5 numbers are 23, 25, 27, 29, 31. The smallest is 23.',
    difficulty: 'EASY',
    sourceType: 'DEMO',
    sourceReference: 'WBPSC Food SI Madhyamik Standard Arithmetic',
    language: 'en',
    qualityScore: 1.0,
    validationStatus: 'APPROVED',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export function getSeedQuestionsByExam(examSlug: string, stageSlug?: string): BankQuestion[] {
  return SEED_BANK_QUESTIONS.filter((q) => {
    if (q.examSlug !== examSlug) return false;
    if (stageSlug && q.stageSlug !== stageSlug) return false;
    return true;
  });
}
