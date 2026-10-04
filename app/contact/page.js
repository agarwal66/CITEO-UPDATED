import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Start a project | Citeo" };

export default function Contact() {
  return (
    <section className="wrap section narrow">
      <h1>Let's talk about your project.</h1>
      <p className="lead">Share a few details and we'll reply within one business day with next steps.</p>
      <div className="card-form"><ContactForm source="contact" /></div>
    </section>
  );
}
