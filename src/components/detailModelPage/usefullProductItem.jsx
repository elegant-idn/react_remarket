import React  from "react";
import Toggle from 'react-toggle'
// import { gsap } from 'gsap';
// import { gsap, MorphSVGPlugin } from "gsap-trial/all";

//  gsap.registerPlugin(MorphSVGPlugin);

const UsefullProductItem = ({items, basketData, addModelToBasket }) => {

    const handleTofuChange = (id)=>{
        items.map((item)=>{
            if (item.id === id){
                item.toggle = !item.toggle
            }
        })
    }

    /*
    const handeMouseEnter = (e) => {
        console.log('handeMouseEnter')
    }

    const handleMouseLeave = (e) => {
        console.log('handleMouseLeave')
    }

    const handeclick = (e) => {
        console.log('handeclick')
    }
    */

    return (
        <div>
            {items.map((item)=>{
            return (
                <label key={item.id} className="usefullToggle">
                    <Toggle
                        defaultChecked={basketData.some(basket => basket.id === item.id) ? true : false}
                        icons={false}
                        data-status={basketData.some(basket => basket.id === item.id) ? 'in' : 'out'}
                        onChange={(e) => addModelToBasket(e, item)}
                        />
                    {/* <label class="switch" 
                        onMouseEnter={(e) => handeMouseEnter(e)}
                        onMouseLeave={(e) => handleMouseLeave(e)}
                        onClick={(e) => handeclick(e)}
                        >
                        <input type="checkbox" />
                        <svg viewBox="0 0 36 18">
                            <path d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9Z" />
                        </svg>
                    </label> */}
                    <img src={item.deviceImages.mainImg.src} alt="" />
                    <div className="description">
                        <span>{item.model}</span>
                        <strong></strong>
                        <span>{`${item.discountPrice === false ? item.price : item.discountPrice} CHF`}</span>
                    </div>
                </label>
            )
            })}
        </div>
    )
}

export default UsefullProductItem