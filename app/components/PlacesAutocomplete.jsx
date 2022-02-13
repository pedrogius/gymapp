import { useLoaderData } from "remix";
import GooglePlacesAutoComplete from "react-google-places-autocomplete";
import { useState } from "react";

export async function loader() {
  return {
    apiKey: process.env.PLACES_API_KEY,
  };
}

const PlacesAutocomplete = ({ disabled, id = "", locationName = "" }) => {
  const [value, setValue] = useState(null);
  const { apiKey } = useLoaderData();
  return (
    <div>
      <GooglePlacesAutoComplete
        apiKey={apiKey}
        selectProps={{
          name: "location",
          isDisabled: disabled,
          defaultInputValue: locationName,
          defaultValue: id,
          value,
          onChange: setValue,
        }}
      />
    </div>
  );
};

export default PlacesAutocomplete;
