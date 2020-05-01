module Algorithm {
    export class Navigation {

		protected gPosMap: egret.MapLike<boolean>;

		/**
		 * 初始化寻路空槽表
		 * @param tSlots 可用于寻路的空槽
		 */
		protected initMap(tSlots: string[])
		{
			const _map: egret.MapLike<boolean> = {};

			let _position: string;

			for (_position of tSlots)
			{
				_map[_position] = true;
			}

			this.gPosMap = _map;
		}

        static getPath(tSlots: string[], tFrom: IPos, tTo: IPos): Array<IPos> | void
        {

        }
    }
}