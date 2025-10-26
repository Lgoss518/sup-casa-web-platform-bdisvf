
export type DocumentType = 'course' | 'practical' | 'exam';
export type AcademicLevel = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9';

export interface Document {
  id: string;
  title: string;
  subject: string;
  level: AcademicLevel;
  type: DocumentType;
  fileUri: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  description?: string;
}

export interface DocumentFilter {
  level?: AcademicLevel;
  subject?: string;
  type?: DocumentType;
  searchQuery?: string;
}
