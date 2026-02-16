export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString('utf-8');

    const response = await fetch('http://80.153.160.204:8080/dvse/Erp.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8; action="DVSE.WebApp.ErpService/GetArticleInformation"',
      },
      body: body,
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
