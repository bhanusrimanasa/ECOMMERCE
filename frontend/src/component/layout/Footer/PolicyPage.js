import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PolicyPage.css";

const policyData = {
  "shipping-policy": {
    title: "Shipping & Delivery Rates",
    content: [
      "We process all store orders within 1-2 business days. Once shipped, you will automatically receive an email containing tracking parameters.",
      "Standard Delivery (3-5 business days): ₹99 flat rate (Free for orders total exceeding ₹999).",
      "Express Delivery (1-2 business days): ₹250 premium rate."
    ]
  },
  "returns": {
    title: "Returns & Replacements",
    content: [
      "We offer a reliable 14-day return and replacement policy for all unused products in original packaging bundles.",
      "Refunds are reversed directly to your original payment card via Stripe within 5-7 banking days."
    ]
  },
  "privacy": {
    title: "Privacy Notice & Security",
    content: [
      "Your privacy and secure connections are fully guaranteed across this domain. We enforce strict SSL layers on all endpoint payloads.",
      "Isolated Transactions: Our system does not capture, store, or view your private credit card numbers. Financial transactions are tokenized instantly using Stripe secure vault microservices."
    ]
  },
  "faq": {
    title: "Frequently Asked Questions",
    content: [
      "Review common quick answers below, or use our live AI Store Assistant terminal to ask any custom question regarding our service pipeline instantly!"
    ]
  }
};

const PolicyPage = ({ page }) => {
  const currentDoc = policyData[page];
  
  // Chatbox States
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! I am your AI Store Assistant. Ask me anything about shipping, returns, or order safety!" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/v1/ai/chat", { question: userMsg.text });
      setChatHistory((prev) => [...prev, { sender: "bot", text: data.answer }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policyPageContainer">
      <div className="policyPageBox">
        <h1>{currentDoc.title}</h1>
        <div className="policyDivider"></div>
        {currentDoc.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        {/* 🤖 Render the AI Chat Container ONLY on the FAQ layout route */}
        {page === "faq" && (
          <div className="aiChatContainer">
            <h3>Ask our AI Store Assistant</h3>
            <div className="chatWindow">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chatMessage ${msg.sender}`}>
                  <span className="msgText">{msg.text}</span>
                </div>
              ))}
              {loading && <div className="chatMessage bot typing">Thinking...</div>}
            </div>
            <form onSubmit={handleChatSubmit} className="chatInputForm">
              <input
                type="text"
                placeholder="Type your question here (e.g., How long does shipping take?)..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyPage;