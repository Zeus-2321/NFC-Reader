import React, { useState, useEffect } from 'react';
import './Scanner.css';

const Scanner = () => {
  const [nfcData, setNfcData] = useState(null);
  const [supportsNFC, setSupportsNFC] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkNFCSupport = async () => {
      if ('NDEFReader' in window) {
        setSupportsNFC(true);
      } else {
        setError('NFC is not supported on this device.');
      }
    };

    checkNFCSupport();
  }, []);

  const handleScan = async () => {
    try {
      const reader = new window.NDEFReader();
      await reader.scan();

      reader.addEventListener('reading', async (e) => {
        const message = e.message;
        console.log(message);

        const records = [];
        for (const record of message.records) {
          records.push({
            recordType: record.recordType,
            data: record.data ? new TextDecoder().decode(record.data) : null,
          });
        }

        setNfcData(records);
      });
    } catch (error) {
      setError('Error scanning NFC. Please try again.');
      console.error('Error scanning NFC:', error);
    }
  };

  const convertToASCII = (data) => {
    return data.map((record) => ({
      ...record,
      data: record.data ? [...record.data].map((charCode) => String.fromCharCode(charCode)).join('') : null,
    }));
  };

  return (
    <div className="scanner-container">
      <h2>NFC Scanner</h2>
      {supportsNFC ? (
        <>
          <button onClick={handleScan}>Scan</button>
          {error && <p className="error">{error}</p>}
          {nfcData && (
            <div>
              <h3>Scanned NFC Data:</h3>
              <ul>
                {convertToASCII(nfcData).map((record, index) => (
                  <li key={index}>
                    <strong>Record Type:</strong> {record.recordType}
                    <br />
                    <strong>Data:</strong> {record.data}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>NFC is not supported on this device.</p>
      )}
    </div>
  );
};

export default Scanner;