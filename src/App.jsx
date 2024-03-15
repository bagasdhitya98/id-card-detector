import React, { useState } from "react";
import Tesseract from "tesseract.js";
// import { google } from "googleapis";

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const cleanText = (rawText) => {
    return rawText.replace(/[^a-zA-Z0-9\s\/]/g, "");
  };

  // const authorize = async () => {
  //   const client = new google.auth.OAuth2(
  //     "YOUR_CLIENT_ID",
  //     "YOUR_CLIENT_SECRET",
  //     "YOUR_REDIRECT_URL"
  //   );

  //   const authUrl = client.generateAuthUrl({
  //     access_type: "offline",
  //     scope: ["https://www.googleapis.com/auth/spreadsheets"],
  //   });

  //   // Redirect ke authUrl dan dapatkan authorization code
  //   // Lalu gunakan authorization code untuk mendapatkan token
  //   // Contoh: const token = await client.getToken(authorizationCode);
  //   // Setelah itu, gunakan token untuk membuat client yang siap digunakan
  //   // Contoh: client.setCredentials(token.tokens);
  // };

  // const writeToSpreadsheet = async (nik, nama, ttl) => {
  //   const client = new google.auth.OAuth2(
  //     "YOUR_CLIENT_ID",
  //     "YOUR_CLIENT_SECRET",
  //     "YOUR_REDIRECT_URL"
  //   );
  //   const sheets = google.sheets({ version: "v4", auth: client });
  //   const spreadsheetId = "YOUR_SPREADSHEET_ID";
  //   const range =
  //     "AEON Alam Sutera In Klinik Galaxy Tangerang!NIK:NAMA:TANGGAL LAHIR";

  //   const values = [[nik, nama, ttl]];

  //   const resource = {
  //     values,
  //   };

  //   try {
  //     const response = await sheets.spreadsheets.values.append({
  //       spreadsheetId,
  //       range,
  //       valueInputOption: "RAW",
  //       resource,
  //     });

  //     console.log(`${response.data.updates.updatedCells} cells updated.`);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const detectText = () => {
    if (!image) {
      alert("Pilih gambar terlebih dahulu.");
      return;
    }

    Tesseract.recognize(
      image,
      "ind", // Bahasa yang digunakan untuk OCR (dalam hal ini, bahasa Indonesia)
      {
        logger: (m) => console.log(m), // Logger opsional untuk melihat proses OCR
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./-@", // Filter karakter yang diizinkan
        psm: 6, // Page Segmentation Mode untuk mengenali blok teks
      }
    )
      .then(({ data: { text } }) => {
        const cleanedText = cleanText(text);

        const lines = cleanedText.split("\n");

        let nik = "";
        let nama = "";
        let ttl = "";

        lines.forEach((line) => {
          if (line.startsWith("NIK")) {
            nik = line.substring(4).trim();
          } else if (line.startsWith("Nama")) {
            nama = line.substring(5).trim();
          } else if (line.startsWith("Tempat")) {
            ttl = line.substring(16).trim();
          }
        });

        setText(`NIK: ${nik}\nNama: ${nama}\nTempat/Tgl Lahir: ${ttl}`);
        // writeToSpreadsheet(nik, nama, ttl);
      })
      .catch((error) => {
        alert("Deteksi teks gagal. Silakan coba lagi.");
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Deteksi Bagian KTP</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={detectText}>Deteksi Teks</button>
      <div>
        <h2>Hasil Deteksi</h2>
        <pre>{text}</pre>
      </div>
    </div>
  );
};

export default App;
