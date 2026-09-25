import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
} from 'docx';

export async function exportToDocx(
  text: string,
  docType: string,
  parties: string,
  effectiveDate: string,
  terms: string,
  brandingTitle: string = 'LegalEase Legal Document'
): Promise<void> {
  // Parse lines to build structured docx elements
  const lines = text.split('\n');
  const paragraphs: Paragraph[] = [];

  // Document Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: (docType || 'LEGAL AGREEMENT').toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman',
          color: '1A202C',
        }),
      ],
    })
  );

  // Subtitle / Effective Date
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Effective Date: ${effectiveDate || 'Upon Mutual Execution'}`,
          italics: true,
          size: 22, // 11pt
          font: 'Times New Roman',
          color: '4A5568',
        }),
      ],
    })
  );

  // If terms are present, create a formatted Terms Table (as highlighted in Milestone 2 page 8, 9, 15)
  if (terms && terms.trim()) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 150 },
        children: [
          new TextRun({
            text: 'SUMMARY OF AGREED COVENANTS & KEY TERMS',
            bold: true,
            size: 24,
            font: 'Times New Roman',
          }),
        ],
      })
    );

    const termItems = terms
      .split(';')
      .map(t => t.trim())
      .filter(Boolean);

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Clause #', bold: true, font: 'Times New Roman' })],
              }),
            ],
            shading: { fill: 'F3F4F6' },
          }),
          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Agreed Provision / Term', bold: true, font: 'Times New Roman' })],
              }),
            ],
            shading: { fill: 'F3F4F6' },
          }),
        ],
      }),
      ...termItems.map(
        (term, index) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `§ ${index + 1}`, bold: true, font: 'Times New Roman' })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: term, font: 'Times New Roman' })],
                  }),
                ],
              }),
            ],
          })
      ),
    ];

    const termsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    paragraphs.push(termsTable as any);
    paragraphs.push(new Paragraph({ spacing: { after: 250 } }));
  }

  // Parse text paragraphs and headings
  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('# ')) {
      const headingText = line.replace(/^#+\s*/, '');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 26,
              font: 'Times New Roman',
              color: '1A202C',
            }),
          ],
        })
      );
    } else if (line.startsWith('### ')) {
      const subHeadingText = line.replace(/^###\s*/, '');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 100 },
          children: [
            new TextRun({
              text: subHeadingText,
              bold: true,
              size: 23,
              font: 'Times New Roman',
              color: '2D3748',
            }),
          ],
        })
      );
    } else if (line.startsWith('---') || line.startsWith('***')) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 150, after: 150 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E0' },
          },
        })
      );
    } else {
      // Process bold markers like **bold text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({
            text: part.slice(2, -2),
            bold: true,
            font: 'Times New Roman',
            size: 22,
          });
        }
        return new TextRun({
          text: part,
          font: 'Times New Roman',
          size: 22,
        });
      });

      paragraphs.push(
        new Paragraph({
          spacing: { after: 140, line: 360 }, // 1.5 line spacing for legal formatting
          alignment: AlignmentType.JUSTIFIED,
          children: textRuns,
        })
      );
    }
  }

  // Build the complete docx Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${brandingTitle} • Certified Draft`,
                    size: 16,
                    font: 'Times New Roman',
                    color: '718096',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 18,
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: '  |  LegalEase AI Document Generator',
                    size: 16,
                    font: 'Times New Roman',
                    color: 'A0AEC0',
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (docType || 'Legal_Agreement')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${cleanName}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
