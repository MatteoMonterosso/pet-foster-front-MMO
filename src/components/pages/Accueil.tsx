import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Heading, Button } from 'react-bulma-components';
const position: LatLngExpression = [43.3365, 1.3396];
function Accueil() {
  return (
    <main>
      <div>
        <h1>
          <Heading size={1} renderAs="h1">
            Bienvenue sur Pet Foster
          </Heading>
        </h1>
        <Button color="primary" className="js-modal-trigger">
          Créer mon compte
        </Button>
      </div>
      <div>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '300px' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png" />
          <Marker position={position}>
            <Popup>C'est mon bled !</Popup>
          </Marker>
        </MapContainer>
      </div>
    </main>
  );
}

export default Accueil;
