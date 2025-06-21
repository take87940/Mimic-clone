// components/surveys/WatsonsSurveyForm.jsx
import { useState, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';

import './WatsonsSurveyForm.css';

export default function WatsonsSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [note, setNote] = useState('');
  const formRef = useRef();

  const handleScoreClick = (questionId, value) => {
    setScores(prev => ({ ...prev, [questionId]: value }));
  };

  const total = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + (val ?? 0), 0);
  }, [scores]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      total,
      note,
      scores,
    };

    emailjs.send(
        'service_kqcyfpq',
        'template_h7936pf',
        {   
            store: '屈臣氏',
            total,
            score_list: Object.entries(scores)
            .map(([key, val]) => `${key}：${val} 分`)
            .join('\n'),
            note,
        },
        'WcdWjJvbpJxBjULiI'
        ).then(() => {
        alert("已成功送出");
        }).catch((error) => {
        console.error("送出失敗", error);
    });
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
      <h2>屈臣氏 秘密客評分表</h2>

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

      <div className="form-actions">
        <button type="submit">送出</button>
        <button type="button" onClick={onClose}>取消</button>
      </div>
    </form>
  );
}
