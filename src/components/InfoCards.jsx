import './InfoCards.css'
import iconNews from './InfoCards-image/news.png'
import iconService from './InfoCards-image/service.png'
import iconUser from './InfoCards-image/user.png'

export default function InfoCards() {
  return (
    <section className="info-cards">
      <div className="card">
        <img src={iconNews} alt="最新動態" className="card-icon" />
        <h3>最新動態</h3>
        <p>
          We love Taiwan 海洋淨灘活動 (2018)<br />
          我們舉辦淨灘、專業講座，用行動回饋台灣。
        </p>
        <a href="https://www.mimic.com.tw/web/page/tw/news/36">瞭解更多 &gt;&gt;</a>
      </div>

      <div className="card">
        <img src={iconService} alt="服務內容" className="card-icon" />
        <h3>服務內容</h3>
        <p>
          提供神秘顧客聯訪、訪查評鑑、客戶服務專案評估、訓練課程等專業服務。
        </p>
        <a href="https://www.mimic.com.tw/web/page/tw/service_plan">瞭解更多 &gt;&gt;</a>
      </div>

      <div className="card">
        <img src={iconUser} alt="成為神秘客" className="card-icon" />
        <h3>成為神秘客</h3>
        <ul>
          <li>你願意匿名收入？</li>
          <li>你觀察敏銳？</li>
          <li>你想要影響企業顧客服務的品質？</li>
        </ul>
        <a href="https://www.mimic.com.tw/web/page/tw/join">瞭解更多 &gt;&gt;</a>
      </div>
    </section>
  )
}
