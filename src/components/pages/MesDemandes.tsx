import React, { useState } from 'react';
import { Heading, Section, Notification } from 'react-bulma-components';

interface DataItem {
  animal: string;
  demandeur: string;
  statut: string;
}

interface SortConfig {
  key: keyof DataItem | null;
  direction: 'ascending' | 'descending';
}

const FilterPage = () => {
  // État pour gérer les données et l'ordre de tri
  const [data, setData] = useState<DataItem[]>([
    { animal: 'Chat', demandeur: 'Alice', statut: 'En attente' },
    { animal: 'Chien', demandeur: 'Bob', statut: 'Approuvé' },
  ]);

    const [sortConfig, setSortConfig] = useState<SortConfig>({
      key: null,
      direction: 'ascending',
    });

  const sortedData = React.useMemo(() => {

    let sortableData = [...data];

    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a]; // Typage explicite pour éviter l'erreur
        const bValue = b[sortConfig.key as keyof typeof b];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }

        return 0;
      });

    }

    return sortableData;

  }, [data, sortConfig]);

  const requestSort = (key: keyof DataItem) => {

    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleConfirm = () => {
    if (window.confirm('Êtes-vous sûr de vouloir valider ?')) {
      alert('Validation effectuée !');
    }
  };

  return (
    <>
    
<div>
  <Heading>Mes demandes</Heading>
</div>

<Section>
  < Notification color={'info'} light={true}>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quisquam, commodi, atque dolorum delectus aspernatur perferendis magnam corrupti totam, suscipit ipsa nam impedit corporis accusantium molestias quia obcaecati esse eligendi.</p>
   </ Notification >
</Section>
    <section className="section">

      <div className="container">

        <table className="table is-fullwidth">

          <thead>

            <tr>

              <th></th>  

              <th>

                <button className="button is-ghost" onClick={() => requestSort('animal')}>
                  Nom animal
                </button>

              </th>

              <th>

                <button className="button is-ghost" onClick={() => requestSort('demandeur')}>
                  Nom demandeur
                </button>

              </th>

              <th>

                <button className="button is-ghost" onClick={() => requestSort('statut')}>
                  Statut
                </button>

              </th>

              <th>Valider</th>

            </tr>

          </thead>

          <tbody>

            {sortedData.map((item, index) => (

              <tr key={index}>

                <td>
                  <figure className="image is-48x48">
                    <img src="avatar_placeholder.png" alt="Avatar" />
                  </figure>
                </td>

                <td>
                  <a href="#">{item.animal}</a>
                </td>

                <td>
                  <a href="#">{item.demandeur}</a>
                </td>

                <td>{item.statut}</td>

                <td>
                  <button className="button is-primary" onClick={handleConfirm}>
                    Valider
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
    </>
  );

};

export default FilterPage;

