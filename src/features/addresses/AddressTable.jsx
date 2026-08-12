import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import { Layer, Map, NavigationControl, Source } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Address from './Address';
import { useGetAddressesQuery } from './AddressApi';
import { remove as deleteAddress } from './AddressService';
import { setDialogOpen, setSelected, setSelections } from './AddressSlice';

const AddressTable = () => {
    const mapRef = useRef(null);
    const getRawTileData = () => {
        if (!mapRef.current) return;
        const map = mapRef.current.getMap();

        // Query directly from the raw vector tile cache
        const allFeaturesInLoadedTiles = map.queryRenderedFeatures();

        // map over features to extract your backend payload/properties
        const rawProperties = allFeaturesInLoadedTiles.map(f => f.properties);

        console.log('All raw properties from loaded service tiles:', rawProperties);
    };

    const { data, isLoading, isError, refetch } = useGetAddressesQuery();
    const addresses = useSelector((state) => state.addresses?.list);
    const selections = useSelector((state) => state.addresses?.selections);
    const selectionCount = useSelector((state) => state.addresses?.selectionCount);
    const dialogOpen = useSelector((state) => state.addresses?.dialogOpen);
    const dispatch = useDispatch();

    const addressColumns = [
        { field: 'street', headerName: 'Street', valueGetter: (value, row) => row.street, width: 300 },
        { field: 'city', headerName: 'City', valueGetter: (value, row) => row.city, width: 100 },
        { field: 'state', headerName: 'State', valueGetter: (value, row) => row.state, width: 100 },
        { field: 'zip', headerName: 'Zip Code', valueGetter: (value, row) => row.zip, width: 100 },
    ];
    const handleCreate = () => {
        dispatch(setSelected(null));
        dispatch(setDialogOpen(true));
    }
    const handleUpdate = () => {
        dispatch(setSelected(addresses.find((address) => address.id == selections[0])));
        dispatch(setDialogOpen(true));
    }
    const handleDelete = () => {
        selections.forEach(id => {
            deleteAddress(id, refetch);
        });

    }

    const waterLayer = {
        id: 'water',
        type: 'fill',
        'source-layer': 'water',
        paint: {
            'fill-color': '#0e87cc',
            'fill-opacity': 0.6
        }
    };
    const runwaysLayer = {
        id: 'runways',
        type: 'fill',
        'source-layer': 'runways',
        paint: {
            'fill-color': ['get', 'feature_color'],
            'fill-opacity': 0.6
        }
    };
    const runwaysLabelLayer = {
        id: 'runways_label',
        type: 'symbol',
        'source-layer': 'runways',
        layout: {
            'text-field': ['get', 'designator'],
            'text-size': 12,
            'text-justify': 'center'

        },
        paint: {
            'text-color': '#000000'
        }
    };
    const countriesLayer = {
        id: 'ne_10m_admin_0_countries',
        type: 'line',
        'source-layer': 'ne_10m_admin_0_countries',
        paint: {
            'line-color': '#808080',
            'line-width': 2,
            'line-dasharray': [2, 2]
        }
    };
    const railroadsLayer = {
        id: 'ne_10m_railroads',
        type: 'line',
        'source-layer': 'ne_10m_railroads',
        paint: {
            'line-color': '#000000',
            'line-width': 2
        }
    };

    const osmRasterStyle = {
        version: 8,
        sources: {
            'osm-raster': {
                type: 'raster',
                tiles: [
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }
        },
        layers: [
            {
                id: 'osm-raster-layer',
                type: 'raster',
                source: 'osm-raster',
                minzoom: 0,
                maxzoom: 19
            }
        ]
    }

    const pointGeoJSON = {
        type: 'Feature',
        geometry: {
            type: 'Point', coordinates:
                [addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[0],
                addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[1]]
        }
    };
    const pixelCircleStyle = {
        id: 'pixel-circle',
        type: 'circle',
        paint: {
            'circle-radius': 5, // size in pixels
            'circle-color': '#000000',
            'circle-opacity': 0.5
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else if (isError) {
        return <div>Failed to load the addresses</div>;
    }

    return (
        <div className="address-container" >
            <Box>
                <PopupState variant="popover" popupId="customer-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <Button variant="contained" {...bindTrigger(popupState)}>
                                Actions
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleCreate();
                                }}>Create...</MenuItem>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleUpdate();
                                }} disabled={selectionCount != 1}>Update...</MenuItem>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleDelete();
                                }} disabled={selectionCount == 0}>Delete</MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
                <div style={{ height: 375, width: '100%' }}>
                    <DataGrid checkboxSelection={true}
                        rows={addresses}
                        columns={addressColumns}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            dispatch(setSelections([...newRowSelectionModel.ids]))
                        }}
                        disableRowSelectionExcludeModel={true}
                    />
                </div>
                <Address forceUpdate={refetch} />
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
                    {(selectionCount == 1) && <Map
                        ref={mapRef}
                        onClick={getRawTileData}
                        initialViewState={{
                            longitude: addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[0],
                            latitude: addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[1],
                            zoom: 12
                        }}
                        style={{
                            width: "50%", height: 375, margin: '0 auto'
                        }}
                        mapLib={maplibregl}
                        mapStyle={osmRasterStyle}
                    >
                        <Source
                            id="martin-nj-pmtiles"
                            type="vector"
                            tiles={['http://localhost:3000/new-jersey/{z}/{x}/{y}']}
                        >
                            <Layer {...waterLayer} />
                        </Source>
                        <Source
                            id="postgis-runways"
                            type="vector"
                            tiles={['http://localhost:3000/runways_suitable/{z}/{x}/{y}?aircraft=C17']}
                        >
                            <Layer {...runwaysLayer} />
                            <Layer {...runwaysLabelLayer} />
                        </Source>
                        <Source
                            id="countries"
                            type="vector"
                            tiles={['http://localhost:3000/countries/{z}/{x}/{y}']}
                        >
                            <Layer {...countriesLayer} />
                        </Source>
                        <Source
                            id="railroads"
                            type="vector"
                            tiles={['http://localhost:3000/railroads/{z}/{x}/{y}']}
                        >
                            <Layer {...railroadsLayer} />
                        </Source>
                        <NavigationControl position="top-right" showCompass={true} />
                    </Map>}
                    {(selectionCount == 1) && <Map
                        initialViewState={{
                            longitude: addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[0],
                            latitude: addresses.find((address) => address.id == selections[0])?.coordinates.coordinates[1],
                            zoom: 3
                        }}
                        style={{
                            width: "15%", height: 200, margin: '0 auto'
                        }}
                        mapLib={maplibregl}
                        mapStyle={osmRasterStyle}
                        dragPan={false}
                        scrollZoom={false}
                        boxZoom={false}
                        doubleClickZoom={false}
                        touchZoomRotate={false}
                        keyboard={false}
                        attributionControl={false}
                    >
                        <Source id="my-rect" type="geojson" data={pointGeoJSON}>
                            <Layer {...pixelCircleStyle} />
                        </Source>
                    </Map>}
                </div>

            </Box>
        </div >
    );
};

export default AddressTable;
