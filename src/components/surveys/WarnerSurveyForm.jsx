// components/surveys/WarnerSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './LouisaSurveyForm.css';

export default function WarnerSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const formRef = useRef();

  const handleScoreClick = (questionId, value) => {
    setScores(prev => ({ ...prev, [questionId]: value }));
  };

  const total = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + (val ?? 0), 0);
  }, [scores]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return alert('請選擇檔案');

  const reader = new FileReader();
  reader.onload = async () => {
    const base64string = reader.result.split(',')[1];

    try {
      const formData = new FormData();
      formData.append('key', '820e8ef48a27dc0c2af7af3b5dd1a27a');
      formData.append('image', base64string);
      formData.append('name', `${mysteryId}_${storeName}`);

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      const imageUrl = json.data.url;

      await emailjs.send(
        'service_scamosg',
        'template_bycjjr8',
        {
          store: '華納威秀影城',
          total,
          score_list: Object.entries(scores).map(([k, v]) => `${k}：${v} 分`).join('\n'),
          note: `神秘客編號：${mysteryId}\n分店名稱：${storeName}\n${note}`,
          attachment: imageUrl,
        },
        'kJH8HCzsXC-YD-NtN'
      );

      alert('已成功送出');
    } catch (err) {
      console.error(err);
      alert('送出失敗');
    }
  };

  reader.readAsDataURL(file);
};

  const renderRating = (questionId, max = 5) => (
    <div className="rating-group">
      {Array.from({ length: max + 1 }, (_, value) => (
        <div
          key={value}
          className={`rating-option ${scores[questionId] === value ? 'selected' : ''}`}
          onClick={() => handleScoreClick(questionId, value)}
        >
          {value}
        </div>
      ))}
    </div>
  );

  return (
    <div className="survey-wrapper">
    <form className="survey-form" onSubmit={handleSubmit} ref={formRef}>
      <h2>華納威秀影城 秘密客評分表</h2>
      
      <label>神秘客編號：<input type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>
      
      <fieldset>
        <legend>1. 環境與設施（滿分 20 分）</legend>
        <label>影城外觀整潔、招牌清楚：{renderRating('q1')}</label>
        <label>大廳、售票區、候影區乾淨整齊：{renderRating('q2')}</label>
        <label>廁所整潔、備品充足：{renderRating('q3')}</label>
        <label>指標明確，動線順暢：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 服務態度（滿分 25 分）</legend>
        <label>售票人員態度親切、應對有禮：{renderRating('q5')}</label>
        <label>售票人員介紹座位、場次或優惠活動：{renderRating('q6')}</label>
        <label>賣品部（爆米花、飲料）人員服務態度良好：{renderRating('q7')}</label>
        <label>驗票人員態度親切、動作俐落：{renderRating('q8')}</label>
        <label>影城人員有主動協助指引座位或回答問題：{renderRating('q9')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 商品品質（滿分 20 分）</legend>
        <label>爆米花口感新鮮、溫度適宜：{renderRating('q10')}</label>
        <label>飲料品質良好、無異味：{renderRating('q11')}</label>
        <label>餐點（熱食、甜點）外觀與口感符合期待：{renderRating('q12')}</label>
        <label>餐飲區域整潔，無明顯垃圾或髒污：{renderRating('q13')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 觀影體驗（滿分 25 分）</legend>
        <label>廳內座椅整潔、無異味、舒適度佳：{renderRating('q14')}</label>
        <label>空調溫度適中、環境舒適：{renderRating('q15')}</label>
        <label>畫面清晰、音效震撼無雜音：{renderRating('q16')}</label>
        <label>放映準時、無中途干擾：{renderRating('q17')}</label>
        <label>觀影秩序良好，影城人員有維持秩序：{renderRating('q18')}</label>
      </fieldset>

      <fieldset>
        <legend>5. 整體印象（滿分 10 分）</legend>
        <label>是否願意再次光顧 / 推薦他人（0-10 分）：{renderRating('q19', 10)}</label>
      </fieldset>

      <div className="total-score-row">
        <div className="total-score-label">總分（0–100）：</div>
        <div className="total-score-box">{total}</div>
      </div>

      <label>秘密客備註與建議（請填寫此次體驗的優點、缺點與改善建議）：
        <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      
      <label>請上傳圖片：
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
      </label>

      <div className="form-actions">
        <button type="submit">送出</button>
        <button type="button" onClick={onClose}>取消</button>
      </div>
    </form>
    </div>
  );
}
