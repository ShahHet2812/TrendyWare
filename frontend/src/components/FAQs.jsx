import React from "react";

const h1Style = {
  fontFamily: "'Lora', serif",
  fontSize: "3rem",
  fontWeight: 400,
  textAlign: "center",
  marginBottom: "1rem",
};

const FaqItem = ({ question, answer }) => (
  <details
    style={{
      width: "100%",
      padding: "1.5rem",
      border: "1px solid #eee",
      borderRadius: "8px",
      marginBottom: "1rem",
      backgroundColor: "white",
    }}
  >
    <summary
      style={{
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "1.1rem",
        color: "#333",
      }}
    >
      {question}
    </summary>
    <p
      style={{
        marginTop: "1rem",
        color: "#555",
        lineHeight: "1.7",
      }}
    >
      {answer}
    </p>
  </details>
);

export default function FAQs() {
  const faqData = [
    {
      q: "What are your shipping options?",
      a: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days) across India. Shipping is free on all orders over ₹5000.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 14 days of delivery for a full refund or exchange. Items must be in their original, unworn condition with all tags attached. Please visit our returns portal to initiate a return.",
    },
    {
      q: "How do I know what size to choose?",
      a: "Each product page has a detailed size guide with measurements. If you're still unsure, feel free to contact our support team with your measurements, and we'll be happy to help you find the perfect fit.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit and debit cards, UPI, net banking, and select digital wallets. We do not offer Cash on Delivery (COD) at this time.",
    },
    {
      q: "Can I track my order?",
      a: "Yes! Once your order has shipped, you will receive an email with a tracking number and a link to track your package.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#F8F8F8",
        fontFamily: "'Inter', sans-serif",
        paddingBottom: "4rem",
      }}
    >
      <header style={{ padding: "4rem 2rem", backgroundColor: "#fff" }}>
        <h1 style={h1Style}>Frequently Asked Questions</h1>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Have a question? We're here to help. If you don't find your answer
          here, feel free to contact us.
        </p>
      </header>
      <main
        style={{ maxWidth: "800px", margin: "4rem auto", padding: "0 2rem" }}
      >
        {faqData.map((faq, index) => (
          <FaqItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </main>
    </div>
  );
}
