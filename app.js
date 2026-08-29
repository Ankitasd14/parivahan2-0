const ONBOARDING_VERSION = 3;

const state = {
  language: "en",
  onboarding: {
    step: "language",
    complete: false,
    selectedService: "",
    userType: "",
    userStatus: "",
    mobile: "",
    aadhaar: "",
    otpSent: false,
    otpVerified: false,
  },
  assistant: [
    {
      from: "assistant",
      text: "Tell me what happened. I will map it to the right transport service and show the next step.",
    },
  ],
  activeScenario: null,
  voiceStatus: "",
  editingRecords: false,
  notificationsOpen: false,
  flowProgress: {},
  copilotDrafts: {},
  approvedApplications: {},
  bookedSlots: {},
};

try {
  const savedSetup = JSON.parse(localStorage.getItem("parivahanSetup") || "{}");
  if (savedSetup.language) state.language = savedSetup.language;
  if (savedSetup.complete && savedSetup.version === ONBOARDING_VERSION) {
    state.onboarding = {
      ...state.onboarding,
      ...savedSetup,
      step: "done",
      complete: true,
      otpSent: false,
      otpVerified: true,
    };
  }
} catch (error) {
  localStorage.removeItem("parivahanSetup");
}

const i18n = {
  en: {
    ask: "What do you need to do today?",
    placeholder: "Try: I bought a second-hand car",
    start: "Find service",
    voice: "Voice",
    mock: "Prototype data",
  },
  hi: {
    ask: "आज आपको क्या करना है?",
    placeholder: "जैसे: मैंने पुरानी कार खरीदी है",
    start: "सेवा खोजें",
    voice: "वॉइस",
    mock: "प्रोटोटाइप डेटा",
  },
  ta: {
    ask: "இன்று நீங்கள் என்ன செய்ய வேண்டும்?",
    placeholder: "உதாரணம்: நான் பயன்படுத்திய கார் வாங்கினேன்",
    start: "சேவையை கண்டறியவும்",
    voice: "குரல்",
    mock: "மாதிரி தரவு",
  },
};

const languageOptions = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["ta", "தமிழ்"],
];

const onboardingCopy = {
  en: {
    languageTitle: "Choose your preferred language",
    languageBody: "We will use this language for the setup and keep it as your platform preference.",
    languageLabel: "Preferred language",
    continue: "Continue",
    back: "Back",
    parivahanServices: "Parivahan services",
    profileSetup: "Profile setup",
    serviceTitle: "What service are you looking for?",
    serviceBody: "Choose the closest area first. We will show the right user options and next steps after this.",
    roleTitle: "What best describes you?",
    roleBody: "This helps us show the most useful services first. You can change this later.",
    statusTitle: "Are you new to Parivahan 2.0?",
    statusBody: "New users can create a profile. Returning users can fetch linked records using OTP.",
    newUser: "I am new",
    newBody: "Create a citizen profile and link records with OTP.",
    returningUser: "I already used this before",
    returningBody: "Use OTP to fetch your saved profile and continue.",
    profileTitle: "Create your profile with OTP",
    profileBody: "No password is needed. We will verify your mobile number and Aadhaar-linked identity before showing saved services.",
    noPasswordTitle: "No password",
    noPasswordBody: "Mobile OTP and Aadhaar-linked verification only.",
    mobile: "Mobile number",
    aadhaar: "Aadhaar number",
    otp: "OTP",
    sendOtp: "Send OTP",
    verify: "Verify and enter platform",
    mockOtp: "Prototype OTP sent. Use 123456 to continue.",
    otpError: "Enter prototype OTP 123456 to continue.",
  },
  hi: {
    languageTitle: "अपनी पसंदीदा भाषा चुनें",
    languageBody: "सेटअप इसी भाषा में दिखेगा और यही आपकी प्लेटफ़ॉर्म भाषा रहेगी।",
    languageLabel: "पसंदीदा भाषा",
    continue: "आगे बढ़ें",
    back: "पीछे",
    parivahanServices: "परिवहन सेवाएँ",
    profileSetup: "प्रोफ़ाइल सेटअप",
    serviceTitle: "आप कौन सी सेवा ढूँढ रहे हैं?",
    serviceBody: "पहले सबसे नज़दीकी सेवा क्षेत्र चुनें। इसके बाद सही उपयोगकर्ता विकल्प और अगले कदम दिखेंगे।",
    roleTitle: "आप किस तरह के उपयोगकर्ता हैं?",
    roleBody: "इससे हम आपके लिए सबसे उपयोगी सेवाएँ पहले दिखा पाएंगे।",
    statusTitle: "क्या आप Parivahan 2.0 पर नए हैं?",
    statusBody: "नए उपयोगकर्ता प्रोफ़ाइल बना सकते हैं। लौटने वाले उपयोगकर्ता OTP से जुड़े रिकॉर्ड वापस ला सकते हैं।",
    newUser: "मैं नया उपयोगकर्ता हूं",
    newBody: "OTP से नागरिक प्रोफ़ाइल बनाएं और रिकॉर्ड लिंक करें।",
    returningUser: "मैंने पहले इस्तेमाल किया है",
    returningBody: "OTP से अपनी सेव की हुई प्रोफ़ाइल वापस पाएँ।",
    profileTitle: "OTP से अपनी प्रोफ़ाइल बनाएं",
    profileBody: "पासवर्ड की ज़रूरत नहीं है। सेवाएँ दिखाने से पहले मोबाइल नंबर और आधार-लिंक पहचान सत्यापित होगी।",
    noPasswordTitle: "पासवर्ड नहीं चाहिए",
    noPasswordBody: "केवल मोबाइल OTP और आधार-लिंक सत्यापन।",
    mobile: "मोबाइल नंबर",
    aadhaar: "आधार नंबर",
    otp: "OTP",
    sendOtp: "OTP भेजें",
    verify: "सत्यापित करें और आगे बढ़ें",
    mockOtp: "प्रोटोटाइप OTP भेजा गया। आगे बढ़ने के लिए 123456 डालें।",
    otpError: "आगे बढ़ने के लिए प्रोटोटाइप OTP 123456 डालें।",
  },
  ta: {
    languageTitle: "உங்கள் விருப்ப மொழியைத் தேர்வு செய்யுங்கள்",
    languageBody: "அமைப்பும் தளத்தின் மொழி விருப்பமும் இந்த மொழியில் இருக்கும்.",
    languageLabel: "விருப்ப மொழி",
    continue: "தொடரவும்",
    back: "பின்செல்லவும்",
    parivahanServices: "பரிவாஹன் சேவைகள்",
    profileSetup: "சுயவிவர அமைப்பு",
    serviceTitle: "நீங்கள் எந்த சேவையைத் தேடுகிறீர்கள்?",
    serviceBody: "முதலில் உங்களுக்கு பொருத்தமான சேவை பகுதியைத் தேர்வு செய்யுங்கள். அதன் பிறகு பயனர் வகையும் அடுத்த படிகளும் காட்டப்படும்.",
    roleTitle: "உங்களைச் சிறப்பாக விவரிக்கும் தேர்வு எது?",
    roleBody: "உங்களுக்கு தேவையான சேவைகளை முதலில் காட்ட இது உதவும்.",
    statusTitle: "Parivahan 2.0-க்கு நீங்கள் புதியவரா?",
    statusBody: "புதிய பயனர்கள் சுயவிவரம் உருவாக்கலாம். திரும்பும் பயனர்கள் OTP மூலம் பதிவுகளை பெறலாம்.",
    newUser: "நான் புதிய பயனர்",
    newBody: "OTP மூலம் குடிமக்கள் சுயவிவரத்தை உருவாக்கி பதிவுகளை இணைக்கவும்.",
    returningUser: "நான் முன்பு பயன்படுத்தியுள்ளேன்",
    returningBody: "OTP மூலம் சேமிக்கப்பட்ட சுயவிவரத்தை மீட்டெடுத்து தொடரவும்.",
    profileTitle: "OTP மூலம் சுயவிவரம் உருவாக்குங்கள்",
    profileBody: "கடவுச்சொல் தேவையில்லை. சேவைகளை காட்டும் முன் மொபைல் எண் மற்றும் ஆதார்-இணைக்கப்பட்ட அடையாளம் சரிபார்க்கப்படும்.",
    noPasswordTitle: "கடவுச்சொல் தேவையில்லை",
    noPasswordBody: "மொபைல் OTP மற்றும் ஆதார்-இணைக்கப்பட்ட சரிபார்ப்பு மட்டும்.",
    mobile: "மொபைல் எண்",
    aadhaar: "ஆதார் எண்",
    otp: "OTP",
    sendOtp: "OTP அனுப்பு",
    verify: "சரிபார்த்து தளத்திற்குள் செல்லவும்",
    mockOtp: "மாதிரி OTP அனுப்பப்பட்டது. தொடர 123456 பயன்படுத்தவும்.",
    otpError: "தொடர மாதிரி OTP 123456-ஐ உள்ளிடவும்.",
  },
};

const serviceEntryOptions = [
  {
    id: "licence",
    icon: "licence",
    href: "/sarathi",
    labels: { en: "Driving licence services", hi: "ड्राइविंग लाइसेंस सेवाएँ", ta: "ஓட்டுநர் உரிமச் சேவைகள்" },
    bodies: { en: "Learner licence, permanent DL, renewal, duplicate, address change, IDP and class changes.", hi: "लर्नर लाइसेंस, स्थायी DL, नवीनीकरण, डुप्लिकेट, पता बदलाव, IDP और वाहन वर्ग बदलाव।", ta: "லெர்னர் உரிமம், நிரந்தர DL, புதுப்பிப்பு, நகல், முகவரி மாற்றம், IDP மற்றும் வாகன வகை மாற்றங்கள்." },
  },
  {
    id: "vehicle",
    icon: "car",
    href: "/vahan",
    labels: { en: "Vehicle and RC services", hi: "वाहन और RC सेवाएँ", ta: "வாகன மற்றும் RC சேவைகள்" },
    bodies: { en: "Registration, transfer of ownership, duplicate RC, address change, NOC and hypothecation.", hi: "पंजीकरण, स्वामित्व ट्रांसफर, डुप्लिकेट RC, पता बदलाव, NOC और हाइपोथिकेशन।", ta: "பதிவு, உரிமை மாற்றம், நகல் RC, முகவரி மாற்றம், NOC மற்றும் கடன் பதிவு சேவைகள்." },
  },
  {
    id: "commercial",
    icon: "truck",
    href: "/services/permit-fitness",
    labels: { en: "Permit, fitness and commercial vehicle", hi: "परमिट, फिटनेस और वाणिज्यिक वाहन", ta: "அனுமதி, தகுதிச் சான்று மற்றும் வர்த்தக வாகனம்" },
    bodies: { en: "Fitness certificate, permit renewal, national permit, badge and commercial compliance.", hi: "फिटनेस प्रमाणपत्र, परमिट नवीनीकरण, राष्ट्रीय परमिट, बैज और वाणिज्यिक अनुपालन।", ta: "தகுதிச் சான்று, அனுமதி புதுப்பிப்பு, தேசிய அனுமதி, பேட்ஜ் மற்றும் வர்த்தக வாகன இணக்கம்." },
  },
  {
    id: "payments",
    icon: "wallet",
    href: "/payments",
    labels: { en: "Tax, fees and payments", hi: "टैक्स, फीस और भुगतान", ta: "வரி, கட்டணம் மற்றும் பணப்பரிவர்த்தனை" },
    bodies: { en: "Vehicle tax, application fee, retest fee, check-post tax, pending payment and receipts.", hi: "वाहन टैक्स, आवेदन फीस, रीटेस्ट फीस, चेक-पोस्ट टैक्स, पेंडिंग भुगतान और रसीदें।", ta: "வாகன வரி, விண்ணப்ப கட்டணம், மறுதேர்வு கட்டணம், சோதனைச் சாவடி வரி, நிலுவை பணம் மற்றும் ரசீதுகள்." },
  },
  {
    id: "challans",
    icon: "receipt",
    href: "/challans",
    labels: { en: "Challans and traffic fines", hi: "चालान और ट्रैफिक जुर्माना", ta: "சலான் மற்றும் போக்குவரத்து அபராதம்" },
    bodies: { en: "Check challan, understand the violation, pay safely or find the next action.", hi: "चालान देखें, उल्लंघन समझें, सुरक्षित भुगतान करें या अगला कदम जानें।", ta: "சலானை பார்க்கவும், விதிமீறலைப் புரிந்துகொள்ளவும், பாதுகாப்பாக செலுத்தவும் அல்லது அடுத்த படியை அறியவும்." },
  },
  {
    id: "applications",
    icon: "documents",
    href: "/applications",
    labels: { en: "Applications, documents and dispatch", hi: "आवेदन, दस्तावेज और डिस्पैच", ta: "விண்ணப்பங்கள், ஆவணங்கள் மற்றும் அனுப்புதல் நிலை" },
    bodies: { en: "Upload documents, find application number, print receipt, track approval and delivery.", hi: "दस्तावेज अपलोड करें, आवेदन नंबर ढूँढें, रसीद प्रिंट करें, मंजूरी और डिलीवरी ट्रैक करें।", ta: "ஆவணங்களை பதிவேற்றவும், விண்ணப்ப எண்ணைக் கண்டறியவும், ரசீது அச்சிடவும், அங்கீகாரம் மற்றும் விநியோகத்தை கண்காணிக்கவும்." },
  },
  {
    id: "dealer",
    icon: "dealer",
    href: "/services/dealer-trade",
    labels: { en: "Dealer and trade certificate", hi: "डीलर और ट्रेड प्रमाणपत्र", ta: "டீலர் மற்றும் வர்த்தகச் சான்று" },
    bodies: { en: "Dealer authorization, trade certificate and business registration support.", hi: "डीलर अनुमति, ट्रेड प्रमाणपत्र और व्यवसाय पंजीकरण सहायता।", ta: "டீலர் அங்கீகாரம், வர்த்தகச் சான்று மற்றும் வணிகப் பதிவு உதவி." },
  },
  {
    id: "maker",
    icon: "factory",
    href: "/services/homologation",
    labels: { en: "Maker, homologation and approvals", hi: "निर्माता, होमोलोगेशन और अनुमोदन", ta: "உற்பத்தியாளர், homologation மற்றும் அனுமதிகள்" },
    bodies: { en: "Homologation, VLTD, SLD, CNG maker and manufacturer services.", hi: "होमोलोगेशन, VLTD, SLD, CNG निर्माता और अन्य निर्माता सेवाएँ।", ta: "Homologation, VLTD, SLD, CNG உற்பத்தியாளர் மற்றும் பிற உற்பத்தியாளர் சேவைகள்." },
  },
  {
    id: "other",
    icon: "help",
    href: "/assistant",
    labels: { en: "Other or I am not sure", hi: "अन्य या मुझे पता नहीं है", ta: "மற்றவை / எனக்கு உறுதி இல்லை" },
    bodies: { en: "Ask the assistant in your own words and it will take you to the right service.", hi: "असिस्टेंट से अपनी भाषा में पूछें, वह आपको सही सेवा तक ले जाएगा।", ta: "உங்கள் சொற்களில் உதவியாளரிடம் கேளுங்கள்; அது சரியான சேவைக்கு அழைத்துச் செல்லும்." },
  },
];

