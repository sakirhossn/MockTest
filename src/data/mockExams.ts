import { ExamPatternConfig, MockTest } from '../types/exam';

export const EXAM_CONFIGS: ExamPatternConfig[] = [
  // 1. RAILWAY
  {
    id: 'rrb_ntpc',
    name: 'RRB NTPC (Non-Technical Popular Categories)',
    shortName: 'RRB NTPC',
    description: 'Railway Recruitment Board CBT-1 Exam Pattern with General Awareness, Mathematics, and General Intelligence.',
    tierOrStage: 'CBT Stage 1',
    durationMinutes: 90,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.333,
    sections: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
    expectedCutoffs: { general: 73.5, obc: 68.2, sc: 61.4, st: 54.8, ews: 65.0 },
    badgeColor: 'bg-emerald-500',
    iconName: 'Train',
  },
  {
    id: 'rrb_group_d',
    name: 'RRB Group D / Level-1',
    shortName: 'RRB Group D',
    description: 'Railway Recruitment Board Level 1 7th CPC Matrix examination covering General Science, Mathematics, Reasoning, and GA.',
    tierOrStage: 'CBT',
    durationMinutes: 90,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.333,
    sections: ['General Science', 'Mathematics', 'General Intelligence & Reasoning', 'General Awareness & Current Affairs'],
    expectedCutoffs: { general: 70.0, obc: 64.5, sc: 58.0, st: 52.0, ews: 60.0 },
    badgeColor: 'bg-emerald-600',
    iconName: 'Train',
  },
  // 2. SSC
  {
    id: 'ssc_cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    shortName: 'SSC CGL',
    description: 'Staff Selection Commission Tier-1 Exam with Advanced Math, Reasoning, English Comprehension, and GA.',
    tierOrStage: 'Tier 1',
    durationMinutes: 60,
    totalQuestions: 100,
    marksPerQuestion: 2,
    negativeMarkRatio: 0.25,
    sections: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    expectedCutoffs: { general: 145.5, obc: 138.0, sc: 122.5, st: 110.0, ews: 135.0 },
    badgeColor: 'bg-blue-600',
    iconName: 'Award',
  },
  {
    id: 'ssc_chsl',
    name: 'SSC CHSL (10+2 Level)',
    shortName: 'SSC CHSL',
    description: 'Staff Selection Commission Combined Higher Secondary Level Tier-1 with Arithmetic, English, Reasoning, and GA.',
    tierOrStage: 'Tier 1',
    durationMinutes: 60,
    totalQuestions: 100,
    marksPerQuestion: 2,
    negativeMarkRatio: 0.25,
    sections: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English Language'],
    expectedCutoffs: { general: 153.0, obc: 151.0, sc: 136.0, st: 125.0, ews: 148.0 },
    badgeColor: 'bg-blue-500',
    iconName: 'Award',
  },
  {
    id: 'ssc_mts',
    name: 'SSC MTS (Multi Tasking Staff)',
    shortName: 'SSC MTS',
    description: 'SSC MTS Computer Based Examination Session I (Math & Reasoning) & Session II (General Awareness & English).',
    tierOrStage: 'Session I & II',
    durationMinutes: 90,
    totalQuestions: 90,
    marksPerQuestion: 3,
    negativeMarkRatio: 0.333,
    sections: ['Numerical & Mathematical Ability', 'Reasoning Ability', 'General Awareness', 'English Language'],
    expectedCutoffs: { general: 125.0, obc: 120.0, sc: 112.0, st: 105.0, ews: 118.0 },
    badgeColor: 'bg-indigo-600',
    iconName: 'Award',
  },
  // 3. BANKING
  {
    id: 'ibps_po',
    name: 'IBPS PO (Probationary Officer)',
    shortName: 'IBPS PO',
    description: 'Institute of Banking Personnel Selection Prelims with Data Interpretation, High-Level Reasoning, and English.',
    tierOrStage: 'Prelims',
    durationMinutes: 60,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.25,
    sections: ['English Language', 'Quantitative Aptitude', 'Reasoning Ability'],
    expectedCutoffs: { general: 54.0, obc: 53.5, sc: 46.2, st: 40.5, ews: 53.0 },
    badgeColor: 'bg-amber-600',
    iconName: 'Landmark',
  },
  {
    id: 'ibps_clerk',
    name: 'IBPS Clerk / CSA',
    shortName: 'IBPS Clerk',
    description: 'IBPS Clerical Cadre Preliminary Exam with Numerical Ability, English, and Reasoning Ability.',
    tierOrStage: 'Prelims',
    durationMinutes: 60,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.25,
    sections: ['English Language', 'Numerical Ability', 'Reasoning Ability'],
    expectedCutoffs: { general: 78.5, obc: 77.0, sc: 70.0, st: 62.0, ews: 76.5 },
    badgeColor: 'bg-amber-500',
    iconName: 'Landmark',
  },
  {
    id: 'ibps_rrb_oa',
    name: 'IBPS RRB Office Assistant',
    shortName: 'IBPS RRB OA',
    description: 'Regional Rural Banks Multipurpose Office Assistant Prelims with Reasoning and Numerical Ability.',
    tierOrStage: 'Prelims',
    durationMinutes: 45,
    totalQuestions: 80,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.25,
    sections: ['Reasoning', 'Numerical Ability'],
    expectedCutoffs: { general: 72.0, obc: 71.0, sc: 66.0, st: 58.0, ews: 70.0 },
    badgeColor: 'bg-yellow-600',
    iconName: 'Landmark',
  },
  {
    id: 'ibps_rrb_os1',
    name: 'IBPS RRB Officer Scale I',
    shortName: 'IBPS RRB Scale I',
    description: 'Regional Rural Banks Officer Scale-I Prelims with Reasoning and Quantitative Aptitude.',
    tierOrStage: 'Prelims',
    durationMinutes: 45,
    totalQuestions: 80,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.25,
    sections: ['Reasoning', 'Quantitative Aptitude'],
    expectedCutoffs: { general: 56.5, obc: 55.0, sc: 48.0, st: 41.0, ews: 54.0 },
    badgeColor: 'bg-yellow-700',
    iconName: 'Landmark',
  },
  // 4. STATE PSC
  {
    id: 'wbpsc_wbcs',
    name: 'WBPSC WBCS (Exe.) Prelims',
    shortName: 'WBPSC WBCS',
    description: 'West Bengal Civil Service (Executive) Preliminary Exam with 8 sections including Bengal History, INM, and Polity.',
    tierOrStage: 'Prelims',
    durationMinutes: 150,
    totalQuestions: 200,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.333,
    sections: ['English Composition', 'General Science', 'History of India', 'Geography of India & WB', 'Indian Polity & Economy', 'Indian National Movement', 'General Mental Ability', 'Current Events'],
    expectedCutoffs: { general: 130.0, obc: 125.0, sc: 115.0, st: 98.0, ews: 122.0 },
    badgeColor: 'bg-purple-700',
    iconName: 'BookOpen',
  },
  {
    id: 'wbpsc_clerkship',
    name: 'WBPSC Clerkship Part 1',
    shortName: 'WBPSC Clerkship',
    description: 'West Bengal Public Service Commission Clerkship Exam covering English, General Studies, and Arithmetic.',
    tierOrStage: 'Part 1 / Prelims',
    durationMinutes: 90,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.25,
    sections: ['English', 'General Studies', 'Arithmetic'],
    expectedCutoffs: { general: 65.0, obc: 58.5, sc: 52.0, st: 41.5, ews: 55.0 },
    badgeColor: 'bg-purple-600',
    iconName: 'BookOpen',
  },
  {
    id: 'wbpsc_misc',
    name: 'WBPSC Miscellaneous Prelims',
    shortName: 'WBPSC Misc',
    description: 'WBPSC Miscellaneous Services Recruitment Preliminary Exam with General Studies and Arithmetic.',
    tierOrStage: 'Prelims',
    durationMinutes: 90,
    totalQuestions: 100,
    marksPerQuestion: 2,
    negativeMarkRatio: 0.25,
    sections: ['General Studies', 'Arithmetic'],
    expectedCutoffs: { general: 105.0, obc: 98.0, sc: 88.0, st: 72.0, ews: 95.0 },
    badgeColor: 'bg-purple-500',
    iconName: 'BookOpen',
  },
  {
    id: 'wbpsc_food_si',
    name: 'WBPSC Food SI Written',
    shortName: 'WBPSC Food SI',
    description: 'Sub-Inspector in the Subordinate Food & Supplies Service Grade-III Exam with General Studies and Madhyamik Arithmetic.',
    tierOrStage: 'Written',
    durationMinutes: 90,
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarkRatio: 0.333,
    sections: ['General Studies', 'Arithmetic'],
    expectedCutoffs: { general: 79.5, obc: 76.0, sc: 71.5, st: 59.0, ews: 74.0 },
    badgeColor: 'bg-violet-600',
    iconName: 'BookOpen',
  },
];

