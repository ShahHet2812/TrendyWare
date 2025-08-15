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

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ padding: "4rem 2rem", backgroundColor: "#F8F8F8" }}>
        <h1 style={h1Style}>Privacy Policy</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Last Updated: August 16, 2025
        </p>
      </header>
      <main
        style={{ maxWidth: "800px", margin: "4rem auto", padding: "0 2rem" }}
      >
        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, place an order, or contact customer service. This
            may include your name, email address, shipping address, and payment
            information. We also collect indirect information such as your IP
            address and browsing behavior through cookies.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to process your orders,
            communicate with you, personalize your shopping experience, and
            improve our services. We may also use your information for marketing
            purposes, from which you can opt-out at any time.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your
            information with third-party service providers who perform services
            on our behalf, such as payment processing, shipping, and data
            analysis. These providers are obligated to protect your information
            and are not authorized to use it for any other purpose.
          </p>
        </section>
        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information. Your personal information is contained
            behind secured networks and is only accessible by a limited number
            of persons who have special access rights to such systems, and are
            required to keep the information confidential.
          </p>
        </section>
      </main>
    </div>
  );
}
