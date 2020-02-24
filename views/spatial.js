var config_vega = function config_vega() {
    var m = jQuery('#master_width').width();
    var mul = 0;
    var vega_config = {};
    return vega_config;
};

var embed_vega = function embed_vega(vgspec, vgsignals, data, element, tooltips) {
    var data = JSON.parse(JSON.stringify(data));
    var vgSpec = JSON.parse(JSON.stringify(vgspec)); //console.log(data);
    if (vgsignals != null) {
        var vgSignals = JSON.parse(JSON.stringify(vgsignals));
        for (var i in vgsignals) {
            var index = findMyIndex(vgSpec.signals, vgsignals[i].name);
            vgSpec.signals[index].value = vgsignals[i].value;
            vgSpec.signals[index].bind = vgsignals[i].bind;
        }
    }
    if (data != null) {
        //  vgSpec.data[findMyIndex(vgSpec.data, "mydata")].values = data;
    }
    vegaEmbed(element, vgSpec, {
        renderer: 'canvas',
        logLeve: 'vega.Debug',
        editorUrl: 'https://spatial.bio/editor/',
        actions: {
            export: true,
            source: true,
            editor: true,
            scaleFactor: 2
        },
        theme: 'vega.themes.ggplot2',
        config: {},
        defaultStyle: true,
        tooltip: true
    }).then(function(result, error) {

    }).catch(function(err) { console.log(err) });
};
var vgspec = JSON.parse(itg_decomp("<%=spatial_graph%>"));
embed_vega(vgspec, [], [], "#spatial_graph", true);