import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import writeToSpreadsheet from "./services/writeToSpreadsheet";
import authorize from "./services/authorize";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState({ nik: "", nama: "", ttl: "" });
  const [text, setText] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const cleanText = (rawText) => {
    return rawText.replace(/[^a-zA-Z0-9\s\/]/g, "");
  };

  const detectText = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    Tesseract.recognize(
      image,
      "eng", // Language used for OCR (in this case, English)
      {
        logger: (m) => console.log(m), // Optional logger to see OCR process
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./-@", // Allowed character filter
        psm: 6, // Page Segmentation Mode for recognizing text blocks
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
        setResult({ nik: nik, nama: nama, ttl: ttl });
        setText(`NIK: ${nik}\nName: ${nama}\nPlace/Date of Birth: ${ttl}`);
      })
      .catch((error) => {
        alert("Text detection failed. Please try again.");
        console.error(error);
      });
  };

  const loginGoogle = async () => {
    try {
      const response = await authorize();
      window.location.href = response;
    } catch (error) {
      console.error(error);
    }
  };

  const exportToSheet = () => {
    writeToSpreadsheet(result.nik, result.nama, result.ttl);
  };

  useEffect(() => {
    setShowAuthPopup(true);
  }, []);

  return (
    <div className="container">
      <div className="ktp-section">
        <h1>ID Card Text Detection</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button className="detect-btn" onClick={detectText}>
          Detect Text
        </button>
        <div>
          <h2>Detection Result :</h2>
          {text ? (
            <>
              <pre>{text}</pre>
              <button className="detect-btn" onClick={exportToSheet}>
                Export to Spreadsheet
              </button>
            </>
          ) : (
            "No ID Card detected"
          )}
        </div>
      </div>
      {showAuthPopup && (
        <>
          <div className="overlay" />
          <div className="auth-popup">
            <p>Please login Google Account for access this app</p>
            <button onClick={loginGoogle}>Authorize</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
