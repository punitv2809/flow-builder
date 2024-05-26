import { forwardRef, useRef } from 'react';
import { Group, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';

const Logo = ({ imageUrl }) => {
    const [image] = useImage(imageUrl);
    return (
        <Image
            x={10}
            y={10}
            width={50}
            height={50}
            image={image}
            cornerRadius={5}
        />
    );
};

const Tile = forwardRef(({ title, subtitle, imageUrl, width = 300, height = 70, onTileClick = null, onAddClick = null, onDragMove = null, ...groupProps }, ref) => {
    const add = useRef();
    const box = useRef();

    return (
        <Group
            onClick={() => onTileClick(box)}
            onMouseEnter={() => {
                add.current.show();
                box.current.strokeWidth(2);
            }}
            onMouseLeave={() => {
                add.current.hide();
                box.current.strokeWidth(0);
            }}
            ref={ref} {...groupProps}
        >
            <Rect
                ref={box}
                stroke={'#00ADB5'}
                strokeWidth={0}
                verticalAlign='middle'
                width={width}
                height={height}
                fill='#393E46'
                cornerRadius={5}
            />
            <Logo imageUrl={imageUrl} />
            <Group x={70} y={15}>
                <Text
                    fontSize={20}
                    width={width - 70}
                    align='left'
                    fill='white'
                    text={title}
                />
                <Text
                    fontSize={12}
                    width={width - 70}
                    y={25}
                    align='left'
                    fill='white'
                    text={subtitle}
                />
            </Group>
            <Rect
                onClick={(e) => {
                    e.cancelBubble = true;
                    if (onAddClick) {
                        onAddClick(e);
                    }
                }}
                ref={add}
                x={(width / 2) - (25 / 2)}
                y={height - 12.5}
                fill='#00ADB5'
                stroke={'#393E46'}
                strokeWidth={2}
                cornerRadius={5}
                width={25}
                height={25}
            />
        </Group>
    );
});

export default Tile;
