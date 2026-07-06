import { motion } from "framer-motion";

// Editorial section shell: numbered rule + uppercase display title.
export default function Section({ id, num, label, title, children }) {
  return (
    <section id={id}>
      <div className="container">
        <motion.div
          className="sec-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sec-meta">
            <span>({num})</span>
            <span>{label}</span>
          </div>
          <h2 className="sec-title">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
