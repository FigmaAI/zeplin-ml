import React, { useState } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import modelList from "./models";

export default function ModelCombobox({ onModelSelect }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState();
  const loading = open && !options;

  const onOpen = async () => {
    setOpen(true);

    if (options) {
      return;
    }

    const models = modelList;

    setOptions(
      models.map((model) => ({
        id: model.id,
        name: model.name,
        value: model.value
      }))
    );
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (event, value) => {
    if (value) {
      onModelSelect(value.value);
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      onChange={onChange}
      getOptionSelected={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.name}
      options={options || []}
      loading={loading}
      noOptionsText="No models"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select the model"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
