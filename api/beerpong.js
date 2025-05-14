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
      const response = await fetch('https://script.google.com/macros/s/AKfycbyOjdECOOtLNhkWls_1OYQJooNHNtQpt1IKzUKsU4wqZWeIt4qer67EaatnaD2I8ZzT/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      const data = await response.text();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.toString() });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}