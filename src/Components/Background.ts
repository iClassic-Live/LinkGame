//背景类
class Background extends eui.Component {

    public btn_reStart: eui.Button;
    public btn_revert: eui.Button;
    public group_lines: eui.Group;
    public group_blocks: eui.Group;
    public group_link: eui.Group;
    public board: Interface;

    public line: egret.Shape;

    private gQueue: egret.MapLike<eui.Label> = {};

    public constructor()
    {
        super();
        this.skinName = 'BackgroundSkin';
    }

    protected childrenCreated()
    {
        super.childrenCreated();

        const _self = this;

        _self.createGrids();
        _self.createBlocks();
    }

    private createGrids()
    {
        const _lines = this.group_lines;
        const _width = _lines.width;
        const _gap = _width / 6;
        const _veritiY = _gap * 8;

        let _shape: egret.Shape;
        let _graphics: egret.Graphics;

        //绘制横线
        for (let i = 0; i < 9; i++)
        {
            _shape = new egret.Shape();
            _graphics = _shape.graphics;
            _graphics.lineStyle(5, 0x975731);
            _graphics.moveTo(0, _gap * i);
            _graphics.lineTo(_width, _gap * i);
            _graphics.endFill();
            _lines.addChild(_shape);
        }

        //绘制竖线
        for (let i = 0; i < 7; i++)
        {
            _shape = new egret.Shape();
            _graphics = _shape.graphics;
            _graphics.lineStyle(5, 0x975731);
            _graphics.moveTo(_gap * i, 0);
            _graphics.lineTo(_gap * i, _veritiY);
            _graphics.endFill();
            _lines.addChild(_shape);
        }
    }

    private createBlocks()
    {
        const _self = this;
        const _queue = _self.gQueue;
        const _blocks = _self.group_blocks;
        const _width = _blocks.width;
        const _size = _width / 12;
        const _gap = _width / 6;
        const _offset = _size / 2 + 6;

        let _block: eui.Label;
        let _name: string;
        let _i: number;
        let _k: number;

        for (_i = 0; _i < 6; _i++)
        {
            for (_k = 0; _k < 8; _k++)
            {
                _block = new eui.Label();
                _name = _i + '_' + _k;

                _queue[_name] = _block;
                _block.name = _name;
                _block.size = _size;
                _block.x = _offset + _gap * _i;
                _block.y = _offset + _gap * _k;
                _block.visible = false;
                _blocks.addChild(_block);
            }
        }
    }

    private resetLink()
    {
        const _self = this;
        const _link = _self.line || new egret.Shape;
        const _graphics = _link.graphics;

        _self.line = _link;
        _graphics.clear();
        _self.group_link.addChild(_link);

        return _link;
    }

    public resetBlocks()
    {
        const _queue = this.gQueue;
        const _list = LinkModel.inst.shuffle();

        let _index: number;
        let _length: number;
        let _block: eui.Label;
        let _info: [string, number];

        for (_index = 0, _length = _list.length; _index < _length; _index++)
        {
            _info = _list[_index];
            _block = _queue[_info[0]];

            _block.text = _info[1] + '';
            _block.textColor = 0xffffff;
            _block.visible = true;
        }
    }

    public showWay(tWay: Array<Algorithm.IPos>)
    {
        const _self = this;
        const _queue = _self.gQueue;
        const _link = _self.resetLink();
        const _graphics = _link.graphics;

        let _i: number;
        let _length: number;
        let [_x, _y]: Algorithm.IPos = [0, 0];
        let [_bx, _by]: Algorithm.IPos = [0, 0];
        let _block: eui.Label;
        let _offset: number;

        for (_i = 0, _length = tWay.length; _i < _length; _i++)
        {
            [_x, _y] = tWay[_i];
            _block = _queue[`${_x}_${_y}`];
            _offset = _block.size / 2 - 6;
            _bx = _block.x + _offset;
            _by = _block.y + _offset;

            if (_i > 0)
            {
                _graphics.lineTo(_bx, _by);
            }
            else
            {
                _graphics.lineStyle(5, 0x00ff00);
                _graphics.moveTo(_bx, _by);
            }
        }
    }

    public hideWay()
    {
        this.resetLink();
    }

    public selectBlock(tBlock: string, tSelect: boolean)
    {
        const _queue = this.gQueue;

        _queue[tBlock].textColor = tSelect ? 0xf42b2b : 0xffffff;
    }

    public hideBlock(tPBlock: string, tCBlock: string)
    {
        const _queue = this.gQueue;

        _queue[tPBlock].visible = false;
        _queue[tCBlock].visible = false;
    }

    public revertBlocks()
    {
        const _blocks = LinkModel.inst.revert(1);

        if (_blocks === void 0) return;

        const _queue = this.gQueue;

        let _block: Algorithm.IPos;

        for (_block of _blocks)
        {
            _queue[_block.join('_')].visible = true;
        }
    }

}