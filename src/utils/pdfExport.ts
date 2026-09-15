import katex from 'katex';
import { MockTest } from '../types/exam';

/**
 * Converts math notation ($...$ and $$...$$) into rendered KaTeX HTML strings
 */
function renderMathInHtml(content: string): string {
  if (!content) return '';
  return content.replace(/(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g, (match) => {
    const isBlock = match.startsWith('$$');
    const formula = isBlock ? match.slice(2, -2).trim() : match.slice(1, -1).trim();
    try {
      return katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return match;
    }
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generates an authentic, printable question paper PDF with answers & solutions on the last page
 */
export function downloadMockPaperPDF(test: MockTest) {
  const letters = ['A', 'B', 'C', 'D'];

  const questionsHtml = test.questions
    .map((q, idx) => {
      const qNum = idx + 1;
      const formattedQText = renderMathInHtml(escapeHtml(q.questionText));

      const optionsHtml = q.options
        .map((opt, oIdx) => {
          const formattedOpt = renderMathInHtml(escapeHtml(opt));
          return `
            <div class="option-item">
              <span class="option-letter">(${letters[oIdx]})</span>
              <span class="option-text">${formattedOpt}</span>
            </div>
          `;
        })
        .join('');

      return `
        <div class="question-block">
          <div class="question-header">
            <span class="question-num">Q${qNum}.</span>
            <span class="question-section">[${escapeHtml(q.section || 'General')}]</span>
          </div>
          <div class="question-body">${formattedQText}</div>
          <div class="options-grid">${optionsHtml}</div>
        </div>
      `;
    })
    .join('');

  // Quick Answer Key Table
  const answerKeyRows = test.questions
    .map((q, idx) => {
      const qNum = idx + 1;
      const correctLetter = letters[q.correctAnswer] || 'A';
      return `
        <tr>
          <td style="text-align:center; font-weight:bold;">${qNum}</td>
          <td style="text-align:center; font-weight:bold; color:#1e40af;">(${correctLetter})</td>
          <td>${escapeHtml(q.topic || 'General')}</td>
        </tr>
      `;
    })
    .join('');

  // Step-by-step Detailed Solutions
  const solutionsHtml = test.questions
    .map((q, idx) => {
      const qNum = idx + 1;
      const correctLetter = letters[q.correctAnswer] || 'A';
      const correctOptText = renderMathInHtml(escapeHtml(q.options[q.correctAnswer] || ''));
      const explanationHtml = renderMathInHtml(escapeHtml(q.explanation || 'Step-by-step authentic solution.'));

      return `
        <div class="solution-block">
          <div class="solution-header">
            <span class="sol-qnum">Q${qNum}.</span>
            <span class="sol-correct">Correct Option: <strong>(${correctLetter}) ${correctOptText}</strong></span>
          </div>
          <div class="sol-explanation">
            <strong>Solution &amp; Explanation:</strong>
            <div class="sol-body">${explanationHtml}</div>
          </div>
        </div>
      `;
    })
    .join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(test.title)} - Question Paper & Solutions</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #fff;
      font-size: 13px;
      line-height: 1.5;
      padding: 24px;
    }

    @page {
      size: A4;
      margin: 15mm;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; break-before: page; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }

    .toolbar {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 12px 18px;
      border-radius: 10px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .btn {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }
    .btn:hover { background: #1d4ed8; }

    /* Paper Header */
    .paper-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .paper-badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
      color: #475569;
    }
    .paper-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0;
    }
    .paper-meta {
      display: flex;
      justify-content: space-around;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      margin-top: 8px;
    }

    .instructions {
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 20px;
      font-size: 11px;
      color: #475569;
      background: #fafafa;
    }

    /* Questions */
    .question-block {
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .question-header {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .question-num {
      font-weight: bold;
      color: #0f172a;
      font-size: 13px;
    }
    .question-section {
      font-size: 10px;
      text-transform: uppercase;
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      color: #334155;
    }
    .question-body {
      font-size: 13px;
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 10px;
      line-height: 1.55;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
    }
    .option-item {
      display: flex;
      gap: 6px;
      font-size: 12px;
      color: #334155;
    }
    .option-letter {
      font-weight: bold;
      color: #1e40af;
      flex-shrink: 0;
    }

    /* Solutions Section (Last Page) */
    .solutions-title {
      font-size: 17px;
      font-weight: 800;
      text-align: center;
      text-transform: uppercase;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 18px;
      color: #0f172a;
    }
    .key-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 11px;
    }
    .key-table th, .key-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    .key-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }

    .solution-block {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 12px;
      background: #f8fafc;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .solution-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .sol-qnum {
      font-weight: 800;
      color: #0f172a;
    }
    .sol-correct {
      color: #15803d;
      background: #dcfce7;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
    }
    .sol-explanation {
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
    }
    .sol-body {
      margin-top: 4px;
      color: #1e293b;
    }
  </style>
</head>
<body>

  <div class="toolbar no-print">
    <div>
      <strong>Print or Save to PDF:</strong> Click the button to download this Question Paper with Answer Key on the last page.
    </div>
    <button class="btn" onclick="window.print()">📥 Print / Save as PDF</button>
  </div>

  <!-- PART 1: QUESTION PAPER -->
  <div class="paper-header">
    <div class="paper-badge">All-India Competitive Examination Standard Mock Paper</div>
    <h1 class="paper-title">${escapeHtml(test.title)}</h1>
    <div class="paper-meta">
      <span>Duration: ${test.durationMinutes} Minutes</span>
      <span>Total Questions: ${test.questions.length}</span>
      <span>Total Marks: ${test.totalMarks}</span>
      <span>Marking Scheme: +${test.marksPerQuestion}, -${test.negativeMark || 0.25}</span>
    </div>
  </div>

  <div class="instructions">
    <strong>INSTRUCTIONS TO CANDIDATES:</strong>
    1. This question paper contains ${test.questions.length} multiple-choice questions. Each question has four choices: (A), (B), (C), and (D).
    2. Read each question carefully. Correct answers receive +${test.marksPerQuestion} mark; incorrect answers receive -${test.negativeMark || 0.25} negative mark.
    3. The Complete Official Answer Key and Step-by-Step Explanations are provided at the end of this document.
  </div>

  <div class="questions-container">
    ${questionsHtml}
  </div>

  <!-- PART 2: ANSWER KEY & SOLUTIONS (STARTS ON NEW / LAST PAGE) -->
  <div class="page-break" style="page-break-before: always; break-before: page; margin-top: 30px;"></div>

  <div class="paper-header" style="margin-top: 20px;">
    <h2 class="solutions-title">PART II: OFFICIAL ANSWER KEY &amp; DETAILED SOLUTIONS</h2>
    <div class="paper-badge">${escapeHtml(test.title)} - Solution Sheet</div>
  </div>

  <h3 style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #1e293b;">Quick Answer Key:</h3>
  <table class="key-table">
    <thead>
      <tr>
        <th style="width: 15%; text-align: center;">Q. No</th>
        <th style="width: 25%; text-align: center;">Correct Option</th>
        <th>Topic / Section</th>
      </tr>
    </thead>
    <tbody>
      ${answerKeyRows}
    </tbody>
  </table>

  <h3 style="font-size: 13px; font-weight: bold; margin: 18px 0 10px 0; color: #1e293b;">Step-by-Step Detailed Explanations:</h3>
  <div class="solutions-container">
    ${solutionsHtml}
  </div>

  <script>
    // Automatically open print dialog after styles load
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    // If popups are blocked, download as HTML file that prints to PDF
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_mock_paper.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
