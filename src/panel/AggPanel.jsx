import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';

import './Panel.css'
export const AggPanel = ({ setMode, aggItem, aggData, setAggData }) => {
    const polygon = aggItem.poly;
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const btnClick = () => {
        setMode('place');
    }
    useEffect(() => {
        const body = {
            "insights": [
                ["INSIGHT_COUNT", "INSIGHT_PLACES"]
            ],
            "filter": {
                "locationFilter": {
                    "customArea": {
                        "polygon": {
                            "coordinates": [
                                { "latitude": polygon[0][1], "longitude": polygon[0][0] },
                                { "latitude": polygon[1][1], "longitude": polygon[1][0] },
                                { "latitude": polygon[2][1], "longitude": polygon[2][0] },
                                { "latitude": polygon[3][1], "longitude": polygon[3][0] },
                                { "latitude": polygon[4][1], "longitude": polygon[4][0] }
                            ]
                        }
                    }
                },
                "typeFilter": {
                    "includedTypes": [
                        "ramen_restaurant"
                    ]
                }
            }
        }
        fetch('https://areainsights.googleapis.com/v1:computeInsights', {
            method: 'POST',
            // mode: 'cors',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': import.meta.env.VITE_GOOGLEMAPS_API_KEY
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.count > 0) {
                    setAggData(data)
                }
            })

    }, [aggItem]);

    useEffect(() => {
        if (aggData.length != 0) {
            setLoading(false);
            console.log('AggPanel aggData:', aggData);
        }
    }, [aggData]);
    return (
        <div className="agg-panel">
            <div className="agg-title">
                <Typography variant="h4">Places Aggregate API</Typography>
            </div>
            <div className="close-btn">
                <CloseIcon onClick={() => {
                    setMode('bq');
                    setAggData([]);
                }} />
            </div>
            {
                loading ? (
                    <>
                        <Typography variant="body1" id="agg-panel-meshid">MeshID: {aggItem.meshid}</Typography>
                        <Typography variant="body1">Loading...</Typography>
                    </>

                ) : (
                    <>
                        <Typography variant="body1" id="agg-panel-meshid">MeshID: {aggItem.meshid}</Typography>
                        <Typography variant="body1" id="agg-panel-result">Places Aggregate API returns {aggData.count} places</Typography>
                        <ListItemButton onClick={handleClick}>
                            <ListItemText primary="Places Ids" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse id="places-id-list" in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {aggData.placeInsights?.map((item, idx) => (
                                    <ListItemText key={idx} primary={item.place.substring(7)} />
                                ))}
                            </List>
                        </Collapse>
                        <Button variant="outlined" onClick={() => btnClick()}>Show</Button>
                    </>
                )
            }
        </div>
    );
}