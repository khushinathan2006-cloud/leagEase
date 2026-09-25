import { jsPDF } from 'jspdf';

export function exportToPdf(
  text: string,
  docType: string,
  parties: string,
  effectiveDate: string,
  terms: string,
  orgName: string = 'LegalEase Legal Systems'
): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 in
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const addHeaderAndFooter = (currentPage: number, totalPages: number) => {
    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(110, 120, 135);
    doc.text('⚖ LEGALEASE LEGAL DOCUMENT REPOSITORY', margin, 36);

    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.text(`Doc Type: ${docType} | Confidential`, pageWidth - margin, 36, { align: 'right' });

    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.6);
    doc.line(margin, 42, pageWidth - margin, 42);

    // Footer
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.6);
    doc.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(130, 140, 155);
    doc.text(`LegalEase Inc. | contact@legalease.com | All Rights Reserved`, margin, pageHeight - 24);
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - 24, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      cursorY = margin + 15;
    }
  };

  // Header Title Area
  cursorY += 15;
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 25, 35);
  doc.text((docType || 'LEGAL AGREEMENT').toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 20;

  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(85, 95, 110);
  doc.text(`Effective Date: ${effectiveDate || 'Upon Mutual Execution'}`, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 26;

  doc.setDrawColor(40, 50, 70);
  doc.setLineWidth(1.2);
  doc.line(pageWidth / 2 - 80, cursorY, pageWidth / 2 + 80, cursorY);
  cursorY += 24;

  // Process text line by line
  const rawLines = text.split('\n');
  doc.setTextColor(30, 35, 45);

  for (let rawLine of rawLines) {
    const line = rawLine.trim();

    if (!line) {
      cursorY += 8;
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('# ')) {
      const heading = line.replace(/^#+\s*/, '');
      checkPageBreak(36);
      cursorY += 14;
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(heading, margin, cursorY);
      cursorY += 16;
    } else if (line.startsWith('### ')) {
      const subHeading = line.replace(/^###\s*/, '');
      checkPageBreak(28);
      cursorY += 10;
      doc.setFont('times', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(30, 41, 59);
      doc.text(subHeading, margin, cursorY);
      cursorY += 14;
    } else if (line.startsWith('---') || line.startsWith('***')) {
      checkPageBreak(18);
      cursorY += 6;
      doc.setDrawColor(220, 225, 230);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 12;
    } else if (line.startsWith('```') || line.endsWith('```')) {
      // Signature code block or separator
      continue;
    } else {
      // Regular paragraph or bullet
      doc.setFont('times', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(35, 40, 50);

      // Clean markdown asterisks for PDF display
      const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
      const wrappedLines = doc.splitTextToSize(cleanLine, contentWidth);

      for (let wLine of wrappedLines) {
        checkPageBreak(14);
        doc.text(wLine, margin, cursorY);
        cursorY += 13.5;
      }
      cursorY += 3;
    }
  }

  // Add headers & footers with correct page count
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderAndFooter(i, totalPages);
  }

  const cleanName = (docType || 'Legal_Agreement')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  doc.save(`${cleanName}.pdf`);
}
