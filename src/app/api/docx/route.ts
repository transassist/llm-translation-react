import { NextRequest, NextResponse } from 'next/server';

// DOCX conversion API handler
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { html, filename = 'translated-document' } = body;

    // Validate required fields
    if (!html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Import libraries asynchronously to avoid server-side issues with Next.js
    const mammoth = await import('mammoth');
    const { Document, Packer, Paragraph, TextRun } = await import('docx');

    // Create a simple DOCX document from the HTML content
    // In a production environment, you would use a more sophisticated HTML to DOCX conversion
    // This is a simplified version for demonstration purposes
    
    // First, convert HTML to plain text (a more complex solution would preserve formatting)
    const plainText = html.replace(/<[^>]*>/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
    
    // Split text into paragraphs
    const paragraphs = plainText.split('\n\n');
    
    // Create DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs.map(text => 
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 24, // 12pt font
                }),
              ],
            })
          ),
        },
      ],
    });

    // Pack the document to a Buffer
    const buffer = await Packer.toBuffer(doc);

    // Return the buffer as a blob
    const response = new NextResponse(buffer);
    
    // Set appropriate headers
    response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    response.headers.set('Content-Disposition', `attachment; filename="${filename}.docx"`);
    
    return response;
  } catch (error) {
    console.error('DOCX API error:', error);
    return NextResponse.json(
      { error: 'Failed to convert to DOCX' },
      { status: 500 }
    );
  }
}