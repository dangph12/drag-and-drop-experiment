import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children?: React.ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '300px',
        height: '300px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(12, 1fr)',
        backgroundColor: '#000',
        position: 'relative'
      }}
    >
      {[...Array(144)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
      ))}
      {children}
    </div>
  );
};

export default Droppable;
