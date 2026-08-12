export type CurrentProgram = {
  work:string;
  category:"ドラマ"|"バラエティ";
  episode:string;
  title:string;
  airtime:string;
  summary:string;
  people:string[];
  keywords:string[];
  sourceUrls:string[];
};

export const currentPrograms:CurrentProgram[] = [
  {work:"風、薫る",category:"ドラマ",episode:"第94回",title:"第19週 黎明の翼",airtime:"8月6日 7:45",summary:"りん、直美、黒川らの思いが村人に通じる一方、アサの容体は改善せず、厳しい状況が続く。",people:["りん","直美","黒川","アサ"],keywords:["黎明の翼","村人","容体"],sourceUrls:["https://bangumi.org/epg/td?broad_cast_date=20260806&ggm_group_id=42"]},
  {work:"大空港〜GATE24〜",category:"ドラマ",episode:"第3話",title:"確認中",airtime:"8月6日 21:00",summary:"密輸された動物が逃げて審査ブースが封鎖される中、子どもを連れた女性が移動を拒む。万智たちは特別措置で、その場での審査に臨む。",people:["万智"],keywords:["密輸動物","審査ブース封鎖","子ども連れ","特別措置"],sourceUrls:["https://www.tv-asahi.co.jp/daikuukou/","https://post.tv-asahi.co.jp/post-812366/"]},
  {work:"ラストノート",category:"ドラマ",episode:"第5話",title:"確認中",airtime:"8月6日 22:00",summary:"葵は澄晴といる時だけ再び花の香りを感じる。十年以上前から香りが分からなくなった事情を明かすと、澄晴は協力を申し出る。",people:["葵","澄晴"],keywords:["花の香り","嗅覚","十年以上前","協力"],sourceUrls:["https://www.fujitv.co.jp/lastnote/story/"]},
  {work:"親愛なる夫へ",category:"ドラマ",episode:"第6話",title:"夫の罪、それぞれの秘密",airtime:"8月6日 23:59",summary:"田端とキャンプ中の優一は、妻は殺されたと告げられた直後、強い眠気で意識を失う。麻衣子は戻らない優一を捜し始める。",people:["優一","田端","麻衣子"],keywords:["キャンプ","妻は殺された","眠気","意識喪失","夫の罪"],sourceUrls:["https://www.ytv.co.jp/dear-husband/"]},
  {work:"突破ファイル",category:"バラエティ",episode:"8月6日放送",title:"スグやる課＆税関",airtime:"8月6日 19:00",summary:"スグやる課がシカの問題に挑み、税関ではDJにまつわる密輸の手口を追う。",people:["高橋文哉"],keywords:["スグやる課","シカ","税関","DJ","密輸"],sourceUrls:["https://www.ntv.co.jp/toppa/"]},
  {work:"ぐるぐるナインティナイン",category:"バラエティ",episode:"8月6日放送",title:"夏のコスプレフェス",airtime:"8月6日 19:54",summary:"夏のコスプレ企画を放送。詳細な企画構成は公式番組ページで確認中。",people:["ナインティナイン","高橋文哉"],keywords:["夏","コスプレフェス","確認中"],sourceUrls:["https://www.ntv.co.jp/gurunai/"]},
  {work:"ゴールデンタッグ",category:"バラエティ",episode:"8月6日放送",title:"異色コンビの二人旅",airtime:"8月6日 20:54",summary:"ダイアン津田と森七菜、M!LK曽野とさかなクン、永尾柚乃と熊元プロレスなど、異色の組み合わせが企画に挑む。",people:["津田篤宏","森七菜","曽野舜太","さかなクン","永尾柚乃","熊元プロレス"],keywords:["二人旅","異色コンビ","ガチャピン"],sourceUrls:["https://bangumi.org/epg/td?broad_cast_date=20260806&ggm_group_id=42"]},
  {work:"相葉ヒロミのお困りですカー？",category:"バラエティ",episode:"2時間SP",title:"以前助けた人を再訪",airtime:"8月6日 19:00",summary:"相葉雅紀とヒロミが、以前手伝った人々のもとを再訪し、再び掃除などの困りごとを手伝う。",people:["相葉雅紀","ヒロミ"],keywords:["再訪","掃除","困りごと","2時間SP"],sourceUrls:["https://www.tv-asahi.co.jp/okomaridesucar/"]},
  {work:"この歌詞が刺さった！グッとフレーズ",category:"バラエティ",episode:"3時間SP",title:"夏に心アツくする名歌詞TOP30",airtime:"8月6日 19:00",summary:"夏に聴きたい、心を熱くする歌詞をランキング形式で紹介する。",people:["加藤浩次","大泉洋"],keywords:["夏","名歌詞","TOP30","ランキング"],sourceUrls:["https://www.tbs.co.jp/goodphrases/"]},
  {work:"櫻井・有吉THE夜会",category:"バラエティ",episode:"8月6日放送",title:"スターの私生活のぞき見SP",airtime:"8月6日 22:00",summary:"寺田心のボディーメイク、RIKACOと荒川の住まい、浅田舞とAYAの企画を取り上げる。",people:["櫻井翔","有吉弘行","寺田心","RIKACO","荒川","浅田舞","AYA"],keywords:["ボディーメイク","豪邸","私生活"],sourceUrls:["https://www.tbs.co.jp/tv/20260806_B71B.html"]},
  {work:"アメトーーク！",category:"バラエティ",episode:"8月6日放送",title:"懐かし回＆傑作回",airtime:"8月6日 23:45",summary:"配信中の過去回から懐かしい企画や傑作回を振り返る。紹介回の全内訳は確認中。",people:[],keywords:["懐かし回","傑作回","過去回","確認中"],sourceUrls:["https://www.tv-asahi.co.jp/ametalk/"]},
];
