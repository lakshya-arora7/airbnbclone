"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LanguageItem {
  name: string;
  region: string;
  code: string;
}

export interface CurrencyItem {
  name: string;
  code: string;
  symbol: string;
}

export const SUGGESTED_LANGUAGES: LanguageItem[] = [
  { name: "English", region: "United States", code: "en-US" },
  { name: "English", region: "United Kingdom", code: "en-GB" },
  { name: "हिन्दी", region: "भारत", code: "hi-IN" },
  { name: "ಕನ್ನಡ", region: "ಭಾರತ", code: "kn-IN" },
  { name: "मराठी", region: "भारत", code: "mr-IN" },
];

export const ALL_LANGUAGES: LanguageItem[] = [
  { name: "English", region: "India", code: "en-IN" },
  { name: "Azərbaycanca", region: "Azərbaycan", code: "az-AZ" },
  { name: "Bahasa Indonesia", region: "Indonesia", code: "id-ID" },
  { name: "Bosanski", region: "Bosna i Hercegovina", code: "bs-BA" },
  { name: "Català", region: "Espanya", code: "ca-ES" },
  { name: "Čeština", region: "Česká republika", code: "cs-CZ" },
  { name: "Crnogorski", region: "Crna Gora", code: "cnr-ME" },
  { name: "Dansk", region: "Danmark", code: "da-DK" },
  { name: "Deutsch", region: "Deutschland", code: "de-DE" },
  { name: "Deutsch", region: "Österreich", code: "de-AT" },
  { name: "Deutsch", region: "Schweiz", code: "de-CH" },
  { name: "Eesti", region: "Eesti", code: "et-EE" },
  { name: "English", region: "Australia", code: "en-AU" },
  { name: "English", region: "Canada", code: "en-CA" },
  { name: "English", region: "Guyana", code: "en-GY" },
  { name: "English", region: "Ireland", code: "en-IE" },
  { name: "English", region: "New Zealand", code: "en-NZ" },
  { name: "English", region: "Singapore", code: "en-SG" },
  { name: "English", region: "United Arab Emirates", code: "en-AE" },
  { name: "Español", region: "España", code: "es-ES" },
  { name: "Español", region: "México", code: "es-MX" },
  { name: "Español", region: "Argentina", code: "es-AR" },
  { name: "Español", region: "Colombia", code: "es-CO" },
  { name: "Français", region: "France", code: "fr-FR" },
  { name: "Français", region: "Canada", code: "fr-CA" },
  { name: "Italiano", region: "Italia", code: "it-IT" },
  { name: "Nederlands", region: "Nederland", code: "nl-NL" },
  { name: "Norsk", region: "Norge", code: "no-NO" },
  { name: "Polski", region: "Polska", code: "pl-PL" },
  { name: "Português", region: "Brasil", code: "pt-BR" },
  { name: "Português", region: "Portugal", code: "pt-PT" },
  { name: "Русский", region: "Россия", code: "ru-RU" },
  { name: "Türkçe", region: "Türkiye", code: "tr-TR" },
  { name: "日本語", region: "日本", code: "ja-JP" },
  { name: "한국어", region: "대한민국", code: "ko-KR" },
  { name: "简体中文", region: "中国", code: "zh-CN" },
  { name: "繁體中文", region: "台灣", code: "zh-TW" },
];

