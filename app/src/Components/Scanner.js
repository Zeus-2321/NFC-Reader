import React, {usestate} from 'react';

const Scanner = () => {

    const [nfcData, setNfcData] = usestate(null);

    const handleScan = async () => {
        try {
            const reader = new NDEFReader();

            await reader.scan();

            reader.addEventListener('reading', async(e) => {
                const message = e.message;
                console.log(message);

                const records = [];
                for(const record of message.records) {
                    records.push({
                        recordType: record.recordType,
                        data: record.data ? new TextDecoder().decode(record.data) : null,
                    })
                }

                setNfcData(records);
            })
        }   catch (error) {
        console.error('Error scanning NFC:', error);
      }
    }

    return (
        <>
        <h2>NFC Scanner</h2>
        <button onClick={handleScan}>Scan</button>
        {nfcData && (
        <div>
          <h3>Scanned NFC Data:</h3>
          <ul>
            {nfcData.map((record, index) => (
              <li key={index}>
                <strong>Record Type:</strong> {record.recordType}<br />
                <strong>Data:</strong> {record.data}
              </li>
            ))}
          </ul>
        </div>
      )}
        </>
    )
}

export default Scanner;