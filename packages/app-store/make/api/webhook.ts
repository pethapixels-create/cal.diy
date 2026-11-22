import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { webhookUrl, bookingData } = req.body;
  if (!webhookUrl) return res.status(400).json({ message: "Missing webhookUrl" });
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      return res
        .status(502)
        .json({ success: false, message: `Webhook delivery failed with status ${response.status}` });
    }
  } catch (error) {
    return res.status(502).json({ success: false, message: "Webhook delivery failed" });
  }
  return res.status(200).json({ success: true });
}
