import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import { Layer, Map, NavigationControl, Source } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Address from './Address';
import { useGetAddressesQuery } from './AddressApi';
import { remove as deleteAddress } from './AddressService';
import { setDialogOpen, setSelected, setSelections } from './AddressSlice';

const AddressTable = () => {
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

    const parksLayer = {
        id: 'parks',
        type: 'fill', // or 'circle' for points, 'line' for geometries
        'source-layer': 'park', // Exact layer name from Martin/PostGIS
        paint: {
            'fill-color': '#00ff00',
            'fill-opacity': 0.6
        }
    };
    const waterLayer = {
        id: 'water',
        type: 'fill',
        'source-layer': 'water', // Exact layer name from Martin/PostGIS
        paint: {
            'fill-color': '#0e87cc',
            'fill-opacity': 0.6
        }
    };
    const transportationLayer = {
        id: 'transportation_name',
        type: 'line',
        'source-layer': 'transportation_name', // Exact layer name from Martin/PostGIS
        paint: {
            'line-color': '#ff0000',
            'line-width': 2
        }
    };
    const runwaysLayer = {
        id: 'runways',
        type: 'fill',
        'source-layer': 'runways', // Exact layer name from Martin/PostGIS
        paint: {
            'fill-color': '#ffa500',
            'fill-opacity': 0.6
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;
    } else if (isError) {
        return <div>Failed to load the addresses</div>;
    }
    return (
        <div className="address-container">
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
                <DataGrid checkboxSelection={true}
                    rows={addresses}
                    columns={addressColumns}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch(setSelections([...newRowSelectionModel.ids]))
                    }}
                    disableRowSelectionExcludeModel={true}
                />
                <Address forceUpdate={refetch} />
                {(selectionCount == 1) && <Map
                    initialViewState={{
                        longitude: addresses.find((address) => address.id == selections[0]).coordinates.coordinates[0],
                        latitude: addresses.find((address) => address.id == selections[0]).coordinates.coordinates[1],
                        zoom: 12
                    }}
                    style={{
                        width: "100%", height: 400
                    }}
                    mapLib={maplibregl}
                    mapStyle="https://demotiles.maplibre.org/style.json"
                >
                    <Source
                        id="martin-nj-pmtiles"
                        type="vector"
                        // Can point to an S3/R2 URL or your local Martin Tile Server
                        tiles={['http://localhost:3000/new-jersey/{z}/{x}/{y}']}
                    >
                        <Layer {...transportationLayer} />
                        <Layer {...parksLayer} />
                        <Layer {...waterLayer} />
                    </Source>
                    <Source
                        id="postgis-runways"
                        type="vector"
                        // Can point to an S3/R2 URL or your local Martin Tile Server
                        tiles={['http://localhost:3001/runways_suitable/{z}/{x}/{y}?aircraft=C17']}
                    >
                        <Layer {...runwaysLayer} />
                    </Source>
                    <NavigationControl position="top-right" showCompass={true} />
                </Map>}

            </Box>
        </div >
    );
};

export default AddressTable;
