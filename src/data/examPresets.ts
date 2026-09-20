import { ExamPreset, ExamStageConfig } from '../types/exam';

export const EXAM_PRESETS: ExamPreset[] = [
  // =========================================================================
  // RAILWAY (2 EXAMS)
  // =========================================================================
  {
    id: 'rrb-ntpc',
    slug: 'rrb_ntpc',
    name: 'RRB NTPC',
    category: 'RAILWAY',
    description: 'Railway Recruitment Boards Non-Technical Popular Categories (Graduate & Under-Graduate posts)',
    officialUrl: 'https://www.rrbcdg.gov.in/',
    stages: [
      {
        id: 'rrb_ntpc_cbt1',
        stageSlug: 'cbt_1',
        stageName: 'CBT 1 (Screening Test)',
        notificationVersion: 'CEN 05/2024 & CEN 06/2024',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.3333333333333333, // 1/3 deduction
        sourceUrl: 'https://www.rrbcdg.gov.in/',
        sourceTitle: 'RRB Centralized Employment Notice (CEN) No. 05/2024 & 06/2024 Notification',
        verificationDate: '2024-11-20',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'ntpc_cbt1_ga',
            name: 'General Awareness',
            slug: 'general_awareness',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Current Affairs', 'Indian History', 'General Science (Physics, Chemistry, Biology)', 'Geography', 'Indian Polity & Constitution', 'Monuments & Places of India', 'Environment Issues', 'Computer Basics']
          },
          {
            id: 'ntpc_cbt1_math',
            name: 'Mathematics',
            slug: 'mathematics',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Number System', 'Decimals & Fractions', 'LCM & HCF', 'Ratio & Proportion', 'Percentages', 'Mensuration', 'Time & Work', 'Time & Distance', 'Simple & Compound Interest', 'Profit & Loss', 'Elementary Algebra', 'Geometry & Trigonometry', 'Elementary Statistics']
          },
          {
            id: 'ntpc_cbt1_reasoning',
            name: 'General Intelligence & Reasoning',
            slug: 'general_intelligence_reasoning',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Analogies', 'Number & Alphabetical Series', 'Coding & Decoding', 'Mathematical Operations', 'Relationships', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Data Interpretation', 'Conclusions & Decision Making', 'Similarities & Differences', 'Analytical Reasoning']
          }
        ]
      },
      {
        id: 'rrb_ntpc_cbt2',
        stageSlug: 'cbt_2',
        stageName: 'CBT 2 (Main Examination)',
        notificationVersion: 'CEN 05/2024 & CEN 06/2024',
        examYear: 2024,
        totalQuestions: 120,
        totalMarks: 120,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.3333333333333333,
        sourceUrl: 'https://www.rrbcdg.gov.in/',
        sourceTitle: 'RRB Centralized Employment Notice (CEN) No. 05/2024 & 06/2024 CBT-2 Pattern',
        verificationDate: '2024-11-20',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'ntpc_cbt2_ga',
            name: 'General Awareness',
            slug: 'general_awareness',
            questionCount: 50,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Current Affairs', 'Indian History', 'General Science', 'Geography', 'Indian Polity', 'Economic Issues', 'Environmental Concerns']
          },
          {
            id: 'ntpc_cbt2_math',
            name: 'Mathematics',
            slug: 'mathematics',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Number System', 'Percentages', 'Ratio & Proportion', 'Time & Work', 'Speed & Distance', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics']
          },
          {
            id: 'ntpc_cbt2_reasoning',
            name: 'General Intelligence & Reasoning',
            slug: 'general_intelligence_reasoning',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Puzzles & Seating Arrangement', 'Coding Decoding', 'Syllogisms', 'Blood Relations', 'Direction Sense', 'Input Output', 'Critical Reasoning']
          }
        ]
      }
    ]
  },
  {
    id: 'rrb-group-d',
    slug: 'rrb_group_d',
    name: 'RRB Group D / Level-1',
    category: 'RAILWAY',
    description: 'Railway Recruitment Board recruitment for various posts in Level 1 of the 7th CPC Pay Matrix.',
    officialUrl: 'https://www.rrbcdg.gov.in/',
    stages: [
      {
        id: 'rrb_group_d_cbt',
        stageSlug: 'cbt',
        stageName: 'Computer Based Test (CBT)',
        notificationVersion: 'CEN RRC-01/2019 / Level 1 7th CPC Matrix',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.3333333333333333, // 1/3 mark deduction
        sourceUrl: 'https://www.rrbcdg.gov.in/',
        sourceTitle: 'Recruitment for Various Posts in Level 1 of 7th CPC Pay Matrix Notification',
        verificationDate: '2024-11-20',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'groupd_science',
            name: 'General Science',
            slug: 'general_science',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Physics (10th Standard CBSE)', 'Chemistry (10th Standard CBSE)', 'Life Sciences / Biology (10th Standard CBSE)']
          },
          {
            id: 'groupd_math',
            name: 'Mathematics',
            slug: 'mathematics',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Number system', 'BODMAS', 'Decimals', 'Fractions', 'LCM & HCF', 'Ratio and Proportion', 'Percentages', 'Mensuration', 'Time and Work', 'Time and Distance', 'Simple and Compound Interest', 'Profit and Loss', 'Algebra', 'Geometry and Trigonometry', 'Elementary Statistics', 'Square root', 'Age Calculations', 'Calendar & Clock', 'Pipes & Cistern']
          },
          {
            id: 'groupd_reasoning',
            name: 'General Intelligence & Reasoning',
            slug: 'general_intelligence_reasoning',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Analogies', 'Alphabetical and Number Series', 'Coding and Decoding', 'Mathematical operations', 'Relationships', 'Syllogism', 'Jumbling', 'Venn Diagram', 'Data Interpretation and Sufficiency', 'Conclusions and Decision making', 'Similarities and Differences', 'Analytical reasoning', 'Classification', 'Directions', 'Statement – Arguments and Assumptions']
          },
          {
            id: 'groupd_ga',
            name: 'General Awareness & Current Affairs',
            slug: 'general_awareness_current_affairs',
            questionCount: 20,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Current Affairs in Science & Technology', 'Sports', 'Culture', 'Personalities', 'Economics', 'Politics and any other subject of importance']
          }
        ]
      }
    ]
  },

  // =========================================================================
  // BANKING (4 EXAMS)
  // =========================================================================
  {
    id: 'ibps-po',
    slug: 'ibps_po',
    name: 'IBPS PO',
    category: 'BANKING',
    description: 'Institute of Banking Personnel Selection - Probationary Officers / Management Trainees (CRP PO/MT-XIV)',
    officialUrl: 'https://www.ibps.in/',
    stages: [
      {
        id: 'ibps_po_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'CRP PO/MT-XIV (2024-25)',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 60,
        hasSectionalTiming: true,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.25, // 1/4th deduction
        sourceUrl: 'https://www.ibps.in/',
        sourceTitle: 'IBPS Common Recruitment Process for Recruitment of Probationary Officers CRP PO/MT-XIV',
        verificationDate: '2024-08-01',
        languages: ['en', 'hi'],
        subjects: [
          {
            id: 'ibps_po_eng',
            name: 'English Language',
            slug: 'english_language',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Error Detection', 'Sentence Improvement', 'Fill in the Blanks', 'Word Swap']
          },
          {
            id: 'ibps_po_quant',
            name: 'Quantitative Aptitude',
            slug: 'quantitative_aptitude',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Data Interpretation (Tables, Graphs, Caselets)', 'Quadratic Equations', 'Number Series (Missing & Wrong)', 'Approximation & Simplification', 'Arithmetic Word Problems (Profit & Loss, SI & CI, Time & Work, Speed Distance)']
          },
          {
            id: 'ibps_po_reasoning',
            name: 'Reasoning Ability',
            slug: 'reasoning_ability',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Puzzles (Floor, Box, Month-Date)', 'Seating Arrangement (Circular, Linear, Parallel)', 'Syllogism', 'Inequalities', 'Blood Relations', 'Direction & Distance', 'Alphanumeric Series', 'Order & Ranking']
          }
        ]
      }
    ]
  },
  {
    id: 'ibps-clerk',
    slug: 'ibps_clerk',
    name: 'IBPS Clerk / CSA',
    category: 'BANKING',
    description: 'Institute of Banking Personnel Selection - Customer Service Associate / Clerical Cadre (CRP Clerks-XIV)',
    officialUrl: 'https://www.ibps.in/',
    stages: [
      {
        id: 'ibps_clerk_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'CRP Clerks-XIV (2024-25)',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 60,
        hasSectionalTiming: true,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.25,
        sourceUrl: 'https://www.ibps.in/',
        sourceTitle: 'IBPS Common Recruitment Process for Recruitment of Clerical Cadre (CRP Clerks-XIV)',
        verificationDate: '2024-07-01',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'ibps_clerk_eng',
            name: 'English Language',
            slug: 'english_language',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Reading Comprehension', 'Cloze Test', 'Error Spotting', 'Phrase Replacement', 'Word Usage', 'Rearrangement']
          },
          {
            id: 'ibps_clerk_quant',
            name: 'Numerical Ability',
            slug: 'numerical_ability',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Simplification & Approximation', 'Number Series', 'Data Interpretation', 'Quadratic Equations', 'Arithmetic Problems']
          },
          {
            id: 'ibps_clerk_reasoning',
            name: 'Reasoning Ability',
            slug: 'reasoning_ability',
            questionCount: 35,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            durationMinutes: 20,
            topics: ['Puzzles & Seating Arrangement', 'Syllogism', 'Inequality', 'Alphanumeric & Number Series', 'Coding-Decoding', 'Blood Relations']
          }
        ]
      }
    ]
  },
  {
    id: 'ibps-rrb-oa',
    slug: 'ibps_rrb_oa',
    name: 'IBPS RRB Office Assistant',
    category: 'BANKING',
    description: 'Regional Rural Banks Recruitment for Office Assistant (Multipurpose) (CRP RRBs-XIII)',
    officialUrl: 'https://www.ibps.in/',
    stages: [
      {
        id: 'ibps_rrb_oa_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'CRP RRBs-XIII (2024-25)',
        examYear: 2024,
        totalQuestions: 80,
        totalMarks: 80,
        durationMinutes: 45,
        hasSectionalTiming: false, // 45 minutes composite time
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.25,
        sourceUrl: 'https://www.ibps.in/',
        sourceTitle: 'IBPS Notification for CRP RRBs-XIII Office Assistant (Multipurpose)',
        verificationDate: '2024-06-07',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'rrb_oa_reasoning',
            name: 'Reasoning',
            slug: 'reasoning',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Inequality', 'Alphanumeric Series', 'Coding Decoding', 'Direction & Distance', 'Blood Relations']
          },
          {
            id: 'rrb_oa_numerical',
            name: 'Numerical Ability',
            slug: 'numerical_ability',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Simplification', 'Number Series', 'Data Interpretation (Table, Bar, Pie)', 'Arithmetic Word Problems']
          }
        ]
      }
    ]
  },
  {
    id: 'ibps-rrb-os1',
    slug: 'ibps_rrb_os1',
    name: 'IBPS RRB Officer Scale I',
    category: 'BANKING',
    description: 'Regional Rural Banks Recruitment for Officers Scale I / Assistant Manager (CRP RRBs-XIII)',
    officialUrl: 'https://www.ibps.in/',
    stages: [
      {
        id: 'ibps_rrb_os1_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'CRP RRBs-XIII (2024-25)',
        examYear: 2024,
        totalQuestions: 80,
        totalMarks: 80,
        durationMinutes: 45,
        hasSectionalTiming: false, // 45 minutes composite time
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.25,
        sourceUrl: 'https://www.ibps.in/',
        sourceTitle: 'IBPS Notification for CRP RRBs-XIII Officer Scale-I',
        verificationDate: '2024-06-07',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'rrb_os1_reasoning',
            name: 'Reasoning',
            slug: 'reasoning',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Puzzles & Seating Arrangements', 'Syllogisms', 'Inequalities', 'Input-Output', 'Data Sufficiency', 'Direction Sense', 'Blood Relations']
          },
          {
            id: 'rrb_os1_quant',
            name: 'Quantitative Aptitude',
            slug: 'quantitative_aptitude',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Data Interpretation & Caselets', 'Approximation', 'Missing/Wrong Number Series', 'Quadratic Equations', 'Arithmetic Word Problems', 'Data Sufficiency']
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SSC (3 EXAMS)
  // =========================================================================
  {
    id: 'ssc-cgl',
    slug: 'ssc_cgl',
    name: 'SSC CGL',
    category: 'SSC',
    description: 'Staff Selection Commission Combined Graduate Level Examination',
    officialUrl: 'https://ssc.gov.in/',
    stages: [
      {
        id: 'ssc_cgl_tier1',
        stageSlug: 'tier_1',
        stageName: 'Tier-I Examination',
        notificationVersion: 'Notice CGL 2024 (F. No. HQ-PPI03/11/2024-PP_1)',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 200,
        durationMinutes: 60,
        hasSectionalTiming: false,
        marksPerCorrect: 2,
        negativeMarkPerWrong: 0.50, // 0.50 marks per wrong answer (1/4th of 2 marks)
        sourceUrl: 'https://ssc.gov.in/',
        sourceTitle: 'Staff Selection Commission Notice of Combined Graduate Level Examination 2024',
        verificationDate: '2024-06-24',
        languages: ['en', 'hi'],
        subjects: [
          {
            id: 'cgl_t1_reasoning',
            name: 'General Intelligence and Reasoning',
            slug: 'general_intelligence_and_reasoning',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Analogies', 'Similarities and Differences', 'Space Visualization', 'Spatial Orientation', 'Problem Solving', 'Analysis', 'Judgment', 'Decision Making', 'Visual Memory', 'Discrimination', 'Observation', 'Relationship Concepts', 'Arithmetical Reasoning', 'Figural Classification', 'Arithmetic Number Series', 'Non-verbal Series', 'Coding and Decoding', 'Statement Conclusion', 'Syllogistic Reasoning']
          },
          {
            id: 'cgl_t1_ga',
            name: 'General Awareness',
            slug: 'general_awareness',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['History', 'Culture', 'Geography', 'Economic Scene', 'General Policy', 'Scientific Research', 'Current Events (National & International)']
          },
          {
            id: 'cgl_t1_quant',
            name: 'Quantitative Aptitude',
            slug: 'quantitative_aptitude',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Computation of Whole Numbers', 'Decimals & Fractions', 'Relationships between Numbers', 'Percentage', 'Ratio and Proportion', 'Square Roots', 'Averages', 'Interest (Simple & Compound)', 'Profit and Loss', 'Discount', 'Partnership Business', 'Mixture and Alligation', 'Time and Distance', 'Time and Work', 'Basic Algebraic Identities', 'Linear Equations', 'Triangles & Circles (Geometry)', 'Trigonometry', 'Heights and Distances', 'Histogram, Frequency Polygon, Bar Diagram, Pie Chart']
          },
          {
            id: 'cgl_t1_english',
            name: 'English Comprehension',
            slug: 'english_comprehension',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Reading Comprehension', 'Spotting Errors', 'Fill in the Blanks', 'Synonyms & Antonyms', 'Spelling/Detecting Mis-spelt Words', 'Idioms & Phrases', 'One Word Substitution', 'Improvement of Sentences', 'Active/Passive Voice of Verbs', 'Conversion into Direct/Indirect Narration', 'Shuffling of Sentence Parts', 'Cloze Passage']
          }
        ]
      }
    ]
  },
  {
    id: 'ssc-chsl',
    slug: 'ssc_chsl',
    name: 'SSC CHSL',
    category: 'SSC',
    description: 'Staff Selection Commission Combined Higher Secondary (10+2) Level Examination',
    officialUrl: 'https://ssc.gov.in/',
    stages: [
      {
        id: 'ssc_chsl_tier1',
        stageSlug: 'tier_1',
        stageName: 'Tier-I Examination',
        notificationVersion: 'Notice CHSL 2024 (F. No. HQ-PPI03/13/2024-PP_1)',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 200,
        durationMinutes: 60,
        hasSectionalTiming: false,
        marksPerCorrect: 2,
        negativeMarkPerWrong: 0.50, // 0.50 marks per wrong answer (1/4th of 2 marks)
        sourceUrl: 'https://ssc.gov.in/',
        sourceTitle: 'Staff Selection Commission Notice of Combined Higher Secondary (10+2) Level Examination 2024',
        verificationDate: '2024-04-08',
        languages: ['en', 'hi'],
        subjects: [
          {
            id: 'chsl_t1_reasoning',
            name: 'General Intelligence',
            slug: 'general_intelligence',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Semantic Analogy', 'Symbolic/Number Analogy', 'Figural Analogy', 'Semantic Classification', 'Symbolic/Number Classification', 'Figural Classification', 'Semantic Series', 'Number Series', 'Figural Series', 'Problem Solving', 'Word Building', 'Coding & Decoding', 'Numerical Operations', 'Symbolic Operations', 'Venn Diagrams', 'Drawing Inferences', 'Critical Thinking']
          },
          {
            id: 'chsl_t1_ga',
            name: 'General Awareness',
            slug: 'general_awareness',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['India and its neighboring countries', 'History', 'Culture', 'Geography', 'Economic Scene', 'General Policy', 'Scientific Research', 'Current Events of National & International Importance']
          },
          {
            id: 'chsl_t1_quant',
            name: 'Quantitative Aptitude (Basic Arithmetic Skill)',
            slug: 'quantitative_aptitude',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Number Systems', 'Fundamental Arithmetical Operations (Percentages, Ratio & Proportion, Square Roots, Averages, Interest, Profit and Loss, Discount, Partnership, Mixtures, Time and Distance, Time & Work)', 'Algebra (Basic algebraic identities, Elementary surds)', 'Geometry (Familiarity with elementary geometric figures and facts)', 'Mensuration', 'Trigonometry', 'Statistical Charts']
          },
          {
            id: 'chsl_t1_english',
            name: 'English Language (Basic Knowledge)',
            slug: 'english_language',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Homonyms', 'Antonyms', 'Spellings/Detecting mis-spelt words', 'Idioms & Phrases', 'One word substitution', 'Improvement of Sentences', 'Active/Passive Voice', 'Direct/Indirect Narration', 'Shuffling of Sentence Parts', 'Cloze Passage', 'Comprehension Passage']
          }
        ]
      }
    ]
  },
  {
    id: 'ssc-mts',
    slug: 'ssc_mts',
    name: 'SSC MTS',
    category: 'SSC',
    description: 'Staff Selection Commission Multi-Tasking (Non-Technical) Staff Examination',
    officialUrl: 'https://ssc.gov.in/',
    stages: [
      {
        id: 'ssc_mts_cbe',
        stageSlug: 'cbe',
        stageName: 'Computer Based Examination (Session I & II)',
        notificationVersion: 'Notice MTS & Havaldar 2024 (F. No. HQ-PPI03/14/2024-PP_1)',
        examYear: 2024,
        totalQuestions: 90,
        totalMarks: 270,
        durationMinutes: 90,
        hasSectionalTiming: true, // 45 min Session I + 45 min Session II
        marksPerCorrect: 3,
        negativeMarkPerWrong: 0.5555, // 0 in Session I, 1 in Session II
        sourceUrl: 'https://ssc.gov.in/',
        sourceTitle: 'Staff Selection Commission Notice of Multi-Tasking (Non-Technical) Staff Examination 2024',
        verificationDate: '2024-06-27',
        languages: ['en', 'hi', 'bn'],
        subjects: [
          {
            id: 'mts_math_s1',
            name: 'Numerical and Mathematical Ability (Session I)',
            slug: 'numerical_and_mathematical_ability',
            questionCount: 20,
            marksPerQuestion: 3,
            negativeMark: 0, // No negative marking in Session I per official notification!
            durationMinutes: 45,
            topics: ['Integers and Whole Numbers', 'LCM and HCF', 'Decimals and Fractions', 'Relationship between numbers', 'Fundamental Arithmetic Operations and BODMAS', 'Percentage', 'Ratio and Proportions', 'Work and Time', 'Direct and Inverse Proportions', 'Averages', 'Simple Interest', 'Profit and Loss', 'Discount', 'Area and Perimeter', 'Distance and Time', 'Lines and Angles', 'Interpretation of simple Graphs and Data', 'Square and Square Roots']
          },
          {
            id: 'mts_reasoning_s1',
            name: 'Reasoning Ability & Problem Solving (Session I)',
            slug: 'reasoning_ability_and_problem_solving',
            questionCount: 20,
            marksPerQuestion: 3,
            negativeMark: 0, // No negative marking in Session I per official notification!
            durationMinutes: 45,
            topics: ['Alpha-Numeric Series', 'Coding and Decoding', 'Analogy', 'Following Directions', 'Similarities and Differences', 'Jumbling', 'Problem Solving and Analysis', 'Non-verbal reasoning based on diagrams', 'Age Calculations', 'Calendar and Clock']
          },
          {
            id: 'mts_ga_s2',
            name: 'General Awareness (Session II)',
            slug: 'general_awareness',
            questionCount: 25,
            marksPerQuestion: 3,
            negativeMark: 1.0, // Negative marking of 1 mark for each incorrect answer in Session II!
            durationMinutes: 45,
            topics: ['Social Studies (History, Geography, Art and Culture, Civics, Economics)', 'General Science and Environmental Studies up to 10th Standard', 'Current Events']
          },
          {
            id: 'mts_english_s2',
            name: 'English Language and Comprehension (Session II)',
            slug: 'english_language_and_comprehension',
            questionCount: 25,
            marksPerQuestion: 3,
            negativeMark: 1.0, // Negative marking of 1 mark for each incorrect answer in Session II!
            durationMinutes: 45,
            topics: ['Basics of English Language, its vocabulary, grammar, sentence structure, synonyms, antonyms and its correct usage', 'Comprehension of a simple paragraph with questions']
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STATE PSC (4 EXAMS)
  // =========================================================================
  {
    id: 'wbpsc-wbcs',
    slug: 'wbpsc_wbcs',
    name: 'WBPSC WBCS (Exe.)',
    category: 'STATE_PSC',
    description: 'West Bengal Civil Service (Executive) etc. Examination',
    officialUrl: 'https://psc.wb.gov.in/',
    stages: [
      {
        id: 'wbcs_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'WBCS (Exe.) etc. Exam Scheme 2024 / Advt. 01/2023',
        examYear: 2024,
        totalQuestions: 200,
        totalMarks: 200,
        durationMinutes: 150, // 2.5 hours
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.3333333333333333, // 1/3 mark penalty
        sourceUrl: 'https://psc.wb.gov.in/',
        sourceTitle: 'Public Service Commission West Bengal WBCS (Exe.) Scheme & Syllabus',
        verificationDate: '2024-03-01',
        languages: ['en', 'bn'],
        subjects: [
          {
            id: 'wbcs_eng',
            name: 'English Composition',
            slug: 'english_composition',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Synonyms & Antonyms', 'Idioms and Phrases', 'Vocabulary Test', 'Phrasal Verbs', 'Homophones', 'Fill in the blanks with Prepositions']
          },
          {
            id: 'wbcs_science',
            name: 'General Science',
            slug: 'general_science',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['General understanding and appreciation of science', 'Observation of everyday scientific matters', 'Physics fundamentals', 'Chemistry essentials', 'Life sciences']
          },
          {
            id: 'wbcs_history',
            name: 'History of India',
            slug: 'history_of_india',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Ancient Indian History', 'Medieval Indian History', 'Mughal Empire', 'Socio-religious reform movements', 'Early British Period']
          },
          {
            id: 'wbcs_geography',
            name: 'Geography of India & West Bengal',
            slug: 'geography_of_india_wb',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Physical Geography of India', 'Geography of West Bengal (Districts, Rivers, Climate, Agriculture, Industry)', 'Natural Resources', 'Demographics']
          },
          {
            id: 'wbcs_polity_eco',
            name: 'Indian Polity and Economy',
            slug: 'indian_polity_and_economy',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Constitution of India (Preamble, Fundamental Rights, DPSP, Parliament, Judiciary)', 'Panchayati Raj in West Bengal', 'Indian Economy', 'Planning and NITI Aayog', 'Banking & RBI']
          },
          {
            id: 'wbcs_inm',
            name: 'Indian National Movement',
            slug: 'indian_national_movement',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Nature and character of 19th Century Resurgence', 'Growth of Nationalism', 'Attainment of Independence', 'Role of Bengal in Freedom Struggle', 'Swadeshi & Revolutionary Movements']
          },
          {
            id: 'wbcs_gma',
            name: 'General Mental Ability',
            slug: 'general_mental_ability',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Logical Reasoning', 'Common inferences', 'Arithmetic reasoning', 'Series completion', 'Coding Decoding', 'Data interpretation']
          },
          {
            id: 'wbcs_current_affairs',
            name: 'Current Events of National & International Importance',
            slug: 'current_events',
            questionCount: 25,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['National News', 'West Bengal State Schemes (Kanyashree, Rupashree, etc.)', 'International Summits', 'Sports', 'Awards and Honours', 'Books and Authors']
          }
        ]
      }
    ]
  },
  {
    id: 'wbpsc-clerkship',
    slug: 'wbpsc_clerkship',
    name: 'WBPSC Clerkship',
    category: 'STATE_PSC',
    description: 'West Bengal Public Service Commission Clerkship Examination (Part I Objective)',
    officialUrl: 'https://psc.wb.gov.in/',
    stages: [
      {
        id: 'wbpsc_clerkship_part1',
        stageSlug: 'part_1',
        stageName: 'Part I (Objective Type)',
        notificationVersion: 'Advt. No. 13/2023',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.25, // 0.25 marks penalty
        sourceUrl: 'https://psc.wb.gov.in/',
        sourceTitle: 'Public Service Commission West Bengal Clerkship Examination 2023 Scheme and Syllabus',
        verificationDate: '2023-12-04',
        languages: ['en', 'bn'],
        subjects: [
          {
            id: 'clerkship_eng',
            name: 'English',
            slug: 'english',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Fundamentals of English language (Vocabulary, Grammar, Sentence Structure, Synonyms, Antonyms and its correct usage)']
          },
          {
            id: 'clerkship_gs',
            name: 'General Studies',
            slug: 'general_studies',
            questionCount: 40,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Matters of everyday observation including everyday science', 'Current events', 'Problems with special reference to India and elementary knowledge of Indian History and Indian Geography']
          },
          {
            id: 'clerkship_arithmetic',
            name: 'Arithmetic',
            slug: 'arithmetic',
            questionCount: 30,
            marksPerQuestion: 1,
            negativeMark: 0.25,
            topics: ['Divisibility', 'Fractions', 'Decimals', 'Recurring Decimals', 'Simplification', 'HCF & LCM', 'Partnership', 'Average', 'Ratio and Proportions', 'Percentage', 'Simple Interest', 'Profit and Loss', 'Time and Distance', 'Area of Rectangles and Squares']
          }
        ]
      }
    ]
  },
  {
    id: 'wbpsc-misc',
    slug: 'wbpsc_misc',
    name: 'WBPSC Miscellaneous',
    category: 'STATE_PSC',
    description: 'West Bengal Public Service Commission Miscellaneous Services Recruitment Examination',
    officialUrl: 'https://psc.wb.gov.in/',
    stages: [
      {
        id: 'wbpsc_misc_prelims',
        stageSlug: 'prelims',
        stageName: 'Preliminary Examination',
        notificationVersion: 'Advt. No. 11/2023',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 200,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 2,
        negativeMarkPerWrong: 0.50, // 0.50 marks (1/4th of 2 marks)
        sourceUrl: 'https://psc.wb.gov.in/',
        sourceTitle: 'Public Service Commission West Bengal Miscellaneous Services Examination 2023 Scheme and Syllabus',
        verificationDate: '2023-10-03',
        languages: ['en', 'bn'],
        subjects: [
          {
            id: 'misc_gs',
            name: 'General Studies',
            slug: 'general_studies',
            questionCount: 75,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['General Knowledge', 'Current Affairs', 'Everyday Science', 'Indian History', 'Geography of India & West Bengal', 'Indian Constitution', 'Ecology & Environment']
          },
          {
            id: 'misc_arithmetic',
            name: 'Arithmetic',
            slug: 'arithmetic',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMark: 0.50,
            topics: ['Madhyamik Examination Standard Arithmetic (Simplification, Percentage, Ratio & Proportion, Profit & Loss, Simple Interest, Time & Work, Speed & Distance, Mensuration)']
          }
        ]
      }
    ]
  },
  {
    id: 'wbpsc-food-si',
    slug: 'wbpsc_food_si',
    name: 'WBPSC Food SI',
    category: 'STATE_PSC',
    description: 'Sub-Inspector in the Subordinate Food & Supplies Service, Grade-III',
    officialUrl: 'https://psc.wb.gov.in/',
    stages: [
      {
        id: 'wbpsc_food_si_written',
        stageSlug: 'written',
        stageName: 'Written Examination (Objective Type)',
        notificationVersion: 'Advt. No. 04/2023',
        examYear: 2024,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        hasSectionalTiming: false,
        marksPerCorrect: 1,
        negativeMarkPerWrong: 0.3333333333333333, // 1/3 mark deduction
        sourceUrl: 'https://psc.wb.gov.in/',
        sourceTitle: 'Public Service Commission West Bengal Scheme and Syllabus for Recruitment to the Post of Sub-Inspector in Subordinate Food & Supplies Service, Gr-III',
        verificationDate: '2023-08-22',
        languages: ['en', 'bn'],
        subjects: [
          {
            id: 'food_si_gs',
            name: 'General Studies',
            slug: 'general_studies',
            questionCount: 50,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Matters of common experience including everyday science', 'Current events', 'Problems with special reference to India', 'Elementary knowledge of Indian History', 'Indian Geography']
          },
          {
            id: 'food_si_arithmetic',
            name: 'Arithmetic',
            slug: 'arithmetic',
            questionCount: 50,
            marksPerQuestion: 1,
            negativeMark: 0.3333333333333333,
            topics: ['Madhyamik Examination Standard Arithmetic', 'Divisibility', 'Fractions', 'Decimals', 'HCF & LCM', 'Partnership', 'Average', 'Ratio and Proportion', 'Percentage', 'Profit and Loss', 'Simple Interest', 'Time and Distance', 'Time and Work']
          }
        ]
      }
    ]
  }
];

export function getExamBySlug(slug: string): ExamPreset | undefined {
  return EXAM_PRESETS.find(e => e.slug === slug);
}

export function getStageConfig(examSlug: string, stageSlug: string): ExamStageConfig | undefined {
  const exam = getExamBySlug(examSlug);
  if (!exam) return undefined;
  return exam.stages.find(s => s.stageSlug === stageSlug) || exam.stages[0];
}
