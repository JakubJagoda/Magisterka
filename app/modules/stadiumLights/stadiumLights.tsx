import React from 'react';

interface IStadiumLightsProps {
    radius: number;
    countX: number;
    countY: number;
    startX?: number;
    startY?: number;
    margin?: number;
    shadowBlur?: number;
    className?: string;
    style?: any;
}

export default class StadiumLights extends React.Component<IStadiumLightsProps,{}> {
    private canvasContext: CanvasRenderingContext2D;
    
    render() {
        return <canvas className={this.props.className} style={this.props.style} ref={this.renderHook.bind(this)} />
    }
    
    private renderHook(ref: HTMLCanvasElement) {
        this.canvasContext = ref.getContext('2d');
        ref.setAttribute('width', String(this.getWidth()));
        ref.setAttribute('height', String(this.getHeight()));

        this.renderStadiumLight();
    }

    private getWidth(): number {
        return this.getDimensionSize(this.props.startX, this.props.countX);
    }

    private getHeight(): number {
        return this.getDimensionSize(this.props.startY, this.props.countY);
    }

    private getDimensionSize(start: number, elementCountInDimension: number) {
        return start + elementCountInDimension*(2*this.props.radius + this.props.margin) - this.props.margin;
    }
    
    private renderStadiumLight() {
        const shift = 2*this.props.radius + this.props.margin;

        for (let i = 0;i < this.props.countX; ++i) {
            for (let j = 0;j < this.props.countY; ++j) {
                StadiumLights.renderLightToContext(this.canvasContext, i*shift + this.props.startX + this.props.shadowBlur / 2,
                    j*shift + this.props.startY + this.props.shadowBlur / 2, this.props.radius, this.props.shadowBlur);
            }
        }
    }

    private static renderLightToContext(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, shadowBlur: number) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = 'white';

        ctx.arc(x, y, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
}