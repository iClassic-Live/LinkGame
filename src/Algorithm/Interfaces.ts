module Algorithm {
    /**
     * 节点坐标 => [横坐标，纵坐标]
     */
    export type IPos = [number, number];
    /**
     * 通道数据 => [转角数，通道路径]
     */
    export type IPathInfo = [number, Array<IPos>];
    /**
     * 单朝向数据 => [目标节点，通道数据]
     */
    export type IOneWayInfo = [IPos, Array<IPathInfo>];
}