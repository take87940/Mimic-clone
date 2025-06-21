import './SurveySelector.css'

export default function SurveySelector({ onSelect, onClose}) {
    return(
        <div className='survey-selector'>
            <div className='survey-card'>
                <h2>請選擇問卷類型</h2>
                <ul>
                    <li onClick={() => onSelect('poYa')}>寶雅</li>
                    <li onClick={() => onSelect('watsons')}>屈臣氏</li>
                    <li onClick={() => onSelect('louisa')}>路易莎咖啡</li>
                    <li onClick={() => onSelect('warner')}>華納威秀影城</li>
                    <li onClick={() => onSelect('ambassador')}>國賓影城</li>
                    <li onClick={() => onSelect('euroMotel')}>歐遊汽車旅館</li>
                    <li onClick={() => onSelect('daiso')}>大創 DAISO</li>
                    <li onClick={() => onSelect('swapped')}>Swapped.com Business (10USDT (TRC-20) VISA購買)</li>
                    <li onClick={() => onSelect('pyppay')}>PypPay (10USDT (TRC-20) VISA購買)</li>
                    <li onClick={() => onSelect('binance')}>Binance (10USDT (TRC-20) VISA購買)</li>
                </ul>  
                <button className='close-button' onClick={onClose}>取消</button>  
            </div>
        </div>
    );
}