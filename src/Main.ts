//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch(console.log)
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            await this.loadTheme();
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, resolve, this);
        })
    }

    //------------------ 游戏主逻辑 ---------------

    private bg: Background;
    private get board()
    {
        return this.bg.board;
    }
    private get btn_reStart()
    {
        return this.bg.btn_reStart;
    }
    private get btn_revert() {
        return this.bg.btn_revert;
    }
    private get blocks()
    {
        return this.bg.group_blocks;
    }

    private curBlock: string;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene()
    {
        const _self = this;

        _self.createBg();
        _self.initListeners();
    }

    //加载背景类
    private createBg()
    {
        const _self = this;
        const _bg = new Background();

        _self.bg = _bg;
        _self.addChild(_bg);
    }

    private initListeners() 
    {
        const _self = this;
        const _blocks = _self.blocks.$children;

        let _block: egret.DisplayObject;

        for (_block of _blocks)
        {
            _block.addEventListener(egret.TouchEvent.TOUCH_TAP, _self.blockListener, _self);
        }

        _self.btn_reStart.addEventListener(egret.TouchEvent.TOUCH_TAP, _self.onReset, _self);
        _self.btn_revert.addEventListener(egret.TouchEvent.TOUCH_TAP, _self.onRevert, _self);
        _self.board.start.addEventListener(egret.TouchEvent.TOUCH_TAP, _self.boardListener, _self);
    }

    private boardListener(tEvt: egret.TouchEvent)
    {
        const _self = this;

        _self.board.visible = false;
        _self.btn_reStart.enabled = true;
        _self.btn_revert.enabled = true;
        _self.onReset();
    }

    private blockListener(evt: egret.TouchEvent) {
        const _self = this;
        const _bg = _self.bg;
        const _prevBlock = _self.curBlock;
        const _block: eui.Label = evt.currentTarget;
        const _curBlock = _block.name;

        if (!_block.visible) return;

        if (_prevBlock !== void 0)
        {
            if (_prevBlock !== _curBlock)
            {
                const _way = LinkModel.inst.link(_prevBlock, _curBlock);
                const _result = _way !== void 0;

                if (_result)
                {
                    _bg.selectBlock(_curBlock, true);
                    _bg.showWay(<Array<Algorithm.IPos>>_way);
                    _bg.group_blocks.touchChildren = false;
                    egret.setTimeout(_self.hideBlocks, _self, 500, _prevBlock, _curBlock);

                    return;
                }
            }

            _self.curBlock = void 0;
            _bg.selectBlock(_prevBlock, false);
        }
        else
        {
            _self.curBlock = _curBlock;
            _bg.selectBlock(_curBlock, true);
        }
    }

    private hideBlocks(_prevBlock: string, _curBlock: string)
    {
        const _self = this;
        const _bg = _self.bg;

        _bg.group_blocks.touchChildren = true;
        _bg.hideBlock(_prevBlock, _curBlock);
        _bg.selectBlock(_prevBlock, false);
        _bg.selectBlock(_curBlock, false);
        _bg.hideWay();
        _self.curBlock = void 0;
        _self.checkShowBoard();
    }

    private onReset()
    {
        this.curBlock = void 0;
        this.bg.resetBlocks();
    }

    private onRevert()
    {
        this.bg.revertBlocks();
    }

    private checkShowBoard()
    {
        if (LinkModel.inst.end)
        {
            const _borad = this.board;

            _borad.label.text = '游戏结束';
            _borad.start.label = '重新开始';
            _borad.visible = true;
        }
    }

}