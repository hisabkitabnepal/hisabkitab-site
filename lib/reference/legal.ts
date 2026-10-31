/** Content for /terms-and-privacy. Inline tokens in paragraphs: [mail], [tel], **bold**, \n = line break. */
export type LegalKey = "terms" | "privacy";
export type LegalSection = { id: string; title: string; body: string[] };
export type LegalView = {
  key: LegalKey;
  title: string;
  label: string;
  intro: string;
  sections: LegalSection[];
};
export const legalUpdated = "27 October 2026";
export const legalEmail = "hisabkitabnepal@outlook.com";
export const legalPhone = { href: "+9779747857130", label: "+977 9747857130" };
export const legalViews: Record<LegalKey, LegalView> = {
  "terms": {
    "key": "terms",
    "title": "Terms and Conditions",
    "label": "Terms and Conditions",
    "intro": "These Terms and Conditions govern your use of hisabkitabnepal.com.np (the Website), operated by Hisab Kitab (we, us or our), based in Samakushi, Kathmandu, Nepal. Please read them before using the Website. If you do not agree with these Terms, please discontinue use.",
    "sections": [
      {
        "id": "terms-1",
        "title": "Scope",
        "body": [
          "These Terms apply to browsing the Website, reading its articles, using its tax calculator and submitting inquiries. Any professional services you engage us to provide are governed by a separate agreement. Submitting an inquiry or using a Website tool does not by itself create a professional engagement or authorise us to act on your behalf."
        ]
      },
      {
        "id": "terms-2",
        "title": "Permitted use",
        "body": [
          "You may use the Website for lawful purposes and access its resources for personal or internal business reference. You must not misuse the Website, attempt unauthorised access, introduce malicious code, interfere with its security or operation, impersonate another person, or submit unlawful or misleading material. You must have authority to provide information about another person or business."
        ]
      },
      {
        "id": "terms-3",
        "title": "General information",
        "body": [
          "Articles, guides and other Website materials are provided for general information. They are not advice tailored to your circumstances. Laws, tax rates and regulatory requirements may change, and materials may not reflect every recent development or exception. Obtain advice appropriate to your circumstances before making decisions or filing returns."
        ]
      },
      {
        "id": "terms-4",
        "title": "Tax calculator",
        "body": [
          "Calculator results are estimates based on the information entered and the assumptions and rules used by the tool. They are not official assessments, tax returns or guarantees of tax payable. Actual liability may depend on the relevant financial year, deductions, exemptions and facts not captured by the tool. Check the result before relying on it. Calculator entries are collected and reviewed as explained in our Privacy Policy."
        ]
      },
      {
        "id": "terms-5",
        "title": "Inquiries",
        "body": [
          "Provide accurate and relevant information when contacting us. Do not submit passwords, one-time passcodes or unnecessary sensitive records through the general contact form. We may contact you to clarify your request. Submission does not guarantee that we can accept an engagement or respond within a particular time. Our handling of personal information is described in the Privacy Policy."
        ]
      },
      {
        "id": "terms-6",
        "title": "Intellectual property",
        "body": [
          "Original Website text, branding, graphics and other materials belong to Hisab Kitab or the relevant rights holders unless stated otherwise. You may view and use educational content for personal or internal business purposes. Commercial republication, redistribution, modification or use of our branding requires permission, except where applicable law permits it. Do not remove ownership notices or present our materials as your own."
        ]
      },
      {
        "id": "terms-7",
        "title": "External links",
        "body": [
          "Links to third-party websites or services are provided for convenience. We do not control their content, availability or privacy practices. Review their terms and policies before using them or providing information."
        ]
      },
      {
        "id": "terms-8",
        "title": "Availability and changes",
        "body": [
          "We may update, correct, restrict or discontinue Website content or features. We aim to provide a useful and accurate Website, but do not guarantee uninterrupted access, error-free operation or that all content will always be complete or current."
        ]
      },
      {
        "id": "terms-9",
        "title": "Limitation of liability",
        "body": [
          "To the extent permitted by applicable law, we are not liable for indirect or consequential loss arising from Website use, interruptions, or reliance on general information or calculator estimates. Nothing in these Terms excludes liability for fraud, wilful misconduct, or any liability that cannot lawfully be excluded, or limits mandatory consumer rights. Responsibility for separately agreed professional services is governed by the relevant agreement and applicable law."
        ]
      },
      {
        "id": "terms-10",
        "title": "Updates to these Terms",
        "body": [
          "We may revise these Terms by publishing an updated version and changing the last updated date. Revisions apply to Website use after publication and do not retrospectively alter a separate client agreement."
        ]
      },
      {
        "id": "terms-11",
        "title": "Governing law and disputes",
        "body": [
          "These Terms are governed by the laws of Nepal. Please contact us about concerns so we can try to resolve them. Unresolved disputes may be brought before the competent courts or authorities in Nepal, subject to any mandatory rights or remedies available to you."
        ]
      },
      {
        "id": "terms-12",
        "title": "Contact",
        "body": [
          "**Hisab Kitab**\nSamakushi, Kathmandu, Nepal\nEmail: [mail]\nPhone: [tel]"
        ]
      }
    ]
  },
  "privacy": {
    "key": "privacy",
    "title": "Privacy Policy",
    "label": "Privacy Policy",
    "intro": "Hisab Kitab (we, us or our) operates hisabkitabnepal.com.np (the Website). This Policy explains how we handle personal information collected through the Website and related inquiry communications. It covers Website visitors and people who contact us through it. Separate client arrangements may address information used in professional engagements.",
    "sections": [
      {
        "id": "privacy-1",
        "title": "Information we collect",
        "body": [
          "We collect the information you provide through our contact form and related communications, including your name, email address, phone number, business details, message and any other information you choose to share. We also collect and review information entered into our tax calculator, such as business type, location category, turnover and taxable profit. Where calculator information is linked to an identifiable person, we treat it as personal information. Please share only relevant information you are authorised to provide."
        ]
      },
      {
        "id": "privacy-2",
        "title": "How information is collected",
        "body": [
          "Information is collected when you enter information into the calculator, submit a contact form, or communicate with us about your inquiry. Website inquiries are delivered to our email. Hosting infrastructure may also process technical request information, such as IP addresses and browser or device details, to deliver and protect the Website."
        ]
      },
      {
        "id": "privacy-3",
        "title": "How we use information",
        "body": [
          "We use relevant information to respond to inquiries, communicate about requested services, understand your requirements, prepare proposals and arrange consultations. We review calculator entries to understand requests, check estimates and improve the tool. We may also use information to maintain Website security, handle complaints and meet applicable legal requirements. Where consent is required, we obtain it for the relevant use. Publishing this Policy does not give us unrestricted permission to use information for unrelated purposes."
        ]
      },
      {
        "id": "privacy-4",
        "title": "Marketing and research",
        "body": [
          "Where you consent to promotional communications, we may send information about our services and resources. You can opt out by replying to a message, using an available unsubscribe option or emailing us. Necessary responses to inquiries may continue. General market research may use anonymised, aggregated information that does not reasonably identify you or disclose confidential business information. We seek separate permission where required for identifiable research or public use of a client name, testimonial or results."
        ]
      },
      {
        "id": "privacy-5",
        "title": "Access and service providers",
        "body": [
          "Access within Hisab Kitab is limited to authorised members who need information for their work. We use Vercel for hosting and Microsoft Outlook for email. Information may also be processed through third-party applications used to organise inquiries, manage communications or support the purposes described in this Policy. Such use is limited to relevant information and lawful purposes; additional consent is obtained where required. We may disclose information in response to lawful requirements or where lawfully necessary to establish, exercise or defend legal claims."
        ]
      },
      {
        "id": "privacy-6",
        "title": "Overseas processing",
        "body": [
          "Hosting, email and other technology providers may store or process information outside Nepal. The location depends on the provider and service configuration. Information handled through those providers is also subject to their applicable terms and privacy arrangements. We do not represent that all Website information is stored in Nepal."
        ]
      },
      {
        "id": "privacy-7",
        "title": "Retention",
        "body": [
          "We retain information for as long as reasonably necessary to respond to your inquiry, carry out the purposes described in this Policy, and meet applicable legal or recordkeeping requirements. Relevant factors include whether an inquiry remains active, whether you become a client, the nature and sensitivity of the information, and any unresolved complaint or dispute. When information is no longer needed, it should be deleted or anonymised. You may contact us to request deletion, subject to applicable legal requirements."
        ]
      },
      {
        "id": "privacy-8",
        "title": "Security",
        "body": [
          "Internal access to inquiry information is restricted to authorised Hisab Kitab members. No method of online transmission or storage is completely secure, and we cannot guarantee absolute security. Do not send passwords, one-time passcodes or unnecessary identity or banking documents through the general contact form. Contact us promptly if you suspect unauthorised use of information you provided."
        ]
      },
      {
        "id": "privacy-9",
        "title": "Cookies and similar technologies",
        "body": [
          "Cookies and similar technologies can store information on your device or support Website functions. Your browser settings allow you to review, block or delete cookies; restricting them may affect Website features. Where we introduce analytics, advertising or other tracking that requires additional notice or consent, we will provide the relevant information and obtain consent before such tracking where required. This section does not authorise undisclosed tracking or use of information for unrelated advertising."
        ]
      },
      {
        "id": "privacy-10",
        "title": "Your choices and requests",
        "body": [
          "You may contact us to ask about information we hold about you, request access or correction, ask for deletion, withdraw consent or raise a privacy concern. We handle requests in accordance with applicable law and may need to verify identity before disclosure or changes. Some information may need to be retained for legal obligations or unresolved claims. We will explain relevant limitations. Withdrawal of consent may affect our ability to fulfil a request that depends on the information."
        ]
      },
      {
        "id": "privacy-11",
        "title": "Children and external websites",
        "body": [
          "The Website is intended primarily for business owners and people planning a business and is not directed at children. Contact us if you believe a child has provided information that should be removed. External websites and services have their own privacy policies; review them before sharing information."
        ]
      },
      {
        "id": "privacy-12",
        "title": "Changes and contact",
        "body": [
          "We may update this Policy as our practices or applicable requirements change. Revisions appear on the Website with an updated date. We seek additional consent before a new use where required.",
          "Contact Hisab Kitab at [mail] or [tel].",
          "Samakushi, Kathmandu, Nepal."
        ]
      }
    ]
  }
};
export function legalKeyFromHash(hash: string): LegalKey {
  return hash === "#privacy" ? "privacy" : "terms";
}