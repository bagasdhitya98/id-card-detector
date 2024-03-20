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
    console.log("response raw : ", response);
    if (response.ok) {
      const data = await response.json();
      console.log("data : ", data);
      console.log("why success : ", response.statusText);
      return {
        message: `${data.updates.updatedCells} cells updated.`,
        status: "success",
      };
    } else {
      console.log("why error : ", response.statusText);
      return {
        message: "Something went wrong : " + response.status,
        details: response.statusText,
        status: "failed",
      };
    }
  } catch (error) {
    console.log("error : ", error);
    return {
      message: "An error occurred : " + error,
      status: "error",
    };
  }
};

export default writeToSpreadsheet;
