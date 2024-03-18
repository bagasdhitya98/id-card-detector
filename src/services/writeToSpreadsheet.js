const writeToSpreadsheet = async (
  nik,
  nama,
  ttl,
  accessToken,
  spreadsheetId
) => {
  try {
    console.log("token : ", accessToken);
    console.log("id : ", spreadsheetId);

    const token = accessToken;
    const id = spreadsheetId;
    const range = "Sheet1!A1:C1";

    const values = [[nik, nama, ttl]];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range,
          majorDimension: "ROWS",
          values,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        message: `${data.updates.updatedCells} cells updated.`,
        status: "success",
      };
    } else {
      return {
        message: "Something went wrong : " + response.status,
        details: response.statusText,
        status: "failed",
      };
    }
  } catch (error) {
    return {
      message: "An error occurred : " + error,
      status: "error",
    };
  }
};

export default writeToSpreadsheet;