const userTypes = [
  {
    id: "private-owner",
    icon: "car",
    labels: { en: "Private vehicle owner", hi: "निजी वाहन मालिक", ta: "தனியார் வாகன உரிமையாளர்" },
    bodies: { en: "RC, PUCC, tax, insurance, challans and ownership work.", hi: "RC, PUCC, टैक्स, बीमा, चालान और स्वामित्व सेवाएँ।", ta: "RC, PUCC, வரி, காப்பீடு, சலான் மற்றும் உரிமை மாற்ற சேவைகள்." },
  },
  {
    id: "private-driver",
    icon: "steering",
    labels: { en: "Private car driver", hi: "निजी कार चालक", ta: "தனியார் கார் ஓட்டுநர்" },
    bodies: { en: "Driving licence renewal, duplicate, address change and IDP.", hi: "DL नवीनीकरण, डुप्लिकेट DL, पता बदलाव और IDP।", ta: "DL புதுப்பிப்பு, நகல் DL, முகவரி மாற்றம் மற்றும் IDP." },
  },
  {
    id: "two-wheeler",
    icon: "bike",
    labels: { en: "Two-wheeler rider", hi: "दोपहिया चालक", ta: "இருசக்கர ஓட்டுநர்" },
    bodies: { en: "Licence class, RC, PUCC, challan and transfer support.", hi: "लाइसेंस वर्ग, RC, PUCC, चालान और ट्रांसफर सहायता।", ta: "உரிம வகை, RC, PUCC, சலான் மற்றும் மாற்ற உதவி." },
  },
  {
    id: "learner",
    icon: "road",
    labels: { en: "Learner or new driver", hi: "लर्नर या नया चालक", ta: "புதிய ஓட்டுநர் / கற்றுக்கொள்பவர்" },
    bodies: { en: "Learner licence, road rules, test booking and permanent DL.", hi: "लर्नर लाइसेंस, सड़क नियम, टेस्ट बुकिंग और स्थायी DL।", ta: "லெர்னர் உரிமம், சாலை விதிகள், தேர்வு முன்பதிவு மற்றும் நிரந்தர DL." },
  },
  {
    id: "heavy-driver",
    icon: "truck",
    labels: { en: "Heavy or commercial driver", hi: "भारी या वाणिज्यिक वाहन चालक", ta: "கனரக / வர்த்தக வாகன ஓட்டுநர்" },
    bodies: { en: "Transport class, badge, medical certificate, fitness and permits.", hi: "ट्रांसपोर्ट वर्ग, बैज, मेडिकल प्रमाणपत्र, फिटनेस और परमिट।", ta: "போக்குவரத்து வாகன வகை, பேட்ஜ், மருத்துவச் சான்று, தகுதி மற்றும் அனுமதி." },
  },
  {
    id: "operator",
    icon: "fleet",
    labels: { en: "Transport operator", hi: "परिवहन ऑपरेटर", ta: "போக்குவரத்து இயக்குநர்" },
    bodies: { en: "Permit, fitness, tax, national permit and fleet compliance.", hi: "परमिट, फिटनेस, टैक्स, राष्ट्रीय परमिट और फ्लीट अनुपालन।", ta: "அனுமதி, தகுதி, வரி, தேசிய அனுமதி மற்றும் வாகனக் குழு இணக்கம்." },
  },
  {
    id: "dealer",
    icon: "store",
    labels: { en: "Dealer or trade user", hi: "डीलर या ट्रेड उपयोगकर्ता", ta: "டீலர் / வர்த்தக பயனர்" },
    bodies: { en: "Dealer authorization, trade certificate and registration support.", hi: "डीलर अनुमति, ट्रेड प्रमाणपत्र और पंजीकरण सहायता।", ta: "டீலர் அங்கீகாரம், வர்த்தகச் சான்று மற்றும் பதிவு உதவி." },
  },
  {
    id: "maker",
    icon: "factory",
    labels: { en: "Manufacturer or maker", hi: "निर्माता या मेकर", ta: "உற்பத்தியாளர் / மேக்கர்" },
    bodies: { en: "Homologation, VLTD, SLD, CNG maker and approval services.", hi: "होमोलोगेशन, VLTD, SLD, CNG निर्माता और अनुमोदन सेवाएँ।", ta: "Homologation, VLTD, SLD, CNG உற்பத்தியாளர் மற்றும் அனுமதி சேவைகள்." },
  },
];

const citizen = {
  name: "Ankita Sharma",
  preferredLanguage: "English",
  phoneMasked: "+91 ******4821",
};

const services = [
  {
    id: "transfer-ownership",
    label: "Transfer a vehicle to a new owner",
    officialName: "Transfer of Ownership",
    category: "Vehicle",
    summary: "Use this when a vehicle has been bought, sold, inherited, or otherwise changed ownership.",
    eligibility: "Vehicle record and parties must be verified. State requirements may differ.",
    documents: ["Registration certificate", "Buyer and seller identity proof", "Address proof", "Insurance", "PUCC"],
    feeSource: "Mock fee range. Validate with state/RTO source before production.",
    time: "20 to 30 minutes online, plus RTO verification where required",
    visit: "May be required for verification or document review",
    steps: ["Confirm vehicle", "Add buyer and seller details", "Upload documents", "Pay fee", "Track verification"],
    match: ["bought", "second", "used", "transfer", "sold", "ownership", "buyer", "seller"],
  },
  {
    id: "duplicate-rc",
    label: "Get a replacement RC",
    officialName: "Duplicate Registration Certificate",
    category: "Vehicle",
    summary: "Use this when your registration certificate is lost, damaged, or stolen.",
    eligibility: "Vehicle ownership must be verified. Police report may be required by state rules.",
    documents: ["Vehicle registration number", "Identity proof", "Address proof", "Police report where applicable"],
    feeSource: "Mock fee. Production must pull authoritative state fee data.",
    time: "15 to 25 minutes online",
    visit: "Usually not required unless verification is requested",
    steps: ["Identify vehicle", "Confirm reason", "Upload documents", "Pay fee", "Receive application ID"],
    match: ["lost rc", "duplicate", "replacement", "rc lost", "damaged rc", "rc", "lost", "stolen"],
  },
  {
    id: "dl-renewal",
    label: "Renew my driving licence",
    officialName: "Driving Licence Renewal",
    category: "Driving Licence",
    summary: "Use this when your driving licence is expiring or has recently expired.",
    eligibility: "Renewal window and medical requirements depend on age and licence class.",
    documents: ["Driving licence", "Identity proof", "Address proof", "Medical certificate if applicable"],
    feeSource: "Mock fee. Validate by state and licence class.",
    time: "20 minutes online",
    visit: "RTO visit or appointment may be required by state, expiry age and licence class",
    steps: ["Select state", "Open services on driving licence", "Enter DL number and date of birth", "Fetch licence details", "Choose renewal", "Fill renewal form", "Upload documents if required", "Pay fee", "Book appointment or visit RTO if required", "Print receipt and track"],
    match: ["licence", "license", "renew", "expire", "dl"],
  },
  {
    id: "challan-status",
    label: "Check and understand a challan",
    officialName: "eChallan Status and Payment",
    category: "Challans",
    summary: "View pending challans, understand the violation, and choose payment or issue-raising options.",
    eligibility: "Requires vehicle number or challan number. Sensitive details require authentication.",
    documents: ["Vehicle number or challan number", "Mobile OTP where required"],
    feeSource: "Penalty must come from official eChallan record.",
    time: "5 to 10 minutes",
    visit: "Not required for most online payments",
    steps: ["Find challan", "Explain violation", "Review official amount", "Pay or raise issue", "Download receipt"],
    match: ["challan", "fine", "penalty", "traffic", "violation"],
  },
  {
    id: "change-address",
    label: "Update address after moving",
    officialName: "Address Change / NOC as applicable",
    category: "Life event",
    summary: "Tell the assistant where you moved so it can identify whether RC, DL, NOC, or RTO actions apply.",
    eligibility: "Depends on current state, destination state, vehicle category, and record type.",
    documents: ["Address proof", "RC or DL record", "NOC where applicable"],
    feeSource: "State-specific official source required.",
    time: "15 to 35 minutes depending on records",
    visit: "May be required if state/RTO transfer applies",
    steps: ["Describe move", "Select affected records", "Check state rules", "Prepare documents", "Start applications"],
    match: ["moved", "address", "city", "state", "shifted", "relocated"],
  },
  {
    id: "pay-tax-fee",
    label: "Pay vehicle tax or government fee",
    officialName: "Tax / Fee Services",
    category: "Payments",
    summary: "Review a fee breakdown, avoid duplicate payments, and recover pending payment status.",
    eligibility: "Amount and due date must come from the official vehicle or application record.",
    documents: ["Vehicle or application number", "Mobile OTP where required"],
    feeSource: "Authoritative fee source required before live payment.",
    time: "5 to 10 minutes",
    visit: "Not required for most online payments",
    steps: ["Find record", "Review government fee and service charge", "Confirm total", "Pay", "Download receipt"],
    match: ["pay", "payment", "tax", "fee", "receipt", "pending payment"],
  },
  {
    id: "permit-fitness",
    label: "Renew permit or fitness",
    officialName: "Permit / Fitness Services",
    category: "Commercial",
    summary: "For transport operators who need permit, fitness, tax, or compliance actions.",
    eligibility: "Depends on vehicle category, permit type, state rules, and linked records.",
    documents: ["Registration certificate", "Insurance", "PUCC", "Existing permit", "Fitness certificate"],
    feeSource: "State and vehicle-class fee source required.",
    time: "20 to 40 minutes",
    visit: "May be required for inspection",
    steps: ["Select vehicle", "Check compliance", "Prepare documents", "Book inspection if required", "Track renewal"],
    match: ["permit", "fitness", "commercial", "operator", "inspection"],
  },
  {
    id: "learner-licence",
    label: "Start as a new learner",
    officialName: "Learner Licence",
    category: "Driving Licence",
    summary: "Learn rules, prepare documents, apply, and track test or appointment steps.",
    eligibility: "Age, vehicle class, and state-specific requirements must be verified.",
    documents: ["Identity proof", "Address proof", "Age proof", "Photo where required"],
    feeSource: "State and class fee source required.",
    time: "20 minutes online plus learning time",
    visit: "Appointment or test may be required",
    steps: ["Learn key rules", "Check eligibility", "Prepare documents", "Apply", "Book test if required"],
    match: ["learner", "learning", "new driver", "first licence", "test prep"],
  },
  {
    id: "noc-move",
    label: "Get an NOC to move a vehicle",
    officialName: "No Objection Certificate",
    category: "Vehicle",
    summary: "Use this when a vehicle needs to move or register elsewhere and an NOC may apply.",
    eligibility: "Depends on source state, destination state, vehicle record, and pending issues.",
    documents: ["Registration certificate", "Insurance", "PUCC", "Address proof", "Challan clearance where required"],
    feeSource: "State-specific source required.",
    time: "15 to 30 minutes",
    visit: "May be required for verification",
    steps: ["Confirm move", "Check pending issues", "Prepare documents", "Apply", "Track approval"],
    match: ["noc", "move vehicle", "register elsewhere", "another state"],
  },
  {
    id: "add-vehicle-class",
    label: "Add another vehicle category to your licence",
    officialName: "Addition of Class of Vehicle",
    category: "Driving Licence",
    summary: "Use this when you already have a licence and need another class, such as transport vehicle or two-wheeler.",
    eligibility: "Existing licence, age, training and test requirements depend on the requested class.",
    documents: ["Existing driving licence", "Identity proof", "Training certificate where required", "Medical certificate where required"],
    feeSource: "State and vehicle-class source required.",
    time: "20 to 35 minutes plus test or appointment where required",
    visit: "Usually required for test or verification",
    steps: ["Choose class", "Check eligibility", "Prepare documents", "Book test if required", "Track endorsement"],
    match: ["add class", "vehicle class", "transport licence", "endorsement"],
  },
];

const officialServiceAdditions = [
  ["rc-renewal", "Renew registration certificate", "Renewal of Registration", "Vehicle", "Renew an expiring vehicle registration and track RTO approval.", ["registration renewal", "renew rc", "rc renewal"]],
  ["rc-address-change", "Change address on RC", "Change of Address in RC", "Vehicle", "Update the address linked to a vehicle record.", ["rc address", "change address rc", "vehicle address"]],
  ["hypothecation-add", "Add bank or loan details to RC", "Hypothecation Addition", "Vehicle", "Add financier details when a vehicle is under loan.", ["hypothecation add", "loan rc", "bank details"]],
  ["hypothecation-terminate", "Remove bank or loan details from RC", "Hypothecation Termination", "Vehicle", "Remove financier details after loan closure.", ["hypothecation terminate", "loan closed", "remove bank"]],
  ["fitness-certificate", "Apply for vehicle fitness", "Fitness Certificate", "Vehicle", "Book inspection and track fitness certificate issuance.", ["fitness certificate", "vehicle fitness"]],
  ["duplicate-fitness", "Get duplicate fitness certificate", "Duplicate Fitness Certificate", "Vehicle", "Request a replacement fitness certificate.", ["duplicate fitness", "lost fitness"]],
  ["national-permit", "Apply for national permit", "National Permit", "Commercial", "Apply, renew or track national permit actions.", ["national permit", "all india permit", "tourist permit"]],
  ["checkpost-tax", "Pay check-post tax", "Checkpost Tax", "Payments", "Pay temporary state entry or check-post tax where applicable.", ["checkpost", "border tax", "entry tax"]],
  ["fancy-number", "Book a fancy number", "Fancy Number Booking", "Vehicle", "Search, reserve and track preferred registration numbers.", ["fancy number", "choice number", "special number"]],
  ["pucc", "Renew pollution certificate", "PUCC", "Vehicle", "Find renewal status and prepare for PUCC renewal.", ["pucc", "pollution certificate", "emission"]],
  ["vehicle-recall", "Check vehicle recall", "Vehicle Recall", "Vehicle", "Check whether a vehicle has an active recall notice.", ["recall", "vehicle recall"]],
  ["vehicle-scrap", "Scrap a vehicle", "Vehicle Scrapping", "Vehicle", "Start scrapping, certificate and record update guidance.", ["scrap", "scrapping", "end of life vehicle"]],
  ["duplicate-dl", "Get a duplicate driving licence", "Duplicate Driving Licence", "Driving Licence", "Replace a lost or damaged driving licence.", ["duplicate dl", "lost licence", "lost license"]],
  ["permanent-dl", "Apply for permanent driving licence", "Permanent Driving Licence", "Driving Licence", "Move from learner licence to permanent licence and book a test.", ["permanent dl", "driving test"]],
  ["idp", "Apply for international driving permit", "International Driving Permit", "Driving Licence", "Prepare documents and apply for an international driving permit.", ["idp", "international permit"]],
  ["dl-extract", "Get driving licence extract", "DL Extract", "Driving Licence", "Download or request an extract of licence details.", ["dl extract", "licence extract"]],
  ["dl-address-change", "Change address on driving licence", "Change of Address in DL", "Driving Licence", "Update address linked to your licence.", ["dl address", "licence address", "license address"]],
  ["public-service-badge", "Apply for public service badge", "Public Service Badge", "Driving Licence", "Apply for a badge where required for public service vehicles.", ["badge", "public service badge"]],
  ["surrender-class", "Remove a vehicle class from licence", "Surrender Class of Vehicle", "Driving Licence", "Surrender one class/category from an existing licence.", ["surrender class", "remove class"]],
  ["retest-fee", "Pay retest fee", "Retest Fee", "Payments", "Pay fee after a failed or rescheduled test where applicable.", ["retest", "test fee"]],
  ["find-application", "Find lost application number", "Application Number Search", "Applications", "Recover an application reference using verified details.", ["lost application", "find application"]],
  ["dispatch-track", "Track document dispatch", "Dispatch Tracking", "Applications", "Track printed DL, RC or certificate dispatch where available.", ["dispatch", "post tracking", "document delivery"]],
  ["dealer-trade", "Dealer and trade certificate services", "Dealer Authorization / Trade Certificate", "Government", "Business-facing dealer authorization and trade certificate services.", ["dealer", "trade certificate"]],
  ["homologation", "Homologation and maker services", "Homologation / Maker Services", "Government", "Manufacturer-facing homologation, VLTD, SLD and CNG maker services.", ["homologation", "vltd", "sld", "cng maker"]],
];

services.push(
  ...officialServiceAdditions.map(([id, label, officialName, category, summary, match]) => ({
    id,
    label,
    officialName,
    category,
    summary,
    eligibility: "Eligibility and availability depend on state, RTO, record status and service configuration.",
    documents: ["Record number", "Identity proof where required", "Address or supporting proof where required", "Service-specific document"],
    feeSource: "Official fee must be fetched from the configured government source before payment.",
    time: "Varies by state and service",
    visit: "Shown after state/RTO and service availability checks",
    steps: ["Choose state and RTO", "Find record", "Verify with OTP", "Enter details", "Upload documents", "Review fee", "Book appointment if needed", "Track application"],
    match,
  }))
);

const mobility = {
  vehicles: [
    { registrationNumber: "MH12 AB 4921", make: "Maruti", model: "Baleno", rto: "Pune", pucc: "Expires in 18 days", tax: "Paid", challans: "1 pending" },
    { registrationNumber: "DL04 CT 7810", make: "Honda", model: "Activa", rto: "Delhi West", pucc: "All good", tax: "Paid", challans: "None" },
  ],
  licence: { number: "DL-*********248", classes: "LMV, MCWG", expiry: "Renewal window opens soon", status: "Action recommended" },
};

const applications = [
  {
    id: "APP-2026-0817",
    service: "Transfer a vehicle to a new owner",
    status: "Waiting for RTO action",
    nextAction: "RTO verification is in progress",
    timeline: [
      ["Started", "done"], ["Information completed", "done"], ["Documents submitted", "done"], ["Payment completed", "done"],
      ["Verification", "current"], ["Approved / rejected", "pending"], ["Document issued", "pending"],
    ],
  },
  {
    id: "APP-2026-0804",
    service: "Driving Licence Renewal",
    status: "Document required",
    nextAction: "Upload medical certificate if applicable",
    timeline: [
      ["Started", "done"], ["Information completed", "done"], ["Documents submitted", "current"], ["Payment completed", "pending"],
      ["Appointment", "pending"], ["Document issued", "pending"],
    ],
  },
];

