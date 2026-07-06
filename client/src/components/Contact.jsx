import { useState } from "react";
import { motion } from "framer-motion";
import Magnetic from "./Magnetic.jsx";

export default function Contact({ email }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <>
      <style>{`
        #contact { padding-bottom: 60px; }
        .ct-wrap { border-top: 1px solid var(--line-strong); padding-top: 40px; }
        .ct-huge {
          font-variation-settings: "wdth" 66;
          font-size: clamp(3rem, 10vw, 8rem); font-weight: 720;
          text-transform: uppercase; letter-spacing: -0.03em; line-height: 0.92;
          margin-bottom: 50px;
        }
        .ct-huge .serif { text-transform: none; }
        .ct-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: start; }
        @media (max-width: 820px) { .ct-grid { grid-template-columns: 1fr; gap: 34px; } }
        .ct-left p { color: var(--paper-dim); max-width: 380px; margin-bottom: 26px; }
        .ct-mail {
          font-family: var(--font-mono); font-size: 0.9rem; color: var(--acid);
          border-bottom: 1px solid rgba(216, 246, 81, 0.35); padding-bottom: 2px;
        }
        .ct-form { display: flex; flex-direction: column; }
        .ct-field { position: relative; border-top: 1px solid var(--line); }
        .ct-field:last-of-type { border-bottom: 1px solid var(--line); }
        .ct-field label {
          position: absolute; left: 0; top: 18px;
          font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--paper-dim); pointer-events: none;
        }
        .ct-field input, .ct-field textarea {
          width: 100%; background: transparent; border: none; outline: none;
          color: var(--paper); font-family: var(--font-display); font-size: 1.05rem;
          padding: 44px 0 18px; resize: vertical;
        }
        .ct-field input:focus ~ .ct-underline, .ct-field textarea:focus ~ .ct-underline { transform: scaleX(1); }
        .ct-underline {
          position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
          background: var(--acid); transform: scaleX(0); transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ct-submit { margin-top: 30px; align-self: flex-start; }
        .ct-status { font-family: var(--font-mono); font-size: 0.78rem; margin-top: 16px; min-height: 1.2em; letter-spacing: 0.06em; }
        .ct-status.sent { color: var(--acid); }
        .ct-status.error { color: #ff6b57; }
      `}</style>
      <section id="contact">
        <div className="container ct-wrap">
          <motion.h2
            className="ct-huge"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            Let's build<br />
            <span className="serif acid">something real.</span>
          </motion.h2>
          <div className="ct-grid">
            <motion.div
              className="ct-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p>
                Opportunities, collaborations, or a conversation about backend systems and AI
                agents — the form writes straight to MongoDB through the Express API.
              </p>
              <a className="ct-mail" href={`mailto:${email}`}>{email}</a>
            </motion.div>
            <motion.form
              className="ct-form"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ct-field">
                <label htmlFor="cf-name">01 — Name</label>
                <input id="cf-name" name="name" value={form.name} onChange={onChange} required />
                <span className="ct-underline" />
              </div>
              <div className="ct-field">
                <label htmlFor="cf-email">02 — Email</label>
                <input id="cf-email" name="email" type="email" value={form.email} onChange={onChange} required />
                <span className="ct-underline" />
              </div>
              <div className="ct-field">
                <label htmlFor="cf-message">03 — Message</label>
                <textarea id="cf-message" name="message" rows="4" value={form.message} onChange={onChange} required />
                <span className="ct-underline" />
              </div>
              <Magnetic strength={0.15}>
                <button className="btn btn-solid ct-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : status === "sent" ? "Delivered ✓" : "Send message →"}
                </button>
              </Magnetic>
              <p className={`ct-status ${status}`}>
                {status === "sent" && "// stored in the database — talk soon"}
                {status === "error" && "// something broke — try emailing instead"}
              </p>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}
