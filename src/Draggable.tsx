import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  rotation: number;
  onRotate: () => void;
}

const CELL_SIZE = 25;

const Draggable: React.FC<DraggableProps> = ({
  id,
  row,
  col,
  width,
  height,
  rotation,
  onRotate
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const isRotated = rotation % 180 === 90;
  const w = isRotated ? height : width;
  const h = isRotated ? width : height;

  const style: React.CSSProperties = {
    width: w * CELL_SIZE,
    height: h * CELL_SIZE,
    position: 'absolute',
    top: row * CELL_SIZE,
    left: col * CELL_SIZE,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    backgroundColor: 'rgba(100, 200, 255, 0.8)',
    border: '2px solid #0077cc',
    cursor: 'move',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  };

  return (
    <>
      {/* Floating Rotate Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          onRotate();
        }}
        style={{
          position: 'absolute',
          top: row * CELL_SIZE - 26, // ⬅️ increased offset to move button higher
          left: col * CELL_SIZE,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          background: '#333',
          color: 'white',
          fontSize: 12,
          padding: '4px 8px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 200,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)' // ⬅️ nice visual lift
        }}
      >
        ⟳
      </button>

      {/* Main draggable block */}
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {id}
      </div>
    </>
  );
};

export default Draggable;
