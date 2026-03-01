import * as XLSX from 'xlsx';

interface ExportReport {
  activityNumber: number;
  date: string | Date;
  team: { name: string };
  primarySkipper: { fullName: string };
  secondarySkipper: { fullName: string } | null;
  _count: { participants: number };
  activityDescription: string;
  weatherConditions: string;
  emotionalHandling: string;
  summaryNextSteps: string;
  generalNotes: string | null;
}

export function reportsToExcelBuffer(reports: ExportReport[]): Buffer {
  const rows = reports.map((r) => ({
    'מס׳ פעילות': r.activityNumber,
    'תאריך': new Date(r.date).toLocaleDateString('he-IL'),
    'צוות': r.team.name,
    'סקיפר ראשי': r.primarySkipper.fullName,
    'סקיפר שני': r.secondarySkipper?.fullName || '',
    'מס׳ משתתפים': r._count.participants,
    'תיאור הפעילות': r.activityDescription,
    'תנאי מזג אוויר': r.weatherConditions,
    'התמודדות רגשית': r.emotionalHandling,
    'סיכום ונקודות להמשך': r.summaryNextSteps,
    'הערות כלליות': r.generalNotes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 10 }, // activity number
    { wch: 12 }, // date
    { wch: 15 }, // team
    { wch: 18 }, // primary skipper
    { wch: 18 }, // secondary skipper
    { wch: 12 }, // participants count
    { wch: 40 }, // activity description
    { wch: 25 }, // weather
    { wch: 30 }, // emotional
    { wch: 30 }, // summary
    { wch: 25 }, // notes
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'דוחות פעילות');

  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}
