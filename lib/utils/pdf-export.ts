'use client';

// Client-side PDF generation for individual reports
// Uses @react-pdf/renderer which runs in the browser

export interface PdfReportData {
  activityNumber: number;
  date: string;
  teamName: string;
  primarySkipperName: string;
  secondarySkipperName?: string;
  participantNames: string[];
  activityDescription: string;
  weatherConditions: string;
  emotionalHandling: string;
  summaryNextSteps: string;
  generalNotes?: string;
}

export async function generateReportPdf(data: PdfReportData): Promise<void> {
  // Dynamic import to avoid SSR issues with @react-pdf/renderer
  const { pdf, Document, Page, Text, View, StyleSheet, Font } = await import(
    '@react-pdf/renderer'
  );
  const { createElement } = await import('react');
  const h = createElement;

  // Register Rubik font for Hebrew
  Font.register({
    family: 'Rubik',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4i1UA.ttf',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-WYi1UA.ttf',
        fontWeight: 700,
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Rubik',
      padding: 40,
      direction: 'rtl' as any,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      textAlign: 'center',
      marginBottom: 20,
      color: '#2E75B6',
    },
    subtitle: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 30,
      color: '#666',
    },
    infoRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingBottom: 8,
      borderBottom: '1px solid #eee',
    },
    infoLabel: {
      fontSize: 10,
      color: '#666',
      width: '30%',
      textAlign: 'right',
    },
    infoValue: {
      fontSize: 11,
      width: '70%',
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      marginTop: 16,
      marginBottom: 8,
      color: '#2E75B6',
      textAlign: 'right',
    },
    sectionContent: {
      fontSize: 10,
      lineHeight: 1.6,
      textAlign: 'right',
      color: '#333',
    },
    participantsGrid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 8,
    },
    participantChip: {
      fontSize: 9,
      backgroundColor: '#EBF3FB',
      padding: '4 8',
      borderRadius: 4,
      color: '#2E75B6',
    },
    footer: {
      fontSize: 8,
      color: '#999',
      textAlign: 'center',
      marginTop: 30,
      paddingTop: 10,
      borderTop: '1px solid #eee',
    },
  });

  const formattedDate = new Date(data.date).toLocaleDateString('he-IL');

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: 'A4', style: styles.page },
      h(Text, { style: styles.title }, `דוח פעילות #${data.activityNumber}`),
      h(
        Text,
        { style: styles.subtitle },
        `${data.teamName} — ${formattedDate}`
      ),
      // Info section
      h(
        View,
        { style: styles.infoRow },
        h(Text, { style: styles.infoLabel }, 'תאריך:'),
        h(Text, { style: styles.infoValue }, formattedDate)
      ),
      h(
        View,
        { style: styles.infoRow },
        h(Text, { style: styles.infoLabel }, 'צוות:'),
        h(Text, { style: styles.infoValue }, data.teamName)
      ),
      h(
        View,
        { style: styles.infoRow },
        h(Text, { style: styles.infoLabel }, 'סקיפר ראשי:'),
        h(Text, { style: styles.infoValue }, data.primarySkipperName)
      ),
      data.secondarySkipperName
        ? h(
            View,
            { style: styles.infoRow },
            h(Text, { style: styles.infoLabel }, 'סקיפר שני:'),
            h(Text, { style: styles.infoValue }, data.secondarySkipperName)
          )
        : null,
      // Participants
      h(
        Text,
        { style: styles.sectionTitle },
        `משתתפים (${data.participantNames.length})`
      ),
      h(
        View,
        { style: styles.participantsGrid },
        ...data.participantNames.map((name, i) =>
          h(Text, { key: i, style: styles.participantChip }, name)
        )
      ),
      // Sections
      h(Text, { style: styles.sectionTitle }, 'תיאור הפעילות'),
      h(Text, { style: styles.sectionContent }, data.activityDescription),
      h(Text, { style: styles.sectionTitle }, 'תנאי מזג אוויר'),
      h(Text, { style: styles.sectionContent }, data.weatherConditions),
      h(Text, { style: styles.sectionTitle }, 'התמודדות רגשית'),
      h(Text, { style: styles.sectionContent }, data.emotionalHandling),
      h(Text, { style: styles.sectionTitle }, 'סיכום ונקודות להמשך'),
      h(Text, { style: styles.sectionContent }, data.summaryNextSteps),
      data.generalNotes
        ? h(Text, { style: styles.sectionTitle }, 'הערות כלליות')
        : null,
      data.generalNotes
        ? h(Text, { style: styles.sectionContent }, data.generalNotes)
        : null,
      // Footer
      h(
        Text,
        { style: styles.footer },
        `הופק מפורטל שוברי גלים — ${new Date().toLocaleDateString('he-IL')}`
      )
    )
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `דוח-פעילות-${data.activityNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
