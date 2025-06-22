// components/surveys/WatsonsSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';

import './WatsonsSurveyForm.css';

export default function WatsonsSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

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
          store: '屈臣氏',
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
    }finally {
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
    <form className="survey-form" onSubmit={handleSubmit} ref={formRef}>
      <h2>屈臣氏 秘密客評分表</h2>
      <label>神秘客編號：<input className="survey-input" type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
      <label>分店名稱：<input className="survey-input" type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>

      <fieldset>
        <legend>1. 門市環境（滿分 20 分）</legend>
        <label>店面整潔、乾淨：{renderRating('q1')}</label>
        <label>商品陳列整齊、標價清楚：{renderRating('q2')}</label>
        <label>動線設計良好、不擁擠：{renderRating('q3')}</label>
        <label>音樂、燈光、氣味舒適：{renderRating('q4')}</label>
      </fieldset>

      <fieldset>
        <legend>2. 服務態度（滿分 30 分）</legend>
        <label>進店是否有主動打招呼：{renderRating('q5')}</label>
        <label>店員服裝儀容整潔：{renderRating('q6')}</label>
        <label>是否主動詢問需求：{renderRating('q7')}</label>
        <label>回答問題專業、親切有禮：{renderRating('q8')}</label>
        <label>結帳時是否主動推銷活動、會員卡：{renderRating('q9')}</label>
        <label>離店是否有道別或感謝用語：{renderRating('q10')}</label>
      </fieldset>

      <fieldset>
        <legend>3. 商品品質與庫存（滿分 20 分）</legend>
        <label>熱銷商品是否有現貨：{renderRating('q11')}</label>
        <label>商品保存狀況良好（無損壞、過期）：{renderRating('q12')}</label>
        <label>試用品乾淨、齊全：{renderRating('q13')}</label>
        <label>促銷商品有明確標示：{renderRating('q14')}</label>
      </fieldset>

      <fieldset>
        <legend>4. 結帳與效率（滿分 20 分）</legend>
        <label>結帳流程順暢、迅速：{renderRating('q15')}</label>
        <label>是否有主動詢問發票載具或袋子需求：{renderRating('q16')}</label>
        <label>發票、找零正確無誤：{renderRating('q17')}</label>
        <label>是否有提供會員點數累積與兌換資訊：{renderRating('q18')}</label>
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
