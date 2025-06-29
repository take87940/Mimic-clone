// components/surveys/BinanceSurveyForm.jsx
import { useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import './LouisaSurveyForm.css';

export default function BinanceSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreClick = (questionId, value, event) => {
    // 防止事件冒泡
    event?.preventDefault();
    event?.stopPropagation();
    setScores(prev => ({ ...prev, [questionId]: value }));
  };

  const total = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + (val ?? 0), 0);
  }, [scores]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return alert('請選擇檔案');
  
  setIsSubmitting(true);

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
          store: '幣安 Binance',
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
    } finally {
        setIsSubmitting(false);
    }
  };

  reader.readAsDataURL(file);
};

  const renderRating = (questionId, max = 5) => (
    <div className="rating-group" key={`rating-${questionId}`}>
      {Array.from({ length: max + 1 }, (_, value) => (
        <label 
          key={`q${questionId}-${value}`} 
          className={`rating-option ${scores[questionId] === value ? 'selected' : ''}`}
          onTouchStart={(e) => {
            // 防止滚动时意外触发
            e.stopPropagation();
            handleScoreClick(questionId, value, e);
          }}
          onClick={(e) => {
            // 防止重复触发
            e.preventDefault();
            e.stopPropagation();
            handleScoreClick(questionId, value, e);
          }}
        >
          <input
            type="radio"
            name={`q-${questionId}`}
            value={value}
            checked={scores[questionId] === value}
            onChange={() => {}} // 空函数，实际处理在 label 的事件中
            style={{ display: 'none' }}
            tabIndex={-1} // 避免键盘导航时被选中
          />
          {value}
        </label>
      ))}
    </div>
  );

  return (
    <div className="survey-wrapper">
    <form className="survey-form" onSubmit={handleSubmit}>
      <h2>幣安購買紀錄秘密客評分表</h2>

      <label>🌟 填寫購買地址（必填）：<input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></label>
      <label>並截圖支付完成介面，否則不予以報銷！</label>
      <label>神秘客編號：<input className="survey-input" type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input className="survey-input" type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>

      <fieldset>
        <legend>1. 購買流程體驗（滿分 30 分）</legend>
        <label>網站介面與導航：網站是否易於瀏覽，購買流程是否清晰？（0-10 分）：{renderRating('q1')}</label>
        <label>下單流程順暢度：從選擇商品到確認訂單的過程是否順暢？（0-10 分）：{renderRating('q2')}</label>
        <label>支付方式多樣性：是否提供多種支付選項，如信用卡、銀行轉帳等？（0-10 分）：{renderRating('q3')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 支付體驗（滿分 25 分）</legend>
        <label>支付過程順暢性：支付過程是否順利，是否有延遲或錯誤？（0-10 分）：{renderRating('q4')}</label>
        <label>支付方式支援度：是否支援台灣地區的支付方式，如台灣信用卡、記帳卡等？（0-10 分）：{renderRating('q5')}</label>
        <label>支付確認通知：支付完成後，是否即時收到確認通知？（0-5 分）：{renderRating('q6', 5)}</label>
      </fieldset>

      <fieldset>
        <legend>3. 交易安全性（滿分 20 分）</legend>
        <label>身份驗證機制：平台是否提供安全的身份驗證機制，如雙重身份驗證（2FA）？（0-10 分）：{renderRating('q7', 10)}</label>
        <label>資金安全保障：平台是否有措施保障用戶資金安全？（0-10 分）：{renderRating('q8', 10)}</label>
      </fieldset>

      <fieldset>
        <legend>4. 客服服務質量（滿分 15 分）</legend>
        <label>客服回應速度：客服是否能在合理時間內回應查詢？（0-5 分）：{renderRating('q9', 5)}</label>
        <label>客服專業性：客服是否能提供專業且有效的協助？（0-5 分）：{renderRating('q10', 5)}</label>
        <label>客服態度：客服是否禮貌且耐心？（0-5 分）：{renderRating('q11', 5)}</label>
      </fieldset>

      <fieldset>
        <legend>5. 整體滿意度（滿分 10 分）</legend>
        <label>是否推薦他人使用：{renderRating('q12', 10)}</label>
      </fieldset>

      <div className="total-score-row">
        <div className="total-score-label">總分（0–100）：</div>
        <div className="total-score-box">{total}</div>
      </div>

      <label>備註與建議（請填寫此次購買體驗的優點、缺點與改善建議）：
        <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      
      <label>請上傳圖片：
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <span className="spinner"></span>送出中...
                </>
            ) : (
                '送出'
            )}
        </button>
        <button type="button" onClick={onClose}>取消</button>
      </div>
    </form>
    </div>
  );
}
