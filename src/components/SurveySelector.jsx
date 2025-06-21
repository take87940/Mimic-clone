import './SurveySelector.css'

export default function SurveySelector({ onSelect, onClose}) {
    return(
        <div className='survey-selector'>
            <div className='survey-card'>
                <h2>請選擇問卷類型</h2>
                <ul>
                    <li onClick={() => onSelect('poYa')}>寶雅</li>
                    <li onClick={() => onSelect('watsons')}>屈臣氏</li>
                    <li onClick={() => onSelect('poYa')}>null</li>
                    <li onClick={() => onSelect('poYa')}>null</li>
                    <li onClick={() => onSelect('poYa')}>null</li>
                    <li onClick={() => onSelect('poYa')}>null</li>
                    <li onClick={() => onSelect('poYa')}>null</li>
                </ul>  
                <button className='close-button' onClick={onClose}>取消</button>  
            </div>
        </div>
    );
}