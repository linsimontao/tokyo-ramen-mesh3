import { useRef, useState, useEffect } from "react"
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import { PolygonLayer } from "deck.gl";
import './Map.css'
const mapOptions = {
    center: {
        lat: 35.66630843274808,
        lng: 139.70069797227023
    },
    mapId: "fae05836df2dc8bb",
    zoom: 11.5
};

export const Map = ({ data, google, mode, setMode, activePlaceId, focus, setAggItem, aggItem, placeData }) => {
    const ref = useRef()
    const overlayRef = useRef();
    const [map, setMap] = useState()
    const markers = useRef([])

    const clickHandler = (info, event) => {
        setMode('agg')
        setAggItem(info.object)
        // console.log('Clicked:', info, event);
    }

    const layer_place_count = new PolygonLayer({
        id: 'layer-place-count',
        data,
        getPolygon: (d) => d.poly,
        // getElevation: (d) => Number(d.place_count) * 100,
        getFillColor: (d) => [255, 0, 0, Number(d.place_count) * 2],
        getLineColor: () => [255, 255, 255],
        getLineWidth: 1,
        lineWidthMinPixels: 1,
        pickable: true,
        onClick: (info, event) => clickHandler(info, event),
        // extruded: true
    });

    const layer_rating_avg = new PolygonLayer({
        id: 'layer-rating-avg',
        data,
        getPolygon: (d) => d.poly,
        // getElevation: (d) => Number(d.place_count) * 100,
        getFillColor: (d) => [0, 255, 0, Math.pow(10, Number(d.avg_rating)) / 20000 * 255],
        getLineColor: () => [255, 255, 255],
        getLineWidth: 1,
        lineWidthMinPixels: 1,
        pickable: true,
        onClick: (info, event) => clickHandler(info, event),
        // extruded: true
    });
    const layer_rating_count = new PolygonLayer({
        id: 'layter-rating-count',
        data,
        getPolygon: (d) => d.poly,
        // getElevation: (d) => Number(d.place_count) * 100,
        getFillColor: (d) => [0, 0, 255, Number(d.rating_count) / 50000 * 255],
        getLineColor: () => [255, 255, 255],
        getLineWidth: 1,
        lineWidthMinPixels: 1,
        pickable: true,
        onClick: (info, event) => clickHandler(info, event),
        // extruded: true
    });

    const getDisplay = (poly) => {
        // console.log('getCenter', poly)
        if (poly.length === 0) return [0, 0];
        const lat = (poly[1][1] + poly[2][1]) / 2;
        // to set the tile in the center of map(considering the panel)
        const lng = (poly[0][0] + poly[1][0]) / 2 - 0.005;
        // console.log('center', lat, lng)
        return { lat, lng };
    }
    useEffect(() => {
        if (google && data) {
            const map = new window.google.maps.Map(ref.current, mapOptions);
            setMap(map)

            overlayRef.current = new GoogleMapsOverlay()

            overlayRef.current.setProps({
                initialViewState: {
                    longitude: -122.4,
                    latitude: 37.74,
                    zoom: 11
                },
                controller: true,
                getTooltip: ({ object }) => {
                    return object && `MeshID: ${object.meshid}\nRamen shop count: ${object.place_count}\nAverage rating: ${Number(object.avg_rating).toFixed(2)}\nRating count: ${object.rating_count}`
                }
            });
            overlayRef.current.setMap(map)

        }
    }, [google])

    useEffect(() => {
        if (google && mode === 'bq') {
            if (markers.current.length > 0) {
                markers.current.forEach(marker => {
                    marker.marker.setMap(null);
                })
                markers.current = [];
            }
            if (map) {
                map.moveCamera({
                    center: {
                        lat: 35.66630843274808,
                        lng: 139.70069797227023
                    },
                    zoom: 11.5
                });
            }
        }
    }, [google, mode])

    useEffect(() => {
        if (google && overlayRef.current && focus && mode === 'bq') {
            if (focus === 'placeCount') {
                overlayRef.current.setProps({
                    layers: [layer_place_count]
                });
            }
            else if (focus === 'ratingScore') {
                overlayRef.current.setProps({
                    layers: [layer_rating_avg]
                });
            }
            else if (focus === 'ratingCount') {
                overlayRef.current.setProps({
                    layers: [layer_rating_count]
                });
            }
        }
    }, [google, focus])

    useEffect(() => {
        if (google && mode === 'place' && placeData.length > 0) {
            markers.current.forEach(marker => {
                marker.marker.setMap(null);
            })
            markers.current = [];
            // console.log('placeData changed:', placeData)
            placeData.forEach(place => {
                const marker = new google.maps.Marker({
                    position: { lat: place.location.lat(), lng: place.location.lng() },
                    map: map,
                    title: place.name,
                    label: {
                        text: place.name,
                        color: "black",
                        fontSize: "12px"
                    }
                });
                markers.current.push({ 'placeId': place.placeId, 'marker': marker });
            });
        }
    }, [google, mode, placeData])

    useEffect(() => {
        if (google && mode === 'place' && activePlaceId) {
            if (markers.current.length > 0) {
                // console.log('markers', markers.current)
                const marker = markers.current.filter(marker => marker.placeId === activePlaceId);
                if (marker.length > 0) {
                    // map.moveCamera({ center: { lat: marker[0].marker.getPosition().lat(), lng: marker[0].marker.getPosition().lng() }, zoom: 16 });
                    marker[0].marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(() => {
                        marker[0].marker.setAnimation(null);
                    }, 2000);
                }
            }
        }
    }, [google, mode, activePlaceId])

    useEffect(() => {
        if (google && overlayRef.current && mode === 'place') {
            map.moveCamera({ center: getDisplay(aggItem.poly), zoom: 16.5 });
        }

    }, [google, mode])

    return <div ref={ref} id="map" />
}
