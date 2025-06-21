import { useState } from 'react';
import SurveySelector from './SurveySelector';
import PoYaSurveyForm from './surveys/PoYaSurveyForm';
import WatsonsSurveyForm from './surveys/WatsonSurveyForm';
import LouisaSurveyForm from './surveys/LouisaSurveyForm';
import WarnerSurveyForm from './surveys/WarnerSurveyForm';
import AmbassadorSurveyForm from './surveys/AmbassadorSurveyForm';
import EuroMotelSurveyForm from './surveys/EuroMotelSurveyForm';
import DaisoSurveyForm from './surveys/DaisoSurveyForm';
import SwappedSurveyForm from './surveys/SwappedSurveyForm';
import PyppaySurveyForm from './surveys/PyppaySurveyForm';
import BinanceSurveyForm from './surveys/BinanceSurveyForm';

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

            {selectedSurvey === 'louisa' && (
                <div className='modal-overlay'>
                    <LouisaSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'warner' && (
                <div className='modal-overlay'>
                    <WarnerSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'ambassador' && (
                <div className='modal-overlay'>
                    <AmbassadorSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'euroMotel' && (
                <div className='modal-overlay'>
                    <EuroMotelSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'daiso' && (
                <div className='modal-overlay'>
                    <DaisoSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'swapped' && (
                <div className='modal-overlay'>
                    <SwappedSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'pyppay' && (
                <div className='modal-overlay'>
                    <PyppaySurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

            {selectedSurvey === 'binance' && (
                <div className='modal-overlay'>
                    <BinanceSurveyForm onClose={() => setSelectedSurvey(null)} />
                </div>
            )}

        </div>
    );
}