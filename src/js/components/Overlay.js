cm.define('Com.Overlay', {
    'modules' : [
        'Params',
        'Events',
        'Langs',
        'Stack'
    ],
    'events' : [
        'onRender',
        'onOpenStart',
        'onOpen',
        'onCloseStart',
        'onClose'
    ],
    'params' : {
        'name' : '',
        'container' : 'document.body',
        'theme' : 'default',            // transparent | default | light | dark
        'position' : 'fixed',
        'showSpinner' : true,
        'showContent' : true,
        'autoOpen' : true,
        'removeOnClose' : true,
        'duration' : 500
    }
},
function(params){
    var that = this,
        themes = ['transparent', 'default', 'light', 'dark'];

    that.nodes = {};
    that.isOpen = false;
    that.isShowSpinner = false;
    that.isShowContent = false;

    var init = function(){
        getCSSHelpers();
        that.setParams(params);
        that.convertEvents(that.params['events']);
        validateParams();
        render();
        that.addToStack(that.nodes['container']);
        that.triggerEvent('onRender');
        that.params['autoOpen'] && that.open();
    };
    
    var getCSSHelpers = function(){
        that.params['duration'] = cm.getTransitionDurationFromRule('.pt__overlay-helper__duration');
    };

    var validateParams = function(){
        that.params['position'] = cm.inArray(['static', 'relative', 'absolute', 'fixed'], that.params['position']) ? that.params['position'] : 'fixed';
    };

    var render = function(){
        // Structure
        that.nodes['container'] = cm.Node('div', {'class' : 'com__overlay pt__overlay'},
            that.nodes['spinner'] = cm.Node('div', {'class' : 'overlay__spinner'}),
            that.nodes['content'] = cm.Node('div', {'class' : 'overlay__content'})
        );
        // Set position
        that.nodes['container'].style.position = that.params['position'];
        // Show spinner
        that.params['showSpinner'] && that.showSpinner();
        // Show content
        that.params['showContent'] && that.showContent();
        // Set theme
        that.setTheme(that.params['theme']);
    };

    /* ******* MAIN ******* */

    that.open = function(){
        if(!that.isOpen){
            that.isOpen = true;
            if(!cm.inDOM(that.nodes['container'])){
                that.params['container'].appendChild(that.nodes['container']);
            }
            that.triggerEvent('onOpenStart');
            cm.addClass(that.nodes['container'], 'is-open', true);
            setTimeout(function(){
                that.triggerEvent('onOpen');
            }, that.params['duration']);
        }
        return that;
    };

    that.close = function(){
        if(that.isOpen){
            that.isOpen = false;
            that.triggerEvent('onCloseStart');
            cm.removeClass(that.nodes['container'], 'is-open');
            setTimeout(function(){
                if(that.params['removeOnClose']){
                    cm.remove(that.nodes['container']);
                }
                that.triggerEvent('onClose');
            }, that.params['duration']);
        }
        // Close Event
        return that;
    };
    
    that.toggle = function(){
        if(that.isOpen){
            that.hide();
        }else{
            that.show();
        }
    };

    that.remove = function(){
        if(that.isOpen){
            that.close();
            if(!that.params['removeOnClose']){
                setTimeout(function(){
                    cm.remove(that.nodes['container']);
                }, that.params['duration']);
            }
        }else{
            cm.remove(that.nodes['container']);
        }
        return that;
    };

    that.setTheme = function(theme){
        if(cm.inArray(themes, theme)){
            cm.addClass(that.nodes['container'], ['theme', theme].join('-'));
            cm.forEach(themes, function(item){
                if(item != theme){
                    cm.removeClass(that.nodes['container'], ['theme', item].join('-'));
                }
            });
        }
        return that;
    };

    that.showSpinner = function(){
        that.isShowSpinner = true;
        cm.addClass(that.nodes['spinner'], 'is-show');
        return that;
    };

    that.hideSpinner = function(){
        that.isShowSpinner = false;
        cm.removeClass(that.nodes['spinner'], 'is-show');
        return that;
    };

    that.setContent = function(node){
        if(cm.isNode(node)){
            that.nodes['content'].appendChild(node);
        }
        return that;
    };

    that.showContent = function(){
        that.isShowContent = true;
        cm.addClass(that.nodes['content'], 'is-show');
        return that;
    };

    that.hideContent = function(){
        that.isShowContent = false;
        cm.removeClass(that.nodes['content'], 'is-show');
        return that;
    };

    that.embed = function(node){
        if(cm.isNode(node)){
            that.params['container'] = node;
            node.appendChild(that.nodes['container']);
        }
        return that;
    };

    that.getNodes = function(key){
        return that.nodes[key] || that.nodes;
    };

    init();
});