const notifications = [
  ["PUCC expiry", "Your PUCC for MH12 AB 4921 expires in 18 days.", "Renew or find a centre"],
  ["Challan", "One challan is pending for MH12 AB 4921.", "View challan"],
  ["Application", "APP-2026-0804 needs an additional document.", "Upload"],
  ["Appointment", "Your RTO appointment is tomorrow at 10:30 AM.", "View appointment"],
];

const personalNotifications = [
  { type: "Renewal", title: "PUCC expires in 18 days", body: "MH12 AB 4921 needs PUCC renewal soon.", action: "Renew", href: "/services/pucc", tone: "warn" },
  { type: "Application", title: "Document upload pending", body: "DL renewal is waiting for one file.", action: "Upload", href: "/applications", tone: "info" },
  { type: "Challan", title: "One challan needs review", body: "Check the violation details before payment.", action: "View", href: "/services/challan-status", tone: "warn" },
];

const governmentUpdates = [
  {
    id: "helmet-safety",
    type: "Safety regulation",
    title: "Helmet and seatbelt safety reminder",
    body: "Review safety guidance for two-wheeler riders, passengers and vehicle occupants.",
    detail: "This update explains why helmet and seatbelt compliance matters, what users should check before travel, and how the platform can remind families and fleet operators about safety requirements. Production content should link to the latest official MoRTH or state notification.",
  },
  {
    id: "document-digital",
    type: "Digital documents",
    title: "Carry verified digital documents",
    body: "Keep licence, RC, insurance and PUCC available in approved digital form where accepted.",
    detail: "This update helps citizens understand which transport documents should be kept ready, when originals may still be required, and how linked records can reduce confusion during renewal, challan or verification journeys.",
  },
  {
    id: "renewal-window",
    type: "Renewal update",
    title: "Check renewal windows before expiry",
    body: "Licence, PUCC, fitness and permit timelines can vary by record type and state.",
    detail: "This update reminds users to verify renewal windows early, especially for driving licence renewal, fitness certificate, permit, PUCC and commercial vehicle records. The platform should always show state/RTO-specific deadlines before submission.",
  },
];

const rtos = [
  { id: "pune", name: "Pune RTO", city: "Pune", address: "Sangam Bridge, Pune", services: "DL test, RC, tax, permit, fitness", hours: "10:00 AM to 5:00 PM", distance: "3.8 km", slots: ["03 Sep, 10:30 AM", "04 Sep, 12:00 PM", "06 Sep, 09:45 AM"] },
  { id: "delhi-west", name: "Delhi West RTO", city: "Delhi", address: "Janakpuri, New Delhi", services: "DL test, RC, challan help", hours: "9:30 AM to 4:30 PM", distance: "6.1 km", slots: ["02 Sep, 11:15 AM", "05 Sep, 01:30 PM", "08 Sep, 10:00 AM"] },
  { id: "bengaluru-central", name: "Bengaluru Central RTO", city: "Bengaluru", address: "Koramangala, Bengaluru", services: "DL test, RC, appointments", hours: "10:00 AM to 5:30 PM", distance: "5.4 km", slots: ["03 Sep, 02:15 PM", "07 Sep, 10:45 AM", "09 Sep, 12:30 PM"] },
];

const visitPrep = {
  drivingTest: {
    title: "Driving test visit preparation",
    documents: ["Learner licence", "Application acknowledgement", "Fee receipt", "Identity proof", "Address proof", "Original documents", "Vehicle with valid insurance and PUCC"],
    notes: ["Reach 20-30 minutes early for verification.", "Carry originals even if uploads were completed online.", "Use the same vehicle class selected in the application.", "Do not make duplicate payment if status is pending."],
  },
  inspection: {
    title: "RTO inspection preparation",
    documents: ["Registration certificate", "Insurance", "PUCC", "Tax/fee receipt", "Permit or fitness document where applicable", "Original identity proof"],
    notes: ["Bring the vehicle in clean and inspectable condition.", "Confirm chassis/engine details are readable.", "Carry any defect correction proof if asked earlier."],
  },
};

const roadModules = [
  ["Road signs", "Learn priority, caution, and mandatory signs in plain language."],
  ["Right of way", "Practice everyday junction and pedestrian situations."],
  ["Rain and night driving", "Understand speed, visibility, and safe following distance."],
  ["Emergency vehicles", "Know how to safely make way."],
];

const taskCards = [
  { title: "Vehicle work", body: "RC, transfer, tax, PUCC and documents.", href: "/my-mobility", tone: "mint", meta: "Most used" },
  { title: "Driving licence", body: "Renew, learn, prepare and track.", href: "/services/dl-renewal", tone: "blue", meta: "Due soon" },
  { title: "Challans", body: "Check, understand and pay safely.", href: "/services/challan-status", tone: "peach", meta: "1 pending" },
  { title: "Applications", body: "See what happened and what is next.", href: "/applications", tone: "lilac", meta: "2 active" },
];

const nextActions = [
  { title: "Renew PUCC", body: "Expires in 18 days for MH12 AB 4921.", action: "Start", href: "/my-mobility", tone: "warn" },
  { title: "Upload document", body: "DL renewal is waiting for one file.", action: "Upload", href: "/applications", tone: "info" },
  { title: "Review challan", body: "One pending challan needs attention.", action: "View", href: "/services/challan-status", tone: "warn" },
];

const driverScoreBreakdown = [
  ["Document readiness", 92, "Licence, RC and proof documents are mostly ready."],
  ["Renewal health", 84, "PUCC and licence renewal need attention soon."],
  ["Challan status", 72, "One challan is still pending review."],
  ["Road learning", 88, "Scenario practice is strong; right of way is next."],
];

const serviceHubs = [
  { title: "Vehicle services", body: "RC, transfer, NOC, hypothecation, fitness, permit, tax, PUCC and number booking.", href: "/vahan", tone: "mint", meta: "VAHAN" },
  { title: "Licence services", body: "Learner, permanent DL, renewal, duplicate, address change, IDP, extracts and class changes.", href: "/sarathi", tone: "blue", meta: "SARATHI" },
  { title: "Payments and challans", body: "Fees, tax, challan, retest fee, pending status, receipt and recovery.", href: "/payments", tone: "peach", meta: "Pay and recover" },
  { title: "Support and documents", body: "RTO finder, forms, uploads, show-me assistance, dispatch and help.", href: "/platform", tone: "lilac", meta: "Help" },
];

const commonJourneys = [
  { title: "Renew my driving licence", body: "Check renewal window, medical form, fee, appointment and tracking.", href: "/services/dl-renewal", tone: "blue" },
  { title: "Transfer vehicle ownership", body: "Buyer, seller, documents, fee and RTO verification in one flow.", href: "/services/transfer-ownership", tone: "mint" },
  { title: "Replace lost RC or DL", body: "Find the right duplicate document flow and what proof may be needed.", href: "/services/duplicate-rc", tone: "peach" },
  { title: "Pay challan or fee", body: "Check official amount, avoid duplicate payment and print receipt.", href: "/payments", tone: "lilac" },
];

const confidenceRows = [
  ["Documents", "Know what to upload, what to carry, and when a medical certificate or police report may be needed.", "/documents"],
  ["Payments", "See government fee, service charge, pending status and receipt recovery before retrying.", "/payments"],
  ["Appointments", "Book a slot only when a test, inspection, biometrics or RTO verification is needed.", "/rto"],
];

const officialFlow = [
  {
    title: "Choose state and RTO",
    body: "The platform asks where the record belongs before showing service availability.",
    fields: ["State", "RTO / registering authority"],
    status: "Required",
  },
  {
    title: "Find the record",
    body: "Enter vehicle number, DL number, LL number, application number or challan number.",
    fields: ["Record number", "Last 5 chassis digits or date of birth where required"],
    status: "Required",
  },
  {
    title: "Verify identity",
    body: "Sensitive records require OTP, eKYC or other approved authentication.",
    fields: ["Masked mobile", "OTP"],
    status: "Secure",
  },
  {
    title: "Complete details",
    body: "Only the fields needed for the selected service are shown, with examples and autosave.",
    fields: ["Applicant details", "Service reason", "Address / financier / class details"],
    status: "Guided",
  },
  {
    title: "Upload and confirm documents",
    body: "Document Copilot checks type and extracts fields, but the user confirms every value.",
    fields: ["Document upload", "Photo/signature where required"],
    status: "Consent",
  },
  {
    title: "Review fee and pay",
    body: "Government fee, service charge and total are separated before payment.",
    fields: ["Fee breakdown", "Payment method", "Pending payment recovery"],
    status: "Confirm",
  },
  {
    title: "Book appointment if needed",
    body: "Inspection, test or verification visits appear only when the service requires them.",
    fields: ["Centre", "Date", "Slot", "Documents to carry"],
    status: "Conditional",
  },
  {
    title: "Receipt and timeline",
    body: "Application ID, receipt, current owner, next action and expected window are shown immediately.",
    fields: ["Application ID", "Receipt", "Timeline"],
    status: "Track",
  },
];

function makeFlow(items) {
  return items.map(([title, body, fields, status]) => ({ title, body, fields, status }));
}

const serviceFlowTemplates = {
  dlRenewal: makeFlow([
    ["Select state", "Start in SARATHI with the state that issued or currently holds the licence record.", ["State"], "Required"],
    ["Open Services on Driving Licence", "Use the Driving Licence menu and choose services on an existing licence, then continue past the instructions.", ["DL services"], "Required"],
    ["Fetch licence details", "Enter driving licence number and date of birth so the official record can be retrieved before any renewal form is shown.", ["DL number", "Date of birth"], "Required"],
    ["Choose Renewal", "Select renewal from the available services and confirm licence class, personal details and expiry context.", ["Renewal service", "Licence class"], "Guided"],
    ["Complete renewal form", "Fill the renewal form and add medical details when required by age, transport category or state rule.", ["Form details", "Medical declaration"], "Guided"],
    ["Upload required documents", "Upload driving licence, identity/address proof, Form 1 or Form 1A where applicable, and photo/signature only when the state asks for them.", ["DL", "Proofs", "Form 1 / Form 1A"], "Conditional"],
    ["Pay fee", "Calculate the official fee, complete payment, verify payment status if needed, and keep the receipt.", ["Fee", "Payment status", "Receipt"], "Confirm"],
    ["Book appointment if required", "Some states, transport classes or late renewals may require an RTO appointment or a driving test before approval.", ["RTO", "Slot", "Test if late"], "Conditional"],
    ["Print and track", "Print acknowledgement and receipt, visit with originals if asked, and track approval or dispatch.", ["Acknowledgement", "Application status"], "Track"],
  ]),
  sarathiExisting: makeFlow([
    ["Select state", "Start in SARATHI with the state where the driving licence record belongs.", ["State"], "Required"],
    ["Open Services on Driving Licence", "Choose the existing-licence service path for renewal, duplicate, address change, extract, badge or class-related work.", ["DL services"], "Required"],
    ["Fetch licence details", "Enter DL number and date of birth, then confirm the licence holder details returned by the official system.", ["DL number", "Date of birth"], "Required"],
    ["Choose the service", "Select the exact service and review the state-specific instructions before filling the form.", ["Service type", "Instructions"], "Guided"],
    ["Fill service details", "Add only the details relevant to the chosen service, such as address, class, reason, badge category or extract purpose.", ["Service form", "Reason / category"], "Guided"],
    ["Upload documents", "Upload identity, address, existing licence and supporting documents required by that service and state.", ["Proofs", "Supporting document"], "Conditional"],
    ["Pay and recover status", "Calculate fee, pay, verify payment status after any failed or pending transaction, and print receipt.", ["Fee", "STN / payment status", "Receipt"], "Confirm"],
    ["Appointment, test or visit", "Book a slot only when verification, biometrics, test or document review is required.", ["RTO", "Slot", "Documents to carry"], "Conditional"],
    ["Track application", "Use the application number to track approval, rejection, re-upload requests or dispatch.", ["Application number", "Timeline"], "Track"],
  ]),
  learnerLicence: makeFlow([
    ["Select state", "Start in SARATHI and choose the state where the learner licence application will be processed.", ["State"], "Required"],
    ["Choose New Learner Licence", "Open learner licence services and read eligibility instructions for age and vehicle class.", ["Learner service", "Vehicle class"], "Required"],
    ["Fill applicant details", "Enter personal, address and class details, using Aadhaar/eKYC only where the state offers it.", ["Applicant details", "Address", "Class"], "Guided"],
    ["Upload documents", "Upload age, address and identity proof plus photo/signature where the state requires online upload.", ["Age proof", "Address proof", "Photo/signature"], "Conditional"],
    ["Pay application fee", "Calculate the official learner licence fee, complete payment and print the receipt.", ["Fee", "Receipt"], "Confirm"],
    ["Book or take LL test", "Book an appointment or complete the online learner test depending on state configuration.", ["Test mode", "Slot"], "Conditional"],
    ["Get learner licence", "Download or print the learner licence after passing and track any pending approval.", ["Learner licence", "Application status"], "Track"],
  ]),
  permanentDl: makeFlow([
    ["Select state", "Start in SARATHI for the state where the learner licence was issued.", ["State"], "Required"],
    ["Choose New Driving Licence", "Open the permanent driving licence service and read test eligibility instructions.", ["DL service"], "Required"],
    ["Fetch learner licence", "Enter learner licence number and date of birth to bring the record into the application.", ["LL number", "Date of birth"], "Required"],
    ["Complete DL application", "Confirm applicant and vehicle class details after the learner licence has met the minimum holding period.", ["Applicant details", "Vehicle class"], "Guided"],
    ["Upload documents if required", "Upload supporting documents, photo/signature or certificates only when the state flow asks for them.", ["Supporting documents", "Photo/signature"], "Conditional"],
    ["Book driving test slot", "Choose RTO/centre, date and time for the driving competence test.", ["Test centre", "Date", "Slot"], "Required"],
    ["Pay fee and print receipt", "Pay the official fee and keep acknowledgement and receipt for the RTO visit.", ["Fee", "Acknowledgement", "Receipt"], "Confirm"],
    ["Attend test and track dispatch", "Carry originals and the correct vehicle, complete the test, then track licence issue and dispatch.", ["Originals", "Vehicle", "Dispatch"], "Track"],
  ]),
  addressChange: makeFlow([
    ["Choose record type", "Select whether the address change is for driving licence, registration certificate or both.", ["Service type", "State"], "Required"],
    ["Fetch existing record", "Enter DL number or vehicle registration number and the required verification detail.", ["DL number", "Registration number", "Date of birth"], "Required"],
    ["Verify identity", "Confirm the linked mobile OTP or approved eKYC before private details are shown.", ["Mobile OTP", "Owner details"], "Secure"],
    ["Enter new address", "Add current address, PIN code and jurisdiction details so the correct RTO path is shown.", ["Address", "RTO / registering authority"], "Guided"],
    ["Upload address proof", "Upload accepted address proof and confirm extracted values before submission.", ["Address proof", "Document preview"], "Consent"],
    ["Review fee and appointment", "Pay fee and book visit only if the selected state requires verification.", ["Fee breakdown", "Slot"], "Conditional"],
    ["Track updated document", "Track approval, smart card/print status and dispatch if a new document is issued.", ["Application number", "Timeline"], "Track"],
  ]),
  vahanRecord: makeFlow([
    ["Select state and service", "Start with the state where the vehicle is registered, then choose the exact VAHAN service.", ["State", "Service"], "Required"],
    ["Find vehicle record", "Enter vehicle registration details and any extra identifier requested by the state flow.", ["Registration number", "Chassis detail"], "Required"],
    ["Check pending issues", "Clear or explain blocks such as pending challan, tax, blacklisting, hypothecation or NOC status before submission.", ["Tax", "Challan", "Record status"], "Required"],
    ["Verify owner", "Use the available authentication mode, such as mobile OTP or approved eKYC, before showing sensitive record details.", ["Mobile OTP", "Owner details"], "Secure"],
    ["Fill service details", "Add the service-specific information, such as buyer/seller, address, reason, financier or permit route.", ["Service form", "Reason / parties"], "Guided"],
    ["Upload documents", "Upload RC, insurance, PUCC and service-specific proofs required by the selected state/RTO.", ["RC", "Insurance", "PUCC", "Supporting proof"], "Conditional"],
    ["Review fee and pay", "Show tax, government fee, service charge and total separately, then recover pending payment if needed.", ["Fee breakdown", "Payment status"], "Confirm"],
    ["Appointment or inspection", "Book inspection or RTO visit only where physical verification is required.", ["RTO", "Slot", "What to carry"], "Conditional"],
    ["Receipt and tracking", "Provide application number, receipt, current owner and next action until certificate or approval is issued.", ["Application number", "Receipt", "Timeline"], "Track"],
  ]),
  permitFitness: makeFlow([
    ["Choose commercial service", "Select permit renewal, fitness certificate renewal, duplicate fitness or national permit action.", ["Service type", "State"], "Required"],
    ["Find vehicle record", "Enter registration number and chassis detail to retrieve the commercial vehicle record.", ["Registration number", "Chassis detail"], "Required"],
    ["Check compliance", "Verify tax, insurance, PUCC, permit validity, blacklist and challan status before booking.", ["Tax", "PUCC", "Record status"], "Required"],
    ["Fill service details", "Confirm route, permit type, vehicle class, fitness context or renewal reason.", ["Service form", "Reason / category"], "Guided"],
    ["Upload documents", "Upload RC, insurance, PUCC, permit/fitness proof and supporting documents.", ["RC", "Insurance", "PUCC", "Supporting proof"], "Conditional"],
    ["Pay fee", "Review fitness, permit, tax and service charges separately before payment.", ["Fee breakdown", "Payment method"], "Confirm"],
    ["Book inspection", "Choose inspection centre, date and slot where physical inspection is required.", ["Test centre", "Date", "Slot"], "Required"],
    ["Track certificate", "Track inspection result, approval and certificate or permit issue.", ["Certificate", "Timeline"], "Track"],
  ]),
  payment: makeFlow([
    ["Enter application details", "Start with application number and date of birth, or the relevant vehicle/challan record.", ["Application number", "Date of birth"], "Required"],
    ["Calculate fee", "Ask the official system to calculate application fee, additional fee or retest fee before payment.", ["Fee type", "Calculated amount"], "Required"],
    ["Choose payment option", "Select the payment mode/gateway and confirm captcha before moving to bank payment.", ["Payment gateway", "Captcha"], "Confirm"],
    ["Complete bank payment", "Finish payment on the bank page and return to the portal without closing the flow early.", ["Bank page", "Transaction"], "Secure"],
    ["Verify pay status", "If the result is pending or failed, check payment status before retrying to avoid duplicate payment.", ["Status check", "STN"], "Required"],
    ["Print receipt", "Print or save the payment receipt and continue to appointment or application tracking.", ["Receipt", "Application status"], "Track"],
  ]),
  challan: makeFlow([
    ["Find challan", "Search by challan number, vehicle number or driving licence number where supported.", ["Challan / vehicle / DL number"], "Required"],
    ["Verify official record", "Show the violation, location/date, amount and authority from the official challan record.", ["Violation", "Amount", "Authority"], "Required"],
    ["Choose action", "Pay the challan, view court/virtual-court path where applicable, or raise the permitted issue route.", ["Pay", "Contest / issue path"], "Guided"],
    ["Complete payment", "Use the official payment flow and wait for final status before leaving.", ["Payment method", "Status"], "Confirm"],
    ["Download receipt", "Keep receipt and update the vehicle or licence attention state.", ["Receipt", "Updated status"], "Track"],
  ]),
  documentUpload: makeFlow([
    ["Select state", "Open SARATHI or VAHAN and choose the state where the application was started.", ["State"], "Required"],
    ["Open upload documents", "Use the upload document or scanned image option for the relevant application.", ["Upload menu"], "Required"],
    ["Fetch application", "Enter application number and date of birth or record details to retrieve the pending application.", ["Application number", "Date of birth"], "Required"],
    ["Upload or re-upload", "Attach only the requested document and follow size, format and category rules.", ["Document type", "File"], "Guided"],
    ["Confirm extracted details", "Review document name and extracted values before submission.", ["Document preview", "Confirmation"], "Consent"],
    ["Submit and track", "Submit the upload and return to the application timeline to verify the pending item cleared.", ["Submission", "Timeline"], "Track"],
  ]),
  pucc: makeFlow([
    ["Find vehicle", "Enter the registration number to check the active PUCC and emission renewal window.", ["Registration number"], "Required"],
    ["Check PUCC status", "Show expiry date, fuel type, emission category and whether renewal is due.", ["PUCC status", "Vehicle class"], "Required"],
    ["Find renewal centre", "Show nearby authorized PUCC centres and what the user should carry.", ["Centre", "Date"], "Guided"],
    ["Complete emission test", "Capture test result and certificate number after the centre updates the official record.", ["Certificate", "Status"], "Track"],
    ["Save reminder", "Add renewal reminder and update the linked vehicle record.", ["Reminder", "Timeline"], "Track"],
  ]),
  fancyNumber: makeFlow([
    ["Select state and RTO", "Choose the state and registering authority where the new vehicle number will be allotted.", ["State", "RTO / registering authority"], "Required"],
    ["Search preferred number", "Enter the desired number pattern and check availability or auction status.", ["Registration number", "Service type"], "Required"],
    ["Register applicant", "Add applicant details and verify mobile OTP before reserving or bidding.", ["Applicant details", "Mobile OTP"], "Secure"],
    ["Pay reservation or bid fee", "Review reservation amount, auction deposit or final fee before payment.", ["Fee breakdown", "Payment method"], "Confirm"],
    ["Track allotment", "Show allotment result, payment receipt and next registration step.", ["Receipt", "Timeline"], "Track"],
  ]),
  recall: makeFlow([
    ["Find vehicle", "Enter registration number or VIN/chassis detail to check whether a recall applies.", ["Registration number", "Chassis detail"], "Required"],
    ["Verify recall notice", "Show recall campaign, affected component, risk summary and manufacturer instructions.", ["Current status", "Authority"], "Required"],
    ["Choose service action", "Pick contact dealer, book inspection or mark already resolved where supported.", ["Service type", "Centre"], "Guided"],
    ["Track closure", "Save dealer confirmation or closure status in the vehicle timeline.", ["Status check", "Timeline"], "Track"],
  ]),
  scrapping: makeFlow([
    ["Find vehicle record", "Enter registration and chassis detail to check eligibility for registered scrapping.", ["Registration number", "Chassis detail"], "Required"],
    ["Check dues and blocks", "Clear pending tax, challans, hypothecation, blacklist or stolen status before scrapping.", ["Tax", "Challan", "Record status"], "Required"],
    ["Choose scrapping facility", "Select an authorized Registered Vehicle Scrapping Facility where available.", ["Centre", "Date"], "Guided"],
    ["Verify owner consent", "Confirm owner identity, mobile OTP and consent before moving ahead.", ["Mobile OTP", "Owner details"], "Secure"],
    ["Upload and submit", "Upload RC, identity proof and required supporting documents for scrapping approval.", ["RC", "Proofs", "File"], "Consent"],
    ["Track certificate", "Track Certificate of Deposit or scrapping certificate and record cancellation status.", ["Certificate", "Timeline"], "Track"],
  ]),
  dealerTrade: makeFlow([
    ["Select business service", "Choose dealer authorization, trade certificate issue, renewal or related business service.", ["Service type", "State"], "Required"],
    ["Enter establishment details", "Add dealership, address, GST/business identity and authorized person details.", ["Applicant details", "Address", "Proofs"], "Guided"],
    ["Upload business documents", "Upload authorization letter, trade premises proof and supporting documents.", ["Document type", "File"], "Conditional"],
    ["Pay fee", "Review certificate fee and complete payment.", ["Fee breakdown", "Payment method"], "Confirm"],
    ["Track certificate", "Track approval, certificate issue, renewal or objection response.", ["Application number", "Timeline"], "Track"],
  ]),
  homologation: makeFlow([
    ["Choose maker service", "Select homologation, VLTD, SLD, CNG maker or related manufacturer service.", ["Service type"], "Required"],
    ["Enter maker details", "Add manufacturer, plant, authorization and contact details.", ["Applicant details", "Address"], "Guided"],
    ["Upload technical documents", "Attach model approval, test reports, authorization and required compliance proofs.", ["Document type", "File"], "Conditional"],
    ["Review scrutiny", "Track department scrutiny, query, resubmission or approval status.", ["Current status", "Timeline"], "Track"],
    ["Download approval", "Download certificate, approval or acknowledgement after final issue.", ["Certificate", "Receipt"], "Track"],
  ]),
};

