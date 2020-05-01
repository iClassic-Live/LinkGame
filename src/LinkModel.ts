class LinkModel {

    private readonly gSeed: number;
    private readonly gRows: number;
    private readonly gColumns: number;
    private readonly gNavigator: typeof Algorithm.Navigation;

    private gMap: egret.MapLike<number>;
    private gSlots: egret.MapLike<boolean>;
    private gRecords: Array<Algorithm.IPos>;

    private constructor()
    {
        this.gSeed = 7;
        this.gRows = 6;
        this.gColumns = 8;
        this.gSlots = {};
        this.gRecords = [];
        this.gNavigator = Algorithm.Exhaustion;
    }

    public get end()
    {
        const _self = this;
        const _mapSize = Object.keys(_self.gMap).length;
        const _slotsSize = Object.keys(_self.gSlots).length;

        return _mapSize === _slotsSize;
    }

    public shuffle(): Array<[string, number]>
    {
        const _self = this;
        const _seed = _self.gSeed;
        const _rows = _self.gRows;
        const _columns = _self.gColumns;

        const _list: Array<[string, number]> = [];
        const _matching: egret.MapLike<number> = {};
        const _map: egret.MapLike<number> = {};
        const _numMap: egret.MapLike<[string, number]> = {};

        let _item: [string, number];
        let _x: number;
        let _y: number;
        let _num: number;
        let _position: string;

        for (_x = 0; _x <= _seed; _x++)
        {
            _matching[_x] = 0;
        }

        for (_x = 0; _x < _rows; _x++)
        {
            for (_y = 0; _y < _columns; _y++)
            {
                _num = Math.round(Math.random() * _seed);
                _position = `${_x}_${_y}`;
                ++_matching[_num];
                _map[_position] = _num;
                _item = [_position, _num];
                _list.push(_item);
                if (_numMap[_num] === void 0)
                {
                    _numMap[_num] = _item;
                }
            }
        }

        let _eSeed = _seed + 1;
        let _sign = true;

        while (--_eSeed >= 0)
        {
            if (_matching[_eSeed] % 2 !== 0)
            {
                _item = _numMap[_eSeed];
                _sign = !_sign;

                if (_sign)
                {
                    _item[1] = _num;
                    _map[_item[0]] = _num;
                }
                else
                {
                    _num = _item[1];
                }
            }
        }

        _self.gSlots = {};
        _self.gMap = _map;
        _self.gRecords = [];

        return _list;
    }

    public link(tFrom: string, tTo: string)
    {
        const _self = this;
        const _map = _self.gMap;
        const _slots = _self.gSlots;

        if (tFrom === tTo) return;
        if (_slots[tFrom] === true ||
            _slots[tTo] === true)
        {
            return;
        }
        if (_map[tFrom] !== _map[tTo]) return;

        const _from = <Algorithm.IPos>[+tFrom[0], +tFrom[2]];
        const _to = <Algorithm.IPos>[+tTo[0], +tTo[2]];
        const _way = _self.gNavigator.getPath(Object.keys(_slots), _from, _to);

        if (_way !== void 0)
        {
            _slots[tFrom] = true;
            _slots[tTo] = true;
            _self.gRecords.push(_from, _to);
        }

        return _way;
    }

    public revert(step: number)
    {
        const _self = this;
        const _records = _self.gRecords;

        if (_records.length < step * 2) return;

        const _index = _records.length - step * 2;
        const _blocks = _records.splice(_index);

        const _slots = _self.gSlots;

        let _block: Algorithm.IPos;

        for (_block of _blocks)
        {
            delete _slots[_block.join('_')];
        }

        return _blocks;
    }

    private static _inst: LinkModel;

    public static get inst()
    {
        const _self = this;

        if (_self._inst === void 0)
        {
            _self._inst = new _self;
        }

        return _self._inst;
    }

}