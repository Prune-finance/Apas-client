import { Director, DocumentData, RequestData } from "../hooks/requests";

// Helper function to access nested keys in the object
export const getNestedDocValue = (obj: any, path: string): any => {
  // If the key is top-level, return it directly
  if (path in obj) {
    return obj[path];
  }

  // Handle nested keys
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && key in current) {
      current = current[key];
    } else {
      return undefined; // Return undefined if any key is missing
    }
  }
  return current;
};

export const areAllDocumentsApproved = (data: RequestData): boolean => {
  const getAllDocumentKeys = (data: DocumentData | Director): string[] => {
    const keys: string[] = [];

    // Handle Corporate's mermat and certOfInc keys
    if ("mermat" in data && data.mermat) {
      keys.push("mermat");
    }
    if ("certOfInc" in data && data.certOfInc) {
      keys.push("certOfInc");
    }

    // Handle User and Director idFileURL and poaFileURL keys
    if ("idFileURL" in data && data.idFileURL) {
      keys.push("idFileURL");
    }
    if ("poaFileURL" in data && data.poaFileURL) {
      keys.push("poaFileURL");
    }

    // Handle nested directors for CorporateRequestData using Object.entries
    if ("directors" in data) {
      Object.entries(data.directors).forEach(([directorKey, directorData]) => {
        if (directorData.idFile) keys.push(`directors.${directorKey}.idFile`);

        if (directorData.poaFile) keys.push(`directors.${directorKey}.poaFile`);
      });
    }

    // Handle nested shareholders for CorporateRequestData using Object.entries
    if ("shareholders" in data) {
      Object.entries(data.shareholders).forEach(
        ([shareholderKey, shareholderData]) => {
          if (shareholderData.idFile)
            keys.push(`shareholders.${shareholderKey}.idFile`);

          if (shareholderData.poaFile)
            keys.push(`shareholders.${shareholderKey}.poaFile`);
        }
      );
    }

    return keys;
  };

  // Extract documentData and documentApprovals based on accountType
  const documentData = data.documentData;
  const documentApprovals = data.documentApprovals || {};

  const allDocumentKeys = getAllDocumentKeys(documentData);

  // Check if all document keys are present in documentApprovals and approved
  const allKeysPresent = allDocumentKeys.every(
    (key) => getNestedDocValue(documentApprovals, key) !== undefined
  );
  if (!allKeysPresent) {
    return false; // If any key is missing, not all documents are approved
  }

  // Check if all documents are approved
  const areAllApproved = allDocumentKeys.every(
    (key) => getNestedDocValue(documentApprovals, key) === true
  );

  return areAllApproved;
};

export const areSomeDocumentsNotApproved = (data: RequestData): boolean => {
  const getAllDocumentKeys = (data: DocumentData | Director): string[] => {
    const keys: string[] = [];

    // Handle Corporate's mermat and certOfInc keys
    if ("mermat" in data && data.mermat) {
      keys.push("mermat");
    }
    if ("certOfInc" in data && data.certOfInc) {
      keys.push("certOfInc");
    }

    // Handle User and Director idFileURL and poaFileURL keys
    if ("idFileURL" in data && data.idFileURL) {
      keys.push("idFileURL");
    }
    if ("poaFileURL" in data && data.poaFileURL) {
      keys.push("poaFileURL");
    }

    // Handle nested directors for CorporateRequestData using Object.entries
    if ("directors" in data) {
      Object.entries(data.directors).forEach(([directorKey, directorData]) => {
        if (directorData.idFile) keys.push(`directors.${directorKey}.idFile`);

        if (directorData.poaFile) keys.push(`directors.${directorKey}.poaFile`);
      });
    }

    // Handle nested shareholders for CorporateRequestData using Object.entries
    if ("shareholders" in data) {
      Object.entries(data.shareholders).forEach(
        ([shareholderKey, shareholderData]) => {
          if (shareholderData.idFile)
            keys.push(`shareholders.${shareholderKey}.idFile`);

          if (shareholderData.poaFile)
            keys.push(`shareholders.${shareholderKey}.poaFile`);
        }
      );
    }

    return keys;
  };

  // Extract documentData and documentApprovals based on accountType
  const documentData = data.documentData;
  const documentApprovals = data.documentApprovals || {};

  const allDocumentKeys = getAllDocumentKeys(documentData);

  // Check if all document keys are present in documentApprovals and approved
  const allKeysPresent = allDocumentKeys.every(
    (key) => getNestedDocValue(documentApprovals, key) !== undefined
  );
  if (!allKeysPresent) {
    return false; // If any key is missing, not all documents are approved
  }

  // Check if all documents are approved
  const areAllApproved = allDocumentKeys.some(
    (key) => getNestedDocValue(documentApprovals, key) === true
  );

  return areAllApproved;
};
