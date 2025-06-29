import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect } from "react";
import { ControlPosition, useControl } from "react-map-gl/mapbox";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    position?: ControlPosition;
  
    onCreate?: (evt: {features: object[]}) => void;
    onUpdate?: (evt: {features: object[]; action: string}) => void;
    onDelete?: (evt: {features: object[]}) => void;
    drawRef?:any;
  };
export default function DrawControl(props: DrawControlProps & { drawRef?: React.RefObject<MapboxDraw> }){
    const { drawRef, ...drawOptions } = props;
    const draw = useControl<MapboxDraw>(
        () => new MapboxDraw(drawOptions),
        ({map}) => {
          if (props.onCreate) map.on('draw.create', props.onCreate);
          if (props.onUpdate) map.on('draw.update', props.onUpdate);
          if (props.onDelete) map.on('draw.delete', props.onDelete);
        },
        ({map}) => {
          if (props.onCreate) map.off('draw.create', props.onCreate);
          if (props.onUpdate) map.off('draw.update', props.onUpdate);
          if (props.onDelete) map.off('draw.delete', props.onDelete);
        },
        {
          position: props.position
        }
      );
      // Expose draw instance to parent
  useEffect(() => {
    if (props.drawRef) {
      props.drawRef.current = draw;
    }
  }, [props.drawRef, draw]);
    
      return null;

}
DrawControl.defaultProps = {
    onCreate: () => {},
    onUpdate: () => {},
    onDelete: () => {}
  };