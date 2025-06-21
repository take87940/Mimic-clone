import { useState, useEffect} from 'react'
import './Hero.css'

import img1 from './Hero-image/banner1.jpg'
import img2 from './Hero-image/banner2.jpg'
import img3 from './Hero-image/banner3.jpg'
import img4 from './Hero-image/banner4.jpg'

const images = [img1, img2, img3, img4]

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0)

    //Auto Play (5s)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 5000)
        
        return () => clearInterval(timer)
    }, [])

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    return (
        <div className='hero-carousel'>
            <a href='https://www.mimic.com.tw/web/page/tw/service_plan#web-inline-article-2'>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className='hero-image'
                />
            </a>
            <button className='arrow left' onClick={goPrev}>
                &#10094;
            </button>
            <button className='arrow right' onClick={goNext}>
                &#10095;
            </button>
        </div>
    )
}
