import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import path from 'path';
import { MizacProfil, MizacTip, mizacProfiller } from '../mizac-data';
import { uyumVerisi } from '../uyum-data';

// Fontlar repoya gömülüdür. Daha önce gstatic URL'lerinden çekiliyordu; Google
// bu URL'leri sürüm yükseltince döndürdü (v21/v36 -> 404) ve PDF üretimi
// tamamen durdu. Yerel dosyada sürüm rotasyonu ya da ağ hatası riski yok.
// Dosyalar Türkçe için gereken latin + latin-ext aralığına indirilmiştir.
const fontDir = path.join(process.cwd(), 'lib/pdf/fonts');

Font.register({
  family: 'NotoSerif',
  fonts: [
    { src: path.join(fontDir, 'NotoSerif-Regular.ttf') },
    { src: path.join(fontDir, 'NotoSerif-Bold.ttf'), fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: path.join(fontDir, 'NotoSans-Regular.ttf') },
    { src: path.join(fontDir, 'NotoSans-Bold.ttf'), fontWeight: 700 },
  ],
});


/**
 * Türkçe'ye duyarlı büyük harf. @react-pdf'in textTransform: 'uppercase'
 * özelliği JS toUpperCase() kullanıyor ve 'i' harfini 'I' yapıyor; Türkçe'de
 * karşılığı 'İ'. Bu yüzden başlıklar "İÇINDEKILER" diye basılıyordu.
 */
const trBuyuk = (s: string) => s.toLocaleUpperCase('tr-TR');

// Renkler
const GOLD = '#c4973a';
const CREAM = '#f5f0e8';
const DARK = '#1a1207';
const DARKER = '#0f0a04';
const MUTED = '#9a8060';
const BORDER = '#3d2c0e';

const styles = StyleSheet.create({
  page: {
    backgroundColor: DARK,
    fontFamily: 'NotoSans',
    paddingTop: 0,
    paddingBottom: 0,
  },
  // Kapak
  coverPage: {
    backgroundColor: DARKER,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  coverLabel: {
    color: GOLD,
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 20,
    fontFamily: 'NotoSans',
  },
  coverSymbolBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  coverSymbolText: {
    color: CREAM,
    fontSize: 36,
    fontFamily: 'NotoSerif',
    fontWeight: 700,
  },
  coverTitle: {
    color: CREAM,
    fontSize: 28,
    fontWeight: 700,
    fontFamily: 'NotoSerif',
    textAlign: 'center',
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'NotoSans',
  },
  coverDesc: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 1.7,
    maxWidth: 360,
    fontFamily: 'NotoSans',
  },
  coverLine: {
    width: 60,
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 24,
    opacity: 0.4,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  coverFooterText: {
    color: MUTED,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: 'NotoSans',
  },
  // İçerik sayfaları
  contentPage: {
    backgroundColor: DARK,
    padding: 40,
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 10,
    marginBottom: 24,
  },
  pageHeaderTitle: {
    color: MUTED,
    fontSize: 8,
    letterSpacing: 2,
    fontFamily: 'NotoSans',
  },
  pageHeaderMizac: {
    color: GOLD,
    fontSize: 8,
    letterSpacing: 2,
    fontFamily: 'NotoSans',
  },
  sectionLabel: {
    color: GOLD,
    fontSize: 8,
    letterSpacing: 3,
    marginBottom: 6,
    fontFamily: 'NotoSans',
  },
  sectionTitle: {
    color: CREAM,
    fontSize: 20,
    fontWeight: 700,
    fontFamily: 'NotoSerif',
    marginBottom: 16,
  },
  bodyText: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 1.8,
    fontFamily: 'NotoSans',
    marginBottom: 10,
  },
  // Kart bileşeni
  card: {
    backgroundColor: DARKER,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  cardTitle: {
    color: CREAM,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: 'NotoSans',
    marginBottom: 4,
  },
  cardText: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 1.7,
    fontFamily: 'NotoSans',
  },
  // Liste öğesi
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  listBullet: {
    color: GOLD,
    fontSize: 10,
    fontFamily: 'NotoSans',
    marginTop: 1,
    width: 12,
  },
  listText: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 1.7,
    fontFamily: 'NotoSans',
    flex: 1,
  },
  // İki sütun
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  // Info kutusu
  infoBox: {
    backgroundColor: DARKER,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  infoBoxLabel: {
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: 'NotoSans',
  },
  infoBoxValue: {
    color: CREAM,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'NotoSerif',
  },
  // Uyum bar
  barContainer: {
    marginBottom: 10,
  },
  barLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabelText: {
    color: MUTED,
    fontSize: 9,
    fontFamily: 'NotoSans',
  },
  barBg: {
    height: 6,
    backgroundColor: '#2a1f0a',
    borderRadius: 3,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  // Sayfa numarası
  pageNum: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    color: MUTED,
    fontSize: 8,
    fontFamily: 'NotoSans',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },
  // Esma kutusu
  esmaBox: {
    backgroundColor: DARKER,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  esmaText: {
    color: GOLD,
    fontSize: 14,
    fontFamily: 'NotoSerif',
    fontWeight: 700,
    marginBottom: 2,
  },
  esmaAlt: {
    color: MUTED,
    fontSize: 8,
    fontFamily: 'NotoSans',
  },
  // Protokol tablosu
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: MUTED,
    fontFamily: 'NotoSans',
    lineHeight: 1.5,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 8,
    color: GOLD,
    fontFamily: 'NotoSans',
    letterSpacing: 1,
  },
});

