(function () {
    function addFunctionOnNative(prototype, nativeName, content) {
        var native = prototype[nativeName];

        prototype[nativeName] = function () {
            native.apply(this, arguments);
            content.apply(this);
        }
    }
    
    function setCommand(command) {
        var pos = command.replace('(', '').replace(')', '').split(',');

        pos[0] = Number(pos[0]);
        pos[1] = Number(pos[1]);

        if (isNaN(pos[0]) || isNaN(pos[1])) {
            this.command = '(0,0)';
            this.commandX = 0;
            this.commandY = 0;
            return;
        }

        this.command = command;
        this.commandX = pos[0];
        this.commandY = pos[1];
    }
    
    function getImgTags() {
        var imgs = document.getElementsByTagName('img');
        for (var i = 0, len = imgs.length; i < len; i++) {
            var img = imgs[i];
            var src = img.getAttribute('cvs-src');

            if (!src) {
                continue;
            }

            var argv = src.split('::');
            var argc = argv.length;

            var imgArr = cvsImg[argv[0]];

            if (argc !== 2 || !imgArr || imgArr.indexOf(img) !== -1) {
                continue;
            }

            img.setCommand = setCommand;
            img.setCommand(argv[1]);
            
            imgArr.push(img);
        }
    }
    var vCtx = document.createElement('canvas').getContext('2d');

    function apply() {
        var cvsId = this.canvas.id;
        var imgArr = cvsImg[cvsId];
        for (var i = 0, len = imgArr.length; i < len; i++) {
            var img = imgArr[i];

            img.width = img.width === 0 ? 20 : img.width;
            img.height = img.height === 0 ? 24 : img.height;

            var imgData = this.getImageData(img.commandX, img.commandY, img.width, img.height);

            vCtx.canvas.width = img.width;
            vCtx.canvas.height = img.height;
            vCtx.putImageData(imgData, 0, 0);

            img.src = vCtx.canvas.toDataURL();
        }
    }

    var cvsCtx = new Object();
    var cvsImg = new Object();

    var nativeNames =
        (function () {
            var keys = Object.keys(CanvasRenderingContext2D.prototype);
            var result = [];

            for (var i = 0, len = keys.length; i < len; i++) {
                if (typeof this[keys[i]] === 'function' && keys[i] !== 'getImageData' && keys[i] !== 'putImageData') {
                    result.push(keys[i]);
                }
            }

            return result;
        }).apply(vCtx);

    var trigger = apply;

    CanvasRenderingContext2D.prototype.release = function () {
        if (this.canvas.id === '') {
            console.warn('Img.js :: Please set the dom id on the canvas element to identify it.');
            return;
        }
        if (cvsCtx[this.canvas.id]) {
            console.warn('Img.js :: An object that has already been released.');
            return;
        }

        for (var i = 0, len = nativeNames.length; i < len; i++) {
            addFunctionOnNative(CanvasRenderingContext2D.prototype, nativeNames[i], trigger);
        }
        cvsCtx[this.canvas.id] = this.canvas.getContext('2d');
        cvsImg[this.canvas.id] = new Array();

        CanvasRenderingContext2D.prototype.getImgTags = getImgTags;

        getImgTags();
    }
})();