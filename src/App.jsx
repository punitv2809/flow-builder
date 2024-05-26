import React, { useRef, useState, useEffect } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import Tile from './Tile';

const GRID_SIZE = 50;

const snapToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};

const App = () => {
  const boxGroup = useRef();
  const box2Group = useRef();
  const line = useRef();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stage = line.current.getStage();
    stage.on('wheel', handleWheel);
    return () => {
      stage.off('wheel', handleWheel);
    };
  }, []);

  const handleWheel = e => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = line.current.getStage();
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleZoomIn = () => {
    setScale(scale * 1.1); // Increase scale by 10%
  };

  const handleZoomOut = () => {
    setScale(scale * 0.9); // Decrease scale by 10%
  };

  const handleDragMove = (groupRef, isBox1) => {
    const [x, y] = [groupRef.current.x(), groupRef.current.y()];
    const prevPoints = line.current.points();

    if (isBox1) {
      line.current.points([x + 150, y + 35, prevPoints[2], prevPoints[3]]);
    } else {
      line.current.points([prevPoints[0], prevPoints[1], x + 150, y + 35]);
    }
  };

  const handleDragEnd = (groupRef, isBox1) => {
    const snappedX = snapToGrid(groupRef.current.x(), GRID_SIZE);
    const snappedY = snapToGrid(groupRef.current.y(), GRID_SIZE);
    groupRef.current.position({ x: snappedX, y: snappedY });

    handleDragMove(groupRef, isBox1);
  };

  const dots = [];

  // Calculate positions of dots
  for (let x = 0; x < window.innerWidth; x += GRID_SIZE) {
    for (let y = 0; y < window.innerHeight; y += GRID_SIZE) {
      dots.push(
        <Line
          key={`${x}-${y}`}
          points={[x, y, x + 1, y + 1]} // Make sure the dot is visible by drawing a tiny line
          stroke="white"
        />
      );
    }
  }

  const [tiles, setTiles] = useState(null);

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scale={{ x: scale, y: scale }}
        style={{ backgroundColor: '#222831' }}
      >
        <Layer>
          {dots}
          <Line
            ref={line}
            stroke='#00ADB5'
            strokeWidth={2}
            points={[800 + 150, 50 + 35, 800 + 150, 200 + 35]}
            lineCap='round'
            lineJoin='round'
          />
          <Tile
            ref={boxGroup}
            onTileClick={() => {
              setTiles(<Tile
                ref={boxGroup}
                onTileClick={() => alert("ok")}
                onAddCLick={() => alert("adding")}
                x={800}
                y={50}
                draggable
                onDragMove={() => handleDragMove(boxGroup, true)}
                onDragEnd={() => handleDragEnd(boxGroup, true)}
                title="Hello Integrator"
                subtitle="Some boring long text description here."
                imageUrl="https://source.unsplash.com/50x50/?logo"
              />);
            }}
            onAddCLick={() => alert("adding")}
            x={800}
            y={50}
            draggable
            onDragMove={() => handleDragMove(boxGroup, true)}
            onDragEnd={() => handleDragEnd(boxGroup, true)}
            title="Hello Integrator"
            subtitle="Some boring long text description here."
            imageUrl="https://source.unsplash.com/50x50/?logo"
          />
          <Tile
            ref={box2Group}
            x={800}
            y={200}
            draggable
            onDragMove={() => handleDragMove(box2Group, false)}
            onDragEnd={() => handleDragEnd(box2Group, false)}
            title="Image Generator"
            subtitle="Some boring long text description here."
            imageUrl="https://source.unsplash.com/50x50/?abstract"
          />
          {tiles}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