// Yardımcı: Sembol → metin dönüştürme (emoji PDF'de çalışmaz)
function elementSimgesi(element: string): string {
  const map: Record<string, string> = {
    'Ateş': '[ATES]',
    'Hava': '[HAVA]',
    'Su': '[SU]',
    'Toprak': '[TOPRAK]',
  };
  return map[element] || element;
}

// Uyum puanları sitedeki tek kaynaktan gelir (lib/uyum-data.ts). Burada ayrı
// bir kopya vardı ve aynı-mizaç çiftlerinde siteyle çelişiyordu (hepsine 70
// diyordu; site 55/65/68/62). Müşteri raporda başka, sitede başka sayı
// görüyordu.
const uyumPuanlari = Object.fromEntries(
  (Object.keys(uyumVerisi) as MizacTip[]).map((a) => [
    a,
    Object.fromEntries(
      (Object.keys(uyumVerisi[a]) as MizacTip[]).map((b) => [b, uyumVerisi[a][b].puan])
    ) as Record<MizacTip, number>,
  ])
) as Record<MizacTip, Record<MizacTip, number>>;

// Haftalık protokol (mizaca göre özelleştirilmiş)
const haftalikProtokol: Record<MizacTip, { sabah: string; ogle: string; aksam: string; uzeri: string }[]> = {
  safravi: [
    { sabah: 'Soğuk su ile yıkanın. Limonu soğuk suya sıkın.', ogle: 'Salata, ekşi meyveler. Et yok.', aksam: 'Nar suyu. Erken yatın (22:00).', uzeri: 'Pazartesi' },
    { sabah: 'Nefes egzersizi — 4/7/8 teknik.', ogle: 'Lahana, kereviz, domates.', aksam: 'Hafif yürüyüş. Ekrandan uzak.', uzeri: 'Salı' },
    { sabah: 'Zencefil yerine nane çayı.', ogle: 'Çorba + yeşillik.', aksam: 'Soğuk duş. Öfke günlüğü.', uzeri: 'Çarşamba' },
    { sabah: 'Limonu tatmayı deneyin — safra hıltını dengeler.', ogle: 'Mercimek, yoğurt.', aksam: 'Müzik / okuma.', uzeri: 'Perşembe' },
    { sabah: 'Sakin yürüyüş — koşu değil.', ogle: 'Elma, armut, erik.', aksam: 'Namaz ve tefekkür.', uzeri: 'Cuma' },
    { sabah: 'Ayran veya kefir.', ogle: 'Hafif tatlar. Acı yok.', aksam: 'Doğada zaman.', uzeri: 'Cumartesi' },
    { sabah: 'Şükür — 5 nimet yaz.', ogle: 'Istakoz, balık yerine bulgur.', aksam: 'Haftayı değerlendir.', uzeri: 'Pazar' },
  ],
  demevi: [
    { sabah: 'Soğuk su + nane çayı. Enerjinizi hissedin.', ogle: 'Taze salata, meyve. Hafif.', aksam: 'Günlük yaz. Hisleri ifade et.', uzeri: 'Pazartesi' },
    { sabah: 'Ritmik egzersiz — dans, yüzme.', ogle: 'Tavuk, sebze. Şeker yok.', aksam: 'Arkadaşlarla vakit.', uzeri: 'Salı' },
    { sabah: 'Derin nefes — öfkeni bırak.', ogle: 'Yeşil yapraklılar, brokoli.', aksam: 'Sessiz oturma vakti.', uzeri: 'Çarşamba' },
    { sabah: 'Portakal suyu — kan şekerini dengele.', ogle: 'Çorba, tam buğday ekmek.', aksam: 'Kitap veya podcast.', uzeri: 'Perşembe' },
    { sabah: 'Sabah koşusu — 20 dk.', ogle: 'Meyve tabağı.', aksam: 'Namaz ve şükür.', uzeri: 'Cuma' },
    { sabah: 'Doğa yürüyüşü.', ogle: 'Hafif piknik yemeği.', aksam: 'Ailevi vakit.', uzeri: 'Cumartesi' },
    { sabah: 'Planla — haftayı yazılı yaz.', ogle: 'Denge tabağı: protein + karbonhidrat.', aksam: 'Haftayı değerlendir.', uzeri: 'Pazar' },
  ],
  balgami: [
    { sabah: 'Sıcak zencefil suyu — balgamı eritir.', ogle: 'Hafif yemek. Baharatları artırın.', aksam: 'Fiziksel hareket — 30 dk.', uzeri: 'Pazartesi' },
    { sabah: 'Soğuk yüz yıkama — uyarı.', ogle: 'Çorba, mercimek.', aksam: 'Yeni bir şey deneyin.', uzeri: 'Salı' },
    { sabah: 'Karabiber + bal karışımı.', ogle: 'Az yağlı, az karbonhidrat.', aksam: 'Biriyle konuşun.', uzeri: 'Çarşamba' },
    { sabah: 'Egzersiz önce, kahvaltı sonra.', ogle: 'Protein ağırlıklı.', aksam: 'Yürüyüş — doğada.', uzeri: 'Perşembe' },
    { sabah: 'Çörekotu ile bal.', ogle: 'Yeşillik ağırlıklı tabak.', aksam: 'Namaz ve tefekkür.', uzeri: 'Cuma' },
    { sabah: 'Hafif jimnastik.', ogle: 'Pişirmeden salata.', aksam: 'Sanat veya el işi.', uzeri: 'Cumartesi' },
    { sabah: '3 hedef belirle.', ogle: 'Detoks çorbası.', aksam: 'Haftayı değerlendir.', uzeri: 'Pazar' },
  ],
  sevdavi: [
    { sabah: 'Sıcak su + bal. Sıcak tut kendinizi.', ogle: 'Sıcak yemekler. Çorba.', aksam: 'Güzel bir şey yaz.', uzeri: 'Pazartesi' },
    { sabah: 'Müzik eşliğinde uyanış.', ogle: 'Fındık, ceviz, hurma.', aksam: 'Bir arkadaşla konuşun.', uzeri: 'Salı' },
    { sabah: 'Güneş ışığında oturma — 15 dk.', ogle: 'Bal, incir, kayısı.', aksam: 'Yaratıcı iş.', uzeri: 'Çarşamba' },
    { sabah: 'Hafif hareket — yürüyüş.', ogle: 'Sıcak sebze yemeği.', aksam: 'Minnettar olduğun 5 şeyi yaz.', uzeri: 'Perşembe' },
    { sabah: 'Güzel koku — lavanta veya gül.', ogle: 'Balık, zeytinyağlı.', aksam: 'Namaz ve dua.', uzeri: 'Cuma' },
    { sabah: 'Doğada oturma.', ogle: 'Hafif ve sıcak.', aksam: 'Film veya müzik.', uzeri: 'Cumartesi' },
    { sabah: 'Hayaller için vizyon.', ogle: 'Özel bir yemek pişir.', aksam: 'Haftayı değerlendir.', uzeri: 'Pazar' },
  ],
};

