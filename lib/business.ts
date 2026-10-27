export const businessPhone = "+977 974 785 7130";
export const phoneHref = "tel:+9779747857130";
export const whatsapp = (message = "Hello Hisab Kitab, I’d like a free first consultation about my business.") => `https://wa.me/9779747857130?text=${encodeURIComponent(message)}`;

export const businessEmail = "hisabkitabnepal@outlook.com";
export const emailHref = "mailto:" + businessEmail;

// Enable only after the owner approves the email-form provider.
export const hostedInquiryDeliveryEnabled=false;
