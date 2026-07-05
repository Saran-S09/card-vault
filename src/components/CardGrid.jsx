import CardItem from "./CardItem";

function CardGrid({ cards, deleteCard, setSelectedCard, setEditingCard }) {
  return (
    <div className="grid-container">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          deleteCard={deleteCard}
          setSelectedCard={setSelectedCard}
          setEditingCard={setEditingCard}
        />
      ))}
    </div>
  );
}

export default CardGrid;