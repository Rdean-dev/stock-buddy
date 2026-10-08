import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

export default function Marker({shape, color}) {
    if (shape === 'circle'){
        return (
            <Svg height="10" width="10">
                <Circle cx='5' cy='5' r='5' fill={color}/>
            </Svg>
        )
    }else if(shape === 'triangle'){
        return (
            <Svg height="10" width="10">
                <Polygon points="5,0 10,10 0,10" fill={color}/>
            </Svg>

        )
    }else if(shape === 'diamond'){
    return (
        <Svg height="10" width="10">
            <Polygon points="5,0 0,5 5,10 10,5" fill={color}/>
        </Svg>

    )
    }else if(shape === 'square'){
    return (
        <Svg height="10" width="10">
            <Rect x='0' y="0" width='10' height='10' fill={color}/>
        </Svg>

    )
    }else if(shape === 'star'){
    return (
        <Svg height="10" width="10">
            <Polygon
                points="5,0 6.2,3.5 10,3.5 7,5.8 8.2,10 5,7.5 1.8,10 3,5.8 0,3.5 3.8,3.5"
                fill={color}/>
        </Svg>

    )
    }else{
        return null
    }

}