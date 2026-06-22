import type { QaItem } from "#/lib/types"

export const QA_DATA: QaItem[] = [
  {
    id: "qa-sensor-1",
    category: "sensor",
    question: "Mengapa hanya memakai pH, suhu, DO, dan TDS?",
    answer: [
      "Empat parameter ini bisa dibaca kontinu dengan sensor yang tersedia dan relevan untuk kondisi dasar akuarium.",
      "pH mewakili keasaman, suhu memengaruhi metabolisme, DO berkaitan dengan respirasi, TDS mewakili akumulasi padatan terlarut.",
      "Keterbatasannya, sistem belum mengukur amonia dan nitrit, sehingga analisis biologis belum lengkap.",
    ],
    suggests: ["qa-keterbatasan-1", "qa-metodologi-1"],
  },
  {
    id: "qa-keterbatasan-1",
    category: "keterbatasan",
    question: "Mengapa amonia dan nitrit tidak diukur, padahal penting?",
    answer: [
      "Keterbatasan alat, biaya, dan integrasi sensor menjadi alasan utama.",
      "Amonia dan nitrit diakui sebagai parameter penting pada akuarium tertutup.",
      "Karena tidak diukur, RI tidak boleh ditafsirkan sebagai diagnosis lengkap penyebab kematian ikan.",
    ],
    suggests: ["qa-validitas-1", "qa-kebaruan-1"],
  },
  {
    id: "qa-metodologi-1",
    category: "metodologi",
    question: "Mengapa memakai indeks risiko linear terbobot?",
    answer: [
      "Bentuk linear mudah dijelaskan dan dibaca pengguna.",
      "Tujuannya adalah screening harian, bukan model biologis kompleks.",
      "Kelemahannya potensi kompensasi antar parameter, sehingga sistem tetap menampilkan data dasar dan peringatan per parameter.",
    ],
    suggests: ["qa-metodologi-2", "qa-validitas-2"],
  },
  {
    id: "qa-metodologi-2",
    category: "metodologi",
    question: "Mengapa bobot TDS 0,4 dan DO 0,3 lebih besar?",
    answer: [
      "Data menunjukkan TDS dan DO paling berkaitan dengan perubahan kondisi air selama pengamatan.",
      "TDS meningkat saat padatan terakumulasi, DO rendah muncul pada kondisi awal yang lebih buruk.",
      "Bobot ini masih berbasis literatur dan rasional empiris awal, belum hasil AHP pakar.",
    ],
    suggests: ["qa-validitas-2", "qa-metodologi-3"],
  },
  {
    id: "qa-validitas-1",
    category: "validitas",
    question: "RI tidak signifikan terhadap kematian ikan. Apakah indeks gagal?",
    answer: [
      "Tidak sepenuhnya gagal, tetapi batas fungsinya jelas.",
      "RI berhasil merangkum kondisi air kronis, tetapi tidak terbukti memprediksi kematian ikan pada dataset ini.",
      "Kematian ikan bisa dipengaruhi amonia, nitrit, penyakit, agresi sosial, pakan, atau stres yang tidak tercatat sensor.",
    ],
    suggests: ["qa-validitas-3", "qa-keterbatasan-1"],
  },
  {
    id: "qa-validitas-2",
    category: "validitas",
    question: "Apakah bobot RI sudah valid?",
    answer: [
      "Valid sebagai rancangan awal untuk screening pada dataset ini.",
      "Belum valid sebagai standar umum untuk semua akuarium diskus.",
      "Validasi lanjutan perlu AHP atau panel pakar, lalu diuji pada beberapa akuarium.",
    ],
    suggests: ["qa-metodologi-2", "qa-kebaruan-1"],
  },
]