const serviceFlowOverrides = {
  "dl-renewal": serviceFlowTemplates.dlRenewal,
  "learner-licence": serviceFlowTemplates.learnerLicence,
  "permanent-dl": serviceFlowTemplates.permanentDl,
  "duplicate-dl": serviceFlowTemplates.sarathiExisting,
  "dl-address-change": serviceFlowTemplates.sarathiExisting,
  "dl-extract": serviceFlowTemplates.sarathiExisting,
  "public-service-badge": serviceFlowTemplates.sarathiExisting,
  "surrender-class": serviceFlowTemplates.sarathiExisting,
  "add-vehicle-class": serviceFlowTemplates.sarathiExisting,
  idp: serviceFlowTemplates.sarathiExisting,
  "change-address": serviceFlowTemplates.addressChange,
  "transfer-ownership": serviceFlowTemplates.vahanRecord,
  "duplicate-rc": serviceFlowTemplates.vahanRecord,
  "rc-renewal": serviceFlowTemplates.vahanRecord,
  "rc-address-change": serviceFlowTemplates.vahanRecord,
  "hypothecation-add": serviceFlowTemplates.vahanRecord,
  "hypothecation-terminate": serviceFlowTemplates.vahanRecord,
  "fitness-certificate": serviceFlowTemplates.vahanRecord,
  "duplicate-fitness": serviceFlowTemplates.vahanRecord,
  "permit-fitness": serviceFlowTemplates.permitFitness,
  "national-permit": serviceFlowTemplates.permitFitness,
  "fancy-number": serviceFlowTemplates.fancyNumber,
  pucc: serviceFlowTemplates.pucc,
  "vehicle-recall": serviceFlowTemplates.recall,
  "vehicle-scrap": serviceFlowTemplates.scrapping,
  "checkpost-tax": serviceFlowTemplates.payment,
  "pay-tax-fee": serviceFlowTemplates.payment,
  "retest-fee": serviceFlowTemplates.payment,
  "challan-status": serviceFlowTemplates.challan,
  "find-application": serviceFlowTemplates.documentUpload,
  "dealer-trade": serviceFlowTemplates.dealerTrade,
  homologation: serviceFlowTemplates.homologation,
  "dispatch-track": makeFlow([
    ["Choose tracking type", "Select whether you are tracking DL, RC, certificate, permit or another dispatched document.", ["Document type"], "Required"],
    ["Enter reference", "Use application number, receipt number or dispatch reference where available.", ["Application / dispatch number"], "Required"],
    ["Verify applicant", "Confirm date of birth, mobile OTP or record detail before exposing private information.", ["DOB / OTP"], "Secure"],
    ["View dispatch status", "Show printed, handed to postal service, in transit, delivered or returned status.", ["Current status", "Date"], "Track"],
    ["Resolve delivery issue", "If delayed or returned, explain the RTO/postal follow-up path.", ["Issue reason", "Support path"], "Conditional"],
  ]),
};

function flowForService(service) {
  if (serviceFlowOverrides[service.id]) return serviceFlowOverrides[service.id];
  if (service.category === "Driving Licence") return serviceFlowTemplates.sarathiExisting;
  if (service.category === "Payments") return serviceFlowTemplates.payment;
  if (service.category === "Challans") return serviceFlowTemplates.challan;
  if (["Vehicle", "Commercial"].includes(service.category)) return serviceFlowTemplates.vahanRecord;
  return officialFlow;
}

const exceptionFlows = [
  ["No record found", "Check state/RTO, spelling, migrated record status or ask for manual support."],
  ["Blacklisted or pending issue", "Explain the official block and route to challan, tax, NOC or support."],
  ["Payment pending", "Check payment status before retrying to prevent duplicate payment."],
  ["Document rejected", "Show the reason, accepted formats and re-upload path."],
  ["Appointment unavailable", "Offer next available slots, alternate centre if allowed, or reminder."],
  ["Application stuck", "Show current owner, delay reason where available and escalation path."],
];

const featureGroups = [
  {
    title: "Personal tasks",
    body: "My Mobility, reminders, linked vehicle and licence records.",
    links: [["My Mobility", "/my-mobility"], ["Profile", "/profile"], ["Notifications", "/notifications"], ["Vehicles", "/vehicles"], ["Driving licence", "/driving-licence"]],
  },
  {
    title: "Transactions",
    body: "Service finder, readiness checks, forms, payments, receipts and timelines.",
    links: [["Services", "/services"], ["Payments", "/payments"], ["Applications", "/applications"], ["Forms", "/forms"]],
  },
  {
    title: "Help and guidance",
    body: "Assistant, document help, RTO finder, explanations and escalation.",
    links: [["Assistant", "/assistant"], ["Document help", "/documents"], ["Find RTO", "/rto"], ["Help", "/help"]],
  },
  {
    title: "Safety and governance",
    body: "Road learning, scenarios, score safeguards, rules, privacy and official dashboards.",
    links: [["Road Safety", "/road-safety"], ["Simulation", "/road-safety/simulation"], ["Rules", "/rules"], ["Privacy", "/privacy"], ["Government", "/government"]],
  },
];

const paymentRows = [
  ["Government fee", "Pulled from the official record in production"],
  ["Service charge", "Shown separately before payment"],
  ["Total", "Confirmed before submission"],
  ["Recovery", "Check pending status before retrying"],
];

const governanceRows = [
  ["Authoritative content", "One verified source per rule, fee, eligibility item or deadline."],
  ["Audit logs", "Sensitive actions keep a record of consent, source and timestamp."],
  ["State-specific rules", "Service content must show where a rule applies."],
  ["AI boundaries", "AI can explain and route, but cannot become the source of legal truth."],
];

const coverageRows = [
  ["Intent homepage", "Home search and guided suggestions"],
  ["My Mobility", "Attention summary, linked records and next actions"],
  ["Service finder", "Plain-language search plus data-driven service pages"],
  ["Application timeline", "Current stage, next action and short history"],
  ["Notifications", "Upcoming reminders and preferences entry"],
  ["Assistant and voice", "Typed and browser speech-recognition flow with status messages"],
  ["Document Copilot", "Document identification, extraction confirmation and show-me assistance"],
  ["Readiness checks", "Eligibility, documents, sign-in and visit expectations"],
  ["Challans and payments", "Explanation, payment breakdown and recovery states"],
  ["RTO finder", "Centre search and visit preparation"],
  ["Road Safety", "Rules, scenarios, score safeguards and learning route"],
  ["Privacy, accessibility, governance", "Consent, source governance, audit and simple-mode principles"],
  ["Optional simulation", "Skippable road-safety practice under learning"],
  ["Profile and preferences", "Consent, language, notification channels and session controls"],
];

const serviceSubset = (categoryNames) => services.filter((service) => categoryNames.includes(service.category));

function serviceListMarkup(list) {
  return list.map((s) => `<article class="simple-service" data-go="/services/${s.id}" tabindex="0">
    <div>
      <span class="status neutral">${s.category}</span>
      <h2>${s.label}</h2>
      <p>${s.summary}</p>
    </div>
    <span class="arrow">Open -></span>
  </article>`).join("");
}

function flowProgressMarkup(flow = officialFlow, currentIndex = 0) {
  return flow.map((step, index) => `<article class="flow-step ${index < currentIndex ? "done" : ""} ${index === currentIndex ? "active" : ""}">
    <div class="flow-number">${index + 1}</div>
    <div>
      <div class="flow-head"><h3>${step.title}</h3><span class="status ${index < currentIndex ? "good" : index === currentIndex ? "warn" : "neutral"}">${index < currentIndex ? "Done" : step.status}</span></div>
      <p>${step.body}</p>
      <div class="doc-list">${step.fields.map((field) => `<span>${field}</span>`).join("")}</div>
    </div>
  </article>`).join("");
}

