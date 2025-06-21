// components/surveys/SwappedSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';

import './LouisaSurveyForm.css';

export default function SwappedSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState('');
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
          store: 'Swapped',
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
    <form className="survey-form" onSubmit={handleSubmit} ref={formRef}>
      <h2>Swapped.com Business 秘密客評分表</h2>

      <label>🌟 填寫購買地址：<input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></label>
      <label>並且截圖支付完成介面，否則不予以報銷！</label>
      <label>神秘客編號：<input type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>
      <fieldset>
        <legend>1. 網站使用體驗（滿分 20 分）</legend>
        <label>網站介面清晰、容易操作（0-5 分）：{renderRating('q1')}</label>
        <label>商品資訊（USDT）價格透明且易查詢（0-5 分）：{renderRating('q2')}</label>
        <label>支付選項豐富且適用於台灣（0-5 分）：{renderRating('q3')}</label>
        <label>購買流程步驟清楚、不複雜（0-5 分）：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 購買流程（滿分 30 分）</legend>
        <label>下單速度順暢，無卡頓或錯誤（0-5 分）：{renderRating('q5')}</label>
        <label>支付過程安全，無異常提示（0-5 分）：{renderRating('q6')}</label>
        <label>支付完成後，USDT 發送速度（0-5 分）：{renderRating('q7')}</label>
        <label>是否有發送購買確認通知（0-5 分）：{renderRating('q8')}</label>
        <label>購買金額與實際扣款相符（0-5 分）：{renderRating('q9')}</label>
        <label>付款時客服提供的協助與說明（0-5 分）：{renderRating('q10')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 客服服務（滿分 20 分）</legend>
        <label>客服回應速度快（0-5 分）：{renderRating('q11')}</label>
        <label>回應態度專業且有禮貌（0-5 分）：{renderRating('q12')}</label>
        <label>問題解決效率高（0-5 分）：{renderRating('q13')}</label>
        <label>客服能夠清楚說明交易相關細節（0-5 分）：{renderRating('q14')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 交易安全與隱私（滿分 20 分）</legend>
        <label>平台有提供安全驗證機制（0-5 分）：{renderRating('q15')}</label>
        <label>個人資訊保護符合規範（0-5 分）：{renderRating('q16')}</label>
        <label>付款資訊安全無漏洞（0-5 分）：{renderRating('q17')}</label>
        <label>交易記錄完整且可查詢（0-5 分）：{renderRating('q18')}</label>
      </fieldset>

      <fieldset>
        <legend>5. 整體滿意度（滿分 10 分）</legend>
        <label>是否願意再次使用或推薦他人（0-10 分）：{renderRating('q19', 10)}</label>
      </fieldset>

      <div className="total-score-row">
        <div className="total-score-label">總分（0–100）：</div>
        <div className="total-score-box">{total}</div>
      </div>

      <label>秘密客備註與建議（請填寫此次購買體驗的優點、缺點與改善建議）：
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
  );
}
