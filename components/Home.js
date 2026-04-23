import { useState, useEffect } from 'react';
import Card from './Card';
import styles from '../styles/Home.module.css';

const INITIAL_DECK = [
  { id: 1,  name: 'billiard ball', image: '/billiardball.svg' },
  { id: 2,  name: 'billiard ball', image: '/billiardball.svg' },
  { id: 3,  name: 'bubble tea',    image: '/bubbletea.svg'    },
  { id: 4,  name: 'bubble tea',    image: '/bubbletea.svg'    },
  { id: 5,  name: 'cactus',        image: '/cactus.svg'       },
  { id: 6,  name: 'cactus',        image: '/cactus.svg'       },
  { id: 7,  name: 'dog',           image: '/dog.svg'          },
  { id: 8,  name: 'dog',           image: '/dog.svg'          },
  { id: 9,  name: 'laptop',        image: '/laptop.svg'       },
  { id: 10, name: 'laptop',        image: '/laptop.svg'       },
  { id: 11, name: 'octopus',       image: '/octopus.svg'      },
  { id: 12, name: 'octopus',       image: '/octopus.svg'      },
  { id: 13, name: 'strawberry',    image: '/strawberry.svg'   },
  { id: 14, name: 'strawberry',    image: '/strawberry.svg'   },
  { id: 15, name: 'sunglasses',    image: '/sunglasses.svg'   },
  { id: 16, name: 'sunglasses',    image: '/sunglasses.svg'   },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Home() {
  const [deck, setDeck] = useState(() => shuffle(INITIAL_DECK));
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (selected.length > 0 && selected.length === deck.length) {
      setWon(true);
    }
  }, [selected, deck.length]);

  const restart = () => {
    setDeck(shuffle(INITIAL_DECK));
    setSelected([]);
    setLocked(false);
    setWon(false);
  };

  const selectCard = (id) => {
    if (locked) return;
    if (selected.includes(id)) return;

    const pendingIds = selected.filter(sid => {
      const name = deck.find(c => c.id === sid).name;
      return selected.filter(s => deck.find(c => c.id === s).name === name).length < 2;
    });

    if (pendingIds.length >= 2) return;

    const newSelected = [...selected, id];
    setSelected(newSelected);

    const newPendingIds = [...pendingIds, id];

    if (newPendingIds.length === 2) {
      const [cardA, cardB] = newPendingIds.map(sid => deck.find(c => c.id === sid));
      if (cardA.name !== cardB.name) {
        setLocked(true);
        setTimeout(() => {
          setSelected(prev => prev.filter(sid => !newPendingIds.includes(sid)));
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Memory Game 🧠</h1>
        <div className={styles.headerDivider} />
      </div>

      {won && (
        <div className={styles.winOverlay}>
          <div className={styles.winCard}>
            <p className={styles.winEmoji}>🎉</p>
            <h2 className={styles.winTitle}>Bravo !</h2>
            <p className={styles.winSub}>Toutes les paires trouvées</p>
            <button className={styles.restartBtn} onClick={restart}>
              Rejouer
            </button>
          </div>
        </div>
      )}

      <div className={styles.main}>
        <div className={styles.grid}>
          {deck.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              image={card.image}
              selectCard={selectCard}
              selected={selected.includes(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;