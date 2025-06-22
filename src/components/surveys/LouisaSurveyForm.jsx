// components/surveys/LouisaSurveyForm.jsx
import { useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import './LouisaSurveyForm.css';

export default function LouisaSurveyForm({ onClose }) {
  const [scores, setScores] = useState({});
  const [mysteryId, setMysteryId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
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
          store: '路易莎咖啡',
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

  return (
    <div className="survey-wrapper">
        <form className="survey-form" onSubmit={handleSubmit}>
        <h2>路易莎咖啡 秘密客評分表</h2>
        
        <label>神秘客編號：<input className="survey-input" type="text" value={mysteryId} onChange={(e) => setMysteryId(e.target.value)} required/></label>
        <label>分店名稱：<input className="survey-input" type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required/></label>

        <fieldset>
            <legend>1. 門市環境（滿分 20 分）</legend>
            <label>店面外觀整潔、招牌清楚（0-5 分）：{renderRating('q1')}</label>
            <label>室內整潔、座位區乾淨（0-5 分）：{renderRating('q2')}</label>
            <label>環境氣氛舒適（燈光、音樂、冷氣）（0-5 分）：{renderRating('q3')}</label>
            <label>垃圾回收區整潔無異味（0-5 分）：{renderRating('q4')}</label>
        </fieldset>

        <fieldset>
            <legend>2. 服務態度（滿分 30 分）</legend>
            <label>進店是否有主動打招呼（0-5 分）：{renderRating('q5')}</label>
            <label>店員服裝整齊、儀容乾淨（0-5 分）：{renderRating('q6')}</label>
            <label>接待時語氣親切、態度友善（0-5 分）：{renderRating('q7')}</label>
            <label>是否主動介紹新品或推薦飲品（0-5 分）：{renderRating('q8')}</label>
            <label>回答問題是否專業、有耐心（0-5 分）：{renderRating('q9')}</label>
            <label>送餐時是否有禮貌致意（0-5 分）：{renderRating('q10')}</label>
        </fieldset>

        <fieldset>
            <legend>3. 商品品質（滿分 20 分）</legend>
            <label>飲品品質（溫度、口感、擺盤）符合期待（0-5 分）：{renderRating('q11')}</label>
            <label>餐點品質（新鮮度、口味）良好（0-5 分）：{renderRating('q12')}</label>
            <label>餐點、飲品送達時間合理（0-5 分）：{renderRating('q13')}</label>
            <label>餐具、杯具乾淨（0-5 分）：{renderRating('q14')}</label>
        </fieldset>

        <fieldset>
            <legend>4. 點餐與效率（滿分 20 分）</legend>
            <label>點餐流程順暢、引導清楚（0-5 分）：{renderRating('q15')}</label>
            <label>結帳速度迅速（0-5 分）：{renderRating('q16')}</label>
            <label>發票、找零正確無誤（0-5 分）：{renderRating('q17')}</label>
            <label>是否有提醒集點或會員優惠（0-5 分）：{renderRating('q18')}</label>
        </fieldset>

        <fieldset>
            <legend>5. 整體印象（滿分 10 分）</legend>
            <label>是否願意再次光顧 / 推薦他人（0-10 分）：{renderRating('q19', 10)}</label>
        </fieldset>

        <div className="total-score-row">
            <div className="total-score-label">總分（0–100）：</div>
            <div className="total-score-box">{total}</div>
        </div>

        <label>秘密客備註與建議（請填寫此次體驗的優點、缺點與改善建議）：<textarea rows="3" value={note} onChange={e => setNote(e.target.value)} /></label>
        
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
