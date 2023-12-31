#target photoshop


function selectFrame(frameNumber) {
    var idslct = charIDToTypeID( "slct" );
    var desc592 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref93 = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        ref93.putIndex( idanimationFrameClass, frameNumber );
    desc592.putReference( idnull, ref93 );
    executeAction( idslct, desc592, DialogModes.NO );
}

function hideActiveLayer() {
    var doc = app.activeDocument;

    // Check if there is an active layer
    if (doc.activeLayer) {
        doc.activeLayer.visible = false;
    } else {
        alert("No active layer selected.");
    }
}

function showActiveLayer() {
    var doc = app.activeDocument;

    // Check if there is an active layer
    if (doc.activeLayer) {
        doc.activeLayer.visible = true;
    } else {
        alert("No active layer selected.");
    }
}

var layerCache = {};

function selectLayerByName(layerName) {
    var doc = app.activeDocument;

    // Recursive function to search layers
    function searchLayers(layers) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            // Check if the layer name matches
            if (layer.name === layerName) {
                layerCache[layerName] = layer;
                doc.activeLayer = layer; // Set the layer as active
                return true; // Found the layer
            }

            // If the layer is a group, search its layers
            if (layer.typename === "LayerSet") {
                if (searchLayers(layer.layers)) {
                    return true; // Found the layer in a group
                }
            }
        }
        return false; // Didn't find the layer
    }

    // Start the search
    if (layerCache[layerName]) {
        doc.activeLayer = layerCache[layerName];
    } else if (!searchLayers(doc.layers)) {
        alert("Layer '" + layerName + "' not found.");
    }
}


function showProgressDialog(totalSteps, title, value) {
    var progressWindow = new Window("palette", title, undefined, {closeButton: false});
    progressWindow.orientation = "column";
    progressWindow.alignChildren = "fill";
    
    var progressBar = progressWindow.add("progressbar", undefined, 0, totalSteps);
    progressBar.preferredSize.width = 300;
    progressBar.value = value || 0;

    progressWindow.show();

    return {
        close: function() {
            progressWindow.close();
        },
        updateProgress: function(step) {
        //     progressBar.value = step;
        //     if (step >= totalSteps) {
        //         progressWindow.close();
        //     }
        }
    };
}

