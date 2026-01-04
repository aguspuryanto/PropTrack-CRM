
import { GoogleGenAI } from "@google/genai";
import { Lead, Property, Appointment } from "../types";

// Note: GoogleGenAI client is initialized inside each function to ensure
// the latest configuration is used per coding guidelines.

export const generateFollowUpMessage = async (lead: Lead, property: Property) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bertindaklah sebagai agen properti elit dan ramah. Buatkan pesan WhatsApp follow-up dalam Bahasa Indonesia.
      
      Konteks Lead:
      Nama: ${lead.name}
      Minat: ${property.title} di ${property.location}
      Status: ${lead.status}
      Catatan: ${lead.notes}
      
      Instruksi Pesan:
      1. Sapa dengan nama secara personal.
      2. Berikan "pancingan" emosional tentang unit tersebut (misal: "Unit ini sangat diminati karena lokasinya yang strategis").
      3. Ajak untuk menjadwalkan kunjungan (site visit) minggu ini.
      4. Gunakan gaya bahasa yang sopan, profesional, namun "warm".
      5. Akhiri dengan pertanyaan terbuka agar mereka merespons.
      6. Tambahkan emoji yang relevan secara proporsional.`,
    });
    
    return response.text || `Halo ${lead.name}, saya Rizky dari PropTrack. Bagaimana kabar Anda? Saya ingin menginfokan bahwa unit ${property.title} sedang banyak diminati minggu ini. Kapan ada waktu untuk kita lihat unitnya bersama?`;
  } catch (error) {
    console.error("Error generating message:", error);
    return `Halo ${lead.name}, saya agen properti Anda. Bagaimana pendapat Anda mengenai ${property.title}? Apakah ada yang bisa saya bantu lebih lanjut?`;
  }
};

export const generateAppointmentInvitation = async (lead: Lead, property: Property, appointment: Appointment) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const date = new Date(appointment.dateTime).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = new Date(appointment.dateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan konfirmasi jadwal kunjungan properti (Site Visit) via WhatsApp yang formal dan antusias.
      
      Detail:
      Calon Pembeli: ${lead.name}
      Unit Properti: ${property.title}
      Lokasi: ${property.location}
      Waktu: ${date}, Jam ${time}
      
      Pesan harus mencakup:
      - Kalimat pembuka yang menyenangkan.
      - Konfirmasi ulang waktu dan lokasi.
      - Info singkat titik temu (misalnya di Marketing Gallery).
      - Tanyakan apakah mereka memerlukan petunjuk arah (Google Maps).
      - Emoji rumah, kalender, dan senyum.`,
    });
    
    return response.text || `Halo ${lead.name}, mengonfirmasi jadwal kunjungan unit ${property.title} pada ${appointment.dateTime}. Sampai jumpa di lokasi!`;
  } catch (error) {
    console.error("Error generating invitation:", error);
    return `Halo ${lead.name}, mengonfirmasi jadwal kunjungan unit ${property.title} pada ${appointment.dateTime}. Sampai jumpa di lokasi!`;
  }
};

export const generatePropertyAdCopy = async (property: Property) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan naskah pemasaran properti mewah dan persuasif untuk landing page.
      
      Properti: ${property.title}
      Lokasi: ${property.location}
      Spesifikasi Utama: ${property.beds}KT, ${property.baths}KM, ${property.sqft}m2
      
      Struktur Output (3 paragraf):
      Paragraf 1: Gaya Hidup & Prestise (Gambarkan betapa bangganya tinggal di sini).
      Paragraf 2: Detail Arsitektur & Kenyamanan (Fokus pada spesifikasi dan kualitas).
      Paragraf 3: Urgensi & Investasi (Gambarkan bahwa ini adalah peluang langka).
      
      Gunakan Bahasa Indonesia yang elegan, menggugah emosi, dan "high-converting".`,
    });
    
    return response.text || property.description;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return property.description;
  }
};
