import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  FlaskConical,
  LoaderCircle,
  Navigation,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import api from "../services/authService";

/* =========================================================
   FIX LEAFLET DEFAULT MARKER ICON
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   MAP CENTER
========================================================= */

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 12, {
        duration: 1.2,
      });
    }
  }, [position, map]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TestingLabs() {
  const onNavigate = useSidebarNav();
  const { logout } = useAuth();

  const [location, setLocation] = useState("");
  const [centres, setCentres] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [selectedCentre, setSelectedCentre] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     HELPERS
  ======================================================= */

  const getCentreId = (centre, index) => {
    return (
      centre?._id ||
      centre?.id ||
      centre?.centre_id ||
      `centre-${index}`
    );
  };

  const getCentreName = (centre) => {
    return (
      centre?.name ||
      centre?.centreName ||
      centre?.centre_name ||
      centre?.title ||
      "BIS Centre"
    );
  };

  const getCentreType = (centre) => {
    return (
      centre?.type ||
      centre?.centreType ||
      centre?.centre_type ||
      "BIS Centre"
    );
  };

  const getAddress = (centre) => {
    return (
      centre?.address ||
      centre?.fullAddress ||
      centre?.location?.address ||
      "Address not available"
    );
  };

  const getCity = (centre) => {
    return (
      centre?.city ||
      centre?.location?.city ||
      ""
    );
  };

  const getState = (centre) => {
    return (
      centre?.state ||
      centre?.location?.state ||
      ""
    );
  };

  const getPincode = (centre) => {
    return (
      centre?.pincode ||
      centre?.pinCode ||
      centre?.postal_code ||
      centre?.postalCode ||
      ""
    );
  };

  const getPhone = (centre) => {
    return (
      centre?.phone ||
      centre?.phoneNumber ||
      centre?.contact ||
      centre?.contactNumber ||
      ""
    );
  };

  const getEmail = (centre) => {
    return (
      centre?.email ||
      centre?.emailAddress ||
      ""
    );
  };

  const getServices = (centre) => {
    if (Array.isArray(centre?.services)) {
      return centre.services;
    }

    if (typeof centre?.services === "string") {
      return [centre.services];
    }

    return [];
  };

  const getCoordinates = (centre) => {
    const rawLat =
      centre?.lat ??
      centre?.latitude ??
      centre?.location?.lat ??
      centre?.location?.latitude;

    const rawLon =
      centre?.lon ??
      centre?.lng ??
      centre?.longitude ??
      centre?.location?.lon ??
      centre?.location?.lng ??
      centre?.location?.longitude;

    const lat = Number(rawLat);
    const lon = Number(rawLon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return null;
    }

    return [lat, lon];
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = async (e) => {
    e?.preventDefault();

    const searchLocation = location.trim();

    if (!searchLocation) {
      setError("Location is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCentres([]);
      setSelectedCentre(null);
      setUserPosition(null);

      /* =================================================
         STEP 1
         POST /api/location/geocode

         BACKEND EXPECTS:
         {
           query: "Ghaziabad"
         }
      ================================================= */

      const geoRes = await api.post("/location/geocode", {
        query: searchLocation,
      });

      console.log("Geocode response:", geoRes.data);

      /*
        Backend controller returns:

        {
          success: true,
          data: result
        }
      */

      const geoData = geoRes.data?.data;

      if (!geoData) {
        throw new Error("Location data not found.");
      }

      const latitude = Number(
        geoData.latitude ?? geoData.lat
      );

      const longitude = Number(
        geoData.longitude ??
          geoData.lon ??
          geoData.lng
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        console.error("Invalid geocode data:", geoData);

        throw new Error(
          "Unable to get coordinates for this location."
        );
      }

      const position = [latitude, longitude];

      setUserPosition(position);

      /* =================================================
         STEP 2
         GET /api/bis-centres
      ================================================= */

      const centresRes = await api.get(
        "/bis-centres",
        {
          params: {
            lat: latitude,
            lon: longitude,
            radius: 25,
          },
        }
      );

      console.log(
        "BIS Centres response:",
        centresRes.data
      );

      /*
        Support possible backend responses:

        {
          success: true,
          data: [...]
        }

        OR

        {
          centres: [...]
        }

        OR

        [...]
      */

      const responseData = centresRes.data;

      let centreData = [];

      if (Array.isArray(responseData)) {
        centreData = responseData;
      } else if (
        Array.isArray(responseData?.data)
      ) {
        centreData = responseData.data;
      } else if (
        Array.isArray(responseData?.centres)
      ) {
        centreData = responseData.centres;
      } else if (
        Array.isArray(responseData?.centers)
      ) {
        centreData = responseData.centers;
      }

      setCentres(centreData);

      if (centreData.length === 0) {
        setError(
          "No BIS centres found within 25 km of this location."
        );
      }
    } catch (err) {
      console.error(
        "Centre locator error:",
        err
      );

      setCentres([]);
      setUserPosition(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to find BIS centres for this location."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearSearch = () => {
    setLocation("");
    setCentres([]);
    setSelectedCentre(null);
    setUserPosition(null);
    setError("");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        active="labs"
        onNavigate={onNavigate}
        onStartCertification={() =>
          onNavigate?.("certification")
        }
        onLogout={logout}
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8 overflow-y-auto">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600 mb-2">
              Testing Labs
            </p>

            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              BIS Centre Locator
            </h1>

            <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
              Find nearby BIS testing centres and
              laboratories using your city or location.
            </p>
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <section className="bg-white border border-neutral-200 rounded-2xl p-5 mb-6 shadow-sm">

            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3"
            >

              <div className="flex-1 relative">

                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Enter city or location"
                  className="w-full h-12 pl-12 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />

                {location && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 px-6 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Finding...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Centres
                  </>
                )}

              </button>

            </form>

            {error && (
              <p className="text-sm text-red-600 mt-3">
                {error}
              </p>
            )}

          </section>

          {/* =================================================
              MAP + LIST
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* =================================================
                MAP
            ================================================= */}

            <section className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">

              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-neutral-900">
                    Nearby BIS Centres
                  </h2>

                  <p className="text-xs text-neutral-500 mt-1">
                    Showing centres within 25 km
                  </p>
                </div>

                {userPosition && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <Navigation className="w-3.5 h-3.5" />
                    Location found
                  </div>
                )}

              </div>

              <div className="h-[520px]">

                {userPosition ? (
                  <MapContainer
                    center={userPosition}
                    zoom={12}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                  >

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapCenter
                      position={userPosition}
                    />

                    {/* USER LOCATION */}

                    <Marker position={userPosition}>
                      <Popup>
                        <strong>
                          Your searched location
                        </strong>
                      </Popup>
                    </Marker>

                    {/* BIS CENTRES */}

                    {centres.map(
                      (centre, index) => {
                        const coordinates =
                          getCoordinates(
                            centre
                          );

                        if (!coordinates) {
                          return null;
                        }

                        const centreId =
                          getCentreId(
                            centre,
                            index
                          );

                        return (
                          <Marker
                            key={centreId}
                            position={coordinates}
                            eventHandlers={{
                              click: () =>
                                setSelectedCentre(
                                  centre
                                ),
                            }}
                          >

                            <Popup>

                              <div className="min-w-[200px]">

                                <p className="font-semibold text-neutral-900">
                                  {getCentreName(
                                    centre
                                  )}
                                </p>

                                <p className="text-xs text-emerald-600 mt-1">
                                  {getCentreType(
                                    centre
                                  )}
                                </p>

                                <p className="text-xs text-neutral-600 mt-2">
                                  {getAddress(
                                    centre
                                  )}
                                </p>

                              </div>

                            </Popup>

                          </Marker>
                        );
                      }
                    )}

                  </MapContainer>
                ) : (

                  <div className="h-full flex flex-col items-center justify-center bg-neutral-50">

                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                      <MapPin className="w-7 h-7" />
                    </div>

                    <h3 className="font-semibold text-neutral-900">
                      Search for a location
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1 text-center max-w-xs">
                      Enter your city above to see
                      nearby BIS centres on the map.
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                CENTRE LIST
            ================================================= */}

            <section className="lg:col-span-2">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Centre Details
                  </h2>

                  <p className="text-xs text-neutral-500 mt-1">

                    {centres.length > 0
                      ? `${centres.length} centre${
                          centres.length > 1
                            ? "s"
                            : ""
                        } found`
                      : "Search to find nearby centres"}

                  </p>
                </div>

              </div>

              <div className="space-y-3 max-h-[570px] overflow-y-auto pr-1">

                {centres.length > 0 ? (

                  centres.map(
                    (centre, index) => {

                      const centreId =
                        getCentreId(
                          centre,
                          index
                        );

                      const services =
                        getServices(
                          centre
                        );

                      const isSelected =
                        selectedCentre &&
                        getCentreId(
                          selectedCentre,
                          0
                        ) === centreId;

                      return (

                        <button
                          key={centreId}
                          type="button"
                          onClick={() =>
                            setSelectedCentre(
                              centre
                            )
                          }
                          className={`w-full text-left bg-white border rounded-2xl p-5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-emerald-500 shadow-sm"
                              : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                          }`}
                        >

                          {/* HEADER */}

                          <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <FlaskConical className="w-5 h-5" />
                            </div>

                            <div className="min-w-0 flex-1">

                              <h3 className="font-semibold text-neutral-900 text-sm leading-snug">
                                {getCentreName(
                                  centre
                                )}
                              </h3>

                              <p className="text-xs text-emerald-600 font-medium mt-1">
                                {getCentreType(
                                  centre
                                )}
                              </p>

                            </div>

                          </div>

                          {/* ADDRESS */}

                          <div className="flex gap-2 mt-4">

                            <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />

                            <div className="text-xs text-neutral-600 leading-relaxed">

                              <p>
                                {getAddress(
                                  centre
                                )}
                              </p>

                              {(getCity(
                                centre
                              ) ||
                                getState(
                                  centre
                                ) ||
                                getPincode(
                                  centre
                                )) && (

                                <p className="text-neutral-400 mt-0.5">

                                  {[
                                    getCity(
                                      centre
                                    ),
                                    getState(
                                      centre
                                    ),
                                    getPincode(
                                      centre
                                    ),
                                  ]
                                    .filter(
                                      Boolean
                                    )
                                    .join(", ")}

                                </p>

                              )}

                            </div>

                          </div>

                          {/* CONTACT */}

                          {(getPhone(
                            centre
                          ) ||
                            getEmail(
                              centre
                            )) && (

                            <div className="flex flex-wrap gap-3 mt-4">

                              {getPhone(
                                centre
                              ) && (

                                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">

                                  <Phone className="w-3.5 h-3.5" />

                                  {getPhone(
                                    centre
                                  )}

                                </span>

                              )}

                              {getEmail(
                                centre
                              ) && (

                                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 break-all">

                                  <Mail className="w-3.5 h-3.5 shrink-0" />

                                  {getEmail(
                                    centre
                                  )}

                                </span>

                              )}

                            </div>

                          )}

                          {/* SERVICES */}

                          {services.length > 0 && (

                            <div className="mt-4">

                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                Services
                              </p>

                              <div className="flex flex-wrap gap-1.5">

                                {services.map(
                                  (
                                    service,
                                    i
                                  ) => (

                                    <span
                                      key={`${service}-${i}`}
                                      className="text-[11px] font-medium text-neutral-600 bg-neutral-100 rounded-md px-2 py-1"
                                    >
                                      {service}
                                    </span>

                                  )
                                )}

                              </div>

                            </div>

                          )}

                        </button>

                      );
                    }
                  )

                ) : (

                  <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center">

                    <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                      <FlaskConical className="w-6 h-6" />
                    </div>

                    <h3 className="font-semibold text-neutral-900 text-sm">
                      No centres to show
                    </h3>

                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Enter a city or location and click
                      "Find Centres" to search nearby BIS
                      facilities.
                    </p>

                  </div>

                )}

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}