function createGradientMapLayers(numLayers) {
    function getLayerName(i,j) {
        var layerType = j===0 ? "fwd" : "rev";
        return "cycle-precompute-" + layerType + " " + (i + 1) + " of " + numLayers;
    }

    var doc = app.activeDocument;

    // Create a group for the gradient map layers
    var colorCycleGroup = doc.layerSets.add();
    colorCycleGroup.name = "colorcycle-precompute-fwd";
    var colorCycleRevGroup = doc.layerSets.add();
    colorCycleRevGroup.name = "colorcycle-precompute-rev";
    // Create a placeholder layer inside the group
    var placeholderLayer = [
        colorCycleGroup.artLayers.add(),
        colorCycleRevGroup.artLayers.add(),
    ];
    for(var j=0; j<2; j++){
        placeholderLayer[j].name = "placeholder";
    }

    var progressDialog = showProgressDialog(numLayers, "Processing Step 1...");
    for (var i = 0; i < numLayers; i++) {
        progressDialog.updateProgress(i);

        var progress = i/numLayers;
        var sliderProgress = Math.floor(progress*4096);
        var greyValue = (1 - progress)*255

        for (var j = 0; j < 2; j++) {
            // Start of Action Descriptor to create a new Gradient Map Adjustment Layer
            var idMk = charIDToTypeID( "Mk  " );
            var desc22 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref1 = new ActionReference();
                var idAdjL = charIDToTypeID( "AdjL" );
                ref1.putClass( idAdjL );
            desc22.putReference( idnull, ref1 );

            // Descriptor for using the Gradient Map
            var idUsng = charIDToTypeID( "Usng" );
                var desc23 = new ActionDescriptor();

                // Descriptor for the type of Adjustment Layer - Gradient Map
                var idType = charIDToTypeID( "Type" );
                    var desc24 = new ActionDescriptor();

                    // Setting gradient interpolation method (you can adjust this part if needed)
                    var idgradientsInterpolationMethod = stringIDToTypeID( "gradientsInterpolationMethod" );
                    var idgradientInterpolationMethodType = stringIDToTypeID( "gradientInterpolationMethodType" );
                    var idInterpMethod = charIDToTypeID( "Gcls" );
                    desc24.putEnumerated( idgradientsInterpolationMethod, idgradientInterpolationMethodType, idInterpMethod );

                    // Descriptor for the Gradient (Modify this part for changing gradient colors)
                    var idGrad = charIDToTypeID( "Grad" );
                        var desc25 = new ActionDescriptor();
                        var idNm = charIDToTypeID( "Nm  " );
                        desc25.putString( idNm, "Foreground to Background" );
                        var idGrdF = charIDToTypeID( "GrdF" );
                        var idGrdF = charIDToTypeID( "GrdF" );
                        var idCstS = charIDToTypeID( "CstS" );
                        desc25.putEnumerated( idGrdF, idGrdF, idCstS );

                        // Setting smoothness to 0
                        var idIntr = charIDToTypeID( "Intr" );
                        desc25.putDouble( idIntr, 0.000000 );

                        // Color Stops (Modify these for different gradient colors)
                        var idClrs = charIDToTypeID( "Clrs" );
                            var list3 = new ActionList();


                                // White color stop
                                var whiteStop = sliderProgress;
                                if(i===0){
                                    whiteStop = 4096;
                                }
                                var desc28 = new ActionDescriptor();
                                var idClr = charIDToTypeID( "Clr " );
                                    var desc29 = new ActionDescriptor();
                                    var idRd = charIDToTypeID( "Rd  " );
                                    desc29.putDouble( idRd, 255.000000 );
                                    var idGrn = charIDToTypeID( "Grn " );
                                    desc29.putDouble( idGrn, 255.000000 );
                                    var idBl = charIDToTypeID( "Bl  " );
                                    desc29.putDouble( idBl, 255.000000 );
                                var idRGBC = charIDToTypeID( "RGBC" );
                                desc28.putObject( idClr, idRGBC, desc29 );
                                var idType = charIDToTypeID( "Type" );
                                var idClry = charIDToTypeID( "Clry" );
                                var idUsrS = charIDToTypeID( "UsrS" );
                                desc28.putEnumerated( idType, idClry, idUsrS );
                                var idLctn = charIDToTypeID( "Lctn" );
                                desc28.putInteger( idLctn, whiteStop ); // Location of white color stop
                                var idMdpn = charIDToTypeID( "Mdpn" );
                                desc28.putInteger( idMdpn, 50 );
                            var idClrt = charIDToTypeID( "Clrt" );
                            list3.putObject( idClrt, desc28 );


                                // Black color stop
                                var blackStop = sliderProgress; // we place the black color stop at the same location as the white color stop to create a sharp transition, photoshop allows this and is the only way. the order we set the color stops is reflected in the final gradient
                                if(i===0){
                                    blackStop = 0;
                                }
                                var desc26 = new ActionDescriptor();
                                var idClr = charIDToTypeID( "Clr " );
                                    var desc27 = new ActionDescriptor();
                                    var idRd = charIDToTypeID( "Rd  " );
                                    desc27.putDouble( idRd, 0 );
                                    var idGrn = charIDToTypeID( "Grn " );
                                    desc27.putDouble( idGrn, 0 );
                                    var idBl = charIDToTypeID( "Bl  " );
                                    desc27.putDouble( idBl, 0 );
                                var idRGBC = charIDToTypeID( "RGBC" );
                                desc26.putObject( idClr, idRGBC, desc27 );
                                var idType = charIDToTypeID( "Type" );
                                var idClry = charIDToTypeID( "Clry" );
                                var idUsrS = charIDToTypeID( "UsrS" );
                                desc26.putEnumerated( idType, idClry, idUsrS );
                                var idLctn = charIDToTypeID( "Lctn" );
                                desc26.putInteger( idLctn, blackStop ); // Location of black color stop
                                var idMdpn = charIDToTypeID( "Mdpn" );
                                    desc26.putInteger( idMdpn, 50 );
                            var idClrt = charIDToTypeID( "Clrt" );
                            list3.putObject( idClrt, desc26 );

                                // Grey color stop
                                if(i!==0){
                                    for(var jj=0; jj<2; jj++){
                                        var desc28b = new ActionDescriptor();
                                        var idClrb = charIDToTypeID( "Clr " );
                                            var desc29b = new ActionDescriptor();
                                            var idRd = charIDToTypeID( "Rd  " );
                                            desc29b.putDouble( idRd, greyValue );
                                            var idGrn = charIDToTypeID( "Grn " );
                                            desc29b.putDouble( idGrn, greyValue );
                                            var idBl = charIDToTypeID( "Bl  " );
                                            desc29b.putDouble( idBl, greyValue );
                                        var idRGBC = charIDToTypeID( "RGBC" );
                                        desc28b.putObject( idClrb, idRGBC, desc29b );
                                        var idType = charIDToTypeID( "Type" );
                                        var idClry = charIDToTypeID( "Clry" );
                                        var idUsrS = charIDToTypeID( "UsrS" );
                                        desc28b.putEnumerated( idType, idClry, idUsrS );
                                        var idLctn = charIDToTypeID( "Lctn" );
                                        desc28b.putInteger( idLctn, 4096*jj ); // Location of grey color stop
                                        var idMdpn = charIDToTypeID( "Mdpn" );
                                        desc28b.putInteger( idMdpn, 50 );

                                        var idClrt = charIDToTypeID( "Clrt" );
                                        list3.putObject( idClrt, desc28b );
                                    }
                                }

                            //alert(i + " : " + blackStop + " : " + whiteStop)

                        desc25.putList( idClrs, list3 );

                        
                        // Transparency Stops
                        var idTrns = charIDToTypeID( "Trns" );
                            var list4 = new ActionList();
                                var desc30 = new ActionDescriptor();
                                var idOpct = charIDToTypeID( "Opct" );
                                var idPrc = charIDToTypeID( "#Prc" );
                                desc30.putUnitDouble( idOpct, idPrc, 100.000000 );
                                var idLctn = charIDToTypeID( "Lctn" );
                                desc30.putInteger( idLctn, 0 );
                                var idMdpn = charIDToTypeID( "Mdpn" );
                                desc30.putInteger( idMdpn, 50 );
                            var idTrnS = charIDToTypeID( "TrnS" );
                            list4.putObject( idTrnS, desc30 );
                                var desc31 = new ActionDescriptor();
                                var idOpct = charIDToTypeID( "Opct" );
                                var idPrc = charIDToTypeID( "#Prc" );
                                desc31.putUnitDouble( idOpct, idPrc, 100.000000 );
                                var idLctn = charIDToTypeID( "Lctn" );
                                desc31.putInteger( idLctn, 4096 );
                                var idMdpn = charIDToTypeID( "Mdpn" );
                                desc31.putInteger( idMdpn, 50 );
                            var idTrnS = charIDToTypeID( "TrnS" );
                            list4.putObject( idTrnS, desc31 );
                        desc25.putList( idTrns, list4 );

                    // Completing the Gradient Descriptor
                    var idGrdn = charIDToTypeID( "Grdn" );
                    desc24.putObject( idGrad, idGrdn, desc25 );
                var idGdMp = charIDToTypeID( "GdMp" );
                desc23.putObject( idType, idGdMp, desc24 );

            // Finalizing the Adjustment Layer Creation
            var idAdjL = charIDToTypeID( "AdjL" );
            desc22.putObject( idUsng, idAdjL, desc23 );
            executeAction( idMk, desc22, DialogModes.NO );

            if(j===1){
                // Now, set the reverse property of the newly created Gradient Map
                var idsetd = charIDToTypeID( "setd" );
                var desc12557 = new ActionDescriptor();
                var idnull = charIDToTypeID( "null" );
                    var ref1131 = new ActionReference();
                    var idAdjL = charIDToTypeID( "AdjL" );
                    var idOrdn = charIDToTypeID( "Ordn" );
                    var idTrgt = charIDToTypeID( "Trgt" );
                    ref1131.putEnumerated( idAdjL, idOrdn, idTrgt );
                desc12557.putReference( idnull, ref1131 );
                var idT = charIDToTypeID( "T   " );
                    var desc12558 = new ActionDescriptor();
                    var idRvrs = charIDToTypeID( "Rvrs" );
                    desc12558.putBoolean( idRvrs, true );
                var idGdMp = charIDToTypeID( "GdMp" );
                desc12557.putObject( idT, idGdMp, desc12558 );
                executeAction( idsetd, desc12557, DialogModes.NO );
            }
            
            var layerName = getLayerName(i,j)
            app.activeDocument.activeLayer.name = layerName;
            
            hideActiveLayer()

            // Move the created gradient map layer relative to the placeholder layer
            app.activeDocument.activeLayer.move(placeholderLayer[j], ElementPlacement.PLACEBEFORE);

            layerCache[layerName] = app.activeDocument.activeLayer


        }
    }

    // Delete the placeholder layers
    for(var j=0; j<2; j++){
        placeholderLayer[j].remove();
    }
    
    progressDialog.close();
    var progressDialog = showProgressDialog(numLayers, "Processing Step 2...");
    for (var i = 0; i < numLayers; i++) {
        progressDialog.updateProgress(i);
        progressDialog.close();
        var progressDialog = showProgressDialog(numLayers, "Processing Step 2..." + (i+1) + " of " + numLayers);
        if(i>0){
            var idDplc = charIDToTypeID( "Dplc" );
            var desc228 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref1 = new ActionReference();
                var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idTrgt = charIDToTypeID( "Trgt" );
                ref1.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
            desc228.putReference( idnull, ref1 );
            executeAction( idDplc, desc228, DialogModes.NO );
        }
        selectFrame(i+1);
        for (var j = 0; j < 2; j++) {
            selectLayerByName(getLayerName(i,j))
            showActiveLayer();
            if(i>0){
                selectLayerByName(getLayerName(i-1,j))
                hideActiveLayer();
            }else{
                selectLayerByName(getLayerName(numLayers-1,j))
                hideActiveLayer();
            }
        }
    }
    progressDialog.close();
}

function main() {
    var numberOfLayers = prompt("Enter the number of gradient map layers:", "1", "Number of Layers");
    var numLayers = parseInt(numberOfLayers, 10);

    if (isNaN(numLayers) || numLayers < 1 || numLayers > 1365) { //(1365 ~= 4096/3)
        alert("Invalid number of layers.");
        return;
    }

    var idmakeFrameAnimation = stringIDToTypeID( "makeFrameAnimation" );
    executeAction( idmakeFrameAnimation, undefined, DialogModes.NO );


    createGradientMapLayers(numLayers);

}

main();
