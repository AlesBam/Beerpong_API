export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Extract league information from the request body
      const { results, league } = req.body;
      
      // Determine which sheet to use based on league parameter
      let sheetName = 'Sheet1'; // Default sheet
      
      if (league === 'PL') {
        sheetName = 'PL';
      } else if (league === '2.League') {
        sheetName = '2.League';
      }
      // If league is undefined or any other value, use 'Sheet1' (default)
      
      // Add sheet information to the payload sent to Google Apps Script
      const payloadForGoogleScript = {
        results: results,
        sheetName: sheetName
      };
      
      console.log(`Sending data to Google Sheets - Sheet: ${sheetName}`);
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbyYfrF7NrOUrsUgeJEWnCAWTvo64D06S5a8WJad-RplPmqlJKmtgGMsmd-9b69A14V1/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadForGoogleScript)
      });
      
      const data = await response.text();
      res.status(200).json({ success: true, data, sheetName });
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({ success: false, error: error.toString() });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 