export const ALL_CURRENCIES: CurrencyItem[] = [
  { name: "Indian rupee", code: "INR", symbol: "₹" },
  { name: "Australian dollar", code: "AUD", symbol: "$" },
  { name: "Brazilian real", code: "BRL", symbol: "R$" },
  { name: "Bulgarian lev", code: "BGN", symbol: "лв." },
  { name: "Canadian dollar", code: "CAD", symbol: "$" },
  { name: "Chilean peso", code: "CLP", symbol: "$" },
  { name: "Chinese yuan", code: "CNY", symbol: "¥" },
  { name: "Colombian peso", code: "COP", symbol: "$" },
  { name: "Costa Rican colon", code: "CRC", symbol: "₡" },
  { name: "Czech koruna", code: "CZK", symbol: "Kč" },
  { name: "Danish krone", code: "DKK", symbol: "kr" },
  { name: "Egyptian pound", code: "EGP", symbol: "ج.م." },
  { name: "Emirati dirham", code: "AED", symbol: "د.إ" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "Ghanaian cedi", code: "GHS", symbol: "GH₵" },
  { name: "Hong Kong dollar", code: "HKD", symbol: "$" },
  { name: "Hungarian forint", code: "HUF", symbol: "Ft" },
  { name: "Indonesian rupiah", code: "IDR", symbol: "Rp" },
  { name: "Israeli new shekel", code: "ILS", symbol: "₪" },
  { name: "Japanese yen", code: "JPY", symbol: "¥" },
  { name: "Kazakhstani tenge", code: "KZT", symbol: "₸" },
  { name: "Kenyan shilling", code: "KES", symbol: "KSh" },
  { name: "Malaysian ringgit", code: "MYR", symbol: "RM" },
  { name: "Mexican peso", code: "MXN", symbol: "$" },
  { name: "Moroccan dirham", code: "MAD", symbol: "MAD" },
  { name: "New Taiwan dollar", code: "TWD", symbol: "$" },
  { name: "New Zealand dollar", code: "NZD", symbol: "$" },
  { name: "Norwegian krone", code: "NOK", symbol: "kr" },
  { name: "Peruvian sol", code: "PEN", symbol: "S/" },
  { name: "Philippine peso", code: "PHP", symbol: "₱" },
  { name: "Polish zloty", code: "PLN", symbol: "zł" },
  { name: "Pound sterling", code: "GBP", symbol: "£" },
  { name: "Qatari riyal", code: "QAR", symbol: "ر.ق" },
  { name: "Romanian leu", code: "RON", symbol: "lei" },
  { name: "Saudi Arabian riyal", code: "SAR", symbol: "SR" },
  { name: "Singapore dollar", code: "SGD", symbol: "$" },
  { name: "South African rand", code: "ZAR", symbol: "R" },
  { name: "South Korean won", code: "KRW", symbol: "₩" },
  { name: "Swedish krona", code: "SEK", symbol: "kr" },
  { name: "Swiss franc", code: "CHF", symbol: "CHF" },
  { name: "Thai baht", code: "THB", symbol: "฿" },
  { name: "Turkish lira", code: "TRY", symbol: "₺" },
  { name: "United States dollar", code: "USD", symbol: "$" },
];

// Realistic exchange rates relative to 1 INR
export const CURRENCY_RATES: Record<
  string,
  { rate: number; symbol: string; position: "before" | "after" }
> = {
  INR: { rate: 1.0, symbol: "₹", position: "before" },
  USD: { rate: 0.012, symbol: "$", position: "before" },
  EUR: { rate: 0.011, symbol: "€", position: "before" },
  GBP: { rate: 0.0095, symbol: "£", position: "before" },
  AUD: { rate: 0.018, symbol: "A$", position: "before" },
  CAD: { rate: 0.016, symbol: "C$", position: "before" },
  JPY: { rate: 1.78, symbol: "¥", position: "before" },
  CNY: { rate: 0.086, symbol: "¥", position: "before" },
  BRL: { rate: 0.061, symbol: "R$", position: "before" },
  AED: { rate: 0.044, symbol: "د.إ", position: "after" },
  SAR: { rate: 0.045, symbol: "SR", position: "after" },
  CHF: { rate: 0.0105, symbol: "CHF", position: "before" },
  SGD: { rate: 0.016, symbol: "S$", position: "before" },
  NZD: { rate: 0.0195, symbol: "NZ$", position: "before" },
  KRW: { rate: 16.0, symbol: "₩", position: "before" },
  MXN: { rate: 0.2, symbol: "Mex$", position: "before" },
  THB: { rate: 0.43, symbol: "฿", position: "before" },
  TRY: { rate: 0.39, symbol: "₺", position: "before" },
  PHP: { rate: 0.67, symbol: "₱", position: "before" },
  IDR: { rate: 185.0, symbol: "Rp", position: "before" },
  MYR: { rate: 0.056, symbol: "RM", position: "before" },
  SEK: { rate: 0.125, symbol: "kr", position: "after" },
  NOK: { rate: 0.128, symbol: "kr", position: "after" },
  DKK: { rate: 0.082, symbol: "kr", position: "after" },
  PLN: { rate: 0.047, symbol: "zł", position: "after" },
  CZK: { rate: 0.27, symbol: "Kč", position: "after" },
  HUF: { rate: 4.3, symbol: "Ft", position: "after" },
  ILS: { rate: 0.044, symbol: "₪", position: "before" },
  ZAR: { rate: 0.21, symbol: "R", position: "before" },
  EGP: { rate: 0.58, symbol: "E£", position: "before" },
  QAR: { rate: 0.044, symbol: "QR", position: "after" },
  BGN: { rate: 0.0215, symbol: "лв.", position: "after" },
  CLP: { rate: 11.2, symbol: "CLP$", position: "before" },
  COP: { rate: 48.0, symbol: "COL$", position: "before" },
  CRC: { rate: 6.2, symbol: "₡", position: "before" },
  GHS: { rate: 0.18, symbol: "GH₵", position: "before" },
  HKD: { rate: 0.094, symbol: "HK$", position: "before" },
  KZT: { rate: 5.7, symbol: "₸", position: "after" },
  KES: { rate: 1.55, symbol: "KSh", position: "before" },
  MAD: { rate: 0.12, symbol: "MAD", position: "after" },
  TWD: { rate: 0.38, symbol: "NT$", position: "before" },
  PEN: { rate: 0.045, symbol: "S/", position: "before" },
  RON: { rate: 0.055, symbol: "lei", position: "after" },
};