// Sayfa başlığı
function PageHeader({ mizacIsim }: { mizacIsim: string }) {
  return (
    <View style={styles.pageHeader}>
      <Text style={styles.pageHeaderTitle}>{trBuyuk(`Derin Mizaç Raporu`)}</Text>
      <Text style={styles.pageHeaderMizac}>{trBuyuk(`${mizacIsim} Mizacı`)}</Text>
    </View>
  );
}

// Liste öğesi
function ListItem({ text, color = GOLD }: { text: string; color?: string }) {
  return (
    <View style={styles.listItem}>
      <Text style={[styles.listBullet, { color }]}>+</Text>
      <Text style={styles.listText}>{text}</Text>
    </View>
  );
}

// Kart
function InfoCard({ title, text, renk }: { title: string; text: string; renk: string }) {
  return (
    <View style={[styles.card, { borderLeftColor: renk }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

// Uyum bar
function UyumBar({ diger, puan, renk }: { diger: string; puan: number; renk: string }) {
  const barColor = puan >= 85 ? '#16a34a' : puan >= 65 ? '#2563eb' : puan >= 50 ? '#d97706' : '#dc2626';
  return (
    <View style={styles.barContainer}>
      <View style={styles.barLabel}>
        <Text style={styles.barLabelText}>{diger}</Text>
        <Text style={[styles.barLabelText, { color: renk }]}>%{puan}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${puan}%` as unknown as number, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

// Ana PDF bileşeni
export function MizacRaporuPDF({ profil }: { profil: MizacProfil }) {
  const renk = profil.renk;
  const uyum = uyumPuanlari[profil.id];

  return (
    <Document
      title={`Derin Mizaç Raporu — ${profil.isim}`}
      author="mizac.xyz"
      subject={`${profil.isim} mizacı kapsamlı analiz raporu`}
      creator="mizac.xyz"
    >
      {/* ═══════════════════════════════════════════════════════
          SAYFA 1 — KAPAK
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverLabel}>{trBuyuk(`mizac.xyz · Tıbb-ı Nebevî`)}</Text>

          <View style={[styles.coverSymbolBox, { backgroundColor: renk + '22', borderWidth: 1.5, borderColor: renk + '40' }]}>
            <Text style={[styles.coverSymbolText, { color: renk }]}>
              {elementSimgesi(profil.element)}
            </Text>
          </View>

          <Text style={styles.coverTitle}>{profil.isim} Mizacı</Text>
          <Text style={[styles.coverSubtitle, { color: renk }]}>Derin Mizaç Raporu</Text>
          <View style={styles.coverLine} />
          <Text style={styles.coverDesc}>{profil.kisaAciklama}</Text>
          <View style={styles.coverLine} />
          <Text style={[styles.coverDesc, { fontSize: 9 }]}>
            Element: {profil.element} · Mevsim: {profil.mevsim} · Vakit: {profil.vakit}
          </Text>

          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterText}>{trBuyuk(`İbn-i Sina Geleneği · Zeynep Işık Büyükbay · Varlığın Tahlili`)}</Text>
          </View>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 2 — İÇİNDEKİLER
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`İçindekiler`)}</Text>
          <Text style={[styles.sectionTitle, { marginBottom: 24 }]}>Raporunuzda Neler Var?</Text>

          {[
            { num: '01', title: 'Mizacınızın Özü', sayfa: '3–4' },
            { num: '02', title: 'Fiziksel Yapı ve Sağlık', sayfa: '5' },
            { num: '03', title: 'Güçlü ve Zayıf Yönleriniz', sayfa: '6–7' },
            { num: '04', title: 'Duygu ve Ruh Haritası', sayfa: '8' },
            { num: '05', title: 'Beslenme Rehberi', sayfa: '9' },
            { num: '06', title: 'Detoks Tarifleri', sayfa: '10' },
            { num: '07', title: 'Renk ve Çevre Önerileri', sayfa: '11' },
            { num: '08', title: 'İlişki ve Sevgi Dili', sayfa: '12' },
            { num: '09', title: 'Mizaç Uyum Haritası', sayfa: '13' },
            { num: '10', title: 'Kariyer ve Yaşam Amacı', sayfa: '14' },
            { num: '11', title: "Esmaü'l-Hüsna Zikirleriniz", sayfa: '15' },
            { num: '12', title: 'Haftalık Sağlık Protokolü', sayfa: '16' },
            { num: '13', title: 'Çocukluk ve Gelişim', sayfa: '17' },
            { num: '14', title: 'Sahabi Örneği', sayfa: '18' },
          ].map((item) => (
            <View key={item.num} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: BORDER + '60' }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={{ color: renk, fontSize: 9, fontFamily: 'NotoSans', width: 24 }}>{item.num}</Text>
                <Text style={{ color: CREAM, fontSize: 10, fontFamily: 'NotoSans' }}>{item.title}</Text>
              </View>
              <Text style={{ color: MUTED, fontSize: 9, fontFamily: 'NotoSans' }}>{item.sayfa}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.pageNum}>2</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 3-4 — MİZACIN ÖZÜ
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`01 · Mizacınızın Özü`)}</Text>
          <Text style={styles.sectionTitle}>Sen Kimsin?</Text>
          <Text style={styles.bodyText}>{profil.uzunAciklama}</Text>

          <View style={styles.divider} />

          <View style={[styles.twoCol, { marginTop: 8 }]}>
            {[
              { label: 'Element', value: profil.element },
              { label: 'Mevsim', value: profil.mevsim },
              { label: 'Günün Vakti', value: profil.vakit },
              { label: 'Nitelik', value: `${profil.sicaklik} · ${profil.nem}` },
            ].map((info, i) => (
              <View key={i} style={[styles.infoBox, { flex: 1, marginRight: i % 2 === 0 ? 6 : 0, marginLeft: i % 2 === 1 ? 6 : 0 }]}>
                <Text style={[styles.infoBoxLabel, { color: renk }]}>{trBuyuk(`${info.label}`)}</Text>
                <Text style={styles.infoBoxValue}>{info.value}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{trBuyuk(`Anahtar Kelimeler`)}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {profil.anahtarKelimeler.map((kw) => (
                <View key={kw} style={{ backgroundColor: renk + '22', borderWidth: 1, borderColor: renk + '44', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: renk, fontSize: 9, fontFamily: 'NotoSans' }}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.pageNum}>3</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 5 — FİZİKSEL YAPI
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`02 · Fiziksel Yapı ve Sağlık`)}</Text>
          <Text style={styles.sectionTitle}>Bedeninizin Dili</Text>

          {profil.fiziksel.map((item, i) => (
            <InfoCard key={i} title={`Özellik ${i + 1}`} text={item} renk={renk} />
          ))}

          <View style={styles.divider} />
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{trBuyuk(`Ağrı Tipi`)}</Text>
              <View style={[styles.infoBox, { marginBottom: 0 }]}>
                <Text style={styles.cardText}>{profil.agriTipi}</Text>
              </View>
            </View>
            <View style={[styles.col, { marginLeft: 12 }]}>
              <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{trBuyuk(`Yaş Dönemi`)}</Text>
              <View style={[styles.infoBox, { marginBottom: 0 }]}>
                <Text style={styles.cardText}>{profil.yasDonem}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.pageNum}>5</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 6 — GÜÇLÜ YÖNLER
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`03 · Güçlü ve Zayıf Yönler`)}</Text>
          <Text style={styles.sectionTitle}>Güçlü Yönleriniz</Text>
          {profil.gucluYonler.map((item, i) => (
            <ListItem key={i} text={item} color={renk} />
          ))}

          <View style={styles.divider} />
          <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 4 }]}>Dikkat Edilmesi Gerekenler</Text>
          {profil.zayifYonler.map((item, i) => (
            <ListItem key={i} text={item} color="#dc2626" />
          ))}
        </View>
        <Text style={styles.pageNum}>6</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 8 — DUYGU HARİTASI
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`04 · Duygu ve Ruh`)}</Text>
          <Text style={styles.sectionTitle}>İçinizin Haritası</Text>
          <Text style={styles.bodyText}>
            Tıbb-ı nebevî geleneğinde duygular bedenden ayrı düşünülmez. {profil.isim} mizacının duygusal dünyası:
          </Text>
          {profil.duygular.map((item, i) => (
            <InfoCard key={i} title={`Duygu Katmanı ${i + 1}`} text={item} renk={renk} />
          ))}
        </View>
        <Text style={styles.pageNum}>8</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 9 — BESLENME
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`05 · Beslenme Rehberi`)}</Text>
          <Text style={styles.sectionTitle}>Sofranızdaki Şifa</Text>

          <Text style={[styles.sectionLabel, { color: '#16a34a', marginBottom: 8 }]}>{trBuyuk(`Tavsiye Edilen Besinler`)}</Text>
          <View style={{ backgroundColor: '#16a34a11', borderRadius: 8, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#16a34a33' }}>
            {profil.beslenme.map((item, i) => (
              <ListItem key={i} text={item} color="#16a34a" />
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: '#dc2626', marginBottom: 8 }]}>{trBuyuk(`Kaçınılacak Besinler`)}</Text>
          <View style={{ backgroundColor: '#dc262611', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#dc262633' }}>
            {profil.yasak.map((item, i) => (
              <ListItem key={i} text={item} color="#dc2626" />
            ))}
          </View>

          <View style={styles.divider} />
          <View style={{ backgroundColor: DARKER, borderRadius: 8, padding: 12 }}>
            <Text style={[styles.sectionLabel, { marginBottom: 6 }]}>{trBuyuk(`Sağlık Eğilimleri`)}</Text>
            {profil.saglikEgilimleri.slice(0, 3).map((item, i) => (
              <ListItem key={i} text={item} color={renk} />
            ))}
          </View>
        </View>
        <Text style={styles.pageNum}>9</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 10 — DETOKS
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`06 · Detoks Tarifleri`)}</Text>
          <Text style={styles.sectionTitle}>Sizin İçin Detoks</Text>
          <Text style={styles.bodyText}>
            İbn-i Sina geleneğinde detoks, hıltların dengelenmesi anlamına gelir.
            {profil.isim} mizacı için önerilen özel karışımlar:
          </Text>
          {profil.detoks.map((item, i) => (
            <View key={i} style={[styles.card, { borderLeftColor: renk, marginBottom: 12 }]}>
              <Text style={[styles.cardTitle, { color: renk, marginBottom: 6 }]}>Tarif {i + 1}</Text>
              <Text style={styles.cardText}>{item}</Text>
            </View>
          ))}

          <View style={styles.divider} />
          {/* fontStyle: 'italic' kullanılamaz — NotoSans için italik varyant
              kayıtlı değil ve @react-pdf tüm PDF üretimini hata ile durduruyor
              ("Could not resolve font"). Vurgu renk/boyutla veriliyor. */}
          <Text style={[styles.bodyText, { fontSize: 9 }]}>
            Not: Bu tarifler genel mizaç önerisidir. Kronik hastalığınız varsa doktora danışın.
          </Text>
        </View>
        <Text style={styles.pageNum}>10</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 11 — RENKLER
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`07 · Renk ve Çevre`)}</Text>
          <Text style={styles.sectionTitle}>Ortamınızdaki Şifa</Text>
          <Text style={styles.bodyText}>
            Renkler ve çevre, mizacı doğrudan etkiler. {profil.isim} mizacı için:
          </Text>

          <Text style={[styles.sectionLabel, { color: '#16a34a', marginBottom: 8 }]}>{trBuyuk(`Önerilen Renkler`)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {profil.renkOnerilir.map((renki) => (
              <View key={renki} style={{ backgroundColor: '#16a34a22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: '#16a34a44' }}>
                <Text style={{ color: '#16a34a', fontSize: 10, fontFamily: 'NotoSans' }}>{renki}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: '#dc2626', marginBottom: 8 }]}>{trBuyuk(`Kaçınılacak Renkler`)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {profil.renkOnerilmez.map((renki) => (
              <View key={renki} style={{ backgroundColor: '#dc262622', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: '#dc262644' }}>
                <Text style={{ color: '#dc2626', fontSize: 10, fontFamily: 'NotoSans' }}>{renki}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.infoBox, { borderLeftWidth: 3, borderLeftColor: renk }]}>
            <Text style={[styles.infoBoxLabel, { color: renk, marginBottom: 8 }]}>{trBuyuk(`Çevre Tavsiyesi`)}</Text>
            <Text style={styles.cardText}>
              {profil.id === 'safravi' && 'Serin, iyi havalandırılmış, açık renkli mekanlar sizi dengeler. Kalabalık ve sıcak ortamlardan uzak durun.'}
              {profil.id === 'demevi' && 'Canlı, aydınlık, sosyal mekanlar sizi besler. Tek düze ve kapalı ortamlardan kaçının.'}
              {profil.id === 'balgami' && 'Sıcak, hareketli, uyaran içeren ortamlar sizi aktive eder. Pasif rutinlerden çıkın.'}
              {profil.id === 'sevdavi' && 'Sıcak, güzel kokulu, huzurlu ve az uyaranlı mekanlar sizi iyileştirir. Gürültüden korunun.'}
            </Text>
          </View>
        </View>
        <Text style={styles.pageNum}>11</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 12 — İLİŞKİ
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`08 · İlişki ve Sevgi Dili`)}</Text>
          <Text style={styles.sectionTitle}>Sevginin Haritası</Text>
          <Text style={styles.bodyText}>{profil.iliski}</Text>
          <View style={styles.divider} />
          <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{trBuyuk(`Sevgi Diliniz`)}</Text>
          <View style={[styles.infoBox, { borderLeftWidth: 3, borderLeftColor: renk }]}>
            <Text style={[styles.infoBoxValue, { color: renk, fontSize: 14 }]}>{profil.sevgiDili}</Text>
          </View>
          <Text style={styles.bodyText}>
            {profil.id === 'safravi' && 'Safravî mizaçlılar için sevgi, birlikte iş yapmak ve başarıyı paylaşmak demektir. Sözel ifadeler önemlidir ama eylem daha güçlüdür.'}
            {profil.id === 'demevi' && 'Demevî mizaçlılar dokunsallık ve zaman birliğine değer verir. Sosyal ortamlarda güvende hissettiren bir partner onlar için idealdir.'}
            {profil.id === 'balgami' && 'Balgamî mizaçlılar istikrar ve güvenilirliği sever. Acele zorlamayan, sakin bir ritimle ilerleyen ilişkiler onlara iyi gelir.'}
            {profil.id === 'sevdavi' && 'Sevdavî mizaçlılar derin anlayış ve takdir arar. Sırlarını paylaşabilecekleri, yargılamayan bir partner için her şeyi yapar.'}
          </Text>
        </View>
        <Text style={styles.pageNum}>12</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 13 — UYUM HARİTASI
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`09 · Uyum Haritası`)}</Text>
          <Text style={styles.sectionTitle}>Diğer Mizaçlarla Uyumunuz</Text>
          <Text style={styles.bodyText}>
            İbn-i Sina geleneğinde mizaçlar birbirini etkiler. Zıt nitelikler çekişir, benzer nitelikler uyum sağlar.
          </Text>

          {(Object.entries(uyum) as [MizacTip, number][])
            .sort(([, a], [, b]) => b - a)
            .map(([tip, puan]) => {
              if (tip === profil.id) return null;
              const digerProfil = mizacProfiller[tip];
              return (
                <View key={tip} style={{ marginBottom: 14 }}>
                  <UyumBar diger={digerProfil.isim} puan={puan} renk={renk} />
                  <Text style={[styles.cardText, { marginTop: 4, paddingLeft: 4 }]}>
                    {puan >= 85 && 'Mükemmel uyum — birbirinizi tamamlıyorsunuz.'}
                    {puan >= 65 && puan < 85 && 'Güçlü uyum — farklılıklarınız güç kaynağı olabilir.'}
                    {puan >= 50 && puan < 65 && 'Orta uyum — bilinçli çaba ile güzel bir ilişki kurulabilir.'}
                    {puan < 50 && 'Zorlu uyum — büyük öğretici potansiyel, ama sabır gerektirir.'}
                  </Text>
                </View>
              );
            })}
        </View>
        <Text style={styles.pageNum}>13</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 14 — KARİYER
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`10 · Kariyer ve Yaşam Amacı`)}</Text>
          <Text style={styles.sectionTitle}>Çağrınız Ne?</Text>
          <Text style={styles.bodyText}>
            İbn-i Sina'ya göre her mizacın doğal meylettiği alanlar vardır.
            {profil.isim} mizacı için en uygun kariyer yolları:
          </Text>
          {profil.kariyer.map((item, i) => (
            <InfoCard key={i} title={`Alan ${i + 1}`} text={item} renk={renk} />
          ))}
        </View>
        <Text style={styles.pageNum}>14</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 15 — ESMAÜL HÜSNA
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`11 · Esmaü'l-Hüsna`)}</Text>
          <Text style={styles.sectionTitle}>Sizin İçin Önerilen İsimler</Text>
          <Text style={styles.bodyText}>
            Allah'ın güzel isimleri, farklı hastalıklar ve mizaçlar için farklı tesir gösterir.
            {profil.isim} mizacı için önerilen isimler:
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {profil.esmalar.map((esma, i) => (
              <View key={i} style={[styles.esmaBox, { width: '47%' }]}>
                <Text style={styles.esmaText}>{esma}</Text>
                <Text style={styles.esmaAlt}>{i + 1}. isim</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />
          <View style={[styles.infoBox, { borderLeftWidth: 3, borderLeftColor: renk }]}>
            <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{trBuyuk(`Zikir Tavsiyesi`)}</Text>
            <Text style={styles.cardText}>
              Sabah namazı sonrasında seçtiğiniz ismi 33, 66 veya 99 kez tekrarlayın.
              Nefes alırken içine çekin, verirken söyleyin. Gönülden ve tefekkürle.
            </Text>
          </View>
        </View>
        <Text style={styles.pageNum}>15</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 16 — HAFTALIK PROTOKOL
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`12 · Haftalık Sağlık Protokolü`)}</Text>
          <Text style={styles.sectionTitle}>7 Günlük Rutininiz</Text>

          {/* Tablo başlığı */}
          <View style={[styles.tableRow, { borderBottomColor: GOLD, borderBottomWidth: 1 }]}>
            <Text style={[styles.tableCellHeader, { color: renk }]}>{trBuyuk(`Gün`)}</Text>
            <Text style={styles.tableCellHeader}>{trBuyuk(`Sabah`)}</Text>
            <Text style={styles.tableCellHeader}>{trBuyuk(`Öğle`)}</Text>
            <Text style={styles.tableCellHeader}>{trBuyuk(`Akşam`)}</Text>
          </View>

          {haftalikProtokol[profil.id].map((gun) => (
            <View key={gun.uzeri} style={styles.tableRow}>
              <Text style={[styles.tableCell, { color: renk, fontWeight: 700, fontSize: 8 }]}>{gun.uzeri}</Text>
              <Text style={styles.tableCell}>{gun.sabah}</Text>
              <Text style={styles.tableCell}>{gun.ogle}</Text>
              <Text style={styles.tableCell}>{gun.aksam}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.pageNum}>16</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 17 — ÇOCUKLUK
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`13 · Çocukluk ve Gelişim`)}</Text>
          <Text style={styles.sectionTitle}>{profil.isim} Çocuk</Text>
          <Text style={styles.bodyText}>
            Mizaç doğuştan gelir. {profil.isim} mizacındaki bir çocuk nasıl büyür?
          </Text>
          {profil.cocukOzellikleri.map((item, i) => (
            <InfoCard key={i} title={`Dönem ${i + 1}`} text={item} renk={renk} />
          ))}
        </View>
        <Text style={styles.pageNum}>17</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 18 — SAHABİ
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader mizacIsim={profil.isim} />
          <Text style={styles.sectionLabel}>{trBuyuk(`14 · Sahabi Örneği`)}</Text>
          <Text style={styles.sectionTitle}>Size En Yakın Örnek</Text>

          <View style={[styles.infoBox, { borderWidth: 1.5, borderColor: renk + '44', padding: 24, alignItems: 'center', marginBottom: 20 }]}>
            <Text style={{ color: MUTED, fontSize: 9, letterSpacing: 2, fontFamily: 'NotoSans', marginBottom: 8 }}>
              {trBuyuk(`${profil.isim} Mizacı · Sahabi Örneği`)}
            </Text>
            <Text style={{ color: renk, fontSize: 18, fontWeight: 700, fontFamily: 'NotoSerif', textAlign: 'center' }}>
              {profil.halife}
            </Text>
          </View>

          <Text style={styles.bodyText}>
            İslam tarihinde bu mizacın en güzel örneklerinden biri olan {profil.halife},
            {profil.isim} mizacının güçlü yönlerini en açık şekilde ortaya koymuştur.
          </Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>{trBuyuk(`Hatırlatıcı`)}</Text>
          <Text style={styles.bodyText}>
            {profil.gucluYonler[0]} — bu sizin en güçlü yanınız.
            Bunu bir araç olarak, kendiniz ve çevreniz için kullanın.
          </Text>

          <View style={[styles.infoBox, { marginTop: 8, borderLeftWidth: 3, borderLeftColor: GOLD }]}>
            {/* fontStyle: 'italic' kayıtlı olmadığı için PDF üretimini
                tamamen bozuyordu — bkz. Font.register (NotoSans) */}
            <Text style={[styles.cardText, { fontSize: 11, lineHeight: 1.8, color: CREAM }]}>
              "Her mizacın bir hikayesi, her hikayenin bir anlamı vardır.
              Sen bu mizaçla yaratılmadın — bu mizaç senin içindir."
            </Text>
            <Text style={[styles.cardText, { marginTop: 6, textAlign: 'right', color: GOLD }]}>
              — Varlığın Tahlili, Zeynep Işık Büyükbay
            </Text>
          </View>
        </View>
        <Text style={styles.pageNum}>18</Text>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          SAYFA 19 — KAPANIŞ
      ═══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.coverPage, { justifyContent: 'flex-start', paddingTop: 80 }]}>
          <Text style={[styles.coverLabel, { marginBottom: 40 }]}>{trBuyuk(`Raporunuzu Tamamladınız`)}</Text>

          <Text style={[styles.coverTitle, { fontSize: 22, marginBottom: 16 }]}>
            Bir sonraki adımınız ne?
          </Text>

          <Text style={[styles.coverDesc, { marginBottom: 32 }]}>
            Bu rapor bir başlangıç. Mizacınızı tanımak, hayatın her alanında daha bilinçli
            kararlar almanızı sağlar. Beslenmenizde, ilişkilerinizde, işinizde.
          </Text>

          <View style={styles.coverLine} />

          <Text style={[styles.sectionLabel, { textAlign: 'center', marginBottom: 16 }]}>{trBuyuk(`Kaynaklar`)}</Text>
          {[
            'Varlığın Tahlili — Zeynep Işık Büyükbay',
            'El-Kanun fit-Tıbb — İbn-i Sina',
            'mizac.xyz — Tüm mizaç profilleri ve testler',
          ].map((kaynak, i) => (
            <Text key={i} style={[styles.coverDesc, { marginBottom: 8, fontSize: 10 }]}>
              {i + 1}. {kaynak}
            </Text>
          ))}

          <View style={styles.coverLine} />

          <Text style={[styles.coverDesc, { fontSize: 9, opacity: 0.7 }]}>
            Bu rapor tıbbi tavsiye niteliği taşımaz. Ciddi sağlık sorunlarında uzman doktora başvurun.
          </Text>

          <View style={[styles.coverFooter, { position: 'relative', bottom: 0, marginTop: 40 }]}>
            <Text style={[styles.coverFooterText, { marginBottom: 4 }]}>{trBuyuk(`mizac.xyz`)}</Text>
            <Text style={[styles.coverFooterText, { opacity: 0.5, fontSize: 7 }]}>{trBuyuk(`© 2026 · Tüm hakları saklıdır`)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Tüm mizaçlar için kullanıma hazır
export { mizacProfiller };
