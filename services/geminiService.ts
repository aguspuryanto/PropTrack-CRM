
import { GoogleGenAI } from "@google/genai";
import { Lead, Property, Appointment } from "../types";

// Note: GoogleGenAI client is initialized inside each function to ensure
// the latest configuration is used per coding guidelines.

export const generateFollowUpMessage = async (lead: Lead, property: Property) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan pesan WhatsApp follow-up yang profesional dan ramah dalam Bahasa Indonesia.
      
      Detail Lead:
      Nama: ${lead.name}
      Status Terakhir: ${lead.status}
      Catatan: ${lead.notes}
      
      Detail Properti:
      Nama: ${property.title}
      Lokasi: ${property.location}
      Harga: Rp ${property.price.toLocaleString()}
      
      Tujuannya adalah mengajak lead untuk menjadwalkan kunjungan lokasi atau bertanya lebih lanjut.
      Gunakan bahasa yang persuasif namun tidak memaksa. Sertakan emoji yang relevan.`,
    });
    
    return response.text || `Halo ${lead.name}, saya agen properti Anda. Bagaimana pendapat Anda mengenai ${property.title}? Apakah ada yang bisa saya bantu lebih lanjut?`;
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
      contents: `Buatkan undangan kunjungan properti (show unit/site visit) via WhatsApp dalam Bahasa Indonesia.
      
      Detail:
      Nama Lead: ${lead.name}
      Properti: ${property.title}
      Lokasi: ${property.location}
      Waktu: ${date}, Jam ${time}
      
      Buat pesan yang mengonfirmasi jadwal ini, memberikan instruksi titik temu singkat, dan tanyakan apakah mereka butuh share location. Gunakan nada yang antusias dan profesional.`,
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
      contents: `Buatkan deskripsi pemasaran yang menarik untuk landing page properti berikut:
      
      Judul: ${property.title}
      Lokasi: ${property.location}
      Spesifikasi: ${property.beds}KT, ${property.baths}KM, Luas ${property.sqft}m2
      Deskripsi Dasar: ${property.description}
      
      Buat dalam 3 paragraf: Keunggulan lokasi, Kualitas bangunan, dan Kesempatan investasi.`,
    });
    
    return response.text || property.description;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return property.description;
  }
};