export const PRELOADED_TESTS: MockTest[] = [
  // 1. RRB NTPC CBT 1 Full-Pattern Mock Test
  {
    id: 'rrb-ntpc-test-1',
    title: 'RRB NTPC CBT-1 All-India Live Mock Test',
    examType: 'rrb_ntpc',
    description: 'Full-syllabus mock test aligned with official RRB NTPC CBT-1 pattern. Featuring Indian Railways facts, Science, Arithmetic, and Logical Reasoning.',
    durationMinutes: 20, // Condensed for quick demo, scalable to full 90m
    totalMarks: 10,
    marksPerQuestion: 1,
    negativeMark: 0.33,
    sections: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
    createdAt: '2026-03-01T10:00:00.000Z',
    questions: [
      {
        id: 'rrb-q1',
        section: 'General Awareness',
        questionText: 'Which railway zone in India is the first to achieve 100% electrification of its entire broad-gauge network?',
        options: [
          'West Central Railway (WCR)',
          'Southern Railway (SR)',
          'Northern Railway (NR)',
          'Eastern Railway (ER)'
        ],
        correctAnswer: 0,
        explanation: 'West Central Railway (headquartered at Jabalpur, Madhya Pradesh) became the first fully electrified railway zone in India by electrifying all 3,012 route km of broad gauge track.',
        difficulty: 'medium',
        topic: 'Indian Railways',
        subtopic: 'Electrification'
      },
      {
        id: 'rrb-q2',
        section: 'General Awareness',
        questionText: 'What is the SI unit of gravitational potential energy, and what is its dimensional formula?',
        options: [
          'Joule and $[M^1 L^2 T^{-2}]$',
          'Watt and $[M^1 L^2 T^{-3}]$',
          'Newton and $[M^1 L^1 T^{-2}]$',
          'Pascal and $[M^1 L^{-1} T^{-2}]$'
        ],
        correctAnswer: 0,
        explanation: 'Gravitational potential energy is given by $U = mgh$. Its SI unit is Joule (J). \nDimension of mass $[m] = M$, $g = [L T^{-2}]$, height $[h] = L$. \nTherefore, $[U] = [M] \\times [L T^{-2}] \\times [L] = [M^1 L^2 T^{-2}]$.',
        difficulty: 'medium',
        topic: 'General Science',
        subtopic: 'Physics - Units and Dimensions'
      },
      {
        id: 'rrb-q3',
        section: 'General Awareness',
        questionText: 'Which Article of the Constitution of India deals with the abolition of Untouchability?',
        options: [
          'Article 14',
          'Article 17',
          'Article 19',
          'Article 21'
        ],
        correctAnswer: 1,
        explanation: 'Article 17 of the Indian Constitution expressly declares: "Untouchability is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of Untouchability shall be an offence punishable in accordance with law."',
        difficulty: 'easy',
        topic: 'Indian Polity',
        subtopic: 'Fundamental Rights'
      },
      {
        id: 'rrb-q4',
        section: 'Mathematics',
        questionText: 'A train $180\\text{ m}$ long is running at a uniform speed of $54\\text{ km/h}$. How much time (in seconds) will it take to cross an electric pole beside the track?',
        options: [
          '$10\\text{ seconds}$',
          '$12\\text{ seconds}$',
          '$15\\text{ seconds}$',
          '$18\\text{ seconds}$'
        ],
        correctAnswer: 1,
        explanation: 'Step 1: Convert speed from $\\text{km/h}$ to $\\text{m/s}$:\n$$\\text{Speed} = 54 \\times \\frac{5}{18} = 15\\text{ m/s}$$\nStep 2: When crossing a pole, distance covered equals the length of the train:\n$$\\text{Distance} = 180\\text{ m}$$\nStep 3: Calculate time:\n$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{180}{15} = 12\\text{ seconds}$$',
        difficulty: 'easy',
        topic: 'Mathematics',
        subtopic: 'Time, Speed and Distance'
      },
      {
        id: 'rrb-q5',
        section: 'Mathematics',
        questionText: 'If $\\frac{a}{b} = \\frac{3}{4}$ and $\\frac{b}{c} = \\frac{8}{9}$, find the value of $\\frac{a^2 + c^2}{b^2}$.',
        options: [
          '$\\frac{117}{64}$',
          '$\\frac{145}{64}$',
          '$\\frac{125}{48}$',
          '$\\frac{81}{64}$'
        ],
        correctAnswer: 0,
        explanation: 'Step 1: Equalize the ratio of $b$:\n$$\\frac{a}{b} = \\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}, \\quad \\frac{b}{c} = \\frac{8}{9}$$\nSo $a : b : c = 6 : 8 : 9$.\nStep 2: Let $a = 6k$, $b = 8k$, $c = 9k$.\nStep 3: Evaluate $\\frac{a^2 + c^2}{b^2}$:\n$$\\frac{(6k)^2 + (9k)^2}{(8k)^2} = \\frac{36k^2 + 81k^2}{64k^2} = \\frac{117}{64}$$',
        difficulty: 'medium',
        topic: 'Mathematics',
        subtopic: 'Ratio and Proportion'
      },
      {
        id: 'rrb-q6',
        section: 'Mathematics',
        questionText: 'A sum of money doubles itself in $5\\text{ years}$ at simple interest. In how many years will it become $4\\text{ times}$ of itself at the same rate?',
        options: [
          '$10\\text{ years}$',
          '$12\\text{ years}$',
          '$15\\text{ years}$',
          '$20\\text{ years}$'
        ],
        correctAnswer: 2,
        explanation: 'At simple interest, if a sum $P$ doubles, Interest $I_1 = 2P - P = P$ in $T_1 = 5\\text{ years}$.\nFor the sum to become $4\\text{ times}$, the interest required is $I_2 = 4P - P = 3P$.\nSince SI is directly proportional to time:\n$$\\frac{I_1}{I_2} = \\frac{T_1}{T_2} \\implies \\frac{P}{3P} = \\frac{5}{T_2} \\implies T_2 = 5 \\times 3 = 15\\text{ years}$$',
        difficulty: 'easy',
        topic: 'Mathematics',
        subtopic: 'Simple Interest'
      },
      {
        id: 'rrb-q7',
        section: 'General Intelligence & Reasoning',
        questionText: 'Select the related word from the given alternatives:\n**Ohm : Resistance :: Pascal : ?**',
        options: [
          'Electric Current',
          'Pressure',
          'Frequency',
          'Luminous Intensity'
        ],
        correctAnswer: 1,
        explanation: 'Ohm is the SI unit of Electrical Resistance. Similarly, Pascal (Pa) is the SI unit of Pressure ($1\\text{ Pa} = 1\\text{ N/m}^2$).',
        difficulty: 'easy',
        topic: 'Reasoning',
        subtopic: 'Analogy'
      },
      {
        id: 'rrb-q8',
        section: 'General Intelligence & Reasoning',
        questionText: 'If in a certain code language, **TRAIN** is written as **WUDLQ**, how will **METRO** be coded in that same language?',
        options: [
          'PHWUR',
          'PGWUR',
          'OGWUR',
          'PHWVS'
        ],
        correctAnswer: 0,
        explanation: 'Each letter is shifted by $+3$ positions in the English alphabet:\n$T (+3) \\to W$\n$R (+3) \\to U$\n$A (+3) \\to D$\n$I (+3) \\to L$\n$N (+3) \\to Q$\n\nApplying $+3$ to METRO:\n$M (+3) \\to P$\n$E (+3) \\to H$\n$T (+3) \\to W$\n$R (+3) \\to U$\n$O (+3) \\to R$\n\nResult is **PHWUR**.',
        difficulty: 'easy',
        topic: 'Reasoning',
        subtopic: 'Coding-Decoding'
      },
      {
        id: 'rrb-q9',
        section: 'General Intelligence & Reasoning',
        questionText: 'Find the missing number in the sequence: $4, 9, 25, 49, 121, 169, ?$',
        options: [
          '$225$',
          '$289$',
          '$361$',
          '$196$'
        ],
        correctAnswer: 1,
        explanation: 'Observe the bases of each term:\n$4 = 2^2$\n$9 = 3^2$\n$25 = 5^2$\n$49 = 7^2$\n$121 = 11^2$\n$169 = 13^2$\n\nThese are the squares of consecutive PRIME numbers: $2, 3, 5, 7, 11, 13$.\nThe next prime number is $17$.\nTherefore, the missing term is $17^2 = 289$.',
        difficulty: 'medium',
        topic: 'Reasoning',
        subtopic: 'Number Series'
      },
      {
        id: 'rrb-q10',
        section: 'General Intelligence & Reasoning',
        questionText: 'Pointing to a photograph, a woman says: "He is the only son of the wife of my husband\'s father." How is the person in the photograph related to the woman?',
        options: [
          'Brother-in-law',
          'Father-in-law',
          'Husband',
          'Son'
        ],
        correctAnswer: 2,
        explanation: 'Break down the statement:\n1. "My husband\'s father" $\\to$ Father-in-law.\n2. "Wife of my husband\'s father" $\\to$ Mother-in-law.\n3. "The only son of my mother-in-law" $\\to$ The woman\'s husband.\nTherefore, the man in the photograph is her Husband.',
        difficulty: 'easy',
        topic: 'Reasoning',
        subtopic: 'Blood Relations'
      }
    ]
  },

  // 2. SSC CGL Tier 1 Pattern Mock Test
  {
    id: 'ssc-cgl-test-1',
    title: 'SSC CGL Tier-1 High-Scorer Standard Mock',
    examType: 'ssc_cgl',
    description: 'Comprehensive Tier 1 examination test featuring Advanced Mathematics (Algebra, Trigonometry, Geometry), Reasoning, English Comprehension, and General Awareness.',
    durationMinutes: 20,
    totalMarks: 16,
    marksPerQuestion: 2,
    negativeMark: 0.5,
    sections: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'English Comprehension', 'General Awareness'],
    createdAt: '2026-03-02T11:00:00.000Z',
    questions: [
      {
        id: 'ssc-q1',
        section: 'Quantitative Aptitude',
        questionText: 'If $x + \\frac{1}{x} = 5$, find the value of $x^3 + \\frac{1}{x^3}$.',
        options: [
          '$110$',
          '$125$',
          '$140$',
          '$115$'
        ],
        correctAnswer: 0,
        explanation: 'Use the algebraic identity:\n$$(x + \\frac{1}{x})^3 = x^3 + \\frac{1}{x^3} + 3(x + \\frac{1}{x})$$\nSubstitute $x + \\frac{1}{x} = 5$:\n$$5^3 = x^3 + \\frac{1}{x^3} + 3(5)$$\n$$125 = x^3 + \\frac{1}{x^3} + 15$$\n$$x^3 + \\frac{1}{x^3} = 125 - 15 = 110$$',
        difficulty: 'easy',
        topic: 'Advanced Mathematics',
        subtopic: 'Algebra'
      },
      {
        id: 'ssc-q2',
        section: 'Quantitative Aptitude',
        questionText: 'In a right-angled triangle $\\triangle ABC$, $\\angle B = 90^\\circ$. If $\\tan A = \\frac{3}{4}$, then find the value of $\\sin A \\cdot \\cos A + \\cos^2 A$.',
        options: [
          '$\\frac{28}{25}$',
          '$\\frac{24}{25}$',
          '$\\frac{7}{25}$',
          '$\\frac{16}{25}$'
        ],
        correctAnswer: 0,
        explanation: 'Given $\\tan A = \\frac{3}{4} = \\frac{\\text{Perpendicular}}{\\text{Base}}$.\nBy Pythagorean theorem, $\\text{Hypotenuse} = \\sqrt{3^2 + 4^2} = 5$.\nTherefore:\n$$\\sin A = \\frac{3}{5}, \\quad \\cos A = \\frac{4}{5}$$\nNow evaluate the expression:\n$$\\sin A \\cdot \\cos A + \\cos^2 A = \\left(\\frac{3}{5} \\times \\frac{4}{5}\\right) + \\left(\\frac{4}{5}\\right)^2 = \\frac{12}{25} + \\frac{16}{25} = \\frac{28}{25}$$',
        difficulty: 'medium',
        topic: 'Advanced Mathematics',
        subtopic: 'Trigonometry'
      },
      {
        id: 'ssc-q3',
        section: 'Quantitative Aptitude',
        questionText: 'A chord of length $16\\text{ cm}$ is at a distance of $6\\text{ cm}$ from the centre of a circle. What is the radius of the circle in centimeters?',
        options: [
          '$8\\text{ cm}$',
          '$10\\text{ cm}$',
          '$12\\text{ cm}$',
          '$14\\text{ cm}$'
        ],
        correctAnswer: 1,
        explanation: 'The perpendicular from the centre of a circle to a chord bisects the chord.\nHalf of the chord length $= \\frac{16}{2} = 8\\text{ cm}$.\nPerpendicular distance from centre $= 6\\text{ cm}$.\nIn the right triangle formed by the radius $r$, half chord, and perpendicular distance:\n$$r^2 = 8^2 + 6^2 = 64 + 36 = 100 \\implies r = \\sqrt{100} = 10\\text{ cm}$$',
        difficulty: 'easy',
        topic: 'Advanced Mathematics',
        subtopic: 'Geometry - Circles'
      },
      {
        id: 'ssc-q4',
        section: 'General Intelligence & Reasoning',
        questionText: 'In a row of students facing North, Rahul is $18^{\\text{th}}$ from the left end and Priya is $24^{\\text{th}}$ from the right end. If there are $50$ students in total, how many students sit between Rahul and Priya?',
        options: [
          '$6$',
          '$8$',
          '$10$',
          '$12$'
        ],
        correctAnswer: 1,
        explanation: 'Check whether the ranks overlap:\n$$\\text{Sum of positions} = 18 + 24 = 42$$\nSince $\\text{Sum} (42) < \\text{Total} (50)$, there is no overlap.\nNumber of students between them:\n$$\\text{Students in between} = \\text{Total} - (\\text{Left} + \\text{Right}) = 50 - 42 = 8$$',
        difficulty: 'easy',
        topic: 'General Intelligence',
        subtopic: 'Order & Ranking'
      },
      {
        id: 'ssc-q5',
        section: 'English Comprehension',
        questionText: 'Select the most appropriate synonym of the given word:\n**METICULOUS**',
        options: [
          'Careless',
          'Painstaking',
          'Hasty',
          'Arrogant'
        ],
        correctAnswer: 1,
        explanation: '"Meticulous" means showing great attention to detail; very careful and precise. "Painstaking" is an exact synonym (done with or employing great care and thoroughness). Antonyms include careless, sloppy, or hasty.',
        difficulty: 'easy',
        topic: 'English Comprehension',
        subtopic: 'Synonyms & Antonyms'
      },
      {
        id: 'ssc-q6',
        section: 'English Comprehension',
        questionText: 'Select the option that correctly converts the given sentence into Passive Voice:\n*"The committee will announce the official results tomorrow."*',
        options: [
          'The official results are announced by the committee tomorrow.',
          'The official results will be announced by the committee tomorrow.',
          'The official results would be announced by the committee tomorrow.',
          'The official results have been announced by the committee tomorrow.'
        ],
        correctAnswer: 1,
        explanation: 'The sentence is in Simple Future tense ($S + \\text{will} + V_1 + O$).\nThe passive voice rule for simple future is:\n$$O + \\text{will be} + V_3 + \\text{by} + S$$\nHence, "The official results will be announced by the committee tomorrow."',
        difficulty: 'easy',
        topic: 'English Comprehension',
        subtopic: 'Active & Passive Voice'
      },
      {
        id: 'ssc-q7',
        section: 'General Awareness',
        questionText: 'Who among the following was the Viceroy of India when the Partition of Bengal was carried out in 1905?',
        options: [
          'Lord Ripon',
          'Lord Curzon',
          'Lord Dalhousie',
          'Lord Minto'
        ],
        correctAnswer: 1,
        explanation: 'Lord Curzon was the Viceroy of India who announced the Partition of Bengal in July 1905, which took effect on October 16, 1905. It triggered the historic Swadeshi and Boycott Movement.',
        difficulty: 'easy',
        topic: 'General Awareness',
        subtopic: 'Modern Indian History'
      },
      {
        id: 'ssc-q8',
        section: 'General Awareness',
        questionText: 'Which constitutional amendment introduced the Goods and Services Tax (GST) in India?',
        options: [
          '100th Constitutional Amendment Act',
          '101st Constitutional Amendment Act',
          '102nd Constitutional Amendment Act',
          '103rd Constitutional Amendment Act'
        ],
        correctAnswer: 1,
        explanation: 'The 101st Constitutional Amendment Act, 2016 paved the way for the implementation of the Goods and Services Tax (GST) in India, which came into effect on 1 July 2017.',
        difficulty: 'medium',
        topic: 'General Awareness',
        subtopic: 'Indian Constitution'
      }
    ]
  },

  // 3. IBPS PO Prelims Pattern Mock Test
  {
    id: 'ibps-po-test-1',
    title: 'IBPS PO Prelims Speed & Accuracy Challenge',
    examType: 'ibps_po',
    description: 'Banking sector entrance exam pattern featuring high-level Data Interpretation, Syllogisms, and English Error Detection.',
    durationMinutes: 20,
    totalMarks: 6,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    sections: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language'],
    createdAt: '2026-03-03T09:00:00.000Z',
    questions: [
      {
        id: 'ibps-q1',
        section: 'Quantitative Aptitude',
        questionText: 'The ratio of income of A and B is $4 : 5$ and the ratio of their expenditures is $2 : 3$. If each saves $\\text{Rs. } 7200$ per month, find the monthly income of A.',
        options: [
          '$\\text{Rs. } 12,400$',
          '$\\text{Rs. } 14,400$',
          '$\\text{Rs. } 16,000$',
          '$\\text{Rs. } 18,000$'
        ],
        correctAnswer: 1,
        explanation: 'Let incomes be $4x$ and $5x$.\nExpenditures are $4x - 7200$ and $5x - 7200$.\nGiven ratio of expenditure is $2 : 3$:\n$$\\frac{4x - 7200}{5x - 7200} = \\frac{2}{3}$$\n$$3(4x - 7200) = 2(5x - 7200)$$\n$$12x - 21600 = 10x - 14400$$\n$$2x = 7200 \\implies x = 3600$$\nIncome of A $= 4x = 4 \\times 3600 = \\text{Rs. } 14,400$.',
        difficulty: 'medium',
        topic: 'Quantitative Aptitude',
        subtopic: 'Ratios and Equations'
      },
      {
        id: 'ibps-q2',
        section: 'Quantitative Aptitude',
        questionText: 'What approximate value should come in place of the question mark (?) in the equation:\n$$24.98\\% \\text{ of } 799.85 + 44.91\\% \\text{ of } 399.72 = ?$$',
        options: [
          '$380$',
          '$395$',
          '$360$',
          '$410$'
        ],
        correctAnswer: 0,
        explanation: 'Approximate the values:\n$$24.98\\% \\approx 25\\% = \\frac{1}{4}, \\quad 799.85 \\approx 800$$\n$$44.91\\% \\approx 45\\%, \\quad 399.72 \\approx 400$$\n\nCalculate:\n$$\\frac{1}{4} \\times 800 + \\frac{45}{100} \\times 400 = 200 + 180 = 380$$',
        difficulty: 'easy',
        topic: 'Quantitative Aptitude',
        subtopic: 'Approximation'
      },
      {
        id: 'ibps-q3',
        section: 'Reasoning Ability',
        questionText: 'Statements:\n1. All laptops are devices.\n2. Some devices are phones.\n3. No phone is a tablet.\n\nConclusions:\nI. Some devices are not tablets.\nII. No laptop is a tablet.',
        options: [
          'Only Conclusion I follows',
          'Only Conclusion II follows',
          'Both Conclusion I and II follow',
          'Neither Conclusion I nor II follows'
        ],
        correctAnswer: 0,
        explanation: 'Analysis:\n- Conclusion I: "Some devices are phones" and "No phone is a tablet". The portion of devices that are phones cannot be tablets. Hence, "Some devices are not tablets" is definitely TRUE.\n- Conclusion II: There is no direct negative relation specified between laptop and tablet (laptops could potentially overlap with tablets without violating any premise). Hence, Conclusion II does NOT necessarily follow.\nTherefore, Only Conclusion I follows.',
        difficulty: 'medium',
        topic: 'Reasoning Ability',
        subtopic: 'Syllogism'
      },
      {
        id: 'ibps-q4',
        section: 'Reasoning Ability',
        questionText: 'In a coded inequality:\n$P \\ge Q > R = S \\le T < U$\nWhich of the following conclusions is definitely TRUE?',
        options: [
          '$P > S$',
          '$Q < U$',
          '$P = S$',
          '$R > T$'
        ],
        correctAnswer: 0,
        explanation: 'Inspect relationship between $P$ and $S$:\n$$P \\ge Q > R = S$$\nSince $P \\ge Q$ and $Q > R$, we have $P > R$. Since $R = S$, it strictly follows that $P > S$.\nHence, $P > S$ is definitely true.',
        difficulty: 'easy',
        topic: 'Reasoning Ability',
        subtopic: 'Inequalities'
      },
      {
        id: 'ibps-q5',
        section: 'English Language',
        questionText: 'Identify the segment of the sentence that contains a grammatical error:\n*"Neither the manager (A) / nor the employees (B) / was present in the meeting (C) / yesterday evening (D)."*',
        options: [
          'Neither the manager (A)',
          'nor the employees (B)',
          'was present in the meeting (C)',
          'yesterday evening (D)'
        ],
        correctAnswer: 2,
        explanation: 'According to the Subject-Verb Agreement rule for "neither... nor...", when two subjects are connected by "nor", the verb agrees in number and person with the closest subject. Here, the closest subject is "the employees" (plural). Therefore, the singular verb "was" must be replaced with the plural "were".\nCorrect: "were present in the meeting".',
        difficulty: 'medium',
        topic: 'English Language',
        subtopic: 'Subject-Verb Agreement'
      },
      {
        id: 'ibps-q6',
        section: 'English Language',
        questionText: 'Select the most appropriate phrase to fill in the blank:\n*"The central bank decided to _______ interest rates to rein in runaway inflation."*',
        options: [
          'bring down',
          'hike up',
          'wash away',
          'run out of'
        ],
        correctAnswer: 1,
        explanation: 'To control or rein in high inflation, central banks increase (raise/hike) interest rates to discourage excessive borrowing and spending. "Hike up" means to increase sharply.',
        difficulty: 'easy',
        topic: 'English Language',
        subtopic: 'Phrasal Verbs'
      }
    ]
  },

  // 4. WBPSC Clerkship / WBCS Prelims Pattern Mock Test (with Bengal History & Regional Context)
  {
    id: 'wbpsc-clerkship-test-1',
    title: 'WBPSC Clerkship & WBCS Prelims Full Mock',
    examType: 'wbpsc_clerkship',
    description: 'Exam pattern aligned with WBPSC Syllabus featuring History of Bengal, Indian National Movement, Geography of West Bengal, Arithmetic, and English.',
    durationMinutes: 20,
    totalMarks: 8,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    sections: ['General Studies (Bengal & India)', 'Arithmetic', 'English'],
    createdAt: '2026-03-04T12:00:00.000Z',
    questions: [
      {
        id: 'wb-q1',
        section: 'General Studies (Bengal & India)',
        questionText: 'Who was the founder of the famous **"Anushilan Samiti"** secret revolutionary society established in Calcutta in 1902?',
        options: [
          'Pramathanath Mitra (P. Mitra)',
          'Aurobindo Ghosh',
          'Rash Behari Bose',
          'Bipin Chandra Pal'
        ],
        correctAnswer: 0,
        explanation: 'Anushilan Samiti was established on 24 March 1902 by Pramathanath Mitra (P. Mitra), along with Jatindranath Banerjee, Barindra Kumar Ghosh, and Sister Nivedita in Calcutta. It was one of the most prominent revolutionary organizations promoting national independence.',
        difficulty: 'medium',
        topic: 'History of Bengal',
        subtopic: 'Revolutionary Movement in Bengal'
      },
      {
        id: 'wb-q2',
        section: 'General Studies (Bengal & India)',
        questionText: 'Which district of West Bengal has the lowest literacy rate according to Census 2011?',
        options: [
          'Purulia',
          'Uttar Dinajpur',
          'Bankura',
          'Malda'
        ],
        correctAnswer: 1,
        explanation: 'According to Census 2011, Uttar Dinajpur district recorded the lowest literacy rate in West Bengal at approximately $59.07\\%$, whereas Purba Medinipur had the highest literacy rate (around $87.02\\%$).',
        difficulty: 'medium',
        topic: 'Geography of West Bengal',
        subtopic: 'Demographics & Census'
      },
      {
        id: 'wb-q3',
        section: 'General Studies (Bengal & India)',
        questionText: 'The Santhal Rebellion (Santhal Hool) of 1855 was led by which of the following legendary brothers?',
        options: [
          'Birsa Munda and Gaya Munda',
          'Sidho and Kanho Murmu',
          'Titu Mir and Golam Masum',
          'Budhu Bhagat and Jova Bhagat'
        ],
        correctAnswer: 1,
        explanation: 'The historic Santhal Rebellion of 1855-1856 against British colonial exploitation and the zamindari system was led by the four Murmu brothers: Sidho, Kanho, Chand, and Bhairav in the Rajmahal Hills / Santhal Pargana region.',
        difficulty: 'easy',
        topic: 'History of Bengal',
        subtopic: 'Tribal Movements'
      },
      {
        id: 'wb-q4',
        section: 'General Studies (Bengal & India)',
        questionText: 'Which river forms the boundary between West Bengal and Assam?',
        options: [
          'Teesta River',
          'Sankosh River',
          'Torsa River',
          'Jaldhaka River'
        ],
        correctAnswer: 1,
        explanation: 'The Sankosh river rises in northern Bhutan and flows through the plains, demarcating the border between the Jalpaiguri/Alipurduar districts of West Bengal and the Kokrajhar/Dhubri districts of Assam before meeting the Brahmaputra.',
        difficulty: 'medium',
        topic: 'Geography of West Bengal',
        subtopic: 'Rivers and Drainage'
      },
      {
        id: 'wb-q5',
        section: 'Arithmetic',
        questionText: 'A shopkeeper sells an article for $\\text{Rs. } 720$ and incurs a loss of $10\\%$. At what price should he sell it to gain a profit of $15\\%$?',
        options: [
          '$\\text{Rs. } 880$',
          '$\\text{Rs. } 920$',
          '$\\text{Rs. } 950$',
          '$\\text{Rs. } 900$'
        ],
        correctAnswer: 1,
        explanation: 'Step 1: Determine Cost Price (CP):\n$$\\text{Selling Price with } 10\\% \\text{ loss} = 90\\% \\text{ of } CP = 720$$\n$$CP = \\frac{720}{0.90} = \\text{Rs. } 800$$\n\nStep 2: Calculate Selling Price for $15\\%$ gain:\n$$SP = CP \\times (1 + 0.15) = 800 \\times 1.15 = \\text{Rs. } 920$$',
        difficulty: 'easy',
        topic: 'Arithmetic',
        subtopic: 'Profit and Loss'
      },
      {
        id: 'wb-q6',
        section: 'Arithmetic',
        questionText: 'Pipe A can fill a water cistern in $12\\text{ hours}$ and Pipe B can fill it in $16\\text{ hours}$. If both pipes are opened together, how much time will it take to fill the cistern completely?',
        options: [
          '$6\\text{ hours } 51\\text{ minutes}$',
          '$7\\text{ hours } 12\\text{ minutes}$',
          '$6\\text{ hours } 24\\text{ minutes}$',
          '$7\\text{ hours } 45\\text{ minutes}$'
        ],
        correctAnswer: 0,
        explanation: 'Let total capacity of the cistern $= \\text{LCM}(12, 16) = 48\\text{ units}$.\nEfficiency of Pipe A $= \\frac{48}{12} = 4\\text{ units/hour}$.\nEfficiency of Pipe B $= \\frac{48}{16} = 3\\text{ units/hour}$.\nCombined efficiency $= 4 + 3 = 7\\text{ units/hour}$.\n$$\\text{Total time} = \\frac{48}{7} = 6 \\frac{6}{7}\\text{ hours}$$\n$$6\\text{ hours} + \\left(\\frac{6}{7} \\times 60\\right)\\text{ minutes} \\approx 6\\text{ hours } 51.4\\text{ minutes} \\approx 6\\text{ hours } 51\\text{ minutes}$$',
        difficulty: 'medium',
        topic: 'Arithmetic',
        subtopic: 'Pipes and Cisterns'
      },
      {
        id: 'wb-q7',
        section: 'English',
        questionText: 'Choose the correct preposition to complete the sentence:\n*"The teacher congratulated Sourav _______ his remarkable success in the competitive examination."*',
        options: [
          'for',
          'on',
          'at',
          'with'
        ],
        correctAnswer: 1,
        explanation: 'The standard idiom in English grammar is to **"congratulate someone ON something"** (not "for" or "at").\nExample: "She congratulated him on his promotion."',
        difficulty: 'easy',
        topic: 'English',
        subtopic: 'Appropriate Prepositions'
      },
      {
        id: 'wb-q8',
        section: 'English',
        questionText: 'Select the correct meaning of the idiom:\n**"To burn the candle at both ends"**',
        options: [
          'To waste wax and resources unnecessarily',
          'To work extremely hard from early morning until late at night',
          'To be in an indecisive state of mind',
          'To celebrate with excessive firecrackers'
        ],
        correctAnswer: 1,
        explanation: '"To burn the candle at both ends" means to exhaust one\'s energies or health by working very hard without getting enough sleep or rest (e.g. studying late at night and getting up early).',
        difficulty: 'easy',
        topic: 'English',
        subtopic: 'Idioms & Phrases'
      }
    ]
  }
];
