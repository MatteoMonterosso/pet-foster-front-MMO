import {
  Section,
  Heading,
  Image,
  Button,
  Table,
  Container,
  Columns,
  Column,
} from 'react-bulma-components';
import MainModal from '../partials/Modal';
import { useModal } from '../../hooks/ModalContext';
function ProfilUtilisateur() {
  const { openModal } = useModal();

  return (
    <main>
      <div>
        <Heading size={1}>Profil utilisateur</Heading>
      </div>
      <Section>
        <Container>
          <Columns>
            <Columns.Column size={{ mobile: 12, tablet: 12, desktop: 6 }}>
              <picture>
                <Image src="#" alt="profile picture" size={300} />
              </picture>
            </Columns.Column>
            <Columns.Column size={{ mobile: 12, tablet: 12, desktop: 6 }}>
              <ul>
                <li>Nom</li>
                <li>Prénom</li>
                <li>Email</li>
                <li>Tél</li>
                <li>Pays</li>
                <li>Code postal</li>
                <li>Ville</li>
                <li>Adresse</li>
              </ul>
            </Columns.Column>
          </Columns>
        </Container>
      </Section>
      <Section>
        <Heading size={2} renderAs="h2">
          Description
        </Heading>
        <Section>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi
            recusandae, velit exercitationem corrupti expedita laudantium
            adipisci ea, reprehenderit cupiditate nam aperiam maiores tempore
            qui ducimus rerum molestiae id laboriosam eum.
          </p>
        </Section>
        <Button
          color="primary"
          className="js-modal-trigger"
          onClick={openModal}
        >
          Contacter ou modifier
        </Button>
      </Section>
      <Section>
        <Heading size={2} renderAs="h2">
          Profils d'accueil
        </Heading>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          praesentium sint eos sequi nobis, suscipit aut quisquam enim maxime
          vitae voluptate culpa debitis ea officiis molestias est quia a? Sunt.
        </p>
        <Button
          color="primary"
          className="js-modal-trigger"
          onClick={openModal}
        >
          Ajouter
        </Button>
        <Table>
          <thead>
            <tr>
              <th>Espèce</th>
              <th>Age</th>
              <th>Sexe</th>
              <th>Perimètre</th>
              <th>Suppr.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chat</td>
              <td>-5ans</td>
              <td>Mâle</td>
              <td>30 Km</td>
              <td>
                <Button color="danger" className="is-dark">
                  Suppr
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Section>
      <MainModal />
    </main>
  );
}

export default ProfilUtilisateur;
