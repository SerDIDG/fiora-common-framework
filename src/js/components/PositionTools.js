cm.define('Com.PositionTools', {
    'extend' : 'Com.AbstractInput',
    'params' : {
        'className' : 'com__position-tools',
        'defaultValue' : 'center center',
        'options' : [
            {'name' : 'left top', 'icon' : 'svg__position-topleft', 'iconActive' : 'svg__position-topleft--light'},
            {'name' : 'center top', 'icon' : 'svg__position-topcenter', 'iconActive' : 'svg__position-topcenter--light'},
            {'name' : 'right top', 'icon' : 'svg__position-topright', 'iconActive' : 'svg__position-topright--light'},
            {'name' : 'left center', 'icon' : 'svg__position-middleleft', 'iconActive' : 'svg__position-middleleft--light'},
            {'name' : 'center center', 'icon' : 'svg__position-middlecenter', 'iconActive' : 'svg__position-middlecenter--light'},
            {'name' : 'right center', 'icon' : 'svg__position-middleright', 'iconActive' : 'svg__position-middleright--light'},
            {'name' : 'left bottom', 'icon' : 'svg__position-bottomleft', 'iconActive' : 'svg__position-bottomleft--light'},
            {'name' : 'center bottom', 'icon' : 'svg__position-bottomcenter', 'iconActive' : 'svg__position-bottomcenter--light'},
            {'name' : 'right bottom', 'icon' : 'svg__position-bottomright', 'iconActive' : 'svg__position-bottomright--light'}
        ]
    }
},
function(params){
    var that = this;
    that.myNodes = {};
    that.options = {};
    // Call parent class construct
    Com.AbstractInput.apply(that, arguments);
});

cm.getConstructor('Com.PositionTools', function(classConstructor, className, classProto){
    var _inherit = classProto._inherit;

    classProto.construct = function(){
        var that = this;
        // Bind context to methods
        // Call parent method
        _inherit.prototype.construct.apply(that, arguments);
        return that;
    };

    classProto.set = function(){
        var that = this;
        // Call parent method
        _inherit.prototype.set.apply(that, arguments);
        // Set inputs
        that.setOption();
        return that;
    };

    classProto.renderContent = function(){
        var that = this;
        that.triggerEvent('onRenderContentStart');
        // Structure
        that.myNodes['container'] = cm.node('div', {'class' : 'com__position-tools__content'},
            that.myNodes['inner'] = cm.node('div', {'class' : 'inner'})
        );
        cm.forEach(that.params['options'], function(item){
            that.renderOption(item);
        });
        // Events
        that.triggerEvent('onRenderContentProcess');
        that.triggerEvent('onRenderContentEnd');
        // Push
        return that.myNodes['container'];
    };

    classProto.renderOption = function(item){
        var that = this;
        // Config
        item = cm.merge({
            'iconType' : 'icon',
            'icon' : '',
            'iconActive' : '',
            'name' : '',
            'nodes' : {}
        }, item);
        // Structure
        item['nodes']['container'] = cm.node('div', {'class' : 'option__item'},
            item['nodes']['icon'] = cm.node('div', {'class' : [item['iconType'], item['icon']].join(' ')})
        );
        cm.appendChild(item['nodes']['container'], that.myNodes['inner']);
        // Events
        cm.addEvent(item['nodes']['container'], 'click', function(){
            that.set(item['name']);
        });
        // Push
        that.options[item['name']] = item;
        return that;
    };

    classProto.setOption = function(){
        var that = this,
            item;
        if(that.options[that.previousValue]){
            item = that.options[that.previousValue];
            cm.removeClass(item['nodes']['container'], 'is-active');
            cm.replaceClass(item['nodes']['icon'], item['iconActive'], item['icon']);
        }
        if(that.options[that.value]){
            item = that.options[that.value];
            cm.addClass(item['nodes']['container'], 'is-active');
            cm.replaceClass(item['nodes']['icon'], item['icon'], item['iconActive']);
        }
    };
});