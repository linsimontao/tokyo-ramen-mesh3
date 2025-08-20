import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './Panel.css'

export const BQPanel = ({ setFocus }) => {
    const handleClick = (event) => {
        const value = event.target.value;
        setFocus(value);
    }
    return (
        <div className="bq-panel">
            <Typography variant="h4">Places Insights</Typography>
            <FormControl id="bq-group">
                <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="placeCount"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="placeCount" control={<Radio />} label="Place count" onClick={handleClick} />
                    <FormControlLabel value="ratingScore" control={<Radio />} label="Rating score" onClick={handleClick} />
                    <FormControlLabel value="ratingCount" control={<Radio />} label="Rating count" onClick={handleClick} />
                </RadioGroup>
            </FormControl>
        </div>
    );
}