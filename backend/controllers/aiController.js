const { GoogleGenAI } = require("@google/genai");

exports.askStoreAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Please enter a question." });
    }

    // Initialize the client using the key from your environment file
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Enforce a strict persona so it answers as an e-commerce assistant
    const prompt = `
      You are "MockMarket Bot", an AI customer support assistant for the MockMarket e-commerce website. 
      Be polite, clear, and professional. 

      Store Guidelines to use for answers:
      - Shipping: Processes in 1-2 days. Standard shipping takes 3-5 days (₹99, free over ₹999). Express takes 1-2 days (₹250).
      - Returns: 14-day hassle-free return policy. Refunds process in 5-7 days via Stripe.
      - Security: Payments are 100% secure and tokenized entirely via Stripe. We do not store card details.

      Customer Question: ${question}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using the fast, cost-efficient model
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};