// UI Translations dictionary across languages
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "nav.switchToHosting": "Switch to hosting",
    "nav.switchToTravelling": "Switch to travelling",
    "nav.all": "All",
    "nav.homes": "Homes",
    "nav.experiences": "Experiences",
    "nav.services": "Services",
    "search.where": "Where",
    "search.searchDestinations": "Search destinations",
    "search.when": "When",
    "search.addDates": "Add dates",
    "search.who": "Who",
    "search.addGuests": "Add guests",
    "search.search": "Search",
    "menu.wishlists": "Wishlists",
    "menu.trips": "Trips",
    "menu.messages": "Messages",
    "menu.profile": "Profile",
    "menu.notifications": "Notifications",
    "menu.accountSettings": "Account settings",
    "menu.languagesAndCurrency": "Languages & currency",
    "menu.helpCentre": "Help Centre",
    "menu.becomeAHost": "Become a host",
    "menu.refer": "Refer a host",
    "menu.cohosts": "Find a co-host",
    "menu.logOut": "Log out",
    "listing.night": "night",
    "listing.perNight": "per night",
    "listing.total": "Total",
    "trips.title": "Trips",
    "trips.mapOut": "Map out your next trip",
    "trips.mapOutSubtitle":
      "After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.",
    "trips.getStarted": "Get started",
    "messages.title": "Messages",
    "messages.all": "All",
    "messages.unread": "Unread",
    "notifications.title": "Notifications",
    "notifications.noNotifications": "No notifications yet",
    "notifications.subtitle":
      "You've got a blank slate (for now). We'll let you know when updates arrive.",
    "booking.reserve": "Reserve",
    "booking.youWontBeCharged": "You won't be charged yet",
  },
  hi: {
    "nav.switchToHosting": "मेजबानी पर स्विच करें",
    "nav.switchToTravelling": "यात्रा पर स्विच करें",
    "nav.all": "सभी",
    "nav.homes": "घर",
    "nav.experiences": "अनुभव",
    "nav.services": "सेवाएं",
    "search.where": "कहाँ",
    "search.searchDestinations": "स्थान खोजें",
    "search.when": "कब",
    "search.addDates": "तारीखें जोड़ें",
    "search.who": "कौन",
    "search.addGuests": "अतिथि जोड़ें",
    "search.search": "खोजें",
    "menu.wishlists": "विशलिस्ट",
    "menu.trips": "यात्राएँ",
    "menu.messages": "संदेश",
    "menu.profile": "प्रोफ़ाइल",
    "menu.notifications": "सूचनाएं",
    "menu.accountSettings": "खाता सेटिंग्स",
    "menu.languagesAndCurrency": "भाषा और मुद्रा",
    "menu.helpCentre": "सहायता केंद्र",
    "menu.becomeAHost": "मेजबान बनें",
    "menu.refer": "मेजबान को रेफर करें",
    "menu.cohosts": "सह-मेजबान खोजें",
    "menu.logOut": "लॉग आउट",
    "listing.night": "रात",
    "listing.perNight": "प्रति रात",
    "listing.total": "कुल",
    "trips.title": "यात्राएँ",
    "trips.mapOut": "अपनी अगली यात्रा की योजना बनाएं",
    "trips.mapOutSubtitle":
      "यात्रा, अनुभव या सेवा बुक करने के बाद, विवरण देखने, मानचित्र देखने और घूमने के स्थानों को सहेजने के लिए यहां वापस आएं।",
    "trips.getStarted": "शुरू करें",
    "messages.title": "संदेश",
    "messages.all": "सभी",
    "messages.unread": "अपठित",
    "notifications.title": "सूचनाएं",
    "notifications.noNotifications": "अभी कोई सूचना नहीं है",
    "notifications.subtitle": "आपके पास अभी कोई नई सूचना नहीं है। अपडेट आने पर हम आपको सूचित करेंगे।",
    "booking.reserve": "आरक्षित करें",
    "booking.youWontBeCharged": "अभी आपसे कोई शुल्क नहीं लिया जाएगा",
  },
  es: {
    "nav.switchToHosting": "Hazte anfitrión",
    "nav.switchToTravelling": "Cambiar a modo viajar",
    "nav.all": "Todo",
    "nav.homes": "Alojamientos",
    "nav.experiences": "Experiencias",
    "nav.services": "Servicios",
    "search.where": "Dónde",
    "search.searchDestinations": "Explora destinos",
    "search.when": "Cuándo",
    "search.addDates": "Añade fechas",
    "search.who": "Quién",
    "search.addGuests": "Añade huéspedes",
    "search.search": "Buscar",
    "menu.wishlists": "Favoritos",
    "menu.trips": "Viajes",
    "menu.messages": "Mensajes",
    "menu.profile": "Perfil",
    "menu.notifications": "Notificaciones",
    "menu.accountSettings": "Configuración de la cuenta",
    "menu.languagesAndCurrency": "Idioma y moneda",
    "menu.helpCentre": "Centro de ayuda",
    "menu.becomeAHost": "Hazte anfitrión",
    "menu.refer": "Recomienda a un anfitrión",
    "menu.cohosts": "Busca un coanfitrión",
    "menu.logOut": "Cerrar sesión",
    "listing.night": "noche",
    "listing.perNight": "por noche",
    "listing.total": "Total",
    "trips.title": "Viajes",
    "trips.mapOut": "Planifica tu próximo viaje",
    "trips.mapOutSubtitle":
      "Cuando reserves un viaje o experiencia, vuelve aquí para ver los detalles y explorar el mapa.",
    "trips.getStarted": "Empezar",
    "messages.title": "Mensajes",
    "messages.all": "Todos",
    "messages.unread": "No leídos",
    "notifications.title": "Notificaciones",
    "notifications.noNotifications": "Aún no tienes notificaciones",
    "notifications.subtitle":
      "Tienes una pizarra en blanco (por ahora). Te avisaremos cuando lleguen actualizaciones.",
    "booking.reserve": "Reservar",
    "booking.youWontBeCharged": "Aún no se te cobrará nada",
  },
  fr: {
    "nav.switchToHosting": "Passer en mode hôte",
    "nav.switchToTravelling": "Passer en mode voyage",
    "nav.all": "Tout",
    "nav.homes": "Logements",
    "nav.experiences": "Expériences",
    "nav.services": "Services",
    "search.where": "Destination",
    "search.searchDestinations": "Rechercher une destination",
    "search.when": "Quand",
    "search.addDates": "Ajoutez des dates",
    "search.who": "Qui",
    "search.addGuests": "Ajouter des voyageurs",
    "search.search": "Rechercher",
    "menu.wishlists": "Coups de cœur",
    "menu.trips": "Voyages",
    "menu.messages": "Messages",
    "menu.profile": "Profil",
    "menu.notifications": "Notifications",
    "menu.accountSettings": "Paramètres du compte",
    "menu.languagesAndCurrency": "Langue et devise",
    "menu.helpCentre": "Centre d'aide",
    "menu.becomeAHost": "Devenir hôte",
    "menu.refer": "Parrainer un hôte",
    "menu.cohosts": "Trouver un co-hôte",
    "menu.logOut": "Déconnexion",
    "listing.night": "nuit",
    "listing.perNight": "par nuit",
    "listing.total": "Total",
    "trips.title": "Voyages",
    "trips.mapOut": "Planifiez votre prochain voyage",
    "trips.mapOutSubtitle":
      "Après avoir réservé, revenez ici pour consulter les détails et explorer la carte.",
    "trips.getStarted": "Commencer",
    "messages.title": "Messages",
    "messages.all": "Tous",
    "messages.unread": "Non lus",
    "notifications.title": "Notifications",
    "notifications.noNotifications": "Aucune notification pour le moment",
    "notifications.subtitle":
      "Rien pour l'instant. Nous vous préviendrons dès que vous aurez des nouvelles.",
    "booking.reserve": "Réserver",
    "booking.youWontBeCharged": "Vous ne serez pas encore débité",
  },
  de: {
    "nav.switchToHosting": "Gastgeber werden",
    "nav.switchToTravelling": "Als Gast reisen",
    "nav.all": "Alle",
    "nav.homes": "Unterkünfte",
    "nav.experiences": "Entdeckungen",
    "nav.services": "Services",
    "search.where": "Wohin",
    "search.searchDestinations": "Reiseziele suchen",
    "search.when": "Wann",
    "search.addDates": "Daten hinzufügen",
    "search.who": "Wer",
    "search.addGuests": "Gäste hinzufügen",
    "search.search": "Suchen",
    "menu.wishlists": "Wunschlisten",
    "menu.trips": "Reisen",
    "menu.messages": "Nachrichten",
    "menu.profile": "Profil",
    "menu.notifications": "Benachrichtigungen",
    "menu.accountSettings": "Kontoeinstellungen",
    "menu.languagesAndCurrency": "Sprache & Währung",
    "menu.helpCentre": "Hilfe-Center",
    "menu.becomeAHost": "Als Gastgeber starten",
    "menu.refer": "Einen Gastgeber werben",
    "menu.cohosts": "Co-Gastgeber finden",
    "menu.logOut": "Abmelden",
    "listing.night": "Nacht",
    "listing.perNight": "pro Nacht",
    "listing.total": "Gesamt",
    "trips.title": "Reisen",
    "trips.mapOut": "Plane deine nächste Reise",
    "trips.mapOutSubtitle":
      "Nach der Buchung findest du hier alle Details, Karten und gespeicherte Orte.",
    "trips.getStarted": "Los geht's",
    "messages.title": "Nachrichten",
    "messages.all": "Alle",
    "messages.unread": "Ungelesen",
    "notifications.title": "Benachrichtigungen",
    "notifications.noNotifications": "Noch keine Benachrichtigungen",
    "notifications.subtitle":
      "Alles sauber (fürs Erste). Wir informieren dich bei neuen Updates.",
    "booking.reserve": "Reservieren",
    "booking.youWontBeCharged": "Es wird noch nichts abgebucht",
  },
  ja: {
    "nav.switchToHosting": "ホストに切り替える",
    "nav.switchToTravelling": "旅行者に切り替える",
    "nav.all": "すべて",
    "nav.homes": "宿泊先",
    "nav.experiences": "体験",
    "nav.services": "サービス",
    "search.where": "行き先",
    "search.searchDestinations": "目的地を検索",
    "search.when": "日程",
    "search.addDates": "日程を追加",
    "search.who": "人数",
    "search.addGuests": "ゲストを追加",
    "search.search": "検索",
    "menu.wishlists": "お気に入り",
    "menu.trips": "旅行",
    "menu.messages": "メッセージ",
    "menu.profile": "プロフィール",
    "menu.notifications": "通知",
    "menu.accountSettings": "アカウント設定",
    "menu.languagesAndCurrency": "言語と通貨",
    "menu.helpCentre": "ヘルプセンター",
    "menu.becomeAHost": "お部屋を掲載",
    "menu.refer": "ホストを紹介",
    "menu.cohosts": "共同ホストを探す",
    "menu.logOut": "ログアウト",
    "listing.night": "泊",
    "listing.perNight": "1泊あたり",
    "listing.total": "合計",
    "trips.title": "旅行",
    "trips.mapOut": "次の旅を計画する",
    "trips.mapOutSubtitle":
      "宿泊先や体験を予約すると、ここに旅程とマップが表示されます。",
    "trips.getStarted": "旅をはじめる",
    "messages.title": "メッセージ",
    "messages.all": "すべて",
    "messages.unread": "未読",
    "notifications.title": "通知",
    "notifications.noNotifications": "通知はまだありません",
    "notifications.subtitle": "最新情報が届き次第、こちらでお知らせします。",
    "booking.reserve": "予約する",
    "booking.youWontBeCharged": "まだ請求されません",
  },
  zh: {
    "nav.switchToHosting": "切换至房东模式",
    "nav.switchToTravelling": "切换至旅行者模式",
    "nav.all": "全部",
    "nav.homes": "房源",
    "nav.experiences": "体验",
    "nav.services": "服务",
    "search.where": "目的地",
    "search.searchDestinations": "搜索目的地",
    "search.when": "入住退房",
    "search.addDates": "添加日期",
    "search.who": "人数",
    "search.addGuests": "添加房客",
    "search.search": "搜索",
    "menu.wishlists": "心愿单",
    "menu.trips": "行程",
    "menu.messages": "收件箱",
    "menu.profile": "个人资料",
    "menu.notifications": "通知",
    "menu.accountSettings": "账号设置",
    "menu.languagesAndCurrency": "语言与货币",
    "menu.helpCentre": "帮助中心",
    "menu.becomeAHost": "成为房东",
    "menu.refer": "推荐房东",
    "menu.cohosts": "寻找房东搭档",
    "menu.logOut": "退出登录",
    "listing.night": "晚",
    "listing.perNight": "每晚",
    "listing.total": "总价",
    "trips.title": "行程",
    "trips.mapOut": "规划您的下一趟旅程",
    "trips.mapOutSubtitle": "预订旅程或体验后，随时在这里查看详情与地图。",
    "trips.getStarted": "立即探索",
    "messages.title": "消息",
    "messages.all": "全部",
    "messages.unread": "未读",
    "notifications.title": "通知",
    "notifications.noNotifications": "暂无通知",
    "notifications.subtitle": "目前空空如也，有新动态时我们会立即通知您。",
    "booking.reserve": "预订",
    "booking.youWontBeCharged": "目前不会向您收费",
  },
  ar: {
    "nav.switchToHosting": "التبديل إلى الاستضافة",
    "nav.switchToTravelling": "التبديل إلى السفر",
    "nav.all": "الكل",
    "nav.homes": "أماكن إقامة",
    "nav.experiences": "تجارب",
    "nav.services": "خدمات",
    "search.where": "الوجهة",
    "search.searchDestinations": "البحث عن وجهات",
    "search.when": "الوقت",
    "search.addDates": "إضافة تواريخ",
    "search.who": "الضيوف",
    "search.addGuests": "إضافة ضيوف",
    "search.search": "بحث",
    "menu.wishlists": "قوائم المفضلات",
    "menu.trips": "الرحلات",
    "menu.messages": "الرسائل",
    "menu.profile": "الملف الشخصي",
    "menu.notifications": "الإشعارات",
    "menu.accountSettings": "إعدادات الحساب",
    "menu.languagesAndCurrency": "اللغات والعملة",
    "menu.helpCentre": "مركز المساعدة",
    "menu.becomeAHost": "كن مضيفاً",
    "menu.refer": "ترشيح مضيف",
    "menu.cohosts": "البحث عن مضيف مشارك",
    "menu.logOut": "تسجيل الخروج",
    "listing.night": "ليلة",
    "listing.perNight": "لكل ليلة",
    "listing.total": "المجموع",
    "trips.title": "الرحلات",
    "trips.mapOut": "خطط لرحلتك القادمة",
    "trips.mapOutSubtitle":
      "بعد حجز رحلة أو تجربة، ارجع هنا للاطلاع على التفاصيل واستكشاف الخريطة.",
    "trips.getStarted": "ابدأ الآن",
    "messages.title": "الرسائل",
    "messages.all": "الكل",
    "messages.unread": "غير مقروءة",
    "notifications.title": "الإشعارات",
    "notifications.noNotifications": "لا توجد إشعارات حتى الآن",
    "notifications.subtitle": "سوف نخطرك عند وصول أي تحديثات جديدة.",
    "booking.reserve": "حجز",
    "booking.youWontBeCharged": "لن يتم تحصيل أي مبالغ منك الآن",
  },
  it: {
    "nav.switchToHosting": "Passa alla modalità host",
    "nav.switchToTravelling": "Passa a viaggiare",
    "nav.all": "Tutti",
    "nav.homes": "Alloggi",
    "nav.experiences": "Esperienze",
    "nav.services": "Servizi",
    "search.where": "Dove",
    "search.searchDestinations": "Cerca destinazioni",
    "search.when": "Quando",
    "search.addDates": "Aggiungi date",
    "search.who": "Chi",
    "search.addGuests": "Aggiungi ospiti",
    "search.search": "Cerca",
    "menu.wishlists": "Preferiti",
    "menu.trips": "Viaggi",
    "menu.messages": "Messaggi",
    "menu.profile": "Profilo",
    "menu.notifications": "Notifiche",
    "menu.accountSettings": "Impostazioni account",
    "menu.languagesAndCurrency": "Lingue e valuta",
    "menu.helpCentre": "Centro assistenza",
    "menu.becomeAHost": "Diventa un host",
    "menu.refer": "Presenta un host",
    "menu.cohosts": "Trova un co-host",
    "menu.logOut": "Esci",
    "listing.night": "notte",
    "listing.perNight": "a notte",
    "listing.total": "Totale",
    "trips.title": "Viaggi",
    "trips.mapOut": "Organizza il tuo prossimo viaggio",
    "trips.mapOutSubtitle":
      "Dopo aver prenotato, torna qui per consultare i dettagli ed esplorare la mappa.",
    "trips.getStarted": "Inizia",
    "messages.title": "Messaggi",
    "messages.all": "Tutti",
    "messages.unread": "Non letti",
    "notifications.title": "Notifiche",
    "notifications.noNotifications": "Nessuna notifica presente",
    "notifications.subtitle": "Ti avviseremo non appena ci saranno aggiornamenti.",
    "booking.reserve": "Prenota",
    "booking.youWontBeCharged": "Non ti verrà ancora addebitato alcun importo",
  },
  pt: {
    "nav.switchToHosting": "Mudar para modo anfitrião",
    "nav.switchToTravelling": "Mudar para modo viagem",
    "nav.all": "Tudo",
    "nav.homes": "Acomodações",
    "nav.experiences": "Experiências",
    "nav.services": "Serviços",
    "search.where": "Onde",
    "search.searchDestinations": "Buscar destinos",
    "search.when": "Quando",
    "search.addDates": "Inserir datas",
    "search.who": "Quem",
    "search.addGuests": "Inserir hóspedes",
    "search.search": "Buscar",
    "menu.wishlists": "Favoritos",
    "menu.trips": "Viagens",
    "menu.messages": "Mensagens",
    "menu.profile": "Perfil",
    "menu.notifications": "Notificações",
    "menu.accountSettings": "Configurações da conta",
    "menu.languagesAndCurrency": "Idiomas e moeda",
    "menu.helpCentre": "Central de Ajuda",
    "menu.becomeAHost": "Seja um anfitrião",
    "menu.refer": "Indique um anfitrião",
    "menu.cohosts": "Encontre um coanfitrião",
    "menu.logOut": "Sair",
    "listing.night": "noite",
    "listing.perNight": "por noite",
    "listing.total": "Total",
    "trips.title": "Viagens",
    "trips.mapOut": "Planeje sua próxima viagem",
    "trips.mapOutSubtitle":
      "Depois de reservar, volte aqui para conferir detalhes e explorar o mapa.",
    "trips.getStarted": "Começar",
    "messages.title": "Mensagens",
    "messages.all": "Todas",
    "messages.unread": "Não lidas",
    "notifications.title": "Notificações",
    "notifications.noNotifications": "Nenhuma notificação por enquanto",
    "notifications.subtitle": "Avisaremos você assim que chegarem novidades.",
    "booking.reserve": "Reservar",
    "booking.youWontBeCharged": "Você ainda não será cobrado",
  },
  ru: {
    "nav.switchToHosting": "Переключиться на прием гостей",
    "nav.switchToTravelling": "Переключиться на путешествия",
    "nav.all": "Все",
    "nav.homes": "Жилье",
    "nav.experiences": "Впечатления",
    "nav.services": "Услуги",
    "search.where": "Куда",
    "search.searchDestinations": "Поиск направлений",
    "search.when": "Когда",
    "search.addDates": "Укажите даты",
    "search.who": "Кто",
    "search.addGuests": "Укажите гостей",
    "search.search": "Искать",
    "menu.wishlists": "Вишлисты",
    "menu.trips": "Поездки",
    "menu.messages": "Сообщения",
    "menu.profile": "Профиль",
    "menu.notifications": "Уведомления",
    "menu.accountSettings": "Настройки аккаунта",
    "menu.languagesAndCurrency": "Язык и валюта",
    "menu.helpCentre": "Центр помощи",
    "menu.becomeAHost": "Сдать жилье",
    "menu.refer": "Пригласить хозяина",
    "menu.cohosts": "Найти второго хозяина",
    "menu.logOut": "Выйти",
    "listing.night": "ночь",
    "listing.perNight": "за ночь",
    "listing.total": "Всего",
    "trips.title": "Поездки",
    "trips.mapOut": "Спланируйте следующую поездку",
    "trips.mapOutSubtitle":
      "После бронирования здесь появятся подробности поездки и карта.",
    "trips.getStarted": "Начать",
    "messages.title": "Сообщения",
    "messages.all": "Все",
    "messages.unread": "Непрочитанные",
    "notifications.title": "Уведомления",
    "notifications.noNotifications": "Пока нет уведомлений",
    "notifications.subtitle": "Мы сообщим вам, когда появятся обновления.",
    "booking.reserve": "Забронировать",
    "booking.youWontBeCharged": "С вас пока не спишут оплату",
  },
  tr: {
    "nav.switchToHosting": "Ev sahipliğine geç",
    "nav.switchToTravelling": "Seyahat moduna geç",
    "nav.all": "Tümü",
    "nav.homes": "Evler",
    "nav.experiences": "Deneyimler",
    "nav.services": "Hizmetler",
    "search.where": "Nereye",
    "search.searchDestinations": "Varış noktası arayın",
    "search.when": "Ne zaman",
    "search.addDates": "Tarih ekleyin",
    "search.who": "Kim",
    "search.addGuests": "Misafir ekleyin",
    "search.search": "Ara",
    "menu.wishlists": "Favoriler",
    "menu.trips": "Seyahatler",
    "menu.messages": "Mesajlar",
    "menu.profile": "Profil",
    "menu.notifications": "Bildirimler",
    "menu.accountSettings": "Hesap ayarları",
    "menu.languagesAndCurrency": "Dil ve para birimi",
    "menu.helpCentre": "Yardım Merkezi",
    "menu.becomeAHost": "Ev sahibi olun",
    "menu.refer": "Ev sahibi önerin",
    "menu.cohosts": "Yardımcı ev sahibi bulun",
    "menu.logOut": "Çıkış yap",
    "listing.night": "gece",
    "listing.perNight": "gecelik",
    "listing.total": "Toplam",
    "trips.title": "Seyahatler",
    "trips.mapOut": "Sonraki seyahatinizi planlayın",
    "trips.mapOutSubtitle":
      "Rezervasyon yaptıktan sonra detayları görmek ve haritayı keşfetmek için buraya gelin.",
    "trips.getStarted": "Başlayın",
    "messages.title": "Mesajlar",
    "messages.all": "Tümü",
    "messages.unread": "Okunmamış",
    "notifications.title": "Bildirimler",
    "notifications.noNotifications": "Henüz bildiriminiz yok",
    "notifications.subtitle": "Yeni bir güncelleme olduğunda size haber vereceğiz.",
    "booking.reserve": "Rezervasyon yapın",
    "booking.youWontBeCharged": "Henüz sizden ücret alınmayacak",
  },
};

