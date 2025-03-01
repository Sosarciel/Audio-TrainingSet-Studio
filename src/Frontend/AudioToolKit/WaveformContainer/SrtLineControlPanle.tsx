import { Button, Card, UtilRH, UtilRT } from "@zwa73/react-utils";
import React, { MutableRefObject, Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { css } from "styled-components";
import { SrtLineContainer } from "./SrtLineContainer";
import { audioTookKitTooltipBoard } from "../AudioTookKitInterface";
import { WaveformContainer } from "./WaveformContainer";
import { AudioToolKitRef } from "../AudioToolKit";

const baseCardStyle = css`
    padding: 5px;
    padding-right: 1px;
    padding-left: 1px;
    width: calc( 4rem + 2px );
    box-sizing: border-box;
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: var(--background-color-3);
    font-size: 0.9rem;
    border-right: 2px solid saddlebrown;
`;
const buttonStyle = css``;

export type SrtLineControlPanleProp = {
    srtLineContainer:MutableRefObject<SrtLineContainer>;
    waveformContainer:MutableRefObject<WaveformContainer>;
}
export type SrtLineControlPanle = {
    forceUpdate:()=>void;
    changeAlign:()=>void;
}

const timeCardStyle = css`
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: var(--background-color-3);
`;

export const SrtLineControlPanle = forwardRef((props:SrtLineControlPanleProp,ref:Ref<SrtLineControlPanle>)=>{
    const {srtLineContainer,waveformContainer} = props;
    const [lockText,setLockText] = useState("已对齐");
    const [fu,forceUpdate] = UtilRH.useForceUpdate(); // 用于强制更新

    const changeAlign = ()=>{
        const dat = srtLineContainer.current.getData();
        dat.isAlign = !dat.isAlign;
        if(dat.isAlign) setLockText("已对齐");
        else setLockText("未对齐");
        srtLineContainer.current.reAlign();
    };

    const refocus = ()=>{
        srtLineContainer.current.refocus();
    };

    const del = ()=>{
        waveformContainer.current.removeSrtLine(srtLineContainer.current.getData().segmentsIndex);
    };
    const add = ()=>{
        waveformContainer.current.addSrtLine(srtLineContainer.current.getData().segmentsIndex);
    };

    useImperativeHandle(ref,()=>({
        forceUpdate,
        changeAlign,
    }));

    const fixStyle = useMemo(()=>css`
    ${baseCardStyle}
    height: ${AudioToolKitRef.current?.getReactData().lineHeight??128}px;
    `,[]);


    return <Card cardStyle={fixStyle} >
        <Button cardStyle={buttonStyle} content={lockText} onClick={changeAlign} tooltip="切换紧密对齐"  tooltipStyle={audioTookKitTooltipBoard}/>
        <Button cardStyle={buttonStyle} content="对焦" onClick={refocus} tooltip="重设焦点至区域"         tooltipStyle={audioTookKitTooltipBoard}/>
        <Button cardStyle={buttonStyle} content="删除" onClick={del} tooltip="删除此行"               tooltipStyle={audioTookKitTooltipBoard}/>
        <Button cardStyle={buttonStyle} content="添加" onClick={add} tooltip="在此行下方新增"         tooltipStyle={audioTookKitTooltipBoard}/>
        <Card cardStyle={timeCardStyle}>
            <div>{String(parseFloat(srtLineContainer.current.getData().mainRegion?.start.toFixed(3)??"")) + '->'}</div>
            <div>{String(parseFloat(srtLineContainer.current.getData().mainRegion?.end.toFixed(3)??""))}</div>
        </Card>
    </Card>;
});