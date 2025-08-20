import { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import './Panel.css'

export const PlacePanel = ({ setMode, aggData, setPlaceData, activePlaceId, setActivePlaceId }) => {
    const gmpLoadHandler = (place) => {
        setPlaceData(placeData => {
            if (placeData.filter(item => item.placeId === place.place.id).length === 0) {
                return [...placeData, { placeId: place.place.id, location: place.place.location }]
            }
            return placeData;
        });
    }
    const gmpRefs = []
    aggData?.placeInsights?.forEach((item) => {
        const placeDetailRef = useRef()
        gmpRefs.push(placeDetailRef)
    })

    const detailButtonHandler = (target) => {
        console.log(target)
        const sibling = target.nextElementSibling;
        if (target.textContent === '+') {
            setActivePlaceId(target.id)
            target.textContent = '-';
            sibling.classList.remove('place-details-collapsed');
            sibling.classList.add('place-details-expanded');
        } else {
            target.textContent = '+';
            sibling.classList.add('place-details-collapsed');
            sibling.classList.remove('place-details-expanded');
        }
    }
    useEffect(() => {
        gmpRefs.forEach((ref, idx) => {
            if (ref.current) {
                ref.current.addEventListener('gmp-load', () => gmpLoadHandler(ref.current));
            }
        });
    }, [])
    return (
        <div className="place-panel">
            <Typography variant="h4">Places Details API</Typography>
            <Typography variant="body2">Marks will be added while scrolling down</Typography>
            <div className="close-btn">
                <CloseIcon onClick={() => {
                    setMode('bq');
                    setPlaceData([]);
                }} />
            </div>
            <div className="place-list">
                {
                    aggData?.placeInsights?.map((item, idx) => {
                        return (
                            <div key={idx} onClick={(evt) => { setActivePlaceId(evt.target.place.id) }}>
                                <gmp-place-details-compact
                                    key={idx}
                                    orientation="horizontal"
                                    slot="control-block-start-inline-center"
                                    ref={gmpRefs[idx]}
                                >
                                    <gmp-place-details-place-request place={item.place.substring(7)}></gmp-place-details-place-request>
                                    <gmp-place-content-config>
                                        <gmp-place-rating></gmp-place-rating>
                                        <gmp-place-type></gmp-place-type>
                                        <gmp-place-price></gmp-place-price>
                                        <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
                                        <gmp-place-open-now-status></gmp-place-open-now-status>
                                        <gmp-place-attribution light-scheme-color="gray" dark-scheme-color="white"></gmp-place-attribution>
                                    </gmp-place-content-config>
                                </gmp-place-details-compact>
                                <div id={item.place.substring(7)} onClick={(evt) => { detailButtonHandler(evt.target) }}>+</div>
                                <div className="place-details-collapsed" key={item.place.substring(7)}>
                                    <gmp-place-details>
                                        <gmp-place-details-place-request place={item.place.substring(7)}></gmp-place-details-place-request>
                                        <gmp-place-all-content></gmp-place-all-content>
                                    </gmp-place-details>
                                </div>
                            </div>
                        )

                    })
                }
            </div>
        </div>

    )
}