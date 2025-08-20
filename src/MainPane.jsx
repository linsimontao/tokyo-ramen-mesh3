import { useEffect, useState } from 'react'
import { Map } from './map/Map'
import './Pane.css'
import { BQPanel } from './panel/BQPanel'
import { AggPanel } from './panel/AggPanel'
import { PlacePanel } from './panel/PlacePanel'

export const MainPane = ({ data, google }) => {
  const [activePlaceId, setActivePlaceId] = useState()
  const [focus, setFocus] = useState('placeCount')
  const [aggItem, setAggItem] = useState('')
  const [aggData, setAggData] = useState([])
  const [placeData, setPlaceData] = useState([])
  const [mode, setMode] = useState('bq')
  
  return (
    <div className="pane">
      <Map data={data} google={google} mode={mode} setMode={setMode} activePlaceId={activePlaceId} focus={focus} setAggItem={setAggItem} aggItem={aggItem} placeData={placeData}/>
      { mode === 'bq'? 
        <BQPanel setFocus={setFocus} /> 
          : mode === 'agg'? 
            <AggPanel setMode={setMode} aggItem={aggItem} aggData={aggData} setAggData={setAggData}/> 
              : <PlacePanel setMode={setMode} aggData={aggData} setPlaceData={setPlaceData} activePlaceId={activePlaceId} setActivePlaceId={setActivePlaceId}/> 
      }
    </div>
  )
}
