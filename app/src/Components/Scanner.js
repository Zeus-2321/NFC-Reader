import React, { useState, useEffect } from 'react';

const Scanner = () => {
  const [nfcData, setNfcData] = useState(null);
  const [supportsNFC, setSupportsNFC] = useState(false);

  useEffect(() => {
    const checkNFCSupport = async () => {
      if ('NDEFReader' in window) {
        setSupportsNFC(true);
      } else {
        console.log('NFC is not supported on this device.');
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
    <>
      <h2>NFC Scanner</h2>
      {supportsNFC ? (
        <>
          <button onClick={handleScan}>Scan</button>
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
    </>
  );
};

export default Scanner;