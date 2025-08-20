import { useEffect, useState } from 'react'
import { Loader } from "@googlemaps/js-api-loader"
import { MainPane } from './MainPane'
import * as d3 from 'd3'
import * as wkt from 'wkt'
import './App.css'

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
  version: "beta",
  libraries: ["marker", "geometry", "places"]
});


function App() {
  const [google, setGoogle] = useState()
  const [data, setData] = useState()
    
  const processData = (raw) => {
    const tmp = raw.map((d, i) => {
      return {
        meshid: d.mesh1kmid,
        place_count: d['place_count'],
        avg_rating: d['avg_rating'],
        rating_count: d['rating_count'],
        poly: wkt.parse(d.geo).coordinates[0]
      }
    })
    return tmp
  }

  useEffect(() => {
    d3.csv('./ramen.csv').then((data) => {
      setData(processData(data))
      loader
        .load()
        .then(google => {
          setGoogle(google)
        })
        .catch(e => {
          console.error(e)
        })
    })

  }, [])

  return (
    <div className="app">
      <MainPane data={data} google={google}/>
    </div>
  )
}

export default App