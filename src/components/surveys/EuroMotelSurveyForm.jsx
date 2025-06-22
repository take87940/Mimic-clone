// components/surveys/EuroMotelSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';

import './LouisaSurveyForm.css';

export default function EuroMotelSurveyForm({ onClose }) {
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
          store: '歐遊汽車旅館',
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
      <h2>歐遊汽車旅館 秘密客評分表</h2>
      
      <label>神秘客編號：<input type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>

      <fieldset>
        <legend>1. 外觀與環境（滿分 20 分）</legend>
        <label>外觀整潔、招牌明顯：{renderRating('q1')}</label>
        <label>車道、停車空間乾淨、指引清楚：{renderRating('q2')}</label>
        <label>櫃檯大廳整潔、燈光舒適：{renderRating('q3')}</label>
        <label>公共空間（走廊、電梯）乾淨無異味：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 服務態度（滿分 25 分）</legend>
        <label>櫃檯人員主動問候、親切有禮：{renderRating('q5')}</label>
        <label>辦理入住流程清楚、迅速：{renderRating('q6')}</label>
        <label>是否主動說明房型、設施與使用須知：{renderRating('q7')}</label>
        <label>退房時態度良好、有道別用語：{renderRating('q8')}</label>
        <label>全程服務態度專業，給人良好印象：{renderRating('q9')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 房間品質（滿分 25 分）</legend>
        <label>房間整潔、無異味、無明顯灰塵：{renderRating('q10')}</label>
        <label>床鋪整齊、床單乾淨：{renderRating('q11')}</label>
        <label>衛浴設備乾淨、備品齊全：{renderRating('q12')}</label>
        <label>家電設備（電視、冰箱、按摩浴缸等）功能正常：{renderRating('q13')}</label>
        <label>燈光、空調溫度適宜、操作方便：{renderRating('q14')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 設施與加值服務（滿分 20 分）</legend>
        <label>是否有提供免費飲料、點心、備品：{renderRating('q15')}</label>
        <label>房內娛樂設備（KTV、投影、浴缸等）體驗良好：{renderRating('q16')}</label>
        <label>Wifi 訊號穩定、速度良好：{renderRating('q17')}</label>
        <label>額外設施（如自助早餐、停車便利性）表現：{renderRating('q18')}</label>
      </fieldset>

      <fieldset>
        <legend>5. 整體印象（滿分 10 分）</legend>
        <label>是否願意再次入住 / 推薦他人（0-10 分）：{renderRating('q19', 10)}</label>
      </fieldset>

      <div className="total-score-row">
        <div className="total-score-label">總分（0–100）：</div>
        <div className="total-score-box">{total}</div>
      </div>

      <label>
        秘密客備註與建議（請填寫此次體驗的優點、缺點與改善建議）：
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
