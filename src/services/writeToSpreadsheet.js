const writeToSpreadsheet = async (nik, nama, ttl) => {
  const accessToken = "YOUR_ACCESS_TOKEN"; // Token OAuth yang diperoleh setelah otorisasi

  const spreadsheetId = "YOUR_SPREADSHEET_ID";
  const range = "Sheet1!A1:C1";

  const values = [[nik, nama, ttl]];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    console.log(`${data.updates.updatedCells} cells updated.`);
  } else {
    console.error("Failed to update cells:", response.statusText);
  }
};

export default writeToSpreadsheet;
