import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
});

const DBS_STATUS_DETAILS = {
  BLANK_NO_NEW_INFO: {
    statusCheckingResponse:
      "This DBS certificate did not reveal any information and remains current as no further information has been identified since its issue.",
    meaning:
      "The individual's DBS certificate contains no criminal record information and no new information has come to light since its issue.",
  },

  NON_BLANK_NO_NEW_INFO: {
    statusCheckingResponse:
      "This DBS certificate remains current as no further information has been identified since its issue.",
    meaning:
      "The individual's DBS certificate contains criminal record information, but no new information has come to light since its issue.",
  },

  NEW_INFO: {
    statusCheckingResponse:
      "This DBS Certificate is no longer current. Please apply for a new DBS check to get the most up-to-date information.",
    meaning:
      "The individual's DBS certificate should not be relied upon as new information is now available. You should request a new DBS certificate.",
  },
};

export const formatDbsResponse = (xml) => {
  const parsed = parser.parse(xml);
  const result = parsed.statusCheckResult;

  if (!result) {
    throw new Error("Invalid DBS response format");
  }

  const status = result.status;
  const statusDetails = DBS_STATUS_DETAILS[status];

  return {
    statusCheckResultType: result.statusCheckResultType,
    status,
    forename: result.forename,
    surname: result.surname,
    printDate: result.printDate,
    statusCheckingResponse: statusDetails?.statusCheckingResponse ?? null,
    meaning: statusDetails?.meaning ?? null,
  };
};
