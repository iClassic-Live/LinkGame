module Algorithm {

	/**
	 * 双向齐头并进式穷举法
	 * 
	 * 算法：在保证每条路径都不存在回头并保证每条路径都避开障碍的前提下，起点终点双向穷举所有可能到达目标点的路径，
	 * 		并寻求最短且转角数最少的路径
	 */
    export class Exhaustion extends Navigation {

		/**
		 * 获取从起点到终点的最佳路径
		 * @param tFrom 起点
		 * @param tTo 终点
		 * @description 参数：[横坐标, 纵坐标]
		 */
		private getPath(tFrom: IPos, tTo: IPos)
		{
			const _posMap = this.gPosMap;

			const _twoWayList: [IOneWayInfo, IOneWayInfo] = [[tTo,[[0, [tFrom]]]],[tFrom,[[0, [tTo]]]]]

			let _sign1: boolean = true;  //是否有通道已到达目标节点
			let _minCornors: number = Infinity;  //所有可达通道的已知最小转角数

			let _bestPath: Array<IPos>;  //最佳路径

			let _oneWayInfo: IOneWayInfo; //单朝向寻路信息
			let _list: Array<IPathInfo>;  //通道信息列表
			let _nList: Array<IPathInfo>;  //下一节点
			let _count: number;
			let _item: IPathInfo;  //通道信息列表
			let _cornors: number;  //转角数
			let _path: Array<IPos>;  //通道路径
			let _allDirecs: [IPos, IPos, IPos, IPos];  //从当前节点延伸的四个待测节点 => 前、后、左、右
			let _nPos: number[];  //下一可能节点
			let [_tX, _tY]: IPos = [0, 0];  //目标节点的坐标
			let [_px, _py]: IPos = [0, 0];  //当前节点的上级节点
			let [_cx, _cy]: IPos = [0, 0];  //当前节点
			let [_nx, _ny]: IPos = [0, 0];	//当前节点的下级节点
			let [_ex, _ey]: IPos = [0, 0];  //通道节点
			let _position: string;  //下级节点名称
			let _pathSize: number;  //通道路径长度
			let _index: number;  //通道序号
			let _sign2: boolean;  //下级节点是否可向前回溯到倒数第二个节点
			let _pathPosMap: egret.MapLike<true> = {};  //当前通道节点表

			//每完成一个While循环，所有有效通道增加一个节点
			//起点=>终点 终点=>起点 双向寻路，减少在实际上无法找到有效路径时过度寻路的寻路消耗
			loop: while (_sign1)
			{
				for (_oneWayInfo of _twoWayList)
				{
					[[_tX, _tY], _list] = _oneWayInfo;
					_nList = [];
					_count = 0;

					//遍历通道信息列表
					for ([_cornors, _path] of _list)
					{
						_pathSize = _path.length;
						_sign2 = _pathSize > 1;
						[_cx, _cy] = _path[_pathSize - 1];
						[_px, _py] = _sign2 && _path[_pathSize - 2];

						//枚举从当前节点延伸的四个待测节点
						_allDirecs = [
							[_cx - 1 , _cy],  //左子项
							[_cx + 1 , _cy],  //右子项
							[_cx , _cy - 1],  //上子项
							[_cx , _cy + 1],  //下子项
						];

						_index = _path.length;
						_pathPosMap = {};

						//遍历当前通道节点生成通道节点表
						while (--_index >= 0)
						{
							[_ex, _ey] = _path[_index];

							_pathPosMap[`${_ex}_${_ey}`] = true;
						}

						//遍历四个待测节点
						for (_nPos of _allDirecs)
						{
							[_nx, _ny] = _nPos;
							_position = `${_nx}_${_ny}`;

							//建立新的通道信息
							_item = [_cornors, [..._path, <IPos>_nPos]];

							//若下级节点可向前回溯到倒数第二个节点
							if (_sign2)
							{
								//若下级节点和前溯倒数第二个节点的横纵坐标都不相同，则两节点之间存在一个转角
								if (_px !== _nx && _py !== _ny)
								{
									if (_cornors < _minCornors)
									{
										_item[0] = _cornors;
									}
									//若当前转角数不小于所有可达通道的已知最小转角数，则丢弃这个下级节点
									else
									{
										continue;
									}
								}
							}

							//若下级节点和目标节点坐标相同
							if (_tX === _nx && _tY === _ny)
							{
								//当前通道的转角数小于所有可达通道的已知最小转角数，当前通道为最佳通道
								if (_minCornors > _item[0])
								{
									_minCornors = _item[0];
									_bestPath = _item[1];
									_sign1 = false;
								}
							}
							//若有通道已到达目标节点，将不再在当前通道上增加节点
							else if (_sign1 === false)
							{
								continue;
							}
							//若下级节点也不存在于空槽表中，则丢弃当前节点
							else if (_posMap[_position] !== true)
							{
								continue;
							}
							//若下级节点存在于当前通道节点表中，则丢弃这个下级节点
							else if (_pathPosMap[_position] === true)
							{
								continue;
							}
							else
							{
								_nList[_count++] = _item;
							}
						}
					}

					if (_sign1 && _nList.length > 0)
					{
						_oneWayInfo[1] = _nList;
					}
					else
					{
						break loop;
					}
				}
			}

			return <Array<IPos> | void>_bestPath;
		}

		private static gPool: Exhaustion[] = [];

		private static create(tSlots: string[])
		{
			const _self = this;
			const _pool = _self.gPool;
			const _inst = _pool.length > 0 ? _pool.pop() : new _self;

			_inst.initMap(tSlots);

			return _inst;
		}

		public static getPath(tSlots: string[], tFrom: IPos, tTo: IPos)
		{
			return this.create(tSlots).getPath(tFrom, tTo);
		}

    }
}
