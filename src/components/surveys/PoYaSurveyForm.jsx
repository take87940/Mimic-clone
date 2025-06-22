// components/surveys/PoYaSurveyForm.jsx
import { useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';

import './PoYaSurveyForm.css';

export default function PoYaSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);

  const handleScoreClick = (questionId, value) => {
    setScores(prev => ({ ...prev, [questionId]: value }));
  };

  const total = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + (val ?? 0), 0);
  }, [scores]);

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
          store: '寶雅',
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

  return (
    <div className="survey-wrapper">
    <form className="survey-form" onSubmit={handleSubmit}>
      <h2>寶雅 秘密客評分表</h2>
      <label>神秘客編號：<input type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>

      <fieldset>
        <legend>1. 賣場環境（滿分 20 分）</legend>
        <label>賣場外觀整潔、招牌明顯（0-5 分）：{renderRating('q1')}</label>
        <label>賣場內部整潔、無雜物堆放（0-5 分）：{renderRating('q2')}</label>
        <label>商品陳列整齊、標價清楚（0-5 分）：{renderRating('q3')}</label>
        <label>動線順暢、購物環境舒適（0-5 分）：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 服務態度（滿分 30 分）</legend>
        <label>進店是否有主動打招呵（0-5 分）：{renderRating('q5')}</label>
        <label>店員服裝整潔、儀容良好（0-5 分）：{renderRating('q6')}</label>
        <label>主動提供協助、詢問需求（0-5 分）：{renderRating('q7')}</label>
        <label>回答問題是否專業、有耐心（0-5 分）：{renderRating('q8')}</label>
        <label>是否主動介紹促銷活動或會員（0-5 分）：{renderRating('q9')}</label>
        <label>結帳時有禮貌、感謝用語完整（0-5 分）：{renderRating('q10')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 商品品質與庫存（滿分 20 分）</legend>
        <label>熱銷商品是否有現貨（0-5 分）：{renderRating('q11')}</label>
        <label>商品無明顯損壞或過期（0-5 分）：{renderRating('q12')}</label>
        <label>試用品區域乾淨、補充完整（0-5 分）：{renderRating('q13')}</label>
        <label>促銷商品標示清楚、資訊正確（0-5 分）：{renderRating('q14')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 結帳流程與效率（滿分 20 分）</legend>
        <label>結帳動線順暢、排隊秩序良好（0-5 分）：{renderRating('q15')}</label>
        <label>結帳速度迅速、準確（0-5 分）：{renderRating('q16')}</label>
        <label>是否詢問發票載具、購物袋需求（0-5 分）：{renderRating('q17')}</label>
        <label>是否有提醒會員點數或集點活動（0-5 分）：{renderRating('q18')}</label>
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
        <textarea name="note" rows="3" />
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
