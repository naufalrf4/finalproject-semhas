export type TourStep = {
  selector: string
  title: string
  body: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="berkas"]',
    title: "Berkas",
    body: "Di sini ada paparan, makalah, dan laporan proyek akhir saya. Laporan baru dibuka setelah seminar hasil.",
  },
  {
    selector: '[data-tour="tanya"]',
    title: "Tanya-Jawab",
    body: "Daftar antisipasi pertanyaan forum, plus chatbot ringan untuk menelusuri jawaban.",
  },
  {
    selector: '[data-tour="interaktif"]',
    title: "Interaktif",
    body: "Ada game beri makan diskus dengan papan skor, dan ruang dukungan untuk meninggalkan pesan.",
  },
  {
    selector: '[data-tour="zoom"]',
    title: "Zoom Semhas",
    body: "Tombol ini menyala saat seminar hasil berlangsung daring.",
  },
]

export const ONBOARDED_KEY = "semhas:onboarded"
