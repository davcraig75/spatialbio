# Spatial.bio app
**App:** `spatial_bio.js`

**Version:** 0.1 

This page provides for installation of the data visualization for spatial.bio.The application is a javascript file that would be accessible to the client. The web-page serving the app would load the app, and the clients DOM is built client-side.  In the current version, no other data is needed for QC.  In the version with genes, a restful API request is made to a database of genes/values.

This page is under active development. Please contact davidwcr@usc.edu for becoming involved.

## Install

To minimally install this embedded application, two `<div>` elements must be added to the HTML of an existing parent page. The first `div` is where the app is contained and requires `id=spatial_graph `, and the second `div` provides the API's URL. This may be placed in any web-page or content management system, such as Wordpress or Django. The javascript is available via this page, however below we have it pointing to a version in a secured Google Bucket

```
    <div id="spatial_graph">Please log into Amp Authorized Account</div>
    <script type="text/javascript" src="https://raw.githubusercontent.com/davcraig75/spatialbio/master/README.md"></script>
``` 

## DEVELOPMENT NOTES

### Build

We use node.js to build, though node.js is not needed for the application because its a single static file.  Within the file structure are embedded, compressed data (crypto option), style guides, base HTML that is built in app, parent javascript appending to DOM, Vega.js, D3-js.  

```
yarn install
node app.js build
```

### Self contained server
We can use node as a server during development.
```
yarn install
nodemon app.js
```
This does not build the javascript into the top level directory.


## Files
```
.
├── LICENSE
├── README.md
├── amp_data_explorer.js  <- compiled app
├── app.js
├── package.json
├── public
│   └── amp_data_explorer.js
├── src
│   ├── amp-active.csv
│   ├── amp-mini.csv
│   ├── smartplot.20.8.amp.json
│   └── styles.css
├── stand_alone_amp.html
└── views
    ├── body_amp.ejs
    ├── d3-dsv.v1.min.js
    ├── graph_builder_base_amp.js
    ├── lz-string.js
    ├── stand_alone_amp.ejs
    ├── vega-embed.min.js
    ├── vega.min.js
    └── wrapper_amp.ejs
```

# Browser Support

Chrome latest; Firefox latest; Opera latest; Safari latest; Edge latest
