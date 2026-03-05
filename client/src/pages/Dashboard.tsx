import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { Row } from "../components/Row";
import { Form } from "../components/Form";
import { Input } from "../components/Input";

type Address = {
  id: number;
  name: string;
  description?: string;
  lat: number;
  lng: number;
};

function getAuthHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export function DashboardPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [adding, setAdding] = useState(false);
  const [searchRadius, setSearchRadius] = useState<string>("");
  const [searchLat, setSearchLat] = useState<string>("");
  const [searchLng, setSearchLng] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Address[] | null>(null);

  async function loadAddresses() {
    try {
      const { data } = await axios.get<{ items: Address[] }>(
        "/api/addresses",
        { headers: getAuthHeaders() },
      );
      setAddresses(data.items);
    } catch {
      toast.error("Unable to load addresses");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAddresses();
  }, []);

  async function onAddAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const json = {
      name: form.get("name"),
      searchWord: form.get("searchWord"),
      description: form.get("description") || undefined,
    };
    setAdding(true);
    try {
      const { data } = await axios.post<{ item: Address }>(
        "/api/addresses",
        json,
        { headers: getAuthHeaders() },
      );
      if (data?.item?.id) {
        toast.success("Place added!");
        e.currentTarget.reset();
        await loadAddresses();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Unable to add place");
      } else {
        toast.error("Unable to add place");
      }
    }
    setAdding(false);
  }

  async function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const radius = parseFloat(searchRadius);
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(radius) || isNaN(lat) || isNaN(lng)) {
      toast.error("Please fill all search fields with valid numbers");
      return;
    }

    try {
      const { data } = await axios.post<{ items: Address[] }>(
        "/api/addresses/searches",
        { radius, from: { lat, lng } },
        { headers: getAuthHeaders() },
      );
      setSearchResults(data.items);
      toast.success(`${data.items.length} place(s) found`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Search failed");
      } else {
        toast.error("Search failed");
      }
    }
  }

  function onSignout() {
    sessionStorage.clear();
    localStorage.clear();
    location.href = "/";
  }

  return (
    <>
      <Layout title="Add a place">
        <Form onSubmit={onAddAddress}>
          <Input name="name" placeholder="Name (e.g. Home)" required />
          <Input
            name="searchWord"
            placeholder="Location (e.g. Paris, France)"
            required
          />
          <Input name="description" placeholder="Description (optional)" />
          <Button type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add place"}
          </Button>
        </Form>
      </Layout>

      <Layout title="Search by radius">
        <Form onSubmit={onSearch}>
          <Input
            placeholder="Radius (km)"
            type="number"
            value={searchRadius}
            onChange={(e) => setSearchRadius(e.target.value)}
            required
          />
          <Input
            placeholder="Your latitude"
            type="number"
            step="any"
            value={searchLat}
            onChange={(e) => setSearchLat(e.target.value)}
            required
          />
          <Input
            placeholder="Your longitude"
            type="number"
            step="any"
            value={searchLng}
            onChange={(e) => setSearchLng(e.target.value)}
            required
          />
          <Button type="submit">Search</Button>
        </Form>
        {searchResults !== null && (
          <>
            {searchResults.length === 0 ? (
              <p>No places found in this radius.</p>
            ) : (
              searchResults.map((address) => (
                <Row key={address.id}>
                  <div>
                    <strong>{address.name}</strong>
                    {address.description && <p>{address.description}</p>}
                    <small>
                      📍 {address.lat.toFixed(4)}, {address.lng.toFixed(4)}
                    </small>
                  </div>
                </Row>
              ))
            )}
          </>
        )}
      </Layout>

      <Layout title="My places">
        {addresses.length === 0 ? (
          <p>No places saved yet.</p>
        ) : (
          addresses.map((address) => (
            <Row key={address.id}>
              <div>
                <strong>{address.name}</strong>
                {address.description && <p>{address.description}</p>}
                <small>
                  📍 {address.lat.toFixed(4)}, {address.lng.toFixed(4)}
                </small>
              </div>
            </Row>
          ))
        )}
        <Row>
          <Button onClick={onSignout}>Signout</Button>
        </Row>
      </Layout>
    </>
  );
}
