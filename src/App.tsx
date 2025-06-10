import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragCancelEvent
} from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';

const CELL_SIZE = 25;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;

interface GridItem {
  id: string;
  width: number;
  height: number;
  row: number;
  col: number;
  rotation: number; // 0 or 90
}

interface Preview {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
}

const App = () => {
  const [items, setItems] = useState<GridItem[]>([
    { id: 'item-1', width: 2, height: 3, row: 0, col: 0, rotation: 0 },
    { id: 'item-2', width: 1, height: 2, row: 5, col: 5, rotation: 0 }
  ]);

  const [preview, setPreview] = useState<Preview | null>(null);

  const getBounds = (item: GridItem | Preview) => ({
    left: item.col,
    right: item.col + item.width - 1,
    top: item.row,
    bottom: item.row + item.height - 1
  });

  const overlaps = (a: Preview, b: GridItem) => {
    const A = getBounds(a);
    const B = getBounds(b);
    return (
      A.left <= B.right &&
      A.right >= B.left &&
      A.top <= B.bottom &&
      A.bottom >= B.top
    );
  };

  const isValidPosition = (preview: Preview, ignoreId: string) =>
    preview.col >= 0 &&
    preview.row >= 0 &&
    preview.col + preview.width <= GRID_WIDTH &&
    preview.row + preview.height <= GRID_HEIGHT &&
    !items.some(other => other.id !== ignoreId && overlaps(preview, other));

  const handleDragMove = (event: DragMoveEvent) => {
    const { delta, active } = event;
    const item = items.find(it => it.id === active.id);
    if (!item || !delta) return;

    const rotated = item.rotation % 180 !== 0;
    const width = rotated ? item.height : item.width;
    const height = rotated ? item.width : item.height;

    const dx = Math.round(delta.x / CELL_SIZE);
    const dy = Math.round(delta.y / CELL_SIZE);

    const newCol = item.col + dx;
    const newRow = item.row + dy;

    const preview = { id: item.id, col: newCol, row: newRow, width, height };

    if (isValidPosition(preview, item.id)) {
      setPreview(preview);
    } else {
      setPreview(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    const item = items.find(it => it.id === active.id);
    if (!item || !preview) return;

    // If valid preview exists, update position
    setItems(prev =>
      prev.map(it =>
        it.id === item.id
          ? {
              ...it,
              row: preview.row,
              col: preview.col
            }
          : it
      )
    );
    setPreview(null);
  };

  const handleDragCancel = (_: DragCancelEvent) => {
    setPreview(null);
  };

  const rotateItem = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newRotation = (item.rotation + 90) % 180;

        const rotated = newRotation === 90;
        const newWidth = rotated ? item.height : item.width;
        const newHeight = rotated ? item.width : item.height;

        const clampedCol = Math.min(item.col, GRID_WIDTH - newWidth);
        const clampedRow = Math.min(item.row, GRID_HEIGHT - newHeight);

        const preview: Preview = {
          id: item.id,
          col: clampedCol,
          row: clampedRow,
          width: newWidth,
          height: newHeight
        };

        return isValidPosition(preview, item.id)
          ? { ...item, col: clampedCol, row: clampedRow, rotation: newRotation }
          : item; // cancel rotation if collision
      })
    );
  };

  return (
    <DndContext
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Droppable id='grid'>
        {items.map(item => (
          <Draggable
            key={item.id}
            id={item.id}
            row={item.row}
            col={item.col}
            width={item.width}
            height={item.height}
            rotation={item.rotation}
            onRotate={() => rotateItem(item.id)}
          />
        ))}
        {preview && (
          <div
            style={{
              position: 'absolute',
              top: preview.row * CELL_SIZE,
              left: preview.col * CELL_SIZE,
              width: preview.width * CELL_SIZE,
              height: preview.height * CELL_SIZE,
              backgroundColor: 'rgba(0, 128, 255, 0.3)',
              border: '2px dashed #0077cc',
              pointerEvents: 'none',
              zIndex: 50
            }}
          />
        )}
      </Droppable>
    </DndContext>
  );
};

export default App;
