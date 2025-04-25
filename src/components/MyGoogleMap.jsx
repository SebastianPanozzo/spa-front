import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
const apiKey = "AIzaSyBHfojGelZfxKv9RXY1Y38yz8CjdkL5VAk"

function MyGoogleMap({ context }) {
    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={context.style ? context.style : null}
                center={context.center ? context.center : { lat: -27.45167, lng: -58.98667 }}
                zoom={context.zoom ? context.zoom : 15}>
                {context.center && (
                    <Marker position={context.center} />)
                }
            </GoogleMap>
        </LoadScript>
    );
}
export default MyGoogleMap;