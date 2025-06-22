// components/surveys/DaisoSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';

import './LouisaSurveyForm.css';

export default function DaisoSurveyForm({ onClose }) {
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
      formData.append('key', '29a0c309ea90b10c5224cdf0f7bb1dff');
      formData.append('image', base64string);
      formData.append('name', `${mysteryId}_${storeName}`);

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      const imageUrl = json.data.url;

      await emailjs.send(
        'service_kqcyfpq',
        'template_h7936pf',
        {
          store: 'DAISO 大創',
          total,
          score_list: Object.entries(scores).map(([k, v]) => `${k}：${v} 分`).join('\n'),
          note: `神秘客編號：${mysteryId}\n分店名稱：${storeName}\n${note}`,
          attachment: imageUrl,
        },
        'WcdWjJvbpJxBjULiI'
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
      <h2>大創 DAISO 秘密客評分表</h2>
      <label>神秘客編號：<input type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>
      <fieldset>
        <legend>1. 賣場環境（滿分 20 分）</legend>
        <label>賣場外觀整潔、招牌明顯：{renderRating('q1')}</label>
        <label>賣場內部整潔、無雜物堆放：{renderRating('q2')}</label>
        <label>地面乾淨、燈光明亮：{renderRating('q3')}</label>
        <label>空氣流通、無異味：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 商品陳列與庫存（滿分 25 分）</legend>
        <label>商品陳列整齊、分類清楚：{renderRating('q5')}</label>
        <label>標價明確、無錯誤標示：{renderRating('q6')}</label>
        <label>熱銷商品有現貨：{renderRating('q7')}</label>
        <label>商品包裝完整、無損壞：{renderRating('q8')}</label>
        <label>特價、活動商品標示清楚：{renderRating('q9')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 服務態度（滿分 25 分）</legend>
        <label>進店是否有基本問候：{renderRating('q10')}</label>
        <label>店員服裝整潔、儀容良好：{renderRating('q11')}</label>
        <label>店員是否主動提供協助：{renderRating('q12')}</label>
        <label>回答顧客詢問時態度親切、解說清楚：{renderRating('q13')}</label>
        <label>結帳時是否有道謝用語：{renderRating('q14')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 結帳流程（滿分 20 分）</legend>
        <label>排隊動線明確、秩序良好：{renderRating('q15')}</label>
        <label>結帳速度順暢、無錯誤：{renderRating('q16')}</label>
        <label>是否詢問發票載具、購物袋需求：{renderRating('q17')}</label>
        <label>櫃檯區域整潔、無雜物堆放：{renderRating('q18')}</label>
      </fieldset>

      <fieldset>
        <legend>5. 整體印象（滿分 10 分）</legend>
        <label>是否願意再次光顧 / 推薦他人（0-10 分）：{renderRating('q19', 10)}</label>
      </fieldset>

      <div className="total-score-row">
        <div className="total-score-label">總分（0–100）：</div>
        <div className="total-score-box">{total}</div>
      </div>

      <label>秘密客備註與建議（請填寫此次體驗的優點、缺點與改善建議）：<textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} /></label>
      
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
