// Canais de contato (dados fictícios — portfólio demonstrativo).
// FONTE ÚNICA: trocar EMAIL e WHATSAPP_NUMBER por dados reais antes de produção.
export const EMAIL = "contato@estudiolentz.com.br";

// Número placeholder, claramente fictício. Formato wa.me: só dígitos, com DDI 55.
export const WHATSAPP_NUMBER = "554800000000";
export const WHATSAPP_DISPLAY = "+55 48 0000-0000";

const WHATSAPP_MSG = "Olá, gostaria de conversar sobre um projeto.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Novo projeto — Estúdio Lentz")}`;
