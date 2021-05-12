'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerInterests = document.querySelector('.interests');
const inputEmoji = document.querySelector('.form__input--emoji');
const inputTitle = document.querySelector('.form__input--title');
const inputType = document.querySelector('.form__input--type');
const inputAdmission = document.querySelector('.form__input--admission');
const inputTime = document.querySelector('.form__input--time');
const inputEra = document.querySelector('.form__input--era');
const logo = document.querySelector('.logo');
const link = document.querySelector('.interest__link');
const inputSort = document.querySelector('.form__input--sort');
const formSort = document.querySelector('.form__sort');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.btn--close-modal');
const modalContent = document.querySelector('.modal__content');
const overlay = document.querySelector('.overlay');
const formTimeline = document.querySelector('.form__timeline');
const inputTimeline = document.querySelector('.form__input--timeline');
const loader = document.querySelector('.loader');
const mapError = document.querySelector('.map__error');
const myPosition = document.querySelector('.my_position');

class Interest {
  id = Date.now();
  constructor(coords, title, type, emoji, time, admission, era) {
    this.coords = coords;
    this.title = title;
    this.type = type;
    this.emoji = emoji;
    this.time = time;
    this.admission = admission;
    this.era = era;
  }
}

// class Historical extends Interest {
//   constructor(coords, title, type, emoji, time, admission, era) {
//     super(coords, title, type, emoji, time, admission);
//     this.era = era;
//   }
// }