interface LanguageCurrencyContextType {
  isModalOpen: boolean;
  activeTab: "language" | "currency";
  currentLanguage: LanguageItem;
  currentCurrency: CurrencyItem;
  isTranslationEnabled: boolean;
  openLanguageModal: () => void;
  openCurrencyModal: () => void;
  closeModal: () => void;
  setActiveTab: (tab: "language" | "currency") => void;
  setLanguage: (lang: LanguageItem) => void;
  setCurrency: (curr: CurrencyItem) => void;
  setIsTranslationEnabled: (enabled: boolean) => void;
  formatPrice: (amountInInr: number) => string;
  convertAmount: (amountInInr: number) => number;
  t: (key: string, defaultText?: string) => string;
}

const LanguageCurrencyContext = createContext<LanguageCurrencyContextType | undefined>(undefined);

export function LanguageCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"language" | "currency">("language");
  const [currentLanguage, setCurrentLanguage] = useState<LanguageItem>(ALL_LANGUAGES[0]); // English (India)
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyItem>(ALL_CURRENCIES[0]); // Indian rupee INR ₹
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("airbnb_pref_language");
      if (savedLang) {
        const parsed = JSON.parse(savedLang);
        if (parsed?.code) setCurrentLanguage(parsed);
      }
      const savedCurr = localStorage.getItem("airbnb_pref_currency");
      if (savedCurr) {
        const parsed = JSON.parse(savedCurr);
        if (parsed?.code) setCurrentCurrency(parsed);
      }
      const savedTrans = localStorage.getItem("airbnb_pref_translation");
      if (savedTrans !== null) {
        setIsTranslationEnabled(savedTrans === "true");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openLanguageModal = () => {
    setActiveTab("language");
    setIsModalOpen(true);
  };

  const openCurrencyModal = () => {
    setActiveTab("currency");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const setLanguage = (lang: LanguageItem) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem("airbnb_pref_language", JSON.stringify(lang));
    } catch (e) {
      console.error(e);
    }
  };

  const setCurrency = (curr: CurrencyItem) => {
    setCurrentCurrency(curr);
    try {
      localStorage.setItem("airbnb_pref_currency", JSON.stringify(curr));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetTranslation = (enabled: boolean) => {
    setIsTranslationEnabled(enabled);
    try {
      localStorage.setItem("airbnb_pref_translation", String(enabled));
    } catch (e) {
      console.error(e);
    }
  };

  // Convert raw amount
  const convertAmount = (amountInInr: number): number => {
    const config = CURRENCY_RATES[currentCurrency.code] || {
      rate: 0.012,
      symbol: currentCurrency.symbol || "$",
      position: "before",
    };
    return amountInInr * config.rate;
  };

  // Format price with proper symbol, currency conversion, and separators
  const formatPrice = (amountInInr: number): string => {
    const config = CURRENCY_RATES[currentCurrency.code] || {
      rate: 0.012,
      symbol: currentCurrency.symbol || "$",
      position: "before",
    };
    const converted = amountInInr * config.rate;
    let formattedNumber: string;

    if (["JPY", "KRW", "IDR", "HUF", "CLP", "COP"].includes(currentCurrency.code)) {
      formattedNumber = Math.round(converted).toLocaleString();
    } else if (currentCurrency.code === "INR") {
      formattedNumber = Math.round(amountInInr).toLocaleString("en-IN");
    } else {
      formattedNumber = Math.round(converted).toLocaleString();
    }

    return config.position === "before"
      ? `${config.symbol}${formattedNumber}`
      : `${formattedNumber} ${config.symbol}`;
  };

  // Translate key into active language
  const t = (key: string, defaultText?: string): string => {
    const langCode = currentLanguage.code.split("-")[0] || "en";
    const dict = UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS["en"];
    return dict[key] || UI_TRANSLATIONS["en"]?.[key] || defaultText || key;
  };

  return (
    <LanguageCurrencyContext.Provider
      value={{
        isModalOpen,
        activeTab,
        currentLanguage,
        currentCurrency,
        isTranslationEnabled,
        openLanguageModal,
        openCurrencyModal,
        closeModal,
        setActiveTab,
        setLanguage,
        setCurrency,
        setIsTranslationEnabled: handleSetTranslation,
        formatPrice,
        convertAmount,
        t,
      }}
    >
      {children}
    </LanguageCurrencyContext.Provider>
  );
}

export function useLanguageCurrency() {
  const context = useContext(LanguageCurrencyContext);
  if (!context) {
    throw new Error("useLanguageCurrency must be used within a LanguageCurrencyProvider");
  }
  return context;
}
