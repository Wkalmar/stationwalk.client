import { Station } from './../src/models/station';
import { StationToMarkerMapper } from './../src/business-logic/stationToMarkerMapper';
import { expect } from 'chai'

describe('StationToMarkerMapper', () => {
  it('should map point to marker correctly', () => {
    const station: Station = new Station()
    station.location = {
      lattitude: 58,
      longitude: 42
    }
    const mapper: StationToMarkerMapper = new StationToMarkerMapper(station)
    const result = mapper.map();
    const resultLatLng = result.getLatLng()
    expect(resultLatLng.lat).to.equal(58)
    expect(resultLatLng.lng).to.equal(42)
  })

  it('should map point to marker correctly 2', () => {
    const station: Station = new Station()
    station.location = {
      lattitude: 13,
      longitude: 16
    }
    const mapper: StationToMarkerMapper = new StationToMarkerMapper(station)
    const result = mapper.map();
    const resultLatLng = result.getLatLng()
    expect(resultLatLng.lat).to.equal(13)
    expect(resultLatLng.lng).to.equal(16)
  })
})