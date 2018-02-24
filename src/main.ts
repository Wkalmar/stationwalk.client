(function() {      
    const mapboxAccesToken = '<your key here>';
    const mapUrl = `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccesToken}`;
    const mapCopyright = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';  

    
    
    const mymap = L.map('mapid').setView([50.415, 30.521], 12);
    L.tileLayer(mapUrl, {
        attribution: mapCopyright,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: mapboxAccesToken
    }).addTo(mymap);      

    const routesRequestResolver = (routesResponse: StationWalk.Route[]) => {
        routesResponse.map((route: StationWalk.Route) => {
            const mapper = new StationWalk.RouteToCheckPointsMapper(route);
            L.polyline(mapper.map())
                .addTo(mymap);
        })
    }
    
    fetch('http://localhost:8888/routes')
    .then((response) => {
        if (response.ok) {
            return response.json();                        
        } else {
            throw new Error();
        }
    })
    .then(routesRequestResolver)
    .catch(() => {
        alert("smth wrong with backend");
    });
    
    mymap.addEventListener('mousemove', (e : L.LeafletMouseEvent) => {
        const routeDrawer = StationWalk.RouteDrawer.drawer;
        routeDrawer.addHypotheticalPoint(mymap, e.latlng);
    });
    
    mymap.addEventListener('click', (e : L.LeafletMouseEvent) => {
        const routeDrawer = StationWalk.RouteDrawer.drawer;
        routeDrawer.addPoint(mymap, e.latlng);
    });    
})();