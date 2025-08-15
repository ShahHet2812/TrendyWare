import React from "react";

const sectionStyle = {
  marginBottom: "2.5rem",
  lineHeight: "1.7",
  color: "#555",
};

const h1Style = {
  fontFamily: "'Lora', serif",
  fontSize: "3rem",
  fontWeight: 400,
  textAlign: "center",
  marginBottom: "1rem",
};

const h2Style = {
  fontFamily: "'Lora', serif",
  fontSize: "1.75rem",
  marginBottom: "1rem",
  color: "#333",
};

export default function TermsOfService() {
  return (
    <div style={{ backgroundColor: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ padding: "4rem 2rem", backgroundColor: "#F8F8F8" }}>
        <h1 style={h1Style}>Terms of Service</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Last Updated: August 16, 2025
        </p>
      </header>
      <main
        style={{ maxWidth: "800px", margin: "4rem auto", padding: "0 2rem" }}
      >
        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TrendyWare (the "Service"), you accept and
            agree to be bound by the terms and provision of this agreement. If
            you do not agree to abide by these terms, please do not use this
            Service.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>2. User Accounts</h2>
          <p>
            To access certain features of the website, you may be required to
            create an account. You are responsible for maintaining the
            confidentiality of your password and are fully responsible for all
            activities that occur under your account. You agree to immediately
            notify us of any unauthorized use of your account.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Prohibited Activities</h2>
          <p>
            You are prohibited from using the site or its content for any
            unlawful purpose, to solicit others to perform or participate in any
            unlawful acts, to violate any international, federal, provincial or
            state regulations, rules, laws, or local ordinances, or to infringe
            upon or violate our intellectual property rights or the intellectual
            property rights of others.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of TrendyWare and its
            licensors. Our trademarks and trade dress may not be used in
            connection with any product or service without the prior written
            consent of TrendyWare.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of India, without regard to its conflict of law provisions. Our
            failure to enforce any right or provision of these Terms will not be
            considered a waiver of those rights.
          </p>
        </section>
      </main>
    </div>
  );
}
