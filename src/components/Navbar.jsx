import './Navbar.css'
import logo from './Navbar-image/logo.png'
import icon_language from './Navbar-image/icon_language_ch.png'
import icon_login from './Navbar-image/icon_login.png'
import icon_search from './Navbar-image/icon_search.png'
import icon_Mystery from './Navbar-image/becomeMimic.png'

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/">
                    <img src={logo} alt="Mimic Logo" className="logo" />
                </a>
                <ul className="nav-links">
                    <li><a href="https://www.mimic.com.tw/web/page/tw/service_plan">服務方案</a></li>
                    <li><a href="https://www.mimic.com.tw/web/page/tw/service_area">服務領域</a></li>
                    <li><a href="https://www.mimic.com.tw/web/page/tw/about">關於我們</a></li>
                    <li>
                        <a href="/" className="active-link mystery-link">
                            <img src={icon_Mystery} alt="神秘客" className="nav-icon" />
                            成為神秘客
                        </a>
                    </li>


                </ul>
            </div>
            <div className="navbar-right">
                <img src={icon_language} alt="Language" className="icon" />
                <a href="/">
                    <img src={icon_login} alt="Login" className="icon" />
                </a>
                <img src={icon_search} alt="Search" className="icon" />
            </div>
        </nav>
    )
}