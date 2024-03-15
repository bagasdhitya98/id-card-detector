// App.js
import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import authorize from "./services/authorize";
import writeToSpreadsheet from "./services/writeToSpreadsheet";

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
        writeToSpreadsheet(nik, nama, ttl);
      })
      .catch((error) => {
        alert("Deteksi teks gagal. Silakan coba lagi.");
        console.error(error);
      });
  };

  useEffect(() => {
    authorize();
  }, []);

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
