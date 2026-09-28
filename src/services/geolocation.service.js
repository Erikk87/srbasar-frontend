// Standort nur gerundet weitergeben: 2 Nachkommastellen sind etwa 1 km, genug für die
// Umkreissuche. So landen keine genauen Standorte beim Server (NBBV-Datenschutz).
export function roundCoordinate(value) {
  return Math.round(value * 100) / 100
}

export function requestUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Dein Browser unterstützt keine Standortabfrage.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: roundCoordinate(position.coords.latitude),
          longitude: roundCoordinate(position.coords.longitude)
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Die Standortfreigabe wurde abgelehnt.'))
          return
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Dein Standort ist momentan nicht verfügbar.'))
          return
        }
        reject(new Error('Die Standortabfrage hat zu lange gedauert.'))
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 10000
      }
    )
  })
}

export function parseDistanceKm(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && !value.trim()) return null
  const distance = Number(value)
  return Number.isFinite(distance) && distance >= 0 ? distance : null
}

export function formatDistanceKm(distanceKm) {
  if (!Number.isFinite(distanceKm)) return 'Entfernung unbekannt'
  return distanceKm < 10
    ? distanceKm.toFixed(1).replace('.', ',') + ' km'
    : Math.round(distanceKm) + ' km'
}