/////////////////////////////////
// architecture
class App {
  #myPos;
  #sorted = [];
  #popup;
  #popups = [];
  #closeZoom = 15;
  #farZoom = 12;
  #coords;
  #marker;
  #map;
  #mapEvent;
  #curMarker;
  #markers = [];
  // prettier-ignore
  #interests = [/*{"id":1619133415003,"coords":[32.65777623601417,51.669354295590125],"title":"Isfahan City","type":"recreational","emoji":"🏙","time":"24hr","admission":"free","era":"Cont"},*/
    {"id":1618962089993,"coords":[32.65727109308283,51.677569690879054],"dgp":"Naqsh-e Jahan","title":"Naqsh-e Jahan Square","type":"historical","emoji":"🔲","time":"24hr","admission":"free","era":"Safavi"},
{"id":1618962148482,"coords":[32.657370400605096,51.67865307374407],"dgp":"Naqsh-e Jahan","title":"Sheikh Lotfollah Mosque","type":"religious","emoji":"🕌","time":"9-16","admission":"paid","era":"Safavi"},
{"id":1618962223530,"coords":[32.65707518592265,51.676566743475895],"dgp":"Naqsh-e Jahan","title":"Ali Qapu Palace","type":"historical","emoji":"🏛","time":"9-16","admission":"paid","era":"Safavi"},
{"id":1618962276229,"coords":[32.65489219327761,51.67786532087726],"dgp":"Naqsh-e Jahan","title":"The Shah Mosque","type":"religious","emoji":"🕌","time":"9-16","admission":"paid","era":"Safavi"},
{"id":1618962545997,"coords":[32.658222635045675,51.67734803619465],"dgp":"Naqsh-e Jahan","title":"Naqsh-e Jahan Carriage Riding","type":"recreational","emoji":"🐎","time":"9-17","admission":"paid","era":"Cont"},
{"id":1618962858802,"coords":[32.66028186770587,51.676846849578965],"dgp":"Naqsh-e Jahan","title":"Qeysarie Bazaar","type":"historical","emoji":"🏪","time":"8-22","admission":"free","era":"Safavi"},
{"id":1618963546426,"coords":[32.66065398350147,51.677658082799994],"dgp":"Naqsh-e Jahan","title":"Shahi Assarkhaneh","type":"historical","emoji":"🏭","time":"10-17","admission":"paid","era":"Safavi"},
{"id":1618963709164,"coords":[32.6612227217476,51.677953214027575],"dgp":"Naqsh-e Jahan","title":"Malek Timcheh","type":"historical","emoji":"🏪","time":"9-16","admission":"free","era":"Qajar"},
{"id":1618964225766,"coords":[32.65722898262278,51.67565121644858],"dgp":"Naqsh-e Jahan","title":"Tohidkhaneh","type":"religious","emoji":"🛕","time":"","admission":"no-visit","era":"Safavi"},
{"id":1618964446400,"coords":[32.657412309936376,51.6719010788243],"dgp":"Inside the Gates of Safavid Court","title":"Chehel Sotoun","type":"historical","emoji":"🏛","time":"9-16","admission":"paid","era":"Safavi"},
{"id":1618964625200,"coords":[32.65715862433923,51.674296470991315],"dgp":"Inside the Gates of Safavid Court","title":"Museum Of Contemporary Art: Jobehkhaneh","type":"art","emoji":"🎨","time":"9-20","admission":"paid","era":"Safavi"},
{"id":1618966319061,"coords":[32.656713584781045, 51.67426451010582],"dgp":"Inside the Gates of Safavid Court","title":"Museum Of Decorative Art: Rakibkhaneh Or Chaharbagh Palace","type":"art","emoji":"🎨","time":"9-13","admission":"paid","era":"Safavi"},
{"id":1618966488922,"coords":[32.65330343624568,51.67014738069446],"dgp":"Inside the Gates of Safavid Court","title":"Hasht Behesht","type":"historical","emoji":"🏛","time":"9-16","admission":"paid","era":"Safavi"},
{"id":1618966989907,"coords":[32.65494297212985,51.6688849324721],"dgp":"Inside the Gates of Safavid Court","title":"Chaharbagh-e Abbasi Thoroughfare","type":"recreational","emoji":"🚶‍♂️","time":"24hr","admission":"free","era":"Safavi"},
{"id":1618967786410,"coords":[32.65180143196632,51.66919099303088],"dgp":"Inside the Gates of Safavid Court","title":"Chaharbagh Religious School","type":"religious","emoji":"🏫","time":"Fri","admission":"paid","era":"Safavi"},
{"id":1618968147823,"coords":[32.652182690882995,51.669857413717395],"dgp":"Inside the Gates of Safavid Court","title":"Honar Bazaar","type":"historical","emoji":"🏪","time":"10-21","admission":"free","era":"Safavi"},
{"id":1618968304900,"coords":[32.658281819060896,51.673672016308394],"dgp":"Inside the Gates of Safavid Court","title":"Timurid Hall","type":"recreational","emoji":"🏛","time":"","admission":"free","era":"Timuri"},
{"id":1618968500107,"coords":[32.656108171412974,51.674429269081884],"dgp":"Inside the Gates of Safavid Court","title":"Ashraf Hall","type":"historical","emoji":"🏛","time":"","admission":"no-visit","era":"Safavi"},
{"id":1619132371836,"coords":[32.653438172163334,51.67540562179057],"dgp":"Inside the Gates of Safavid Court","title":"Ali Akbar Esfahani Statue","type":"art","emoji":"🗿","time":"24hr","admission":"free","era":"Cont"},
{"id":1618978265647,"coords":[32.66682093771314,51.68390393191659],"dgp":"The Faint Glory of Seljuq Empire","title":"Kohneh Square: Atiq Or Imam Ali Square","type":"historical","emoji":"🔲","time":"24hr","admission":"free","era":"Seljuq"},
{"id":1618979019945,"coords":[32.66508793438864,51.691333651542664],"dgp":"The Faint Glory of Seljuq Empire","title":"Tomb Of Khajeh Nizam Al-mulk & Malekshah: Dar Al-batikh","type":"historical","emoji":"💀","time":"","admission":"no-visit","era":"Seljuq"},
{"id":1618979282691,"coords":[32.669656174441734,51.68519890288736],"dgp":"The Faint Glory of Seljuq Empire","title":"Jameh Mosque Of Isfahan","type":"religious","emoji":"🕌","time":"9-14","admission":"paid","era":"Abasi"},
{"id":1618979670439,"coords":[32.66317215078287,51.67462348937989],"dgp":"The Faint Glory of Seljuq Empire","title":"Hakim Mosque","type":"religious","emoji":"🕌","time":"Azan","admission":"free","era":"Seljuq"},
{"id":1618979928533,"coords":[32.670387550442754,51.68541669845581],"dgp":"The Faint Glory of Seljuq Empire","title":"Allameh Majlesi Mausoleum","type":"religious","emoji":"💀","time":"6-22","admission":"free","era":"Safavi"},
{"id":1618980364873,"coords":[32.670376718626116,51.690879822235736],"dgp":"The Faint Glory of Seljuq Empire","title":"Kamal Esmail Tomb","type":"historical","emoji":"💀","time":"24hr","admission":"free","era":"Ilkhanate"},
{"id":1618980873069,"coords":[32.65006181189728,51.59398341165798],"dgp":"The City of Minarets","title":"Shaking Minarets","type":"historical","emoji":"🗼","time":"9-16","admission":"paid","era":"Ilkhanate"},
{"id":1618981076436,"coords":[32.669627447372065,51.68200922005781],"dgp":"The City of Minarets","title":"Dardasht Minarets: Sultan Bakht-agha Mausoleum","type":"historical","emoji":"🗼","time":"24hr","admission":"free","era":"Ilkhanate"},
{"id":1618981277761,"coords":[32.66893531129856,51.69314467959339],"dgp":"The City of Minarets","title":"Darozziafeh Minarets","type":"historical","emoji":"🗼","time":"24hr","admission":"free","era":"Ilkhanate"},
{"id":1618981774753,"coords":[32.68145333094658,51.69190549771884],"dgp":"The City of Minarets","title":"Bagh-e Ghoushkhaneh Minaret","type":"historical","emoji":"🗼","time":"24hr","admission":"free","era":"Ilkhanate"},
{"id":1618982012742,"coords":[32.67346681153478,51.69449007524236],"dgp":"The City of Minarets","title":"Chehel Dokhtaran Minaret: Garland","type":"historical","emoji":"🗼","time":"24hr","admission":"free","era":"Ilkhanate"},
{"id":1618982468045,"coords":[32.66530016586396,51.682954430907564],"dgp":"The City of Minarets","title":"Ali Minaret And Mosque","type":"religious","emoji":"🗼","time":"Azan","admission":"free","era":"Abasi"},
{"id":1618982657091,"coords":[32.636769915500025,51.68329238367733],"dgp":"Along Zayanderud River","title":"Khaju Bridge","type":"historical","emoji":"🌉","time":"24hr","admission":"free","era":"Safavi"},
{"id":1618982872382,"coords":[32.64131786703348,51.64339935792669],"dgp":"Along Zayanderud River","title":"Marnan Bridge","type":"historical","emoji":"🌉","time":"24hr","admission":"free","era":"Sasani"},
{"id":1618982982045,"coords":[32.64427940700729,51.66748666815694],"dgp":"Along Zayanderud River","title":"Si-se-pol Bridge","type":"historical","emoji":"🌉","time":"24hr","admission":"free","era":"Safavi"},
{"id":1618983133031,"coords":[32.637940302614716,51.67744517326356],"dgp":"Along Zayanderud River","title":"Joubi Bridge","type":"historical","emoji":"🌉","time":"24hr","admission":"free","era":"Safavi"},
{"id":1618983419541,"coords":[32.62694583409493,51.717667581615395],"dgp":"Along Zayanderud River","title":"Shahrestan Bridge","type":"historical","emoji":"🌉","time":"24hr","admission":"free","era":"Sasani"},
{"id":1618984283977,"coords":[32.630198038328054,51.71282351016998],"dgp":"Along Zayanderud River","title":"Ashraf Historical Hill","type":"historical","emoji":"⛰","time":"24hr","admission":"free","era":"Prehistory"},
{"id":1618984514650,"coords":[32.647687469795656,51.6514041422488],"dgp":"Along Zayanderud River","title":"Sa’eb-e Tabrizi Monument","type":"historical","emoji":"💀","time":"24hr","admission":"free","era":"Pahlavi"},
{"id":1618984631344,"coords":[32.63815920461753,51.68478047893587],"dgp":"Along Zayanderud River","title":"Arthur Pope & Phyllis Ackerman Tomb","type":"historical","emoji":"💀","time":"24hr","admission":"free","era":"Pahlavi"},
{"id":1618985342752,"coords":[32.62452769745411,51.68102645664476],"dgp":"Visiting the Other Side!","title":"Takht-e Foulad Cemetery","type":"historical","emoji":"💀","time":"24hr","admission":"free","era":"Prehistory"},
{"id":1618985680238,"coords":[32.6140266251727,51.653170106437756],"dgp":"Visiting the Other Side!","title":"Armenian & European Cemetery","type":"religious","emoji":"💀","time":"9-17","admission":"paid","era":"Safavi"},
{"id":1619039170972,"coords":[32.663398091417896,51.68567419052125],"dgp":"Visiting the Other Side!","title":"Isaiah Mausoleum And Imamzadeh Ismail","type":"religious","emoji":"🛕","time":"8-12","admission":"free","era":"Seljuq"},
{"id":1619039380225,"coords":[32.65368321088099,51.680166006481166],"dgp":"Visiting the Other Side!","title":"Imamzadeh Ahmad","type":"religious","emoji":"🛕","time":"7-19","admission":"free","era":"Safavi"},
{"id":1619045192381,"coords":[32.665682312597816,51.68283319486364],"dgp":"Visiting the Other Side!","title":"Imamzadeh Harounieh - Haroun-e-velayat","type":"religious","emoji":"🛕","time":"8-17","admission":"free","era":"Safavi"},
{"id":1619045447474,"coords":[32.629771112586894,51.71819329196296],"dgp":"Visiting the Other Side!","title":"Tomb Of Caliph Billah Al-rashid","type":"religious","emoji":"🛕","time":"7-21","admission":"free","era":"Seljuq"},
{"id":1619045790268,"coords":[32.65147695401472,51.701282501417154],"dgp":"Visiting the Other Side!","title":"Emamzadeh Shahzayd","type":"religious","emoji":"🛕","time":"8-22","admission":"free","era":"Safavi"},
{"id":1619046009424,"coords":[32.663054367322076,51.68432879454486],"dgp":"Visiting the Other Side!","title":"Emamzadeh Jafar","type":"religious","emoji":"🛕","time":"7-17","admission":"free","era":"Ilkhanate"},
{"id":1619046432976,"coords":[32.64805233121796,51.57029306901678],"dgp":"The City of Religions","title":"Fire Temple Of Isfahan: Mount Atashgah","type":"historical","emoji":"🏛","time":"9-16","admission":"paid","era":"Sasani"},
{"id":1619046572289,"coords":[32.66497012349469,51.663888216608036],"dgp":"The City of Religions","title":"Seyed Mosque","type":"religious","emoji":"🕌","time":"8-21","admission":"free","era":"Qajar"},
{"id":1619046990889,"coords":[32.634903380736645,51.655786871779135],"dgp":"The City of Religions","title":"Vank Cathedral","type":"religious","emoji":"⛪","time":"9-18","admission":"paid","era":"Safavi"},
{"id":1619047244282,"coords":[32.63573809268986,51.66067278365518],"dgp":"The City of Religions","title":"Darb-e Mehr-e Gohar-o Mehraban Fire Temple","type":"religious","emoji":"🔥","time":"Arranged","admission":"paid","era":"Cont"},
{"id":1619047852643,"coords":[32.670056231858155,51.690495729708346],"dgp":"The City of Religions","title":"Mollah Yaqub Synagogue","type":"religious","emoji":"🕍","time":"Arranged","admission":"paid","era":"Qajar"},
{"id":1619048019804,"coords":[32.636417221206365,51.657741665840156],"dgp":"The City of Religions","title":"Beitlahm Church","type":"religious","emoji":"⛪","time":"9-18","admission":"paid","era":"Safavi"},
{"id":1619048615712,"coords":[32.68019881822341,51.69264900690906],"dgp":"The City of Religions","title":"Ali-ibn Sahl Monastery","type":"religious","emoji":"🛕","time":"Arranged","admission":"paid","era":"Buyid"},
{"id":1619048924096,"coords":[32.66323969105091,51.681736707196265],"dgp":"Inside the Living Rooms of History","title":"Moshir Al-molk Historical House: Museum Of Islamic Heritage","type":"historical","emoji":"🏠","time":"8-16","admission":"paid","era":"Safavi"},
{"id":1619049182735,"coords":[32.65429229718294,51.6863876577918],"dgp":"Inside the Living Rooms of History","title":"Angurestan-e Malek: Malek Vineyard","type":"historical","emoji":"🏠","time":"9-19","admission":"paid","era":"Qajar"},
{"id":1619049463987,"coords":[32.65387926417313,51.68093740940095],"dgp":"Inside the Living Rooms of History","title":"Mashrouteh House Of Isfahan","type":"historical","emoji":"🏠","time":"9-18","admission":"free","era":"Qajar"},
{"id":1619049812302,"coords":[32.65290918090179,51.66540956444806],"dgp":"Inside the Living Rooms of History","title":"Ata Al-molk House: Museum Of Educational System","type":"historical","emoji":"🏠","time":"8-13","admission":"paid","era":"Qajar"},
{"id":1619050001160,"coords":[32.65338792435582,51.68612587458484],"dgp":"Inside the Living Rooms of History","title":"Mollabashi House","type":"historical","emoji":"🏠","time":"9-19","admission":"paid","era":"Qajar"},
{"id":1619050352401,"coords":[32.66953416086179,51.68221306794294],"dgp":"Inside the Living Rooms of History","title":"Javaheri Historical House","type":"historical","emoji":"🏠","time":"10-20","admission":"free","era":"Qajar"},
{"id":1619052120033,"coords":[32.668211185217444,51.66752099925361],"dgp":"Let’s Take a Dip in History!","title":"Aliqoli Agha Bathhouse Museum","type":"historical","emoji":"🛁","time":"9-18","admission":"paid","era":"Safavi"},
{"id":1619052712428,"coords":[32.651854224078356,51.75099563624827],"dgp":"Let’s Take a Dip in History!","title":"Naghashi Bathhouse","type":"recreational","emoji":"🛀","time":"6-17","admission":"paid","era":"Safavi"},
{"id":1619053013627,"coords":[32.68358280150349,51.60138845443726],"dgp":"Let’s Take a Dip in History!","title":"Rehnan Bathhouse Museum","type":"historical","emoji":"🛁","time":"8-18","admission":"paid","era":"Safavi"},
{"id":1619053168454,"coords":[32.67164733541588,51.68027544139478],"dgp":"Let’s Take a Dip in History!","title":"Dardasht Bathhouse Museum","type":"historical","emoji":"🛁","time":"9-17","admission":"free","era":"Safavi"},
{"id":1619053371750,"coords":[32.663033807475394,51.67510843224591],"dgp":"Let’s Take a Dip in History!","title":"Jarchibashi Bathhouse","type":"recreational","emoji":"🛁","time":"12-23","admission":"free","era":"Safavi"},
{"id":1619053662398,"coords":[32.671775554279385,51.6810865404841],"dgp":"Let’s Take a Dip in History!","title":"Aghanour Mosque","type":"religious","emoji":"🕌","time":"Azan","admission":"free","era":"Safavi"},
{"id":1619053743843,"coords":[32.667843264488944,51.667606830596924],"dgp":"Let’s Take a Dip in History!","title":"Aliqoli Agha Mosque","type":"religious","emoji":"🕌","time":"Azan","admission":"free","era":"Safavi"},
{"id":1619054042876,"coords":[32.66923339544943,51.6676400900542],"dgp":"Zurkhaneh: Iranian Classic Workout","title":"Aliqoli Agha Zourkhaneh","type":"recreational","emoji":"🏋️‍♀️","time":"20-21","admission":"free","era":"Safavi"},
{"id":1619054238725,"coords":[32.671956533974246,51.67279315053748],"dgp":"Zurkhaneh: Iranian Classic Workout","title":"Ali Ibn Abitaleb Zourkhaneh","type":"recreational","emoji":"🏋️‍♀️","time":"19-21","admission":"paid","era":"Cont"},
{"id":1619054545305,"coords":[32.67002092739291,51.68972325318464],"dgp":"Zurkhaneh: Iranian Classic Workout","title":"Mola Ali Zourkhaneh","type":"recreational","emoji":"🏋️‍♀️","time":"21-22","admission":"paid","era":"Cont"},
{"id":1619054697915,"coords":[32.67418318786456,51.67913496494293],"dgp":"Zurkhaneh: Iranian Classic Workout","title":"Avicenna School","type":"historical","emoji":"🏫","time":"","admission":"no-visit","era":"Buyid"},
{"id":1619055276211,"coords":[32.596171730314595,51.64465785026551],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Shahdezh Fort","type":"historical","emoji":"🏰","time":"","admission":"no-visit","era":"Seljuq"},
{"id":1619055796891,"coords":[32.59193349342868,51.63763153559558],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Zip-line & Suspension Bridge","type":"recreational","emoji":"🕹","time":"Fri","admission":"paid","era":"Cont"},
{"id":1619055982542,"coords":[32.591615430910764,51.656513214111335],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Cable Car","type":"recreational","emoji":"🚠","time":"16-22","admission":"paid","era":"Cont"},
{"id":1619056066109,"coords":[32.5915205677047,51.65627717971802],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Bowling Center","type":"recreational","emoji":"🎳","time":"15-22","admission":"paid","era":"Cont"},
{"id":1619056264892,"coords":[32.59194074253069,51.64994180202485],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Sofeh Park Zoo","type":"recreational","emoji":"🐐","time":"Fri","admission":"paid","era":"Cont"},
{"id":1619056385662,"coords":[32.61546430316712,51.67008304681076],"dgp":"Sofeh: Isfahan’s Rooftop","title":"Mardavij Pigeon Tower","type":"historical","emoji":"🗼","time":"8-13","admission":"free","era":"Safavi"},
{"id":1619130223024,"coords":[32.63767370631345,51.612246037184384],"dgp":"Nazhvan: Land of Wildlife","title":"Isfahan Aquarium","type":"recreational","emoji":"🐟","time":"9-18","admission":"paid","era":"Cont"},
{"id":1619130439758,"coords":[32.63669661932226,51.62598752962368],"dgp":"Nazhvan: Land of Wildlife","title":"Nazhvan Chairlift","type":"recreational","emoji":"🚡","time":"10-17","admission":"paid","era":"Cont"},
{"id":1619130532999,"coords":[32.64067884912547,51.609667896700564],"dgp":"Nazhvan: Land of Wildlife","title":"Birds’ Garden","type":"recreational","emoji":"🐦","time":"8-17","admission":"paid","era":"Cont"},
{"id":1619130754612,"coords":[32.63755358459798,51.613804936278044],"dgp":"Nazhvan: Land of Wildlife","title":"Reptiles’ Garden","type":"recreational","emoji":"🐊","time":"9-17","admission":"paid","era":"Cont"},
{"id":1619130952230,"coords":[32.63755809957402,51.61392831789272],"dgp":"Nazhvan: Land of Wildlife","title":"Seashells, Snails, And Butterflies’ Garden","type":"recreational","emoji":"🦋","time":"9-17","admission":"paid","era":"Cont"},
{"id":1619131163214,"coords":[32.63657842813061,51.7911772725347],"dgp":"Let’s Have Fun!","title":"Dream Land","type":"recreational","emoji":"🎡","time":"10-22","admission":"paid","era":"Cont"},
{"id":1619131346830,"coords":[32.634257715293586,51.65754854646366],"dgp":"Let’s Have Fun!","title":"Isfahan Music Museum","type":"recreational","emoji":"🎵","time":"9-21","admission":"paid","era":"Cont"},
{"id":1619131521960,"coords":[32.63946321927688,51.69740509980329],"dgp":"Let’s Have Fun!","title":"Flowers’ Garden","type":"recreational","emoji":"🌼","time":"7-21","admission":"paid","era":"Cont"},
{"id":1619132007162,"coords":[32.551548520787634,51.689352033426985],"dgp":"Let’s Have Fun!","title":"Isfahan Shopping Center","type":"recreational","emoji":"🛒","time":"10-23","admission":"free","era":"Cont"},
].reverse()

  constructor() {
    this._getGeolocation();
    // this._getLocalStorage();
    this._loadMap();
    form.addEventListener('submit', this._newInterest.bind(this));
    // logo.addEventListener('click', this._clearLocalStorage.bind(this));
    containerInterests.addEventListener('click', this._popupPan.bind(this));
    formSort.addEventListener('submit', this._sortInterest.bind(this));
    containerInterests.firstElementChild.classList.add('select-color');
    document.addEventListener('click', this._openModal.bind(this));
    modalClose.addEventListener('click', this._closeModal.bind(this));
    overlay.addEventListener('click', this._closeModal.bind(this));
    formTimeline.addEventListener('submit', this._sortInterestDyn.bind(this));
    document.addEventListener('keyup', this._keyup.bind(this));
    myPosition.addEventListener('click', this._panMyPosition.bind(this));
  }

  _getGeolocation() {
    this._getPosition()
      .then(pos => this._showMyPosition(pos))
      .catch(() => this._displayError(`Couldn't get your location.`));
    // if (navigator.geolocation)
    //   navigator.geolocation.getCurrentPosition(
    //     this._showMyPosition.bind(this),
    //     function () {
    //       mapError.textContent = `Couldn't get your location.`;
    //       mapError.classList.remove('hidden');
    //       setTimeout(() => mapError.classList.add('hidden'), 5000);
    //     }
    //   );
  }

  _getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  _displayError(msg) {
    mapError.textContent = msg;
    mapError.classList.remove('hidden');
    setTimeout(() => mapError.classList.add('hidden'), 5000);
  }

  _loadMap(position) {
    const lat = 32.62530953459631;
    const lng = 51.67921111165265;

    console.log(`https://www.google.com/maps/@${lat},${lng},14.74z`);

    this.#coords = [lat, lng];

    this.#map = L.map('map').setView(this.#coords, this.#farZoom, {
      animate: true,
      pan: { duration: 1 },
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
    this.#map.on('click', this._showCurMarker.bind(this));

    this.#interests.forEach(i => this._renderList(i));
    this.#interests.forEach(i => this._renderMarkers(i));

    // this.#markers.forEach(m => m.on('click', this._panListItem.bind(this)));
    this.#map
      .getPanes()
      .popupPane.addEventListener('click', this._listPan.bind(this));

    this._showMyPosition(position);
  }

  _showMyPosition(position) {
    if (position) {
      this.#myPos = L.marker(
        [position.coords.latitude, position.coords.longitude],
        {
          icon: this._createIcon('red'),
        }
      );

      this.#myPos
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 180,
            closeOnClick: false,
            className: `myposition-popup`,
          })
        )
        .setPopupContent(
          `<span>🕺 </span><span class="popup-content">Your Position</span>`
        )
        .openPopup(position.coords)
        .addTo(this.#map);
    }
  }

  _panMyPosition() {
    console.log(this.#myPos);
    if (this.#myPos) {
      this._panTo(this.#myPos._latlng, this.#closeZoom);
    }
    this.#myPos.openPopup();
  }

  _panTo(coords, zoom) {
    this.#map
      .setView(coords, zoom, {
        animate: true,
        pan: { duration: 2 },
      })
      .panTo(coords);
  }

  _showCurMarker() {
    // primary marker
    this.#curMarker?.remove();
    this.#curMarker = L.marker(this.#mapEvent.latlng, {
      icon: this._createIcon('black'),
    }).addTo(this.#map);
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    // form.classList.remove('hidden');
    const { lat, lng } = this.#mapEvent.latlng;
  }

  _newInterest(e) {
    e.preventDefault();
    // 1 get data
    const emoji = inputEmoji.value;
    const title = inputTitle.value
      .trim()
      .toLowerCase()
      .split(' ')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ');
    const type = inputType.value;
    const time = inputTime.value;
    const era = inputEra.value;
    const admission = inputAdmission.value;
    const { lat, lng } = this.#mapEvent.latlng;

    inputEmoji.value = inputTitle.value = inputTime.value = '';
    //check valid
    // if recreational, create recreational object

    let interest = new Interest(
      [lat, lng],
      title,
      type,
      emoji,
      time,
      admission,
      era
    );

    this.#interests.push(interest);

    // render on map
    this._renderMarkers(interest);

    // render on list
    this._renderList(interest);

    // hide form
    this._hideForm();

    // storage
    this._setLocalStorage();
  }

  // rendering
  _renderMarkers(interest) {
    let color;
    if (interest.type === 'historical') color = 'orange';
    if (interest.type === 'religious') color = 'blue';
    if (interest.type === 'recreational') color = 'green';
    if (interest.type === 'art') color = 'violet';

    const icon = this._createIcon(color);

    this.#popup = L.popup({
      maxWidth: 250,
      minWidth: 180,
      closeOnClick: false,
      className: `${interest.type}-popup`,
    });
    this.#popups.push(this.#popup);

    // Display marker
    this.#marker = L.marker(interest.coords, {
      icon: icon,
      riseOnHover: true,
      bubblingMouseEvents: true,
    });

    this.#marker
      .addTo(this.#map)
      .bindPopup(this.#popup)
      .setPopupContent(
        `<span>${interest.emoji} </span><span class="popup-content">${interest.title}</span>`
      )
      .openPopup(interest.coords);

    this.#markers.push(this.#marker);
  }

  _createIcon(color) {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  _renderList(interest) {
    let payEmoji;
    if (interest.admission == 'free') payEmoji = '🆓';
    if (interest.admission == 'paid') payEmoji = '💲';
    if (interest.admission == 'no-visit') payEmoji = '⛔';

    const dGP = [
      'Naqsh-e Jahan',
      'Inside the Gates of Safavid Court',
      'The Faint Glory of Seljuq Empire',
      'The City of Minarets',
      'Along Zayanderud River',
      'Visiting the Other Side!',
      'The City of Religions',
      'Inside the Living Rooms of History',
      'Let’s Take a Dip in History!',
      'Zurkhaneh: Iranian Classic Workout',
      'Sofeh: Isfahan’s Rooftop',
      'Nazhvan: Land of Wildlife',
      'Let’s Have Fun!',
    ];

    let html = `
        <li class="interest interest--${interest.type}" data-id="${
      interest.id
    }">
        <a href="#dgp--${
          dGP.findIndex(i => i === interest.dgp) + 1
        }" class="interest__category interest_modal">
          ${interest.dgp ? interest.dgp : ''}
        </a>
        <div class="interest__title"">
        <span>${interest.emoji} </span><span class="interest__content">${
      interest.title
    }</span>
        </div>
          
          <div class="interest__details">
            <span class="interest__icon">${
              interest.era === 'Cont' ? '' : '🏛'
            }</span>
            <span class="interest__text">${
              interest.era === 'Cont' ? '' : interest.era
            }</span>
          </div>
          <div class="interest__details">
            <span class="interest__icon">${payEmoji === '⛔' ? '' : '⌚'}</span>
            <span class="interest__text">${interest.time}</span>
          </div>
          <div class="interest__details">
            <span class="interest__icon">${payEmoji}</span>
            <span class="interest__text">Visit</span>
          </div>
          <div class="interest__details">
            <span class="interest__icon">🔗</span>
            <a href="#${interest.id}" class="interest__link">more...</a>
          </div>
        </li>
      `;

    containerInterests.insertAdjacentHTML('afterbegin', html);
  }

  _hideForm() {
    form.classList.add('hidden');
  }

  ///////////////////////////////////////////////// panning
  _popupPan(e) {
    if (!this.#map) return;

    const target = e.target.closest('.interest');

    if (
      !target ||
      e.target.classList.contains('interest__category') ||
      e.target.classList.contains('interest__link')
    )
      return;

    const interest = this.#interests.find(i => i.id === +target.dataset.id);

    this._panTo(interest.coords, this.#closeZoom);

    this.#marker = this.#markers.find(
      m =>
        m._latlng.lat === interest.coords[0] &&
        m._latlng.lng === interest.coords[1]
    );
    this.#marker.openPopup();
    this.#marker.getPane().scrollIntoView();

    this._highlightListTarget(target);
  }

  _listPan(e) {
    const target = e.target.closest('.leaflet-popup-content');
    if (!target) return;

    const interest = this.#interests.find(
      i => i.title === target.querySelector('.popup-content').textContent
    );

    containerInterests.querySelectorAll('.interest').forEach(l => {
      if (
        l.querySelector('.interest__content').textContent === interest.title
      ) {
        // if (window.matchMedia("(max-width: 400px)").matches){
        l.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // }
        this._highlightListTarget(l);
      }
    });
  }

  // _panListItem(e){
  //   const {lat, lng} = e.latlng
  //   const interest = this.#interests.find(i => i.coords[0] === lat && i.coords[1] === lng)

  //   containerInterests.querySelectorAll('.interest').forEach(l => {

  //     if(+l.dataset.id === interest.id){
  //       // if (window.matchMedia("(max-width: 400px)").matches){
  //         l.scrollIntoView({behavior: 'smooth', block: 'start'})
  //       // }

  //       this._highlightListTarget(l)
  //     }
  //   })
  // }

  //////////////////////////////////////////////// local storage
  _setLocalStorage() {
    localStorage.setItem('interests', JSON.stringify(this.#interests));
  }

  _getLocalStorage() {
    // console.log(localStorage.getItem('interests'))
    // const data = JSON.parse(localStorage.getItem('interests'));
    // if (!data) return;
    // this.#interests = data;
    // if (this.#interests) this.#interests.forEach(i => this._renderList(i));
  }

  _clearLocalStorage() {
    localStorage.clear();
  }

  _highlightListTarget(item) {
    containerInterests
      .querySelectorAll('.interest')
      .forEach(i => i.classList.remove('select-color'));
    item.classList.add('select-color');
  }

  /////////////////////////////////////////////////////// modal
  _openModal(e) {
    const target = e.target.closest('.interest_modal');
    if (!target) return;

    const link = target.getAttribute('href');
    loader.classList.remove('hidden');

    modalContent.innerHTML = `
    <img src="img/driverguides/${link.slice(
      1
    )}.jpg" alt="Driver Guide Plan" class="img--guide dgp--1">
    `;

    const modalImage = modal.querySelector('img');
    modalImage.addEventListener('load', function () {
      loader.classList.add('hidden');
    });

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  _keyup(e) {
    if (e.key === 'Escape') this._closeModal();
  }

  _closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  /////////////////////////////////////////////////// sorting
  _sortInterest(e) {
    e.preventDefault();

    const condition = inputSort.value;
    const dgp = [
      'Naqsh-e Jahan',
      'Inside the Gates of Safavid Court',
      'The Faint Glory of Seljuq Empire',
      'The City of Minarets',
      'Along Zayanderud River',
      'Visiting the Other Side!',
      'The City of Religions',
      'Inside the Living Rooms of History',
      'Let’s Take a Dip in History!',
      'Zurkhaneh: Iranian Classic Workout',
      'Sofeh: Isfahan’s Rooftop',
      'Nazhvan: Land of Wildlife',
      'Let’s Have Fun!',
    ];

    if (condition === 'all') {
      this.#sorted = this.#interests;
    } else {
      if (condition.includes(' ')) {
        this.#sorted = this.#interests.filter(i => i.dgp === `${condition}`);
      } else {
        this.#sorted = this.#interests.filter(i => i.type === `${condition}`);
      }
      this._updateUI(this.#sorted);
    }
  }

  _sortInterestDyn(e) {
    e.preventDefault();

    const condition = inputTimeline.value;

    if (condition === 'all') {
      this.#sorted = this.#interests;
    } else {
      this.#sorted = this.#interests.filter(i => i.era === `${condition}`);
      this._updateUI(this.#sorted);
    }
    console.log(this.#sorted);
  }

  _updateUI(arr) {
    containerInterests.innerHTML = '';
    this.#markers.forEach(m => m.removeFrom(this.#map));
    this.#markers = [];

    arr.forEach(i => this._renderList(i));
    arr.forEach(i => this._renderMarkers(i));
    containerInterests.firstElementChild.classList.add('select-color');
    // this.#map.setView(this.#coords, this.#farZoom, {
    //   animate: true,
    //   pan: { duration: 1 },
    // });
    this._panTo(this.#sorted.reverse()[0].coords, this.#farZoom);
  }
}

const app = new App();
