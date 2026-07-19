import type { QaItem } from "#/lib/types"

export const QA_DATA: QaItem[] = [
  {
    id: "qa-sensor-1",
    category: "sensor",
    question: "Mengapa saya memakai pH, suhu, DO, dan TDS?",
    answer: [
      "Empat parameter ini relevan untuk melihat kondisi dasar akuarium dan bisa dibaca terus-menerus dengan sensor yang tersedia.",
      "pH menunjukkan keasaman, suhu memengaruhi metabolisme, DO berkaitan dengan respirasi, dan TDS menunjukkan padatan terlarut.",
      "Sistem saya belum mengukur amonia dan nitrit, jadi hasilnya belum menjadi diagnosis lengkap penyebab masalah ikan.",
    ],
    suggests: ["qa-keterbatasan-1", "qa-sensor-4"],
  },
  {
    id: "qa-keterbatasan-1",
    category: "keterbatasan",
    question: "Mengapa amonia dan nitrit belum diukur, padahal penting?",
    answer: [
      "Sensor dan integrasi untuk dua parameter itu akan menambah biaya serta kompleksitas alat.",
      "Saya tetap mengakui amonia dan nitrit penting untuk akuarium tertutup.",
      "Karena belum diukur, RI saya tidak boleh dianggap sebagai diagnosis lengkap penyebab kematian ikan.",
    ],
    suggests: ["qa-sensor-1", "qa-keterbatasan-2"],
  },
  {
    id: "qa-metodologi-1",
    category: "metodologi",
    question: "Kenapa kondisi air diringkas menjadi kategori Baik, Waspada, dan Berisiko?",
    answer: [
      "Saya memakai skor parameter terburuk dibandingkan ambang Water Quality Index, bukan rata-rata linear sederhana.",
      "Cara ini membuat satu parameter yang sudah buruk tidak tertutup oleh parameter lain yang masih normal.",
      "Hasil akhirnya lebih gampang dibaca sebagai screening harian, sementara angka sensor tetap bisa dilihat di dashboard.",
    ],
    suggests: ["qa-metodologi-4", "qa-validitas-1"],
  },
  {
    id: "qa-metodologi-2",
    category: "metodologi",
    question: "Dari mana bobot DO, pH, TDS, dan suhu berasal?",
    answer: [
      "Bobotnya berasal dari AHP berdasarkan survei dua pakar pembudidaya ikan diskus.",
      "Keduanya punya pengalaman 19 tahun dan 8 tahun, lalu menghasilkan bobot DO 0,39, pH 0,35, TDS 0,14, dan suhu 0,12.",
      "Consistency Ratio atau CR adalah 0,091, jadi penilaian pakarnya konsisten karena masih di bawah 0,1.",
    ],
    suggests: ["qa-validitas-2", "qa-metodologi-5"],
  },
  {
    id: "qa-validitas-1",
    category: "validitas",
    question: "Kalau RI diuji terhadap kematian ikan, hasilnya bagaimana?",
    answer: [
      "Hasilnya justru kuat, bukan tidak signifikan. Semua 6 tanggal kematian, dengan total 8 ekor ikan, masuk kategori Waspada atau Berisiko.",
      "Empat tanggal masuk Berisiko dan dua tanggal masuk Waspada, tidak ada yang masuk Baik.",
      "Uji Mann-Whitney menghasilkan U=535 dan p<0,001, dengan rata-rata RI 0,323 pada hari kematian dibandingkan 0,094 pada hari biasa.",
    ],
    suggests: ["qa-validitas-2", "qa-validitas-3"],
  },
  {
    id: "qa-validitas-2",
    category: "validitas",
    question: "Apakah bobot RI sudah cukup kuat?",
    answer: [
      "Untuk penelitian ini, bobotnya sudah punya dasar AHP dari dua pakar, bukan sekadar tebakan atau bobot awal.",
      "Dampaknya juga kuat pada data kematian, dengan rank-biserial r=0,84.",
      "Meski begitu, bobot ini belum otomatis menjadi standar untuk semua akuarium diskus karena pengujiannya baru pada satu akuarium.",
    ],
    suggests: ["qa-metodologi-2", "qa-keterbatasan-2"],
  },
  {
    id: "qa-sensor-2",
    category: "sensor",
    question: "Bagaimana ESP32 membaca empat sensor lalu mengirim datanya?",
    answer: [
      "ESP32-S3 menjalankan siklus baca sensor pH, suhu, DO, dan TDS, lalu mengemas hasilnya sebagai satu data pengamatan.",
      "Saya memakai ADS1115 sebagai ADC eksternal karena ADC internal ESP32 kurang presisi untuk pembacaan analog ini.",
      "Setelah dibaca dan diproses, data dikirim melalui koneksi internet ke Firebase Realtime Database.",
    ],
    suggests: ["qa-metodologi-5", "qa-sensor-3"],
  },
  {
    id: "qa-metodologi-3",
    category: "metodologi",
    question: "Kenapa saya memakai Firebase, bukan membuat server sendiri dari nol?",
    answer: [
      "Firebase mempercepat pengembangan dan cocok untuk aliran data sensor yang perlu terlihat hampir realtime.",
      "Membuat server sendiri memberi kontrol lebih penuh, tetapi saya harus mengurus lebih banyak bagian sejak awal.",
      "Untuk skala proyek ini, saya memilih waktu pengembangan yang lebih singkat, lalu logika utama tetap saya kelola di backend Next.js.",
    ],
    suggests: ["qa-metodologi-5", "qa-sensor-3"],
  },
  {
    id: "qa-kebaruan-1",
    category: "kebaruan",
    question: "Bagaimana notifikasi WhatsApp dan Telegram dikirim? Apa dikirim tiap detik?",
    answer: [
      "Notifikasi tidak dikirim pada setiap pembacaan karena itu akan menjadi spam.",
      "Backend mengecek kondisi berdasarkan ambang tertentu, lalu mengirim notifikasi saat status air masuk kondisi yang perlu diperhatikan.",
      "Dengan begitu, WhatsApp dan Telegram dipakai sebagai peringatan yang bisa ditindaklanjuti, bukan salinan semua data sensor.",
    ],
    suggests: ["qa-metodologi-1", "qa-kebaruan-2"],
  },
  {
    id: "qa-sensor-3",
    category: "sensor",
    question: "Kalau internet putus, apakah data sensor hilang?",
    answer: [
      "Data tidak langsung hilang karena device menyimpannya lebih dulu di buffer offline LittleFS.",
      "Kapasitas buffer sekitar 1.440 entri, atau kira-kira 24 jam data.",
      "Saat jaringan kembali online, data dikirim ulang otomatis ke sistem.",
    ],
    suggests: ["qa-sensor-2", "qa-validitas-3"],
  },
  {
    id: "qa-sensor-4",
    category: "sensor",
    question: "Apa itu kalibrasi sensor dan kenapa penting?",
    answer: [
      "Kalibrasi berarti mencocokkan hasil baca sensor dengan larutan atau acuan yang nilainya sudah diketahui.",
      "Sensor yang harganya lebih terjangkau, terutama pH, TDS, dan DO, bisa melenceng kalau tidak dicek berkala.",
      "Tanpa kalibrasi yang baik, angka sensor terlihat rapi tetapi keputusan tentang kondisi air bisa ikut salah.",
    ],
    suggests: ["qa-sensor-1", "qa-metodologi-1"],
  },
  {
    id: "qa-metodologi-4",
    category: "metodologi",
    question: "Kenapa memakai satu indeks, bukan menampilkan empat angka mentah saja?",
    answer: [
      "Empat angka mentah tetap tersedia, tetapi tidak semua pengguna hafal ambang pH, suhu, DO, dan TDS.",
      "Indeks komposit membantu pengguna awam melihat kondisi air lewat satu kategori yang lebih mudah dipahami.",
      "Saya tetap memakai skor parameter terburuk terhadap ambang WQI supaya satu masalah besar tidak tersamarkan oleh angka lain.",
    ],
    suggests: ["qa-metodologi-1", "qa-kebaruan-2"],
  },
  {
    id: "qa-keterbatasan-2",
    category: "keterbatasan",
    question: "Kenapa penelitian ini hanya memakai satu akuarium?",
    answer: [
      "Pengujian dilakukan pada satu akuarium selama 103 hari, dari 1 Des 2025 sampai 13 Mar 2026.",
      "Untuk proyek D4, waktu dan biaya membuat pengujian beberapa akuarium belum realistis untuk saya lakukan.",
      "Karena itu, penelitian berikutnya perlu memakai lebih banyak akuarium agar hasilnya bisa digeneralisasi dengan lebih kuat.",
    ],
    suggests: ["qa-validitas-2", "qa-validitas-1"],
  },
  {
    id: "qa-kebaruan-2",
    category: "kebaruan",
    question: "Apa bedanya proyek ini dari alat monitoring air yang sudah banyak dijual?",
    answer: [
      "Kebaruan proyek saya bukan sekadar menampilkan angka sensor di layar.",
      "Saya menggabungkan empat parameter menjadi indeks risiko komposit, lalu memvalidasinya dengan data kematian ikan yang benar-benar tercatat.",
      "Hasilnya, RI punya pengaruh kuat terhadap pembeda hari kematian dan hari biasa, dengan rank-biserial r=0,84.",
    ],
    suggests: ["qa-validitas-1", "qa-metodologi-4"],
  },
  {
    id: "qa-validitas-3",
    category: "validitas",
    question: "Kenapa data yang terekam hanya 91,37% dari target?",
    answer: [
      "Sebanyak 271.040 baris data berhasil terekam, atau 91,37% dari target ideal.",
      "Sisanya terdampak celah transmisi jaringan dan daya, bukan karena semua pembacaan sensor gagal.",
      "Setelah pembersihan, ada 268.968 baris valid atau 99,24% dari data yang diproses.",
    ],
    suggests: ["qa-sensor-3", "qa-keterbatasan-2"],
  },
  {
    id: "qa-metodologi-5",
    category: "metodologi",
    question: "Kenapa arsitekturnya dibagi menjadi empat lapisan?",
    answer: [
      "Device fokus membaca sensor, komunikasi fokus mengirim data, aplikasi fokus menjalankan logika, dan penyimpanan fokus menyimpan riwayat.",
      "Lapisan itu terdiri dari ESP32-S3 dan sensor, Firebase Realtime Database, backend Next.js dengan scheduler, lalu Firestore dan TimescaleDB.",
      "Pemisahan ini membuat saya lebih mudah mencari masalah atau mengganti satu bagian tanpa membongkar seluruh sistem.",
    ],
    suggests: ["qa-sensor-2", "qa-metodologi-3"],
  },
]