function inputId(label, index) {
  return `flow-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function controlForField(service, field, index) {
  const id = inputId(field, index);
  const normalized = field.toLowerCase();
  const prepared = state.copilotDrafts[service.id];
  const value = draftValueForField(field);
  if (normalized.includes("state")) {
    return `<div class="field"><label for="${id}">State</label><select id="${id}"><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Uttar Pradesh</option></select></div>`;
  }
  if (normalized.includes("rto") || normalized.includes("centre") || normalized.includes("center")) {
    return `<div class="field"><label for="${id}">${field}</label><select id="${id}"><option>Pune RTO</option><option>Delhi West RTO</option><option>Bengaluru Central RTO</option><option>Chennai South RTO</option></select></div>`;
  }
  if (normalized.includes("service") || normalized.includes("action") || normalized.includes("type")) {
    return `<div class="field"><label for="${id}">${field}</label><select id="${id}"><option>${service.label}</option><option>Check eligibility first</option><option>Resume saved application</option></select></div>`;
  }
  if (normalized.includes("payment") || normalized.includes("gateway")) {
    return `<div class="field"><label for="${id}">${field}</label><select id="${id}"><option>UPI</option><option>Debit / credit card</option><option>Net banking</option></select></div>`;
  }
  if (normalized.includes("test mode")) {
    return `<div class="field"><label for="${id}">${field}</label><select id="${id}"><option>Online learner test</option><option>RTO appointment</option></select></div>`;
  }
  if (normalized.includes("date of birth") || normalized.includes("dob")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" type="date" value="1994-06-21" /></div>`;
  }
  if (normalized === "date" || normalized.includes("slot")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" type="date" value="2026-09-03" /></div>`;
  }
  if (normalized.includes("otp")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" inputmode="numeric" maxlength="6" placeholder="Enter OTP sent to linked mobile" value="${prepared ? "123456" : ""}" /></div>`;
  }
  if (normalized.includes("challan")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="MH-CH-2026-1182" /></div>`;
  }
  if (normalized.includes("registration") || normalized.includes("vehicle")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="MH12 AB 4921" /></div>`;
  }
  if (normalized.includes("dl number") || normalized.includes("driving licence")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="DL-*********248" /></div>`;
  }
  if (normalized.includes("ll number") || normalized.includes("learner")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="LL-2026-004218" /></div>`;
  }
  if (normalized.includes("application") || normalized.includes("dispatch")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="APP-2026-0804" /></div>`;
  }
  if (normalized.includes("chassis")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="21984" maxlength="5" /></div>`;
  }
  if (normalized.includes("file") || normalized.includes("upload") || normalized.includes("photo") || normalized.includes("proof") || normalized.includes("document") || normalized.includes("certificate")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" type="file" /></div>`;
  }
  if (normalized.includes("fee") || normalized.includes("amount") || normalized.includes("receipt") || normalized.includes("status") || normalized.includes("timeline")) {
    return `<div class="field"><label for="${id}">${field}</label><input id="${id}" value="Fetched from official record" /></div>`;
  }
  return `<div class="field"><label for="${id}">${field}</label><input id="${id}" placeholder="Enter ${field.toLowerCase()}" value="${prepared ? value : ""}" /></div>`;
}

function draftValueForField(field) {
  const normalized = field.toLowerCase();
  if (normalized.includes("applicant")) return citizen.name;
  if (normalized.includes("owner")) return citizen.name;
  if (normalized.includes("address")) return "Kothrud, Pune, Maharashtra 411038";
  if (normalized.includes("reason")) return "Citizen requested service";
  if (normalized.includes("category") || normalized.includes("class")) return "LMV / MCWG";
  if (normalized.includes("mobile")) return "+91 ******2841";
  if (normalized.includes("confirmation")) return "User confirmation pending";
  if (normalized.includes("captcha")) return "To be entered manually";
  if (normalized.includes("bank") || normalized.includes("transaction")) return "Payment gateway pending";
  if (normalized.includes("authority")) return "Traffic authority record";
  if (normalized.includes("violation")) return "No parking / signal record fetched";
  if (normalized.includes("tax")) return "Paid";
  if (normalized.includes("insurance")) return "Valid";
  if (normalized.includes("pucc")) return "Expires in 18 days";
  if (normalized.includes("timeline")) return "Draft ready for tracking";
  if (normalized.includes("acknowledgement")) return "Generated after submission";
  if (normalized.includes("certificate")) return "Certificate pending";
  if (normalized.includes("receipt")) return "Receipt after payment";
  if (normalized.includes("fee") || normalized.includes("amount")) return "Calculated by official source";
  if (normalized.includes("status")) return "Verified";
  return "Prepared by assistant";
}

function uniqueFieldsForFlow(flow) {
  return [...new Set(flow.flatMap((step) => step.fields))];
}

function prerequisiteMarkup(service, flow) {
  const prereqs = [...new Set([
    ...service.documents,
    "Linked mobile for OTP",
    service.category === "Payments" || flow.some((step) => step.title.toLowerCase().includes("pay")) ? "Payment method" : "",
    flow.some((step) => step.title.toLowerCase().includes("appointment") || step.title.toLowerCase().includes("inspection")) ? "Preferred appointment date" : "",
  ].filter(Boolean))];
  return prereqs.map((item) => `<li>${item}</li>`).join("");
}

function copilotQuestionsMarkup(step) {
  return step.fields.map((field) => `<li>Please confirm ${field.toLowerCase()}.</li>`).join("");
}

function needsRtoSlot(step) {
  const text = `${step.title} ${step.body} ${step.fields.join(" ")}`.toLowerCase();
  return text.includes("test") || text.includes("appointment") || text.includes("inspection") || text.includes("slot");
}

function slotPrepForService(service) {
  const licenceRelated = service.category === "Driving Licence" || service.id === "permanent-dl" || service.id === "learner-licence";
  return licenceRelated ? visitPrep.drivingTest : visitPrep.inspection;
}

