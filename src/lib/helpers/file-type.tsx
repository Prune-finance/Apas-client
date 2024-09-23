import {
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MIME_TYPES,
} from "@mantine/dropzone";
import {
  IconFileDescription,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileTypePpt,
  IconFileTypeXls,
  IconPhoto,
} from "@tabler/icons-react";

export const getFileType = (mimeType: string): string => {
  const imageMimeTypes: string[] = IMAGE_MIME_TYPE;
  const pdfMimeTypes: string[] = PDF_MIME_TYPE;
  const wordMimeTypes: string[] = MS_WORD_MIME_TYPE;
  const excelMimeTypes: string[] = MS_EXCEL_MIME_TYPE;
  const powerpointMimeTypes: string[] = MS_POWERPOINT_MIME_TYPE;

  switch (true) {
    case imageMimeTypes.includes(mimeType):
      return "Image attached";
    case pdfMimeTypes.includes(mimeType):
      return "PDF attached";
    case wordMimeTypes.includes(mimeType):
      return "Word Document attached";
    case excelMimeTypes.includes(mimeType):
      return "Excel Spreadsheet attached";
    case powerpointMimeTypes.includes(mimeType):
      return "PowerPoint Presentation attached";
    case MIME_TYPES.csv.includes(mimeType):
      return "CSV attached";
    default:
      return "Unknown file type";
  }
};

export const getFileIcon = (mimeType: string): JSX.Element => {
  const imageMimeTypes: string[] = IMAGE_MIME_TYPE;
  const pdfMimeTypes: string[] = PDF_MIME_TYPE;
  const wordMimeTypes: string[] = MS_WORD_MIME_TYPE;
  const excelMimeTypes: string[] = MS_EXCEL_MIME_TYPE;
  const powerpointMimeTypes: string[] = MS_POWERPOINT_MIME_TYPE;

  switch (true) {
    case imageMimeTypes.includes(mimeType):
      return <IconPhoto />;
    case pdfMimeTypes.includes(mimeType):
      return <IconFileTypePdf />;
    case wordMimeTypes.includes(mimeType):
      return <IconFileTypeDoc />;
    case excelMimeTypes.includes(mimeType):
      return <IconFileTypeXls />;
    case MIME_TYPES.csv.includes(mimeType):
      return <IconFileTypeCsv />;
    default:
      return <IconFileDescription />;
  }
};
