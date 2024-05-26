import React, { useEffect, useRef, useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import Tile from '../Tile';


const GRID_SIZE = 50;

const View = () => {

    const DEFAULT_X = 500;
    const DEFAULT_Y = 200;
    const TILE_HEIGHT = 70;
    const TILE_GAP = 70;
    const dots = [];

    // Calculate positions of dots
    for (let x = 0; x < window.innerWidth; x += GRID_SIZE) {
        for (let y = 0; y < window.innerHeight; y += GRID_SIZE) {
            dots.push(
                <Line
                    key={`${x}-${y}`}
                    points={[x, y, x + 1, y + 1]} // Make sure the dot is visible by drawing a tiny line
                    stroke="#4c5485"
                />
            );
        }
    }

    const [flow, setFlow] = useState([
        {
            id: Math.random(),
            x: DEFAULT_X,
            y: DEFAULT_Y,
            image: 'https://cdn.iconscout.com/icon/free/png-256/free-webhooks-282425.png',
            title: "Webhook Trigger",
            subtitle: "webhook trigger, picked from config"
        }
    ]);

    const [sideTiles, setSideTiles] = useState(
        [
            {
                id: Math.random(),
                image: 'https://seeklogo.com/images/H/hubspot-logo-39CE90861B-seeklogo.com.png',
                title: "HubSpot Integration",
                subtitle: "Integrate with HubSpot to sync your data."
            },
            {
                id: Math.random(),
                image: 'data:image/png;base64,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',
                title: "Shopify",
                subtitle: "Connect Shopify to manage orders."
            },
            {
                id: Math.random(),
                image: 'https://static.vecteezy.com/system/resources/previews/009/116/675/non_2x/crm-logo-crm-letter-crm-letter-logo-design-initials-crm-logo-linked-with-circle-and-uppercase-monogram-logo-crm-typography-for-technology-business-and-real-estate-brand-vector.jpg',
                title: "Product Importer",
                subtitle: "Easily import products from various sources."
            }
        ]
    );

    const [pane, setPaneOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const tileRefs = useRef([]);
    const lineRefs = useRef([]);

    return (
        <div className='w-screen h-screen grid grid-cols-12'>
            <div className={`col-span-${pane ? 8 : 12}`}>
                <Stage
                    width={pane ? window.innerWidth / 1.5 : window.innerWidth}
                    height={window.innerHeight}
                    scale={{ x: 1, y: 1 }}
                    style={{ backgroundColor: '#170529' }}
                >
                    <Layer>
                        {dots}
                        {flow.map((tile, position) => (
                            <>
                                <Tile
                                    draggable
                                    key={tile.id}
                                    ref={el => tileRefs.current[position] = el}
                                    x={DEFAULT_X}
                                    y={DEFAULT_Y + position * (TILE_HEIGHT + TILE_GAP)}
                                    title={tile.title}
                                    subtitle={tile.subtitle}
                                    imageUrl={tile.image}
                                    onTileClick={(tile) => setPaneOpen(!pane)}
                                />
                                {position > 0 && (
                                    <Line
                                        key={tile.id + '_line'}
                                        ref={el => lineRefs.current[position] = el}
                                        stroke='#00ADB5'
                                        strokeWidth={2}
                                        points={[
                                            DEFAULT_X + 150, DEFAULT_Y + (position - 1) * (TILE_HEIGHT + TILE_GAP) + TILE_HEIGHT,
                                            DEFAULT_X + 150, DEFAULT_Y + position * (TILE_HEIGHT + TILE_GAP)
                                        ]}
                                        lineCap='round'
                                        lineJoin='round'
                                    />
                                )}
                            </>
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div className={`${pane ? 'flex' : 'hidden'} col-span-4 p-3 bg-stone-100 flex-col items-center justify-center gap-4`}>
                {sideTiles.map(x =>
                    <div key={x.id} className="tile border flex text-sm p-3 gap-2 rounded-md shadow-sm bg-white w-9/12 cursor-pointer hover:ring-2 ring-indigo-400/50 ring-offset-2 transition-all"
                        onClick={() => {
                            setFlow(
                                [
                                    ...flow,
                                    x
                                ]
                            )
                        }}
                    >
                        <img src={x.image} alt="tools" className='shrink-0 rounded-md' width={75} height={75} />
                        <div className="grow">
                            <p className='text-lg font-medium'>{x.title}</p>
                            <p>{x.subtitle}</p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default View
