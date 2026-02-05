const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

interface GeocodingResult {
  lat: number
  lng: number
  formattedAddress: string
}

const geocodeCache = new Map<string, GeocodingResult>()

export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  const cached = geocodeCache.get(address)
  if (cached) return cached

  if (!GOOGLE_MAPS_API_KEY) {
    return null
  }

  try {
    const encoded = encodeURIComponent(address)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR&region=BR`,
    )
    const data = await response.json()

    if (data.status !== 'OK' || !data.results?.length) {
      return null
    }

    const result: GeocodingResult = {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
      formattedAddress: data.results[0].formatted_address,
    }

    geocodeCache.set(address, result)
    return result
  } catch {
    return null
  }
}
