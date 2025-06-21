import './Footer.css'


export default function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-top'>
                <div className='footer-column'>
                    <h4>公司資訊</h4>
                    <ul>
                        <li><a href='https://www.mimic.com.tw/web/page/tw/about'>關於我們</a></li>
                        <li><a href='https://www.mimic.com.tw/web/page/tw/contact'>聯繫我們</a></li>
                    </ul>
                </div>
                <div className='footer-column'>
                    <h4>市場推廣</h4>
                    <ul>
                        <li><a href='https://www.mimic.com.tw/web/page/tw/news'>最新動態</a></li>
                        <li><a href='https://www.mimic.com.tw/web/page/tw/events'>活動資訊</a></li>
                    </ul>
                </div>
            </div>

            <div className='footer-bottom'>
                <div className='footer-links'>
                    <a href='https://www.mimic.com.tw/web/page/tw/privacy_policy'>隱私政策</a>
                    <a href='https://www.mimic.com.tw/web/page/tw/terms_of_use'>使用條款</a>
                    <a href='https://www.mimic.com.tw/web/page/tw/sitemap'>網站地圖</a>
                </div>
                <div className='footer-copy'>
                    Copyright © The Mimic Company 版權所有
                </div>
            </div>
        </footer>
    )
}