function slotBookingMarkup(service, compact = false) {
  const booking = state.bookedSlots[service.id];
  const prep = slotPrepForService(service);
  return `
    <section class="slot-booking ${compact ? "compact-slot" : ""}">
      <div class="section-title" style="margin:0">
        <div>
          <span class="eyebrow">Nearby RTO slots</span>
          <h2>${compact ? "Book this visit" : "Schedule your driving test or RTO visit"}</h2>
        </div>
        ${booking ? `<span class="status good">Booked</span>` : `<span class="status info">Slots available</span>`}
      </div>
      <div class="slot-grid">
        ${rtos.map((rto) => `<article class="slot-rto ${booking?.rto === rto.name ? "selected" : ""}">
          <div>
            <strong>${rto.name}</strong>
            <p>${rto.address}</p>
            <span>${rto.distance} away · ${rto.hours}</span>
          </div>
          <div class="slot-options">
            ${rto.slots.map((slot) => `<button class="pill slot-pill ${booking?.slot === slot && booking?.rto === rto.name ? "active" : ""}" data-book-slot="${service.id}" data-rto="${rto.name}" data-slot="${slot}">${slot}</button>`).join("")}
          </div>
        </article>`).join("")}
      </div>
      ${booking ? `
        <div class="visit-prep">
          <div>
            <span class="status good">${booking.slot}</span>
            <h3>${prep.title}</h3>
            <p>Booked at ${booking.rto}. Carry these documents and review the visit notes before leaving.</p>
          </div>
          <div class="prep-columns">
            <div>
              <strong>Documents to carry</strong>
              <ul class="clean-list">${prep.documents.map((doc) => `<li>${doc}</li>`).join("")}</ul>
            </div>
            <div>
              <strong>Be aware</strong>
              <ul class="clean-list">${prep.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
            </div>
          </div>
          <div class="flow-actions">
            <button class="btn secondary" data-go="/applications">View application timeline</button>
            <button class="btn" data-success="Visit checklist saved to reminders.">Save visit reminder</button>
          </div>
        </div>
      ` : `<p class="muted">Choose a slot to see exactly what to carry and how to prepare for the visit.</p>`}
    </section>
  `;
}

function applicationPreviewMarkup(service, flow, currentIndex) {
  const prepared = state.copilotDrafts[service.id];
  const approved = state.approvedApplications[service.id];
  const reviewedAllSteps = currentIndex >= flow.length - 1;
  const fields = uniqueFieldsForFlow(flow).slice(0, 10);
  return `
    <section class="card copilot-review simple-panel">
      <div class="section-title" style="margin:0">
        <div>
          <span class="eyebrow">Assistant-filled preview</span>
          <h2>Review before submission</h2>
        </div>
        <span class="status ${approved ? "good" : prepared ? "warn" : "neutral"}">${approved ? "Approved" : prepared ? "Needs user approval" : "Not filled yet"}</span>
      </div>
      <p class="muted">The assistant can prepare the form, but every value stays editable. Submission is locked until the user approves the filled application.</p>
      <div class="preview-field-grid">
        ${fields.map((field, index) => `<div class="field">
          <label for="review-${inputId(field, index)}">${field}</label>
          <input id="review-${inputId(field, index)}" value="${prepared ? draftValueForField(field) : ""}" placeholder="Assistant will prepare this field" />
        </div>`).join("")}
      </div>
      <div class="document-upload-list">
        ${service.documents.slice(0, 4).map((doc) => `<label><span>${doc}</span><input type="file" /></label>`).join("")}
      </div>
      <div class="flow-actions">
        <button class="btn secondary" data-copilot-fill="${service.id}">${prepared ? "Refresh assistant draft" : "Let assistant fill draft"}</button>
        <button class="btn" data-approve-application="${service.id}" ${reviewedAllSteps ? "" : "disabled"}>${approved ? "Approved for submission" : "Approve filled application"}</button>
      </div>
      ${!reviewedAllSteps ? `<div class="loading-state compact-state">Finish reviewing all journey steps before final approval becomes available.</div>` : ""}
      ${approved ? `<div class="success-state compact-state">Approved. The application can now be submitted to the official service after live backend integration.</div>` : ""}
    </section>
  `;
}

function currentStepFormMarkup(service, flow, currentIndex) {
  const currentStep = flow[currentIndex] || flow[flow.length - 1];
  const nextStep = flow[currentIndex + 1];
  const controls = currentStep.fields.map((field, index) => controlForField(service, field, index)).join("");
  const actionLabel = nextStep ? `Continue to ${nextStep.title}` : "Finish and view tracking";
  return `
    <aside class="card sticky-card ready-panel">
      <div class="step-context">
        <span class="status info">Step ${currentIndex + 1} of ${flow.length}</span>
        <h2>${currentStep.title}</h2>
        <p>${currentStep.body}</p>
      </div>
      <div class="flow-form">${controls}</div>
      <div class="copilot-mini">
        <strong>Copilot questions</strong>
        <ul>${copilotQuestionsMarkup(currentStep)}</ul>
        <button class="btn secondary" data-copilot-fill="${service.id}">Ask assistant to fill this step</button>
        ${state.copilotDrafts[service.id] ? `<span class="success-state compact-state">Draft prepared. Please review and edit anything that looks wrong.</span>` : ""}
      </div>
      ${needsRtoSlot(currentStep) ? slotBookingMarkup(service, true) : ""}
      <div class="info-banner compact-banner">
        <strong>Why this step?</strong>
        <span>${currentStep.status === "Conditional" ? "This appears only when the selected state or service requires it." : "These details match the selected service before the platform asks for the next information."}</span>
      </div>
      <div class="flow-actions">
        ${currentIndex > 0 ? `<button class="btn secondary" data-flow-prev="${service.id}">Back</button>` : ""}
        <button class="btn" data-flow-next="${service.id}">${actionLabel}</button>
      </div>
    </aside>
  `;
}

const scenario = {
  question: "A pedestrian is waiting at a zebra crossing and traffic behind you is moving slowly. What would you do?",
  options: [
    ["Slow down and stop before the crossing", true, "Correct. Stopping early makes your intent visible and protects the person crossing."],
    ["Honk and continue because traffic is slow", false, "That increases risk. A zebra crossing gives pedestrians a clear protected space."],
    ["Overtake from the side", false, "Overtaking near a crossing can hide the pedestrian from other drivers and is unsafe."],
  ],
};

function t(key) {
  return i18n[state.language][key] || i18n.en[key];
}

function route() {
  return location.hash.replace("#", "") || "/";
}

function go(path) {
  location.hash = path;
}

function oc(key) {
  return onboardingCopy[state.language]?.[key] || onboardingCopy.en[key];
}

function userTypeText(item, field) {
  return item[field][state.language] || item[field].en;
}

function localizedText(item, field) {
  return item[field][state.language] || item[field].en;
}

function iconMarkup(name) {
  const icons = {
    licence: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="14" width="40" height="36" rx="6"/><circle cx="25" cy="29" r="6"/><path d="M36 25h9M36 33h9M20 42h24"/></svg>`,
    car: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 36l5-12h26l5 12"/><rect x="10" y="33" width="44" height="14" rx="5"/><circle cx="21" cy="48" r="5"/><circle cx="43" cy="48" r="5"/><path d="M22 24l3-6h14l3 6"/></svg>`,
    truck: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="9" y="24" width="29" height="18" rx="3"/><path d="M38 30h9l7 7v5H38z"/><circle cx="19" cy="45" r="5"/><circle cx="46" cy="45" r="5"/></svg>`,
    wallet: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 22h34a6 6 0 016 6v22H16a6 6 0 01-6-6V26a4 4 0 014-4z"/><path d="M17 22l25-8 4 8"/><rect x="39" y="32" width="15" height="11" rx="3"/><circle cx="46" cy="38" r="1.8"/></svg>`,
    receipt: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 10l5 4 5-4 5 4 5-4 5 4 5-4v44l-5-4-5 4-5-4-5 4-5-4-5 4z"/><path d="M25 25h16M25 34h16M25 43h10"/></svg>`,
    documents: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 14h24l8 8v30H18z"/><path d="M42 14v10h8M14 22h6M14 30h6M14 38h6M26 32h16M26 41h16"/></svg>`,
    store: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 25l4-11h28l4 11"/><path d="M16 31v21h32V31"/><path d="M18 25v4a6 6 0 0012 0v-4M30 25v4a6 6 0 0012 0v-4M42 25v4a6 6 0 0010 3"/><path d="M26 52V40h12v12"/></svg>`,
    factory: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 52V30l14 8V30l14 8V18h10v34z"/><path d="M20 45h6M32 45h6M44 45h6"/></svg>`,
    help: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22"/><path d="M25 27a7 7 0 1111 6c-3 2-4 3-4 7"/><path d="M32 48h.1"/></svg>`,
    steering: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="34" r="22"/><circle cx="32" cy="34" r="7"/><path d="M12 34h13M39 34h13M32 41v15"/></svg>`,
    bike: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="19" cy="43" r="8"/><circle cx="46" cy="43" r="8"/><path d="M19 43l10-17h8l9 17M29 26l9 17M26 22h8M40 23h7"/></svg>`,
    road: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 54l6-44h8l6 44"/><path d="M32 14v8M32 30v8M32 46v6"/><path d="M13 18h14M37 18h14"/></svg>`,
    fleet: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="20" width="22" height="15" rx="3"/><rect x="34" y="26" width="22" height="15" rx="3"/><path d="M10 35h18M36 41h18"/><circle cx="15" cy="39" r="4"/><circle cx="25" cy="39" r="4"/><circle cx="41" cy="45" r="4"/><circle cx="51" cy="45" r="4"/></svg>`,
    permit: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="15" y="10" width="34" height="44" rx="5"/><path d="M23 22h18M23 31h18M23 40h10"/><circle cx="42" cy="43" r="6"/></svg>`,
  };
  return icons[name] || icons.help;
}

function persistSetup(extra = {}) {
  const setup = {
    version: ONBOARDING_VERSION,
    language: state.language,
    selectedService: state.onboarding.selectedService,
    userType: state.onboarding.userType,
    userStatus: state.onboarding.userStatus,
    complete: state.onboarding.complete,
    ...extra,
  };
  localStorage.setItem("parivahanSetup", JSON.stringify(setup));
}

function matchService(query) {
  const q = query.toLowerCase();
  const ranked = services
    .map((service) => ({
      service,
      score: service.match.reduce((score, word) => score + (q.includes(word) ? (word.includes(" ") ? 3 : 1) : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score > 0 ? ranked[0].service : services[0];
}

function assistantReply(text) {
  const service = matchService(text);
  const flow = flowForService(service);
  const nextSteps = flow.slice(0, 4).map((step, index) => `${index + 1}. ${step.title}`).join(" ");
  state.assistant.push({ from: "user", text });
  state.assistant.push({
    from: "assistant",
    text: `This looks like: ${service.label}. Keep ready: ${service.documents.slice(0, 4).join(", ")}. I will guide you through: ${nextSteps} I can fill an editable draft and will ask for your approval before submission. Open /flow/${service.id} to start the guided copilot.`,
  });
}

function onboardingPage() {
  const step = state.onboarding.step;
  const selectedType = userTypes.find((item) => item.id === state.onboarding.userType);
  const selectedService = serviceEntryOptions.find((item) => item.id === state.onboarding.selectedService);
  const progress = step === "language" ? 1 : step === "service" ? 2 : step === "role" ? 3 : step === "status" ? 4 : 5;

  return `
    <div class="onboarding-shell">
      <main class="onboarding-card" id="main">
        <div class="onboarding-progress" aria-label="Setup progress">
          ${[1, 2, 3, 4, 5].map((item) => `<span class="${item <= progress ? "active" : ""}"></span>`).join("")}
        </div>

        ${step === "language" ? `
          <section class="onboarding-grid">
            <div class="onboarding-hero">
              <span class="status neutral">Parivahan 2.0</span>
              <h1>${oc("languageTitle")}</h1>
              <p>${oc("languageBody")}</p>
              <div class="onboarding-visual language-visual" aria-hidden="true"><span>अ</span><span>A</span><span>த</span></div>
            </div>
            <form class="onboarding-panel" data-onboarding-language>
              <label for="setup-language">${oc("languageLabel")}</label>
              <select id="setup-language" name="language">
                ${languageOptions.map(([value, label]) => `<option value="${value}" ${state.language === value ? "selected" : ""}>${label}</option>`).join("")}
              </select>
              <button class="btn" type="submit">${oc("continue")}</button>
            </form>
          </section>
        ` : ""}

        ${step === "service" ? `
          <section class="onboarding-wide">
            <div class="onboarding-head">
              <div><span class="eyebrow">${oc("parivahanServices")}</span><h1>${oc("serviceTitle")}</h1><p>${oc("serviceBody")}</p></div>
              <button class="btn secondary compact" data-onboarding-back>${oc("back")}</button>
            </div>
            <div class="service-entry-grid">
              ${serviceEntryOptions.map((item) => `<button class="user-type-card service-entry-card ${state.onboarding.selectedService === item.id ? "selected" : ""}" type="button" data-onboarding-service="${item.id}">
                <span class="user-icon icon-${item.icon}" aria-hidden="true">${iconMarkup(item.icon)}</span>
                <strong>${localizedText(item, "labels")}</strong>
                <small>${localizedText(item, "bodies")}</small>
              </button>`).join("")}
            </div>
          </section>
        ` : ""}

        ${step === "role" ? `
          <section class="onboarding-wide">
            <div class="onboarding-head">
              <div><span class="eyebrow">${selectedService ? localizedText(selectedService, "labels") : oc("profileSetup")}</span><h1>${oc("roleTitle")}</h1><p>${oc("roleBody")}</p></div>
              <button class="btn secondary compact" data-onboarding-back>${oc("back")}</button>
            </div>
            <div class="user-type-grid">
              ${userTypes.map((item) => `<button class="user-type-card ${state.onboarding.userType === item.id ? "selected" : ""}" type="button" data-user-type="${item.id}">
                <span class="user-icon icon-${item.icon}" aria-hidden="true">${iconMarkup(item.icon)}</span>
                <strong>${userTypeText(item, "labels")}</strong>
                <small>${userTypeText(item, "bodies")}</small>
              </button>`).join("")}
            </div>
          </section>
        ` : ""}

        ${step === "status" ? `
          <section class="onboarding-grid">
            <div class="onboarding-hero">
              <span class="status info">${selectedType ? userTypeText(selectedType, "labels") : "Profile"}</span>
              <h1>${oc("statusTitle")}</h1>
              <p>${oc("statusBody")}</p>
            </div>
            <div class="onboarding-panel status-choice">
              <button class="setup-choice" data-user-status="new"><strong>${oc("newUser")}</strong><span>${oc("newBody")}</span></button>
              <button class="setup-choice" data-user-status="returning"><strong>${oc("returningUser")}</strong><span>${oc("returningBody")}</span></button>
              <button class="btn secondary compact" data-onboarding-back>${oc("back")}</button>
            </div>
          </section>
        ` : ""}

        ${step === "profile" ? `
          <section class="onboarding-grid">
            <div class="onboarding-hero">
              <span class="status good">${selectedType ? userTypeText(selectedType, "labels") : "Citizen"}</span>
              <h1>${oc("profileTitle")}</h1>
              <p>${oc("profileBody")}</p>
              <div class="secure-note"><strong>${oc("noPasswordTitle")}</strong><span>${oc("noPasswordBody")}</span></div>
            </div>
            <form class="onboarding-panel" data-onboarding-profile>
              <label for="setup-mobile">${oc("mobile")}</label>
              <input id="setup-mobile" name="mobile" inputmode="numeric" maxlength="10" placeholder="9876543210" value="${state.onboarding.mobile}" required />
              <label for="setup-aadhaar">${oc("aadhaar")}</label>
              <input id="setup-aadhaar" name="aadhaar" inputmode="numeric" maxlength="12" placeholder="XXXX XXXX XXXX" value="${state.onboarding.aadhaar}" required />
              ${state.onboarding.otpSent ? `<div class="success-state compact-state">${oc("mockOtp")}</div><label for="setup-otp">${oc("otp")}</label><input id="setup-otp" name="otp" inputmode="numeric" maxlength="6" placeholder="123456" required />` : ""}
              <div class="onboarding-actions">
                <button class="btn secondary" type="button" data-onboarding-back>${oc("back")}</button>
                <button class="btn" type="submit">${state.onboarding.otpSent ? oc("verify") : oc("sendOtp")}</button>
              </div>
            </form>
          </section>
        ` : ""}
      </main>
    </div>
  `;
}

function shell(content) {
  const current = route();
  const nav = [
    ["/", "Home"], ["/my-mobility", "My Mobility"], ["/services", "Services"], ["/applications", "Applications"], ["/help", "Help"],
  ];
  return `
    <div class="app-shell">
      <div class="gov-strip">
        <span>Government of India</span>
        <span>Ministry of Road Transport and Highways</span>
        <span>Citizen services prototype</span>
      </div>
      <header class="topbar">
        <a class="brand" href="#/">
          <span class="emblem-mark" aria-hidden="true"><span></span></span>
          <span><strong>Parivahan 2.0</strong><em>Citizen transport services</em></span>
        </a>
        <nav class="nav" aria-label="Primary navigation">
          ${nav.map(([href, label]) => `<a href="#${href}" ${current === href ? `aria-current="page"` : ""}>${label}</a>`).join("")}
        </nav>
        <div class="top-actions">
          <select class="language-select" aria-label="Language" data-language>
            <option value="en" ${state.language === "en" ? "selected" : ""}>English</option>
            <option value="hi" ${state.language === "hi" ? "selected" : ""}>हिन्दी</option>
            <option value="ta" ${state.language === "ta" ? "selected" : ""}>தமிழ்</option>
          </select>
          <button class="btn secondary compact" data-go="/assistant">Ask</button>
          <div class="notification-wrap">
            <button class="notification-bell" data-toggle-notifications aria-label="Open notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
              <span>${personalNotifications.length + governmentUpdates.length}</span>
            </button>
            ${state.notificationsOpen ? `
              <div class="notification-panel">
                <div class="notification-head">
                  <strong>Notifications</strong>
                  <button class="pill" data-toggle-notifications>Close</button>
                </div>
                <section>
                  <h3>Personal</h3>
                  <div class="notification-list">
                    ${personalNotifications.map((item) => `<button class="notification-item" data-go="${item.href}">
                      <span class="status ${item.tone}">${item.type}</span>
                      <strong>${item.title}</strong>
                      <small>${item.body}</small>
                      <em>${item.action}</em>
                    </button>`).join("")}
                  </div>
                </section>
                <section>
                  <h3>Government news and updates</h3>
                  <div class="notification-list">
                    ${governmentUpdates.map((item) => `<button class="notification-item gov-update" data-go="/updates/${item.id}">
                      <span class="status info">${item.type}</span>
                      <strong>${item.title}</strong>
                      <small>${item.body}</small>
                      <em>View details</em>
                    </button>`).join("")}
                  </div>
                </section>
              </div>
            ` : ""}
          </div>
          <button class="profile-chip" data-go="/profile" aria-label="Open profile, driver score, documents and reminders">
            <span class="profile-avatar">AS</span>
            <span class="profile-chip-main">
              <strong>${citizen.name.split(" ")[0]}</strong>
              <small>Score 782</small>
            </span>
            <span class="profile-metrics">
              <span><b>4</b> docs</span>
              <span><b>3</b> reminders</span>
            </span>
          </button>
        </div>
      </header>
      <main id="main">${content}</main>
    </div>
  `;
}

function home() {
  return shell(`
    <section class="section home-board">
      <div class="home-intro">
        <div>
          <div class="eyebrow">Government transport services</div>
          <h1 class="home-title">What do you need help with today?</h1>
          <p class="lede">Start with your situation, not a department name. We will guide you through documents, payment, appointment and tracking step by step.</p>
        </div>
        <span class="prototype-mark">India transport services</span>
      </div>

      <div class="public-notice">
        <span class="notice-seal" aria-hidden="true"></span>
        <div>
          <strong>Official-service journey, simplified for citizens</strong>
          <p>Fees, eligibility and final submissions must come from authorised government systems. This prototype keeps the process readable before any sensitive action.</p>
        </div>
      </div>

      <div class="focus-grid home-focus-grid">
        <section class="focus-card primary-focus">
          <div>
            <span class="status warn">Citizen dashboard</span>
            <h2>Three things need your review.</h2>
            <p>PUCC renewal, one pending challan, and one application document.</p>
          </div>
          <button class="btn" data-go="/my-mobility">Review now</button>
        </section>

        <section class="focus-card search-focus">
          <div class="search-card-top">
            <h2>${t("ask")}</h2>
            <div class="road-signs" aria-hidden="true"><span></span><span></span></div>
          </div>
          <div>
            <form class="intent-form" data-intent-form>
              <input name="intent" aria-label="Describe your transport task" placeholder="Example: my licence is expiring, I bought a used car" />
              <button class="btn" type="submit">${t("start")}</button>
              <button class="btn secondary icon" type="button" data-voice title="Use voice input" aria-label="Use voice input">Voice</button>
            </form>
            <div class="suggestions simplified">
              ${["Renew my licence", "Bought a used car", "Lost my RC", "I don't know the service"].map((x) => `<button class="pill" data-suggest="${x}">${x}</button>`).join("")}
            </div>
          </div>
          <div class="route-card" aria-hidden="true"><span></span><span></span><span></span></div>
        </section>
      </div>

      <section class="quiet-section">
        <div class="section-title"><div><span class="eyebrow">Needs your attention</span><h2>Finish these first</h2></div></div>
        <div class="next-list">
          ${nextActions.map((item) => `<article class="next-row">
            <div><span class="status ${item.tone}">${item.title}</span><p>${item.body}</p></div>
            <button class="btn secondary" data-go="${item.href}">${item.action}</button>
          </article>`).join("")}
        </div>
      </section>

      <section class="quiet-section">
        <div class="section-title"><div><span class="eyebrow">Common tasks</span><h2>Most people come here for these</h2></div><a class="btn secondary compact" href="#/services">View all services</a></div>
        <div class="grid task-grid">
        ${commonJourneys.map((card) => `<article class="card task-card tone-${card.tone}" data-go="${card.href}" tabindex="0">
          <div class="card-topline"><span>Start</span><span class="arrow">-></span></div>
          <div><h3>${card.title}</h3><p>${card.body}</p></div>
        </article>`).join("")}
        </div>
      </section>

      <section class="quiet-section">
        <div class="section-title"><div><span class="eyebrow">Before you submit</span><h2>Know what is needed at each step</h2></div></div>
        <div class="confidence-grid">
          ${confidenceRows.map(([title, body, href]) => `<article class="simple-service" data-go="${href}" tabindex="0">
            <div><h2>${title}</h2><p>${body}</p></div>
            <span class="arrow">Open -></span>
          </article>`).join("")}
        </div>
      </section>

      <section class="quiet-section content-note">
        <div class="help-strip">
          <div>
            <span class="eyebrow">Not sure where to start?</span>
            <h2>Tell the assistant what happened.</h2>
            <p>Use your own words, upload a confusing notice, or ask what to carry before visiting an RTO.</p>
          </div>
          <div class="button-stack narrow-actions">
            <button class="btn" data-go="/assistant">Ask assistant</button>
            <button class="btn secondary" data-go="/applications">Track application</button>
          </div>
        </div>
      </section>
    </section>
  `);
}

function servicesPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header">
        <div><div class="eyebrow">Services</div><h1 class="page-title">What do you need to do?</h1></div>
        <p class="muted">Search in your own words or choose one service. Details stay short until you open a task.</p>
      </div>
      <div class="service-search card">
        <form class="intent-form" data-intent-form>
          <input name="intent" aria-label="Search services" placeholder="Search like: transfer bike, licence expired, check fine" />
          <button class="btn" type="submit">Find</button>
          <button class="btn secondary icon" type="button" data-voice title="Use voice input" aria-label="Use voice input">Voice</button>
        </form>
      </div>
      <div class="simple-service-list">
        ${serviceListMarkup(services)}
      </div>
    </section>
  `);
}

function vahanPage() {
  const vehicleServices = serviceSubset(["Vehicle", "Commercial"]);
  return shell(`
    <section class="section content-page">
      <div class="page-header">
        <div><div class="eyebrow">VAHAN services</div><h1 class="page-title">Everything for your vehicle.</h1></div>
        <p class="muted">Start with what happened. The platform handles state, RTO, record checks, documents, fees, appointment and timeline.</p>
      </div>
      <div class="focus-grid">
        <section class="focus-card primary-focus">
          <span class="status warn">Most common</span>
          <h2>Bought, moved, lost RC, tax, fitness or permit?</h2>
          <p>Use plain language and we will route to the right vehicle service.</p>
          <button class="btn" data-go="/services/transfer-ownership">Start vehicle task</button>
        </section>
        <section class="focus-card search-focus">
          <h2>Official process, simplified</h2>
          <div class="simple-steps compact-steps">
            ${officialFlow.slice(0, 4).map((step, index) => `<div><span>${index + 1}</span><strong>${step.title}</strong></div>`).join("")}
          </div>
        </section>
      </div>
      <div class="simple-service-list">${serviceListMarkup(vehicleServices)}</div>
    </section>
  `);
}

function sarathiPage() {
  const licenceServices = serviceSubset(["Driving Licence"]);
  return shell(`
    <section class="section content-page">
      <div class="page-header">
        <div><div class="eyebrow">SARATHI services</div><h1 class="page-title">Everything for your licence.</h1></div>
        <p class="muted">Learner, permanent DL, renewal, duplicate, address, IDP, extract, badge, class addition and test-related actions.</p>
      </div>
      <div class="focus-grid">
        <section class="focus-card primary-focus">
          <span class="status warn">Renewal soon</span>
          <h2>Your licence needs review.</h2>
          <p>Check renewal, documents, appointment and payment in one guided flow.</p>
          <button class="btn" data-go="/services/dl-renewal">Renew licence</button>
        </section>
        <section class="focus-card search-focus">
          <h2>New or changing class?</h2>
          <p>Start learner licence, permanent DL, add class, surrender class or pay retest fee from here.</p>
          <button class="btn secondary" data-go="/services/learner-licence">Learner licence</button>
          <button class="btn secondary" data-go="/services/add-vehicle-class">Add class</button>
        </section>
      </div>
      <div class="simple-service-list">${serviceListMarkup(licenceServices)}</div>
    </section>
  `);
}

function servicePage(id) {
  const service = services.find((x) => x.id === id) || services[0];
  const flow = flowForService(service);
  return shell(`
    <section class="section content-page">
      <div class="service-layout calm-layout">
        <div class="card service-main simple-panel">
          <button class="pill back-pill" data-go="/services">Back to services</button>
          <div class="eyebrow">${service.category}</div>
          <h1 class="page-title">${service.label}</h1>
          <p>${service.summary}</p>

          <div class="service-summary">
            <div><span>Time</span><strong>${service.time}</strong></div>
            <div><span>Visit</span><strong>${service.visit}</strong></div>
            <div><span>Official term</span><strong>${service.officialName}</strong></div>
          </div>

          <div class="info-banner">
            <strong>Before you start</strong>
            <span>Fees, eligibility and deadlines must be checked against approved government sources before this becomes a live service.</span>
          </div>

          <h2>What will happen</h2>
          <div class="simple-steps">${flow.map((step, index) => `<div><span>${index + 1}</span><strong>${step.title}</strong></div>`).join("")}</div>
        </div>
        <aside class="card sticky-card ready-panel">
          <h2>Ready check</h2>
          <div class="checklist">
            <div class="check-row"><span>Eligibility</span><span class="status info">Verification required</span></div>
            <div class="check-row"><span>Documents</span><span class="status warn">${Math.max(2, service.documents.length - 1)} of ${service.documents.length} ready</span></div>
            <div class="check-row"><span>Sign-in</span><span class="status neutral">OTP needed</span></div>
          </div>
          <h3>Documents</h3>
          <div class="doc-list">${service.documents.map((doc) => `<span>${doc}</span>`).join("")}</div>
          <div class="button-stack">
            <button class="btn" data-go="/flow/${service.id}">Start</button>
            <button class="btn secondary" data-ask-about="${service.id}">Ask a question</button>
          </div>
        </aside>
      </div>
      <section class="card copilot-intake simple-panel">
        <div>
          <span class="eyebrow">Application copilot</span>
          <h2>Start with everything ready.</h2>
          <p class="muted">The assistant will ask only the details needed for ${service.label}, fill an editable draft, request uploads at the right time and ask for approval before submission.</p>
        </div>
        <div class="copilot-columns">
          <div>
            <h3>Keep these handy</h3>
            <ul class="clean-list">${prerequisiteMarkup(service, flow)}</ul>
          </div>
          <div>
            <h3>How the assistant helps</h3>
            <ul class="clean-list">
              <li>Asks service-specific questions instead of showing one large form.</li>
              <li>Validates record format, required uploads and pending blockers.</li>
              <li>Creates an editable review page before final approval.</li>
            </ul>
          </div>
        </div>
        <button class="btn" data-go="/flow/${service.id}">Open guided copilot</button>
      </section>
    </section>
  `);
}

function flowPage(id) {
  const service = services.find((x) => x.id === id) || services[0];
  const flow = flowForService(service);
  const currentIndex = Math.min(state.flowProgress[service.id] || 0, flow.length - 1);
  return shell(`
    <section class="section content-page">
      <div class="page-header">
        <div>
          <button class="pill back-pill" data-go="/services/${service.id}">Back to service</button>
          <div class="eyebrow">Guided application</div>
          <h1 class="page-title">${service.label}</h1>
        </div>
        <p class="muted">This is the end-to-end transaction path. It shows the official sequence without exposing backend complexity.</p>
      </div>

      <div class="flow-layout">
        <div class="card simple-panel">
          <h2>Application journey</h2>
          <div class="flow-list">${flowProgressMarkup(flow, currentIndex)}</div>
        </div>
        ${currentStepFormMarkup(service, flow, currentIndex)}
      </div>

      <section class="copilot-workspace">
        <article class="card copilot-intake simple-panel">
          <div>
            <span class="eyebrow">Application copilot</span>
            <h2>What to keep ready</h2>
            <p class="muted">The assistant will ask for these only when needed, validate the entered details, and keep the form editable.</p>
          </div>
          <ul class="clean-list">${prerequisiteMarkup(service, flow)}</ul>
        </article>
        ${applicationPreviewMarkup(service, flow, currentIndex)}
      </section>

      <section class="quiet-section">
        <div class="section-title"><div><span class="eyebrow">Edge cases</span><h2>Handled in the flow</h2></div></div>
        <div class="simple-service-list">
          ${exceptionFlows.map(([title, body]) => `<article class="simple-service"><div><h2>${title}</h2><p>${body}</p></div><span class="status neutral">Supported</span></article>`).join("")}
        </div>
      </section>
    </section>
  `);
}

function priorityActionsMarkup() {
  return `
    <aside class="card action-list-card simple-panel">
      <h2>Do these first</h2>
      <div class="notice-list">
        ${nextActions.map((item, index) => `<div class="notice"><div><strong>${item.title}</strong><p>${item.body}</p></div><span class="status ${index === 0 ? "warn" : "neutral"}">${index === 0 ? "Highest priority" : "Queued"}</span></div>`).join("")}
      </div>
      <button class="btn action-card-cta" data-go="${nextActions[0].href}">Continue highest priority task</button>
    </aside>
  `;
}

function linkedRecordsMarkup() {
  return `
    <div class="card simple-panel">
      <div class="records-head">
        <h2>Linked records</h2>
        <div class="records-actions">
          ${state.editingRecords ? `<button class="btn secondary compact" data-success="Add record flow opened. Production would verify with OTP before linking.">Add record</button>` : ""}
          <button class="btn secondary compact" data-toggle-record-edit>${state.editingRecords ? "Done" : "Edit records"}</button>
        </div>
      </div>
      <div class="health-list">
        ${mobility.vehicles.map((v) => `<div class="health-row record-row"><div><strong>${v.registrationNumber}</strong><p class="muted">${v.make} ${v.model}, ${v.rto}</p><div class="mini-tags"><span>PUCC: ${v.pucc}</span><span>Tax: ${v.tax}</span></div></div><div class="record-side"><span class="status ${v.challans === "None" ? "good" : "warn"}">${v.challans === "None" ? "All good" : "Action needed"}</span>${state.editingRecords ? `<div class="record-actions"><button class="pill" data-success="Edit record flow opened for ${v.registrationNumber}.">Edit</button><button class="pill danger-pill" data-success="Delete request started for ${v.registrationNumber}. Production would verify with OTP before unlinking.">Delete</button></div>` : ""}</div></div>`).join("")}
        <div class="health-row"><div><strong>${mobility.licence.number}</strong><p class="muted">${mobility.licence.classes}; ${mobility.licence.expiry}</p></div><div class="record-side"><span class="status warn">${mobility.licence.status}</span>${state.editingRecords ? `<div class="record-actions"><button class="pill" data-success="Edit licence details flow opened.">Edit</button><button class="pill danger-pill" data-success="Delete request started for linked licence. Production would verify with OTP before unlinking.">Delete</button></div>` : ""}</div></div>
      </div>
    </div>
  `;
}

function driverScoreMarkup() {
  return `
    <section class="card simple-panel driver-score-card">
      <div>
        <span class="eyebrow">Driver score</span>
        <h2>782 <span>/ 900</span></h2>
        <p class="muted">A personal readiness score based on documents, renewals, challans and learning activity.</p>
      </div>
      <div class="score-breakdown">
        ${driverScoreBreakdown.map(([label, value, body]) => `<div class="score-row">
          <div><strong>${label}</strong><p>${body}</p></div>
          <span>${value}</span>
          <div class="progress"><span style="width:${value}%"></span></div>
        </div>`).join("")}
      </div>
    </section>
  `;
}

function mobilityPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header">
        <div><div class="eyebrow">My Mobility</div><h1 class="page-title">What needs attention?</h1></div>
        <p class="muted">A short view of your transport records. Identifiers are masked and this is mock data.</p>
      </div>
      <div class="dashboard calm-layout">
        ${priorityActionsMarkup()}
        ${linkedRecordsMarkup()}
      </div>
    </section>
  `);
}

function profilePage() {
  const selectedType = userTypes.find((item) => item.id === state.onboarding.userType);
  const selectedTypeLabel = selectedType ? userTypeText(selectedType, "labels") : "Not selected";
  const selectedLanguageLabel = languageOptions.find(([value]) => value === state.language)?.[1] || "English";
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Citizen profile</div><h1 class="page-title">Your mobility profile.</h1></div><p class="muted">Driver score, linked records, renewals, reminders, consent and account preferences live together here.</p></div>
      <div class="profile-overview">
        <section class="card simple-panel profile-card">
          <span class="profile-avatar large">AS</span>
          <div>
            <h2>${citizen.name}</h2>
            <p class="muted">${selectedTypeLabel}</p>
          </div>
          <div class="profile-facts">
            <span><strong>${selectedLanguageLabel}</strong> language</span>
            <span><strong>4</strong> documents</span>
            <span><strong>3</strong> reminders</span>
          </div>
          <button class="btn secondary compact" data-reset-onboarding>Change setup</button>
        </section>
        ${driverScoreMarkup()}
      </div>

      <div class="dashboard calm-layout profile-mobility-layout">
        ${priorityActionsMarkup()}
        ${linkedRecordsMarkup()}
      </div>

      <section class="quiet-section">
        <div class="section-title"><div><span class="eyebrow">Privacy and consent</span><h2>What you control</h2></div></div>
        <div class="simple-service-list">
          <article class="simple-service"><div><h2>Document processing</h2><p>Document Copilot asks before reading, extracting or retaining uploaded data.</p></div><span class="status neutral">Consent required</span></article>
          <article class="simple-service"><div><h2>Session timeout</h2><p>Sensitive record pages should time out and re-authenticate before showing private data.</p></div><span class="status neutral">Prototype</span></article>
        </div>
      </section>
    </section>
  `);
}

function vehiclesPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Vehicles</div><h1 class="page-title">Your vehicle records.</h1></div><p class="muted">RC, PUCC, tax, insurance where permitted, fitness, permits and challans in one view.</p></div>
      <div class="grid">${mobility.vehicles.map((v) => `<article class="card application-card simple-panel">
        <span class="status ${v.challans === "None" ? "good" : "warn"}">${v.challans === "None" ? "All good" : "Needs review"}</span>
        <h2>${v.registrationNumber}</h2>
        <p class="muted">${v.make} ${v.model}, ${v.rto}</p>
        <div class="doc-list"><span>PUCC: ${v.pucc}</span><span>Tax: ${v.tax}</span><span>Challans: ${v.challans}</span><span>Insurance: verify when available</span></div>
        <button class="btn secondary" data-go="/vahan">Start vehicle service</button>
      </article>`).join("")}</div>
    </section>
  `);
}

function drivingLicencePage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Driving Licence</div><h1 class="page-title">Licence, learning and renewal.</h1></div><p class="muted">For renewal, learner journeys, class additions, appointments and test preparation.</p></div>
      <div class="focus-grid">
        <section class="focus-card primary-focus">
          <span class="status warn">${mobility.licence.status}</span>
          <h2>${mobility.licence.number}</h2>
          <p>${mobility.licence.classes}. ${mobility.licence.expiry}.</p>
          <button class="btn" data-go="/services/dl-renewal">Renew licence</button>
        </section>
        <section class="focus-card search-focus">
          <h2>New driver?</h2>
          <p>Start with road rules, scenario practice, documents and learner licence steps.</p>
          <button class="btn secondary" data-go="/services/learner-licence">Start learner journey</button>
          <button class="btn secondary" data-go="/road-safety">Practice road safety</button>
        </section>
      </div>
    </section>
  `);
}

function challansPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Challans</div><h1 class="page-title">Understand before you pay.</h1></div><p class="muted">This prototype explains the violation, source, amount, next action and safety context without implying guilt beyond the official record.</p></div>
      <div class="focus-grid">
        <section class="focus-card primary-focus">
          <span class="status warn">Pending</span>
          <h2>One challan needs attention.</h2>
          <p>Vehicle MH12 AB 4921. Official amount and rule reference must come from eChallan data in production.</p>
          <button class="btn" data-go="/services/challan-status">View details</button>
        </section>
        <section class="focus-card search-focus">
          <h2>Explain my challan</h2>
          <p>Show plain-language violation meaning, rule reference, amount source, payment or issue-raising path, and receipt recovery.</p>
          <button class="btn secondary" data-go="/payments">Payment options</button>
        </section>
      </div>
    </section>
  `);
}

function paymentsPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Payments</div><h1 class="page-title">Clear payment status.</h1></div><p class="muted">No ambiguous success states. Review official amount, charges, total and receipt before a transaction completes.</p></div>
      <div class="simple-service-list">
        ${paymentRows.map(([title, body]) => `<article class="simple-service"><div><h2>${title}</h2><p>${body}</p></div><span class="status neutral">Prototype</span></article>`).join("")}
      </div>
    </section>
  `);
}

function documentsPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Document help</div><h1 class="page-title">Check a document before upload.</h1></div><p class="muted">Document Copilot identifies document type, extracts fields for confirmation, flags missing details and minimizes retention.</p></div>
      <div class="focus-grid">
        <section class="focus-card search-focus">
          <h2>Upload or capture</h2>
          <p>No field is silently changed. You confirm extracted details before they enter an application.</p>
          <button class="btn" data-success="Document upload prototype opened">Upload document</button>
        </section>
        <section class="focus-card search-focus">
          <h2>Show me assistance</h2>
          <p>Upload a screenshot, form or notice to ask: what does this mean, why is it needed, or is this the right document?</p>
          <button class="btn secondary" data-go="/assistant">Ask Assistant</button>
        </section>
      </div>
    </section>
  `);
}

function applicationsPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Applications</div><h1 class="page-title">Track what happens next.</h1></div><p class="muted">Each application shows only the current stage, next action, and a short history.</p></div>
      <div class="grid">${applications.map((app) => `
        <article class="card application-card simple-panel">
          <div class="application-head">
            <span class="status ${app.status.includes("Waiting") ? "info" : "warn"}">${app.status}</span>
            <strong>${app.id}</strong>
          </div>
          <h2>${app.service}</h2><p class="muted">${app.nextAction}</p>
          <div class="timeline">${app.timeline.map(([label, cls]) => `<div class="timeline-item ${cls}"><span class="dot"></span><div><strong>${label}</strong><p class="muted">${cls === "current" ? "Current owner and next action are visible here." : "Status retained for history."}</p></div></div>`).join("")}</div>
        </article>`).join("")}</div>
    </section>
  `);
}

function notificationsPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Reminders</div><h1 class="page-title">Upcoming actions</h1></div><button class="btn secondary" data-success="Notification preferences saved">Preferences</button></div>
      <div class="card notice-list simple-panel">${notifications.map(([type, title, action]) => `<div class="notice"><div><strong>${type}</strong><p class="muted">${title}</p></div><button class="btn secondary" data-go="/assistant">${action}</button></div>`).join("")}</div>
    </section>
  `);
}

function updateDetailPage(id) {
  const update = governmentUpdates.find((item) => item.id === id) || governmentUpdates[0];
  return shell(`
    <section class="section content-page">
      <div class="service-layout calm-layout">
        <div class="card service-main simple-panel">
          <button class="pill back-pill" data-go="/notifications">Back to notifications</button>
          <span class="status info">${update.type}</span>
          <h1 class="page-title">${update.title}</h1>
          <p>${update.detail}</p>
          <div class="info-banner">
            <strong>Source check needed</strong>
            <span>Production updates should link to the latest official MoRTH, Parivahan or state transport department notification before being shown as authoritative.</span>
          </div>
        </div>
        <aside class="card sticky-card ready-panel">
          <h2>What you can do</h2>
          <div class="checklist">
            <div class="check-row"><span>Save as reminder</span><span class="status neutral">Optional</span></div>
            <div class="check-row"><span>Check affected records</span><span class="status info">Recommended</span></div>
            <div class="check-row"><span>Ask assistant</span><span class="status good">Available</span></div>
          </div>
          <div class="button-stack">
            <button class="btn" data-go="/assistant">Ask about this update</button>
            <button class="btn secondary" data-go="/my-mobility">Check my records</button>
          </div>
        </aside>
      </div>
    </section>
  `);
}

function assistantPage() {
  return shell(`
    <section class="section content-page">
      <div class="dashboard calm-layout">
        <div>
          <div class="eyebrow">Assistant</div>
          <h1 class="page-title">Describe the problem. Get the next step.</h1>
          <p class="lede">Use this when you are unsure which service applies, a form is confusing, or an application is stuck.</p>
          <div class="card guardrail-card simple-panel">
            <h2>Designed to be careful</h2>
            <div class="principle-list">
              <p>It can explain, route and prepare.</p>
              <p>It will ask before payments, submissions or document use.</p>
              <p>It will not invent legal rules, fees or deadlines.</p>
            </div>
          </div>
        </div>
        <div class="card assistant-panel simple-panel">
          <div class="section-title" style="margin:0"><h2>Assistant</h2><button class="btn secondary icon" data-voice title="Speak to assistant" aria-label="Speak to assistant">Voice</button></div>
          ${state.voiceStatus ? `<div class="voice-status" aria-live="polite">${state.voiceStatus}</div>` : ""}
          <div class="transcript" aria-live="polite">${state.assistant.map((m) => `<div class="message ${m.from}">${m.text}</div>`).join("")}</div>
          <form class="assistant-input" data-assistant-form>
            <input name="message" aria-label="Message assistant" placeholder="Example: I bought a used car" />
            <button class="btn" type="submit">Send</button>
            <button class="btn secondary" type="button" data-clear-chat>Clear</button>
          </form>
        </div>
      </div>
    </section>
  `);
}

function roadSafetyPage() {
  const answer = state.activeScenario;
  const subpage = route().split("/").pop();
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Road Safety</div><h1 class="page-title">${subpage === "score" ? "Your learning score." : subpage === "learn" ? "Learn the rule before the test." : "Practice one situation at a time."}</h1></div><p class="muted">Private learning only. This score is not used for enforcement, insurance, employment or licence decisions.</p></div>
      <div class="tabs">
        <button class="tab ${route() === "/road-safety" ? "active" : ""}" data-go="/road-safety">Scenario</button>
        <button class="tab ${route() === "/road-safety/learn" ? "active" : ""}" data-go="/road-safety/learn">Learn</button>
        <button class="tab ${route() === "/road-safety/scenarios" ? "active" : ""}" data-go="/road-safety/scenarios">More scenarios</button>
        <button class="tab ${route() === "/road-safety/score" ? "active" : ""}" data-go="/road-safety/score">Score</button>
      </div>
      <div class="dashboard calm-layout">
        <div class="card simple-panel">
          ${subpage === "learn" ? `<h2>Start with right of way</h2><p>Learn what to do at crossings, signals, lanes, emergency vehicles and low-visibility conditions.</p><div class="module-grid">${roadModules.map(([title, body], index) => `<article class="module-card tone-${["mint", "blue", "peach", "lilac"][index % 4]}"><h3>${title}</h3><p>${body}</p><button class="btn secondary" data-success="${title} lesson opened">Open</button></article>`).join("")}</div>` : subpage === "simulation" ? `<h2>Optional driving simulation</h2><p>A short, skippable practice path for signals, pedestrians, school zones, merging, rain and night driving.</p><div class="simulation-strip"><span>Signal</span><span>Pedestrian</span><span>Merge</span><span>Rain</span></div><button class="btn secondary" data-success="Simulation prototype started">Start 2-minute practice</button>` : `<h2>${subpage === "scenarios" ? "Scenario practice" : "Today’s scenario"}</h2><p>${scenario.question}</p><div class="scenario-options">${scenario.options.map(([label], idx) => `<button class="btn secondary" data-scenario="${idx}">${label}</button>`).join("")}</div>${answer === null ? "" : `<div class="${scenario.options[answer][1] ? "success-state" : "error-state"}" style="margin-top:16px">${scenario.options[answer][2]}</div>`}`}
        </div>
        <aside class="card simple-panel">
          <div class="score-ring"><div><strong>782</strong><span>/900</span></div></div>
          <h2>Learning score</h2>
          <p class="muted">Strongest area: vehicle compliance. Suggested next lesson: right of way.</p>
          <button class="btn secondary" data-success="Right of way lesson opened">Start lesson</button>
        </aside>
      </div>
    </section>
  `);
}

function rulesPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Rules</div><h1 class="page-title">Plain-language road rules.</h1></div><p class="muted">A learning library for signs, signals, right of way, lane discipline, parking, seatbelts, helmets, pedestrians, emergencies, night driving and rain.</p></div>
      <div class="module-grid">${roadModules.concat([["Parking", "Understand where stopping creates risk or penalty."], ["Emergency vehicles", "Know how to safely give way."]]).map(([title, body], index) => `<article class="module-card tone-${["mint", "blue", "peach", "lilac"][index % 4]}"><h3>${title}</h3><p>${body}</p><button class="btn secondary" data-success="${title} lesson opened">Open</button></article>`).join("")}</div>
    </section>
  `);
}

function formsPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Forms and downloads</div><h1 class="page-title">Find the document you need.</h1></div><p class="muted">Official downloads are grouped by citizen task rather than department name.</p></div>
      <div class="simple-service-list">
        ${["RC replacement forms", "Ownership transfer checklist", "Driving licence renewal checklist", "Permit and fitness checklist", "Payment receipt recovery", "Application acknowledgement"].map((item) => `<article class="simple-service"><div><h2>${item}</h2><p>Prototype entry. Production links must point to approved official files and show review dates.</p></div><span class="status info">Download</span></article>`).join("")}
      </div>
    </section>
  `);
}

function privacyPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Privacy and accessibility</div><h1 class="page-title">Clear consent, readable by default.</h1></div><p class="muted">The platform explains what it uses, why it uses it, and asks before sensitive actions.</p></div>
      <div class="principle-grid">
        <article class="card simple-panel"><h2>Consent</h2><p class="muted">Linked records and document processing require explicit consent.</p></article>
        <article class="card simple-panel"><h2>Data minimisation</h2><p class="muted">Keep only what is needed for the journey and mask sensitive identifiers.</p></article>
        <article class="card simple-panel"><h2>Accessibility</h2><p class="muted">Keyboard navigation, visible focus, scalable text, high contrast, simple mode and voice support.</p></article>
      </div>
    </section>
  `);
}

function governmentPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Government and industry</div><h1 class="page-title">Operational and governance view.</h1></div><p class="muted">Dashboards, notices, analytics and content ownership live away from citizen task flows.</p></div>
      <div class="simple-service-list">
        ${governanceRows.map(([title, body]) => `<article class="simple-service"><div><h2>${title}</h2><p>${body}</p></div><span class="status neutral">Governance</span></article>`).join("")}
        <article class="simple-service"><div><h2>Success metrics</h2><p>Track service discovery success, abandonment, support requests, payment recovery, reminder conversion and accessibility task success.</p></div><span class="status info">Analytics</span></article>
        <article class="simple-service"><div><h2>News and notices</h2><p>Relevant outages and updates appear only when they affect a user journey.</p></div><span class="status neutral">Notices</span></article>
      </div>
    </section>
  `);
}

function rtoPage() {
  const service = services.find((item) => item.id === "permanent-dl") || services[0];
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Find RTO</div><h1 class="page-title">Find the right place to visit.</h1></div><p class="muted">Search only when a visit is actually needed.</p></div>
      <div class="card service-search simple-panel"><form class="intent-form" data-rto-form><input name="q" aria-label="Search RTO" placeholder="City, PIN or service" /><button class="btn" type="submit">Search</button><button class="btn secondary" type="button" data-success="Showing mock nearby centres">Use location</button></form></div>
      <div class="grid rto-grid">${rtos.map((r) => `<article class="card rto-card"><span class="status neutral">${r.city}</span><h2>${r.name}</h2><p>${r.address}</p><p class="muted">${r.services}</p><p><strong>${r.hours}</strong></p><p class="muted">${r.distance} from saved location</p><button class="btn secondary" data-go="/assistant">Ask what to carry</button></article>`).join("")}</div>
      <div class="card simple-panel">${slotBookingMarkup(service)}</div>
    </section>
  `);
}

function platformPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Service map</div><h1 class="page-title">Find the right transport service.</h1></div><p class="muted">Browse by everyday needs: personal tasks, vehicle work, licence work, payments, applications and help.</p></div>
      <div class="feature-groups">
        ${featureGroups.map((group) => `<article class="feature-group">
          <h3>${group.title}</h3>
          <p>${group.body}</p>
          <div>${group.links.map(([label, href]) => `<button class="pill" data-go="${href}">${label}</button>`).join("")}</div>
        </article>`).join("")}
      </div>
      <div class="card simple-panel coverage-card">
        <h2>Available help areas</h2>
        <div class="simple-service-list">
          ${coverageRows.map(([title, body]) => `<article class="simple-service"><div><h2>${title}</h2><p>${body}</p></div><span class="status good">Ready</span></article>`).join("")}
        </div>
      </div>
    </section>
  `);
}

function helpPage() {
  return shell(`
    <section class="section content-page">
      <div class="page-header"><div><div class="eyebrow">Help</div><h1 class="page-title">What is blocking you?</h1></div><p class="muted">Pick the closest problem. The assistant keeps the context of your journey.</p></div>
      <div class="simple-service-list">
        ${["I do not understand this step", "I do not have this document", "My payment failed", "My application is stuck", "My details are wrong", "OTP issue"].map((x) => `<article class="simple-service" data-go="/assistant" tabindex="0"><div><h2>${x}</h2><p>Get a plain-language explanation and a next step.</p></div><span class="arrow">Ask -></span></article>`).join("")}
      </div>
    </section>
  `);
}

function notFound() {
  return shell(`<section class="section"><div class="empty-state"><h1>Page not found</h1><p class="muted">This prototype route is not available yet.</p><button class="btn" data-go="/">Go home</button></div></section>`);
}

function render() {
  if (!state.onboarding.complete) {
    document.getElementById("app").innerHTML = onboardingPage();
    wireEvents();
    return;
  }

  const path = route();
  let html;
  if (path === "/") html = home();
  else if (path === "/vahan") html = vahanPage();
  else if (path === "/sarathi") html = sarathiPage();
  else if (path === "/services") html = servicesPage();
  else if (path.startsWith("/flow/")) html = flowPage(path.split("/").pop());
  else if (path.startsWith("/services/")) html = servicePage(path.split("/").pop());
  else if (path === "/my-mobility") html = mobilityPage();
  else if (path === "/profile") html = profilePage();
  else if (path === "/vehicles") html = vehiclesPage();
  else if (path === "/driving-licence") html = drivingLicencePage();
  else if (path === "/challans") html = challansPage();
  else if (path === "/payments") html = paymentsPage();
  else if (path === "/documents") html = documentsPage();
  else if (path === "/applications") html = applicationsPage();
  else if (path === "/notifications") html = notificationsPage();
  else if (path.startsWith("/updates/")) html = updateDetailPage(path.split("/").pop());
  else if (path === "/assistant") html = assistantPage();
  else if (path === "/road-safety" || path.startsWith("/road-safety/")) html = roadSafetyPage();
  else if (path === "/rto") html = rtoPage();
  else if (path === "/rules") html = rulesPage();
  else if (path === "/forms") html = formsPage();
  else if (path === "/privacy") html = privacyPage();
  else if (path === "/government") html = governmentPage();
  else if (path === "/platform") html = platformPage();
  else if (path === "/help") html = helpPage();
  else html = notFound();
  document.getElementById("app").innerHTML = html;
  wireEvents();
}

function wireEvents() {
  document.querySelector("[data-onboarding-language]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.language = new FormData(event.target).get("language") || "en";
    state.onboarding.step = "service";
    persistSetup();
    render();
  });

  document.querySelectorAll("[data-onboarding-service]").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboarding.selectedService = button.dataset.onboardingService;
      if (state.onboarding.selectedService === "other") {
        state.onboarding.userType = "other-help";
        state.onboarding.userStatus = "assistant-first";
        state.onboarding.complete = true;
        state.onboarding.step = "done";
        state.assistant = [{
          from: "assistant",
          text: "Tell me what you are trying to do. I will find the right Parivahan service and take you to the correct page.",
        }];
        persistSetup({ complete: true });
        go("/assistant");
        render();
        return;
      }
      state.onboarding.step = "role";
      persistSetup();
      render();
    });
  });

  document.querySelectorAll("[data-user-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboarding.userType = button.dataset.userType;
      state.onboarding.step = "status";
      persistSetup();
      render();
    });
  });

  document.querySelectorAll("[data-user-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboarding.userStatus = button.dataset.userStatus;
      state.onboarding.step = "profile";
      state.onboarding.otpSent = false;
      persistSetup();
      render();
    });
  });

  document.querySelector("[data-onboarding-profile]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    state.onboarding.mobile = String(data.get("mobile") || "").replace(/\D/g, "").slice(0, 10);
    state.onboarding.aadhaar = String(data.get("aadhaar") || "").replace(/\D/g, "").slice(0, 12);
    if (!state.onboarding.otpSent) {
      state.onboarding.otpSent = true;
      persistSetup();
      render();
      return;
    }
    if (String(data.get("otp") || "").trim() !== "123456") {
      event.target.insertAdjacentHTML("beforeend", `<div class="error-state compact-state">${oc("otpError")}</div>`);
      return;
    }
    state.onboarding.complete = true;
    state.onboarding.step = "done";
    state.onboarding.otpVerified = true;
    persistSetup({
      complete: true,
      mobileMasked: `+91 ******${String(data.get("mobile") || "").slice(-4)}`,
      aadhaarMasked: `XXXX XXXX ${String(data.get("aadhaar") || "").slice(-4)}`,
    });
    go("/");
    render();
  });

  document.querySelectorAll("[data-onboarding-back]").forEach((button) => {
    button.addEventListener("click", () => {
      const order = ["language", "service", "role", "status", "profile"];
      const index = order.indexOf(state.onboarding.step);
      state.onboarding.step = order[Math.max(0, index - 1)];
      state.onboarding.otpSent = false;
      render();
    });
  });

  document.querySelector("[data-language]")?.addEventListener("change", (event) => {
    state.language = event.target.value;
    persistSetup({ language: state.language });
    render();
  });

  document.querySelector("[data-reset-onboarding]")?.addEventListener("click", () => {
    localStorage.removeItem("parivahanSetup");
    state.onboarding = {
      step: "language",
      complete: false,
      selectedService: "",
      userType: "",
      userStatus: "",
      mobile: "",
      aadhaar: "",
      otpSent: false,
      otpVerified: false,
    };
    render();
  });

  document.querySelector("[data-toggle-record-edit]")?.addEventListener("click", () => {
    state.editingRecords = !state.editingRecords;
    render();
  });

  document.querySelectorAll("[data-toggle-notifications]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.notificationsOpen = !state.notificationsOpen;
      render();
    });
  });

  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => {
      state.notificationsOpen = false;
      go(el.dataset.go);
    });
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        state.notificationsOpen = false;
        go(el.dataset.go);
      }
    });
  });

  document.querySelectorAll("[data-suggest]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.suggest.toLowerCase().includes("don't know")) {
        go("/assistant");
        return;
      }
      const service = matchService(button.dataset.suggest);
      go(`/services/${service.id}`);
    });
  });

  document.querySelector("[data-intent-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = new FormData(event.target).get("intent") || "";
    const service = matchService(String(value));
    go(`/services/${service.id}`);
  });

  document.querySelector("[data-assistant-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.target.message;
    const text = input.value.trim();
    if (!text) return;
    assistantReply(text);
    input.value = "";
    state.voiceStatus = "";
    render();
  });

  document.querySelector("[data-clear-chat]")?.addEventListener("click", () => {
    state.assistant = [{ from: "assistant", text: "Chat cleared. Tell me what happened and I will map it to a transport service." }];
    state.voiceStatus = "";
    render();
  });

  document.querySelectorAll("[data-start-application]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = services.find((x) => x.id === button.dataset.startApplication);
      state.assistant.push({ from: "assistant", text: `Started a guided prototype journey for ${service.label}. First step: confirm the record and consent to use saved details.` });
      go("/assistant");
    });
  });

  document.querySelectorAll("[data-ask-about]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = services.find((x) => x.id === button.dataset.askAbout);
      state.assistant.push({ from: "assistant", text: `For ${service.label}, you will need: ${service.documents.join(", ")}. I will not submit or pay without confirmation.` });
      go("/assistant");
    });
  });

  document.querySelectorAll("[data-flow-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = services.find((item) => item.id === button.dataset.flowNext);
      const flow = flowForService(service);
      const currentIndex = state.flowProgress[service.id] || 0;
      if (currentIndex < flow.length - 1) {
        state.flowProgress[service.id] = currentIndex + 1;
        render();
        return;
      }
      button.insertAdjacentHTML("afterend", `<div class="success-state" style="margin-top:12px">Application is ready for submission and tracking. In production this would submit only after final consent.</div>`);
      button.disabled = true;
    });
  });

  document.querySelectorAll("[data-flow-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = button.dataset.flowPrev;
      state.flowProgress[serviceId] = Math.max(0, (state.flowProgress[serviceId] || 0) - 1);
      render();
    });
  });

  document.querySelectorAll("[data-copilot-fill]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = button.dataset.copilotFill;
      const service = services.find((item) => item.id === serviceId);
      state.copilotDrafts[serviceId] = true;
      state.approvedApplications[serviceId] = false;
      state.assistant.push({
        from: "assistant",
        text: `I prepared an editable draft for ${service.label}. Please review the fields, correct anything needed, upload required documents and approve only when everything looks right.`,
      });
      render();
    });
  });

  document.querySelectorAll("[data-approve-application]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = button.dataset.approveApplication;
      state.approvedApplications[serviceId] = true;
      state.copilotDrafts[serviceId] = true;
      render();
    });
  });

  document.querySelectorAll("[data-book-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = button.dataset.bookSlot;
      state.bookedSlots[serviceId] = {
        rto: button.dataset.rto,
        slot: button.dataset.slot,
      };
      const service = services.find((item) => item.id === serviceId);
      state.assistant.push({
        from: "assistant",
        text: `Booked ${button.dataset.slot} at ${button.dataset.rto} for ${service.label}. I added the visit checklist so the user knows what documents to carry and what to check before going.`,
      });
      render();
    });
  });

  document.querySelectorAll("[data-success]").forEach((button) => {
    button.addEventListener("click", () => {
      button.insertAdjacentHTML("afterend", `<div class="success-state" style="margin-top:12px">${button.dataset.success}</div>`);
      button.disabled = true;
    });
  });

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeScenario = Number(button.dataset.scenario);
      render();
    });
  });

  document.querySelector("[data-rto-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.target.insertAdjacentHTML("afterend", `<div class="loading-state" style="margin-top:12px">Showing matching mock RTO records. Production search would use authoritative location and service data.</div>`);
  });

  document.querySelectorAll("[data-voice]").forEach((button) => {
    button.addEventListener("click", () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        state.voiceStatus = "Voice input is not available in this browser. Typed search is ready.";
        render();
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = state.language === "hi" ? "hi-IN" : state.language === "ta" ? "ta-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      state.voiceStatus = "Listening. Speak your transport task now.";
      render();
      recognition.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript?.trim();
        if (!text) {
          state.voiceStatus = "I could not catch that. Please try again or type your task.";
          render();
          return;
        }
        const formInput = document.querySelector("input[name='intent'], input[name='message']");
        if (formInput) formInput.value = text;
        if (location.hash === "#/assistant") {
          assistantReply(text);
          state.voiceStatus = `Heard: "${text}"`;
          render();
        } else {
          state.voiceStatus = `Heard: "${text}"`;
        }
      };
      recognition.onerror = (event) => {
        const messages = {
          "not-allowed": "Microphone access was blocked. Allow microphone access in the browser and try again.",
          "no-speech": "I did not hear anything. Please try again or type your task.",
          "audio-capture": "No microphone was found. Typed search is ready.",
          network: "Voice recognition needs browser speech support. Typed search is ready.",
        };
        state.voiceStatus = messages[event.error] || "Voice input could not start. Typed search is ready.";
        render();
      };
      recognition.onend = () => {
        if (state.voiceStatus === "Listening. Speak your transport task now.") {
          state.voiceStatus = "Listening stopped. Please try again or type your task.";
          render();
        }
      };
      try {
        recognition.start();
      } catch (error) {
        state.voiceStatus = "Voice input could not start here. Typed search is ready.";
        render();
      }
    });
  });
}

window.addEventListener("hashchange", render);
render();
