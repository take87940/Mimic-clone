import { useState } from 'react';
import SurveySelector from './SurveySelector';
import PoYaSurveyForm from './surveys/PoYaSurveyForm';
import WatsonsSurveyForm from './surveys/WatsonSurveyForm';

import './Mimic_survey.css'

export default function Mimic_survey() {
    const [showSelector, setShowSelector] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    const handleSelectSurvey = (type) => {
        setSelectedSurvey(type);
        setShowSelector(false);
    }

    return(
        <div className='App'>
            {(!showSelector && selectedSurvey == null )&& (
                <button className='fancy-button' onClick={() => setShowSelector(true)}>
                    神秘客問卷回報
                </button>
            )}
            

            {showSelector && (
                <div className='modal-overlay'>
                    <SurveySelector onSelect={handleSelectSurvey} onClose={() => setShowSelector(false)} />
                </div>
            )}

            {selectedSurvey === 'poYa' && (
                <div className='modal-overlay'>
                    <PoYaSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'watsons' && (
                <div className='modal-overlay'>
                    <WatsonsSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

        </div>
    );
}